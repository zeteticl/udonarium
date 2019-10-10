import { AfterViewInit, Component, NgZone, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';

import { ChatTab } from '@udonarium/chat-tab';
import { AudioPlayer } from '@udonarium/core/file-storage/audio-player';
import { AudioSharingSystem } from '@udonarium/core/file-storage/audio-sharing-system';
import { AudioStorage } from '@udonarium/core/file-storage/audio-storage';
import { FileArchiver } from '@udonarium/core/file-storage/file-archiver';
import { ImageFile } from '@udonarium/core/file-storage/image-file';
import { FileSharingSystem } from '@udonarium/core/file-storage/image-sharing-system';
import { ImageStorage } from '@udonarium/core/file-storage/image-storage';
import { ObjectFactory } from '@udonarium/core/synchronize-object/object-factory';
import { ObjectSerializer } from '@udonarium/core/synchronize-object/object-serializer';
import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { ObjectSynchronizer } from '@udonarium/core/synchronize-object/object-synchronizer';
import { EventSystem, Network } from '@udonarium/core/system';
import { DataSummarySetting } from '@udonarium/data-summary-setting';
import { DiceBot } from '@udonarium/dice-bot';
import { Jukebox } from '@udonarium/Jukebox';
import { PeerCursor } from '@udonarium/peer-cursor';
import { PresetSound, SoundEffect } from '@udonarium/sound-effect';

import { ChatWindowComponent } from 'component/chat-window/chat-window.component';
import { FileStorageComponent } from 'component/file-storage/file-storage.component';
import { GameCharacterGeneratorComponent } from 'component/game-character-generator/game-character-generator.component';
import { GameCharacterSheetComponent } from 'component/game-character-sheet/game-character-sheet.component';
import { GameObjectInventoryComponent } from 'component/game-object-inventory/game-object-inventory.component';
import { GameTableSettingComponent } from 'component/game-table-setting/game-table-setting.component';
import { JukeboxComponent } from 'component/jukebox/jukebox.component';
import { PeerMenuComponent } from 'component/peer-menu/peer-menu.component';
import { TextViewComponent } from 'component/text-view/text-view.component';
import { AppConfig, AppConfigService } from 'service/app-config.service';
import { ChatMessageService } from 'service/chat-message.service';
import { ContextMenuService } from 'service/context-menu.service';
import { ModalService } from 'service/modal.service';
import { PanelOption, PanelService } from 'service/panel.service';
import { PointerDeviceService } from 'service/pointer-device.service';
import { SaveDataService } from 'service/save-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnDestroy {

  networkService = Network;

  @ViewChild('modalLayer', { read: ViewContainerRef, static: true }) modalLayerViewContainerRef: ViewContainerRef;
  private immediateUpdateTimer: NodeJS.Timer = null;
  private lazyUpdateTimer: NodeJS.Timer = null;
  private openPanelCount: number = 0;
  private autoSave: boolean = false;

  constructor(
    private modalService: ModalService,
    private panelService: PanelService,
    private pointerDeviceService: PointerDeviceService,
    private chatMessageService: ChatMessageService,
    private appConfigService: AppConfigService,
    private saveDataService: SaveDataService,
    private ngZone: NgZone
  ) {

    let self = this;
    this.ngZone.runOutsideAngular(() => {
      EventSystem;
      Network;
      FileArchiver.instance.initialize();
      FileSharingSystem.instance.initialize();
      ImageStorage.instance;
      AudioSharingSystem.instance.initialize();
      AudioStorage.instance;
      ObjectFactory.instance;
      ObjectSerializer.instance;
      ObjectStore.instance;
      ObjectSynchronizer.instance.initialize();
    });
    this.appConfigService.initialize();
    this.pointerDeviceService.initialize();

    DataSummarySetting.instance.initialize();

    this.autoSave = (localStorage.getItem("AutoSave")=="true");

    let diceBot: DiceBot = new DiceBot('DiceBot');
    diceBot.initialize();

    let jukebox: Jukebox = new Jukebox('Jukebox');
    jukebox.initialize();

    let soundEffect: SoundEffect = new SoundEffect('SoundEffect');
    soundEffect.initialize();

    let chatTab: ChatTab;
    if(localStorage.getItem("ChatTab")){
      let chattab_arr = JSON.parse(localStorage.getItem("ChatTab"));
      for(let tab of chattab_arr){
        chatTab = new ChatTab();
        chatTab.name = tab.name;
        chatTab.initialize();

        for(let msg of tab.children){
          let msg_context = {
            from: msg["from"],
            timestamp: msg["timestamp"],
            imageIdentifier: msg["imageIdentifier"],
            tag: '',
            name: msg["name"],
            text: msg["text"],
            color: msg["color"]
          };
          chatTab.easyAppendMessage(msg_context);
        }
      }
    }
    else{
      chatTab = new ChatTab();
      chatTab.name = '主要';
      chatTab.initialize();

      chatTab = new ChatTab();
      chatTab.name = '閒聊';
      chatTab.initialize();
    }
    

    let fileContext = ImageFile.createEmpty('./assets/images/ic_account_circle_black_24dp_2x.png').toContext();
    fileContext.url = './assets/images/ic_account_circle_black_24dp_2x.png';
    let noneIconImage = ImageStorage.instance.add(fileContext);

    AudioPlayer.resumeAudioContext();
    PresetSound.dicePick = AudioStorage.instance.add('./assets/sounds/soundeffect-lab/shoulder-touch1.mp3').identifier;
    PresetSound.dicePut = AudioStorage.instance.add('./assets/sounds/soundeffect-lab/book-stack1.mp3').identifier;
    PresetSound.diceRoll1 = AudioStorage.instance.add('./assets/sounds/on-jin/spo_ge_saikoro_teburu01.mp3').identifier;
    PresetSound.diceRoll2 = AudioStorage.instance.add('./assets/sounds/on-jin/spo_ge_saikoro_teburu02.mp3').identifier;
    PresetSound.cardDraw = AudioStorage.instance.add('./assets/sounds/soundeffect-lab/card-turn-over1.mp3').identifier;
    PresetSound.cardPick = AudioStorage.instance.add('./assets/sounds/soundeffect-lab/shoulder-touch1.mp3').identifier;
    PresetSound.cardPut = AudioStorage.instance.add('./assets/sounds/soundeffect-lab/book-stack1.mp3').identifier;
    PresetSound.cardShuffle = AudioStorage.instance.add('./assets/sounds/soundeffect-lab/card-open1.mp3').identifier;
    PresetSound.piecePick = AudioStorage.instance.add('./assets/sounds/soundeffect-lab/shoulder-touch1.mp3').identifier;
    PresetSound.piecePut = AudioStorage.instance.add('./assets/sounds/soundeffect-lab/book-stack1.mp3').identifier;
    PresetSound.blockPick = AudioStorage.instance.add('./assets/sounds/tm2/tm2_pon002.wav').identifier;
    PresetSound.blockPut = AudioStorage.instance.add('./assets/sounds/tm2/tm2_pon002.wav').identifier;
    PresetSound.lock = AudioStorage.instance.add('./assets/sounds/tm2/tm2_switch001.wav').identifier;
    PresetSound.unlock = AudioStorage.instance.add('./assets/sounds/tm2/tm2_switch001.wav').identifier;
    PresetSound.sweep = AudioStorage.instance.add('./assets/sounds/tm2/tm2_swing003.wav').identifier;

    AudioStorage.instance.get(PresetSound.dicePick).isHidden = true;
    AudioStorage.instance.get(PresetSound.dicePut).isHidden = true;
    AudioStorage.instance.get(PresetSound.diceRoll1).isHidden = true;
    AudioStorage.instance.get(PresetSound.diceRoll2).isHidden = true;
    AudioStorage.instance.get(PresetSound.cardDraw).isHidden = true;
    AudioStorage.instance.get(PresetSound.cardPick).isHidden = true;
    AudioStorage.instance.get(PresetSound.cardPut).isHidden = true;
    AudioStorage.instance.get(PresetSound.cardShuffle).isHidden = true;
    AudioStorage.instance.get(PresetSound.piecePick).isHidden = true;
    AudioStorage.instance.get(PresetSound.piecePut).isHidden = true;
    AudioStorage.instance.get(PresetSound.blockPick).isHidden = true;
    AudioStorage.instance.get(PresetSound.blockPut).isHidden = true;
    AudioStorage.instance.get(PresetSound.lock).isHidden = true;
    AudioStorage.instance.get(PresetSound.unlock).isHidden = true;
    AudioStorage.instance.get(PresetSound.sweep).isHidden = true;

    PeerCursor.createMyCursor();
    PeerCursor.myCursor.name = (localStorage.getItem("PlayerNickname"))? localStorage.getItem("PlayerNickname"): '玩家';
    if(localStorage.getItem("PlayerIcon")){
      let url = localStorage.getItem("PlayerIcon");
      PeerCursor.myCursor.imageIdentifier = ImageStorage.instance.loadImageFromUrl(url);
    }
    else
      PeerCursor.myCursor.imageIdentifier = noneIconImage.identifier;

    EventSystem.register(this)
      .on('UPDATE_GAME_OBJECT', event => { this.lazyNgZoneUpdate(event.isSendFromSelf); })
      .on('DELETE_GAME_OBJECT', event => { this.lazyNgZoneUpdate(event.isSendFromSelf); })
      .on('SYNCHRONIZE_AUDIO_LIST', event => { if (event.isSendFromSelf) this.lazyNgZoneUpdate(false); })
      .on('SYNCHRONIZE_FILE_LIST', event => { if (event.isSendFromSelf) this.lazyNgZoneUpdate(false); })
      .on<AppConfig>('LOAD_CONFIG', event => {
        console.log('LOAD_CONFIG !!!', event.data);
        Network.setApiKey(event.data.webrtc.key);
        Network.open();
      })
      .on<File>('FILE_LOADED', event => {
        this.lazyNgZoneUpdate(false);
      })
      .on('OPEN_NETWORK', event => {
        console.log('OPEN_NETWORK', event.data.peer);
        PeerCursor.myCursor.peerId = event.data.peer;
      })
      .on('CLOSE_NETWORK', event => {
        console.log('CLOSE_NETWORK', event.data.peer);
        this.ngZone.run(async () => {
          if (1 < Network.peerIds.length) {
            await this.modalService.open(TextViewComponent, { title: 'ネットワークエラー', text: 'ネットワーク接続に何らかの異常が発生しました。\nこの表示以後、接続が不安定であれば、ページリロードと再接続を試みてください。' });
          } else {
            await this.modalService.open(TextViewComponent, { title: 'ネットワークエラー', text: '接続情報が破棄されました。\nこのウィンドウを閉じると再接続を試みます。' });
            Network.open();
          }
        });
      })
      .on('CONNECT_PEER', event => {
        if (event.isSendFromSelf) this.chatMessageService.calibrateTimeOffset();
      })
      .on('DISCONNECT_PEER', event => {
        //
      });

    window.onbeforeunload = function(){
      if(localStorage.getItem("AutoSave")=="true") self.saveLocalCache();
    }
  }

  ngAfterViewInit() {
    PanelService.defaultParentViewContainerRef = ModalService.defaultParentViewContainerRef = ContextMenuService.defaultParentViewContainerRef = this.modalLayerViewContainerRef;
    setTimeout(() => {
      this.panelService.open(PeerMenuComponent, { width: 500, height: 450, left: 100 });
      this.panelService.open(ChatWindowComponent, { width: 700, height: 400, left: 100, top: 450 });
    }, 0);
  }

  ngOnDestroy() {
    EventSystem.unregister(this);
  }

  open(componentName: string) {
    let component: { new(...args: any[]): any } = null;
    let option: PanelOption = { width: 450, height: 600, left: 100 }
    switch (componentName) {
      case 'PeerMenuComponent':
        component = PeerMenuComponent;
        break;
      case 'ChatWindowComponent':
        component = ChatWindowComponent;
        option.width = 700;
        break;
      case 'GameTableSettingComponent':
        component = GameTableSettingComponent;
        option = { width: 630, height: 400, left: 100 };
        break;
      case 'FileStorageComponent':
        component = FileStorageComponent;
        break;
      case 'GameCharacterSheetComponent':
        component = GameCharacterSheetComponent;
        break;
      case 'JukeboxComponent':
        component = JukeboxComponent;
        break;
      case 'GameCharacterGeneratorComponent':
        component = GameCharacterGeneratorComponent;
        option = { width: 500, height: 300, left: 100 };
        break;
      case 'GameObjectInventoryComponent':
        component = GameObjectInventoryComponent;
        break;
    }
    if (component) {
      option.top = (this.openPanelCount % 10 + 1) * 20;
      option.left = 100 + (this.openPanelCount % 20 + 1) * 5;
      this.openPanelCount = this.openPanelCount + 1;
      console.log('openPanelCount:', this.openPanelCount);
      this.panelService.open(component, option);
    }
  }

  save() {
    let roomName = Network.peerContext && 0 < Network.peerContext.roomName.length
      ? Network.peerContext.roomName
      : 'RoomData';
    this.saveDataService.saveRoom(roomName);
  }

  private lazyNgZoneUpdate(isImmediate: boolean) {
    if (isImmediate) {
      if (this.immediateUpdateTimer !== null) return;
      this.immediateUpdateTimer = setTimeout(() => {
        this.immediateUpdateTimer = null;
        if (this.lazyUpdateTimer != null) {
          clearTimeout(this.lazyUpdateTimer);
          this.lazyUpdateTimer = null;
        }
        this.ngZone.run(() => { });
      }, 0);
    } else {
      if (this.lazyUpdateTimer !== null) return;
      this.lazyUpdateTimer = setTimeout(() => {
        this.lazyUpdateTimer = null;
        if (this.immediateUpdateTimer != null) {
          clearTimeout(this.immediateUpdateTimer);
          this.immediateUpdateTimer = null;
        }
        this.ngZone.run(() => { });
      }, 100);
    }
  }

  private changeAutoSave(target){
    if(target.checked){
      localStorage.setItem("AutoSave", "true");
      //this.saveLocalCache();
    }
    else{
      localStorage.setItem("AutoSave", "false");
      console.log("Clear all Cahce");
      let gameObject_key = ["SummarySetting", "ChatTab", "GameTable", "GameCharacter", "TableMask", "Terrain", "TextNote", "DiceSymbol", "Card", "CardStack"];
      for(let key of gameObject_key){
        localStorage.removeItem(key);
      }
    }
  }

  private saveLocalCache(){
    console.log("SAVE");
    let objects_arr={}, arr=[];
    for(let object of ObjectStore.instance.getAllGameObject()){
      switch(object.aliasName){
        case "summary-setting":
          localStorage.setItem("SummarySetting", object["dataTag"]);
          break;
        case "game-table":
        case "character":
        case "table-mask":
        case "terrain":
        case "text-note":
        case "dice-symbol":
        case "chat-tab":
        case "card-stack":
          if(!objects_arr[object.aliasName]) objects_arr[object.aliasName] = [];
          objects_arr[object.aliasName].push(this.getCacheObject( object ));
          break;
        case "card":
          if(object["parentIdentifier"]!="") break;
          if(!objects_arr["card"]) objects_arr["card"] = [];
          objects_arr["card"].push(this.getCacheObject( object ));
          break;
        default:
          break;
      }
      //arr.push(object);
    }
    
    // Set Local Storage
    this.updateLocalStorage(objects_arr, "chat-tab", "ChatTab");
    this.updateLocalStorage(objects_arr, "game-table", "GameTable");
    this.updateLocalStorage(objects_arr, "character", "GameCharacter");
    this.updateLocalStorage(objects_arr, "table-mask", "TableMask");
    this.updateLocalStorage(objects_arr, "terrain", "Terrain");
    this.updateLocalStorage(objects_arr, "text-note", "TextNote");
    this.updateLocalStorage(objects_arr, "dice-symbol", "DiceSymbol");
    this.updateLocalStorage(objects_arr, "card", "Card");
    this.updateLocalStorage(objects_arr, "card-stack", "CardStack");
  }

  private updateLocalStorage(save_obj: Object, saveObj_key: string, localStorage_key: string ){
    if(save_obj[saveObj_key])
      localStorage.setItem(localStorage_key, JSON.stringify(save_obj[saveObj_key]));
    else
      localStorage.removeItem(localStorage_key);
  }

  private getCacheObject(object): Object {
    let key_arr, temp_obj;
    switch(object.aliasName){
      case "chat":
        key_arr = ["form", "name", "imageIdentifier", "timestamp", "color", "text"];
        return this.getObjectWithSpecificAttribute( object, key_arr );
      case "chat-tab":
        temp_obj = this.getObjectWithSpecificAttribute( object, ["name"] );
        temp_obj["children"] = [];
        for(let msg of object["children"])
          temp_obj["children"].push( this.getCacheObject(msg) );
        return temp_obj;
      case "chat-palette":
        key_arr = ["color", "dicebot", "value"];
        return this.getObjectWithSpecificAttribute( object, key_arr );
      case "TableSelecter":
        key_arr = ["gridShow", "gridSnap"];
        return this.getObjectWithSpecificAttribute( object, key_arr );
      case "game-table":
        key_arr = ["name", "width", "height", "gridSize", "imageIdentifier", "backgroundImageIdentifier", 
                    "backgroundFilterType", "selected", "gridType", "gridColor"];
        return this.getObjectWithSpecificAttribute( object, key_arr );
      case "character":
        key_arr = ["location", "posZ", "roll", "rotate"];
        temp_obj = this.getObjectWithSpecificAttribute( object, key_arr, true );
        temp_obj["chatPalette"] = this.getCacheObject(object["chatPalette"]);
        return temp_obj;
      case "table-mask":
        key_arr = ["location", "posZ", "isLock"];
        return this.getObjectWithSpecificAttribute( object, key_arr, true );
      case "terrain":
        key_arr = ["location", "mode", "posZ", "rotate", "isLocked"];
        return this.getObjectWithSpecificAttribute( object, key_arr, true );
      case "text-note":
        key_arr = ["location", "posZ", "rotate"];
        return this.getObjectWithSpecificAttribute( object, key_arr, true );
      case "dice-symbol":
        key_arr = ["location", "posZ", "rotate", "face", "owner"];
        return this.getObjectWithSpecificAttribute( object, key_arr, true );
      case "card":
        key_arr = ["location", "posZ", "rotate", "state", "owner"];
        return this.getObjectWithSpecificAttribute( object, key_arr, true );
      case "card-stack":
        key_arr = ["location", "posZ", "rotate", "isShowTotal", "owner"];
        temp_obj = this.getObjectWithSpecificAttribute( object, key_arr, true );
        temp_obj["children"] = [];
        for(let msg of object["cardRoot"]["children"])
          temp_obj["children"].push( this.getCacheObject(msg) );
        return temp_obj;
    }
  }

  private getObjectWithSpecificAttribute (object: Object, key_arr: Array<string>, isTableObjectBasic?: boolean): Object{
    var obj = {};
    for(let key of key_arr) obj[key] = object[key];
    if(isTableObjectBasic){
      obj["commonDataElement"] = this.getDataElementObject(object["commonDataElement"]);
      obj["detailDataElement"] = this.getDataElementObject(object["detailDataElement"]);
      obj["imageDataElement"]  = this.getDataElementObject(object["imageDataElement"]);
    }
    return obj;
  }
  private getDataElementObject(object: Object): Object{
    let obj = {
      name: object["name"],
      type: object["type"],
      value: object["value"],
      currentValue: object["currentValue"]
    };
    if(object["children"].length>0){
      obj["children"] = [];
      for(let child of object["children"]){
        obj["children"].push(this.getDataElementObject(child));
      }
    }
    return obj;
  }

}
