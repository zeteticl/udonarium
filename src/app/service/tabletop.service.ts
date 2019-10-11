import { Injectable, NgZone } from '@angular/core';
import { Card } from '@udonarium/card';
import { CardStack } from '@udonarium/card-stack';
import { ImageContext, ImageFile } from '@udonarium/core/file-storage/image-file';
import { ImageStorage } from '@udonarium/core/file-storage/image-storage';
import { ObjectSerializer } from '@udonarium/core/synchronize-object/object-serializer';
import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { EventSystem } from '@udonarium/core/system';
import { DiceSymbol, DiceType } from '@udonarium/dice-symbol';
import { GameCharacter } from '@udonarium/game-character';
import { GameTable } from '@udonarium/game-table';
import { GameTableMask } from '@udonarium/game-table-mask';
import { PeerCursor } from '@udonarium/peer-cursor';
import { PresetSound, SoundEffect } from '@udonarium/sound-effect';
import { TableSelecter } from '@udonarium/table-selecter';
import { TabletopObject } from '@udonarium/tabletop-object';
import { Terrain } from '@udonarium/terrain';
import { TextNote } from '@udonarium/text-note';

import { ContextMenuAction } from './context-menu.service';
import { PointerCoordinate, PointerDeviceService } from './pointer-device.service';

type ObjectIdentifier = string;
type LocationName = string;

@Injectable()
export class TabletopService {
  dragAreaElement: HTMLElement = document.body;

  private batchTask: Map<any, Function> = new Map();
  private batchTaskTimer: NodeJS.Timer = null;

  private _emptyTable: GameTable = new GameTable('');
  get tableSelecter(): TableSelecter { return ObjectStore.instance.get<TableSelecter>('tableSelecter'); }
  get currentTable(): GameTable {
    let table = this.tableSelecter.viewTable;
    return table ? table : this._emptyTable;
  }

  private locationMap: Map<ObjectIdentifier, LocationName> = new Map();
  private parentMap: Map<ObjectIdentifier, ObjectIdentifier> = new Map();
  private characterCache = new TabletopCache<GameCharacter>(() => ObjectStore.instance.getObjects(GameCharacter).filter(obj => obj.isVisibleOnTable));
  private cardCache = new TabletopCache<Card>(() => ObjectStore.instance.getObjects(Card).filter(obj => obj.isVisibleOnTable));
  private cardStackCache = new TabletopCache<CardStack>(() => ObjectStore.instance.getObjects(CardStack).filter(obj => obj.isVisibleOnTable));
  private tableMaskCache = new TabletopCache<GameTableMask>(() => {
    let viewTable = this.tableSelecter.viewTable;
    return viewTable ? viewTable.masks : [];
  });
  private terrainCache = new TabletopCache<Terrain>(() => {
    let viewTable = this.tableSelecter.viewTable;
    return viewTable ? viewTable.terrains : [];
  });
  private textNoteCache = new TabletopCache<TextNote>(() => ObjectStore.instance.getObjects(TextNote));
  private diceSymbolCache = new TabletopCache<DiceSymbol>(() => ObjectStore.instance.getObjects(DiceSymbol));

  private cahceTableIdentifierMap = {};

  get characters(): GameCharacter[] { return this.characterCache.objects; }
  get cards(): Card[] { return this.cardCache.objects; }
  get cardStacks(): CardStack[] { return this.cardStackCache.objects; }
  get tableMasks(): GameTableMask[] { return this.tableMaskCache.objects; }
  get terrains(): Terrain[] { return this.terrainCache.objects; }
  get textNotes(): TextNote[] { return this.textNoteCache.objects; }
  get diceSymbols(): DiceSymbol[] { return this.diceSymbolCache.objects; }
  get peerCursors(): PeerCursor[] { return ObjectStore.instance.getObjects<PeerCursor>(PeerCursor); }

  constructor(
    public ngZone: NgZone,
    public pointerDeviceService: PointerDeviceService,
  ) {
    this.initialize();
  }

  private initialize() {
    this.refreshCacheAll();
    EventSystem.register(this)
      .on('UPDATE_GAME_OBJECT', -1000, event => {
        if (event.data.identifier === this.currentTable.identifier || event.data.identifier === this.tableSelecter.identifier) {
          this.refreshCache(GameTableMask.aliasName);
          this.refreshCache(Terrain.aliasName);
          return;
        }

        let object = ObjectStore.instance.get(event.data.identifier);
        if (!object || !(object instanceof TabletopObject)) {
          this.refreshCache(event.data.aliasName);
        } else if (this.shouldRefreshCache(object)) {
          this.refreshCache(event.data.aliasName);
          this.updateMap(object);
        }
      })
      .on('DELETE_GAME_OBJECT', -1000, event => {
        let garbage = ObjectStore.instance.get(event.data.identifier);
        if (garbage == null || garbage.aliasName.length < 1) {
          this.refreshCacheAll();
        } else {
          this.refreshCache(garbage.aliasName);
        }
      })
      .on('XML_LOADED', event => {
        let xmlElement: Element = event.data.xmlElement;
        // todo:立体地形の上にドロップした時の挙動
        let gameObject = ObjectSerializer.instance.parseXml(xmlElement);
        if (gameObject instanceof TabletopObject) {
          let pointer = this.calcTabletopLocalCoordinate();
          gameObject.location.x = pointer.x - 25;
          gameObject.location.y = pointer.y - 25;
          gameObject.posZ = pointer.z;
          this.placeToTabletop(gameObject);
          SoundEffect.play(PresetSound.piecePut);
        }
      });
  }

  addBatch(task: Function, key: any = {}) {
    this.batchTask.set(key, task);
    if (this.batchTaskTimer != null) return;
    this.execBatch();
    this.batchTaskTimer = setInterval(() => {
      if (0 < this.batchTask.size) {
        this.execBatch();
      } else {
        clearInterval(this.batchTaskTimer);
        this.batchTaskTimer = null;
      }
    }, 66);
  }

  private execBatch() {
    this.batchTask.forEach(task => task());
    this.batchTask.clear();
  }

  private findCache(aliasName: string): TabletopCache<any> {
    switch (aliasName) {
      case GameCharacter.aliasName:
        return this.characterCache;
      case Card.aliasName:
        return this.cardCache;
      case CardStack.aliasName:
        return this.cardStackCache;
      case GameTableMask.aliasName:
        return this.tableMaskCache;
      case Terrain.aliasName:
        return this.terrainCache;
      case TextNote.aliasName:
        return this.textNoteCache;
      case DiceSymbol.aliasName:
        return this.diceSymbolCache;
      default:
        return null;
    }
  }

  private refreshCache(aliasName: string) {
    let cache = this.findCache(aliasName);
    if (cache) cache.refresh();
  }

  private refreshCacheAll() {
    this.characterCache.refresh();
    this.cardCache.refresh();
    this.cardStackCache.refresh();
    this.tableMaskCache.refresh();
    this.terrainCache.refresh();
    this.textNoteCache.refresh();
    this.diceSymbolCache.refresh();

    this.clearMap();
  }

  private shouldRefreshCache(object: TabletopObject) {
    return this.locationMap.get(object.identifier) !== object.location.name || this.parentMap.get(object.identifier) !== object.parentId;
  }

  private updateMap(object: TabletopObject) {
    this.locationMap.set(object.identifier, object.location.name);
    this.parentMap.set(object.identifier, object.parentId);
  }

  private clearMap() {
    this.locationMap.clear();
    this.parentMap.clear();
  }

  private placeToTabletop(gameObject: TabletopObject) {
    switch (gameObject.aliasName) {
      case GameTableMask.aliasName:
        if (gameObject instanceof GameTableMask) gameObject.isLock = false;
      case Terrain.aliasName:
        if (gameObject instanceof Terrain) gameObject.isLocked = false;
        if (!this.tableSelecter || !this.tableSelecter.viewTable) return;
        this.tableSelecter.viewTable.appendChild(gameObject);
        break;
      default:
        gameObject.setLocation('table');
        break;
    }
  }

  calcTabletopLocalCoordinate(
    x: number = this.pointerDeviceService.pointers[0].x,
    y: number = this.pointerDeviceService.pointers[0].y,
    target: HTMLElement = this.pointerDeviceService.targetElement
  ): PointerCoordinate {
    let coordinate: PointerCoordinate = { x: x, y: y, z: 0 };
    if (target.contains(this.dragAreaElement)) {
      coordinate = PointerDeviceService.convertToLocal(coordinate, this.dragAreaElement);
      coordinate.z = 0;
    } else {
      coordinate = PointerDeviceService.convertLocalToLocal(coordinate, target, this.dragAreaElement);
    }
    return { x: coordinate.x, y: coordinate.y, z: 0 < coordinate.z ? coordinate.z : 0 };
  }

  createGameCharacter(position: PointerCoordinate): GameCharacter {
    let character = GameCharacter.create('新建的角色', 1, '');
    character.location.x = position.x - 25;
    character.location.y = position.y - 25;
    character.posZ = position.z;
    return character;
  }

  createGameTableMask(position: PointerCoordinate): GameTableMask {
    let viewTable = this.tableSelecter.viewTable;
    if (!viewTable) return;

    let tableMask = GameTableMask.create('地圖迷霧', 5, 5, 100);
    tableMask.location.x = position.x - 25;
    tableMask.location.y = position.y - 25;
    tableMask.posZ = position.z;

    viewTable.appendChild(tableMask);
    return tableMask;
  }

  createTerrain(position: PointerCoordinate): Terrain {
    let url: string = './assets/images/tex.jpg';
    let image: ImageFile = ImageStorage.instance.get(url)
    if (!image) image = ImageStorage.instance.add(url);

    let viewTable = this.tableSelecter.viewTable;
    if (!viewTable) return;

    let terrain = Terrain.create('地形', 2, 2, 2, image.identifier, image.identifier);
    terrain.location.x = position.x - 50;
    terrain.location.y = position.y - 50;
    terrain.posZ = position.z;

    viewTable.appendChild(terrain);
    return terrain;
  }

  createTextNote(position: PointerCoordinate): TextNote {
    let textNote = TextNote.create('共用筆記', '請在此輸入文字', 5, 4, 3);
    textNote.location.x = position.x;
    textNote.location.y = position.y;
    textNote.posZ = position.z;
    return textNote;
  }

  createDiceSymbol(position: PointerCoordinate, name: string, diceType: DiceType, imagePathPrefix: string): DiceSymbol {
    let diceSymbol = DiceSymbol.create(name, diceType, 1);
    let image: ImageFile = null;

    diceSymbol.faces.forEach(face => {
      let url: string = `./assets/images/dice/${imagePathPrefix}/${imagePathPrefix}[${face}].png`;
      image = ImageStorage.instance.get(url)
      if (!image) { image = ImageStorage.instance.add(url); }
      diceSymbol.imageDataElement.getFirstElementByName(face).value = image.identifier;
    });

    diceSymbol.location.x = position.x - 25;
    diceSymbol.location.y = position.y - 25;
    diceSymbol.posZ = position.z;
    return diceSymbol;
  }

  createTrump(position: PointerCoordinate): CardStack {
    let cardStack = CardStack.create('撲克牌牌堆');
    cardStack.location.x = position.x - 25;
    cardStack.location.y = position.y - 25;
    cardStack.posZ = position.z;

    let back: string = './assets/images/trump/z02.gif';
    if (!ImageStorage.instance.get(back)) {
      ImageStorage.instance.add(back);
    }

    let names: string[] = ['c', 'd', 'h', 's'];

    for (let name of names) {
      for (let i = 1; i <= 13; i++) {
        let trump: string = name + (('00' + i).slice(-2));
        let url: string = './assets/images/trump/' + trump + '.gif';
        if (!ImageStorage.instance.get(url)) {
          ImageStorage.instance.add(url);
        }
        let card = Card.create('卡牌', url, back);
        cardStack.putOnBottom(card);
      }
    }

    for (let i = 1; i <= 2; i++) {
      let trump: string = 'x' + (('00' + i).slice(-2));
      let url: string = './assets/images/trump/' + trump + '.gif';
      if (!ImageStorage.instance.get(url)) {
        ImageStorage.instance.add(url);
      }
      let card = Card.create('卡牌', url, back);
      cardStack.putOnBottom(card);
    }
    return cardStack;
  }

  createCard(position: PointerCoordinate):Card {
    let front_url: string = './assets/images/trump/x01.gif';
    if (!ImageStorage.instance.get(front_url)) {
      ImageStorage.instance.add(front_url);
    }

    let back_url: string = './assets/images/trump/z02.gif';
    if (!ImageStorage.instance.get(back_url)) {
      ImageStorage.instance.add(back_url);
    }

    let card:Card = Card.create('新建卡片',front_url,back_url);
    card.appendNoteElement();
    
    card.location.x = position.x;
    card.location.y = position.y;
    return card;
  }

  makeDefaultTable() {
    let tableSelecter = new TableSelecter('tableSelecter');
    if(localStorage.getItem("TableSelecter")){
      try{
        let ts_setting = JSON.parse(localStorage.getItem("TableSelecter"));
        tableSelecter.gridShow = ts_setting.gridShow;
        tableSelecter.gridSnap = ts_setting.gridSnap;
      } catch(e){
        console.error(e);
      }
    }
    tableSelecter.initialize();

    let gameTable;
    let testBgFile: ImageFile = null;
    let bgFileContext = ImageFile.createEmpty('./assets/images/BG10a_80.jpg').toContext();
    bgFileContext.url = './assets/images/BG10a_80.jpg';
    testBgFile = ImageStorage.instance.add(bgFileContext);
    //let testDistanceFile: ImageFile = null;
    //let distanceFileContext = ImageFile.createEmpty('./assets/images/BG00a1_80.jpg').toContext();
    //distanceFileContext.url = './assets/images/BG00a1_80.jpg';
    //testDistanceFile = ImageStorage.instance.add(distanceFileContext);

    let gameTableStorage, useDefaultMap=true;
    try{
      if(localStorage.getItem("GameTable")){
        gameTableStorage = JSON.parse(localStorage.getItem("GameTable"));
        useDefaultMap = false;
      }
    } catch(e){
      console.error(e);
    }

    if(useDefaultMap){
      gameTable = new GameTable();
      gameTable.name = '預設遊戲桌';
      gameTable.imageIdentifier = testBgFile.identifier;
      //gameTable.backgroundImageIdentifier = testDistanceFile.identifier;
      gameTable.width = 20;
      gameTable.height = 15;
      gameTable.initialize();
      tableSelecter.viewTableIdentifier = gameTable.identifier;
    }
    else{
      for(let table of gameTableStorage){
        gameTable = new GameTable();
        gameTable.name = table.name;
        gameTable.imageIdentifier = ImageStorage.instance.loadImageFromUrl(table.imageIdentifier);
        gameTable.backgroundImageIdentifier = ImageStorage.instance.loadImageFromUrl(table.backgroundImageIdentifier);
        gameTable.backgroundFilterType = table.backgroundFilterType;
        gameTable.width = table.width;
        gameTable.height = table.height;
        gameTable.selected = table.selected;
        gameTable.gridType = table.gridType;
        gameTable.gridColor = table.gridColor;
        gameTable.initialize();
        if(gameTable.selected=="true")
          tableSelecter.viewTableIdentifier = gameTable.identifier;

        this.cahceTableIdentifierMap[table.identifier] = gameTable.identifier;
      }
    }

  }

  makeDefaultTabletopObjects() {
    let viewTable = this.tableSelecter.viewTable;

    let gameObjectsStorage = {};
    let gameObject_key = ["GameCharacter", "TableMask", "Terrain", "TextNote", "DiceSymbol", "Card", "CardStack"];
    let useDefaultObjects=true;
    try{
      for(let key of gameObject_key){
        if(localStorage.getItem(key)){
          gameObjectsStorage[key] = JSON.parse(localStorage.getItem(key));
          useDefaultObjects = false;
        }
        else
          gameObjectsStorage[key] = [];
      }
    } catch(e){
      useDefaultObjects = true;
      console.error(e);
    }

    if(useDefaultObjects){
      let testCharacter: GameCharacter = null;
      let testFile: ImageFile = null;
      let fileContext: ImageContext = null;

      testCharacter = new GameCharacter();
      fileContext = ImageFile.createEmpty('./assets/images/mon_052.gif').toContext();
      fileContext.url = './assets/images/mon_052.gif';
      testFile = ImageStorage.instance.add(fileContext);
      testCharacter.location.x = 5 * 50;
      testCharacter.location.y = 9 * 50;
      testCharacter.initialize();
      testCharacter.createTestGameDataElement('地精', 1, testFile.identifier);

      testCharacter = new GameCharacter();
      fileContext = ImageFile.createEmpty('./assets/images/mon_128.gif').toContext();
      fileContext.url = './assets/images/mon_128.gif';
      testFile = ImageStorage.instance.add(fileContext);
      testCharacter.location.x = 8 * 50;
      testCharacter.location.y = 5 * 50;
      testCharacter.initialize();
      testCharacter.createTestGameDataElement('徬徨樹靈', 3, testFile.identifier);

      testCharacter = new GameCharacter();
      fileContext = ImageFile.createEmpty('./assets/images/mon_150.gif').toContext();
      fileContext.url = './assets/images/mon_150.gif';
      testFile = ImageStorage.instance.add(fileContext);
      testCharacter.location.x = 6 * 50;
      testCharacter.location.y = 11 * 50;
      testCharacter.initialize();
      testCharacter.createTestGameDataElement('劍士', 1, testFile.identifier);
    }
    else{
      // GameCharacter
      for(let raw_obj of gameObjectsStorage["GameCharacter"]){
        let game_obj: GameCharacter = GameCharacter.easyCreate(raw_obj);
      }
      // TableMask
      for(let raw_obj of gameObjectsStorage["TableMask"]){
        let game_obj: GameTableMask = GameTableMask.easyCreate(raw_obj);
        let table = ObjectStore.instance.get<GameTable>(this.cahceTableIdentifierMap[raw_obj.parentId]);
        table.appendChild(game_obj);
      }
      // Terrain
      for(let raw_obj of gameObjectsStorage["Terrain"]){
        let game_obj: Terrain = Terrain.easyCreate(raw_obj);
        let table = ObjectStore.instance.get<GameTable>(this.cahceTableIdentifierMap[raw_obj.parentId]);
        table.appendChild(game_obj);
      }
      // TextNote
      for(let raw_obj of gameObjectsStorage["TextNote"]){
        let game_obj: TextNote = TextNote.easyCreate(raw_obj);
        viewTable.appendChild(game_obj);
      }
      // DiceSymbol
      for(let raw_obj of gameObjectsStorage["DiceSymbol"]){
        let game_obj: DiceSymbol = DiceSymbol.easyCreate(raw_obj);
        viewTable.appendChild(game_obj);
      }
      // Card
      for(let raw_obj of gameObjectsStorage["Card"]){
        let game_obj: Card = Card.easyCreate(raw_obj);
      }
      // CardStack
      for(let raw_obj of gameObjectsStorage["CardStack"]){
        let game_obj: CardStack = CardStack.easyCreate(raw_obj);
      }
    }

  }

  getContextMenuActionsForCreateObject(position: PointerCoordinate): ContextMenuAction[] {
    return [
      this.getCreateCharacterMenu(position),
      this.getCreateTableMaskMenu(position),
      this.getCreateTerrainMenu(position),
      this.getCreateTextNoteMenu(position),
      this.getCreateTrumpMenu(position),
      this.getCreateCardMenu(position),
      this.getCreateDiceSymbolMenu(position),
    ];
  }

  private getCreateCharacterMenu(position: PointerCoordinate): ContextMenuAction {
    return {
      name: '創建角色', action: () => {
        let character = this.createGameCharacter(position);
        EventSystem.trigger('SELECT_TABLETOP_OBJECT', { identifier: character.identifier, className: character.aliasName });
        SoundEffect.play(PresetSound.piecePut);
      }
    }
  }

  private getCreateTableMaskMenu(position: PointerCoordinate): ContextMenuAction {
    return {
      name: '創建地圖迷霧', action: () => {
        this.createGameTableMask(position);
        SoundEffect.play(PresetSound.cardPut);
      }
    }
  }

  private getCreateTerrainMenu(position: PointerCoordinate): ContextMenuAction {
    return {
      name: '創建地形', action: () => {
        this.createTerrain(position);
        SoundEffect.play(PresetSound.blockPut);
      }
    }
  }

  private getCreateTextNoteMenu(position: PointerCoordinate): ContextMenuAction {
    return {
      name: '創建共用筆記', action: () => {
        this.createTextNote(position);
        SoundEffect.play(PresetSound.cardPut);
      }
    }
  }

  private getCreateTrumpMenu(position: PointerCoordinate): ContextMenuAction {
    return {
      name: '創建撲克牌牌堆', action: () => {
        this.createTrump(position);
        SoundEffect.play(PresetSound.cardPut);
      }
    }
  }

  private getCreateCardMenu(position: PointerCoordinate): ContextMenuAction {
    return {
      name: '創建卡片', action: () => {
        this.createCard(position);
        SoundEffect.play(PresetSound.cardPut);
      }
    }
  }

  private getCreateDiceSymbolMenu(position: PointerCoordinate): ContextMenuAction {
    let dices: { menuName: string, diceName: string, type: DiceType, imagePathPrefix: string }[] = [
      { menuName: 'D4', diceName: 'D4', type: DiceType.D4, imagePathPrefix: '4_dice' },
      { menuName: 'D6', diceName: 'D6', type: DiceType.D6, imagePathPrefix: '6_dice' },
      { menuName: 'D8', diceName: 'D8', type: DiceType.D8, imagePathPrefix: '8_dice' },
      { menuName: 'D10', diceName: 'D10', type: DiceType.D10, imagePathPrefix: '10_dice' },
      { menuName: 'D10 (00-90)', diceName: 'D10', type: DiceType.D10_10TIMES, imagePathPrefix: '100_dice' },
      { menuName: 'D12', diceName: 'D12', type: DiceType.D12, imagePathPrefix: '12_dice' },
      { menuName: 'D20', diceName: 'D20', type: DiceType.D20, imagePathPrefix: '20_dice' },
    ];
    let subMenus: ContextMenuAction[] = [];

    dices.forEach(item => {
      subMenus.push({
        name: item.menuName, action: () => {
          this.createDiceSymbol(position, item.diceName, item.type, item.imagePathPrefix);
          SoundEffect.play(PresetSound.dicePut);
        }
      });
    });
    return { name: '創建骰子', action: null, subActions: subMenus };
  }
}

class TabletopCache<T extends TabletopObject> {
  private needsRefresh: boolean = true;

  private _objects: T[] = [];
  get objects(): T[] {
    if (this.needsRefresh) {
      this._objects = this.refreshCollector();
      this._objects = this._objects ? this._objects : [];
      this.needsRefresh = false;
    }
    return this._objects;
  }

  constructor(
    readonly refreshCollector: () => T[]
  ) { }

  refresh() {
    this.needsRefresh = true;
  }
}
