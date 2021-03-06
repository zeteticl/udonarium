import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, Input, NgZone, ViewChild, ElementRef } from '@angular/core';
import { TableSelecter } from '@udonarium/table-selecter';
import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { EventSystem, Network } from '@udonarium/core/system';
import { PeerCursor } from '@udonarium/peer-cursor';
import { DataElement } from '@udonarium/data-element';
import { SortOrder } from '@udonarium/data-summary-setting';
import { GameCharacter } from '@udonarium/game-character';
import { TabletopObject } from '@udonarium/tabletop-object';
import { ObjectNode } from '@udonarium/core/synchronize-object/object-node';
import { GameObjectInventoryService } from 'service/game-object-inventory.service';
import { PanelService } from 'service/panel.service';
import { DiceBot } from '@udonarium/dice-bot';
import { TextNote } from '@udonarium/text-note';
import { TabletopService } from 'service/tabletop.service';
import { FilterType, GameTable, GridType } from '@udonarium/game-table';
@Component({
  selector: 'note-inventory',
  templateUrl: './note-inventory.component.html',
  styleUrls: ['./note-inventory.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteInventoryComponent implements OnInit, AfterViewInit, OnDestroy {
  inventoryTypes: string[] = ['table', 'common', 'graveyard'];
  //GM
  @Input() gameCharacter: GameCharacter = null;
  @Input() textNote: TextNote = null;
  get title(): string { return this.textNote.title; }
  get text(): string { this.calcFitHeightIfNeeded(); return this.textNote.text; }
  @ViewChild('textArea', { static: true }) textAreaElementRef: ElementRef;
  get textNotes(): TextNote[] { return this.textNoteCache.objects; }

  selectTab: string = 'table';
  selectedIdentifier: string = '';

  isEdit: boolean = false;
  private textNoteCache = new TabletopCache<TextNote>(() => ObjectStore.instance.getObjects(TextNote));
  get sortTag(): string { return this.inventoryService.sortTag; }
  set sortTag(sortTag: string) { this.inventoryService.sortTag = sortTag; }
  get sortOrder(): SortOrder { return this.inventoryService.sortOrder; }
  set sortOrder(sortOrder: SortOrder) { this.inventoryService.sortOrder = sortOrder; }
  get dataTag(): string { return this.inventoryService.dataTag; }
  set dataTag(dataTag: string) { this.inventoryService.dataTag = dataTag; }
  get dataTags(): string[] { return this.inventoryService.dataTags; }
  get diceBotInfos() { return DiceBot.diceBotInfos }
  get gameType(): string { return this.inventoryService.gameType; }
  set gameType(gameType: string) { this.inventoryService.gameType = gameType; }
  //GM
  get GM(): string { return this.gameCharacter.GM; }
  set GM(GM: string) { this.gameCharacter.GM = GM; }
  get isMine(): boolean { return this.gameCharacter.isMine; }
  get hasGM(): boolean { return this.gameCharacter.hasGM; }
  get GMName(): string { return this.gameCharacter.GMName; }
  isDisabled(gameObject) {
    return gameObject.GM && !(PeerCursor.myCursor.name === gameObject.GM);
  }
  get tableSelecter(): TableSelecter { return this.tabletopService.tableSelecter; }

  get currentTable(): GameTable { return this.tabletopService.currentTable; }
  get sortOrderName(): string { return this.sortOrder === SortOrder.ASC ? '升序' : '降序'; }

  get newLineString(): string { return this.inventoryService.newLineString; }

  constructor(
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef,
    private panelService: PanelService,
    private tabletopService: TabletopService,
    private inventoryService: GameObjectInventoryService
  ) { }

  ngOnInit() {
    this.panelService.title = '筆記倉庫';
    EventSystem.register(this)
      .on('SELECT_TABLETOP_OBJECT', -1000, event => {
        let object = ObjectStore.instance.get(event.data.identifier);
        if ((ObjectStore.instance.get(event.data.identifier) instanceof TabletopObject) || (object instanceof PeerCursor) || object instanceof ObjectNode || this.textNote === object) {
          this.selectedIdentifier = event.data.identifier;
          //  console.log(event.data.identifier)
          this.changeDetector.markForCheck();

        }
      })
      .on('SYNCHRONIZE_FILE_LIST', event => {
        this.changeDetector.markForCheck();
      })
      .on('UPDATE_FILE_RESOURE', -1000, event => {
        this.changeDetector.markForCheck();
      }).on('DISCONNECT_PEER', event => {
        //GM
        if (this.textNote.GM === event.data.peer) this.changeDetector.markForCheck();
      })
      .on('UPDATE_GAME_OBJECT', -1000, event => {
        if (event.data.identifier !== this.currentTable.identifier && event.data.identifier !== this.tableSelecter.identifier) return;
        console.log('UPDATE_GAME_OBJECT GameTableComponent ' + this.currentTable.identifier);

        // this.setGameTableGrid(this.currentTable.width, this.currentTable.height, this.currentTable.gridSize, this.currentTable.gridType, this.currentTable.gridColor);
      })

    this.tabletopService.makeDefaultTable();
    this.tabletopService.makeDefaultTabletopObjects();

    this.inventoryTypes = ['table', 'common', Network.peerId, 'graveyard'];
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    EventSystem.unregister(this);
  }

  getTabTitle(inventoryType: string) {
    // console.log('this.textNote', this.textNote)
    switch (inventoryType) {
      case 'table':
        return '桌面';
      case Network.peerId:
        return '個人倉庫';
      case 'graveyard':
        return '墓場';
      default:
        return '共有倉庫';
    }
  }
  getNotes() {
    // console.log('getNotes')
    return this.textNotes;
  }
  getInventory(inventoryType: string) {
    // console.log('this.inventoryService', this.inventoryService)
    // console.log('this.textNotes', this.textNotes)

    switch (inventoryType) {
      case 'table':
        return this.inventoryService.tableInventory;
      case Network.peerId:
        return this.inventoryService.privateInventory;
      case 'graveyard':
        return this.inventoryService.graveyardInventory;
      default:
        return this.inventoryService.commonInventory;
    }
  }

  calcFitHeightIfNeeded() {
    if (this.calcFitHeightTimer) return;
    this.ngZone.runOutsideAngular(() => {
      this.calcFitHeightTimer = setTimeout(() => {
        this.calcFitHeight();
        this.calcFitHeightTimer = null;
      }, 0);
    });
  }
  calcFitHeight() {
    let textArea: HTMLTextAreaElement = this.textAreaElementRef.nativeElement;
    textArea.style.height = '0';
    if (textArea.scrollHeight > textArea.offsetHeight) {
      textArea.style.height = textArea.scrollHeight + 'px';
    }
  }
  //MARK
  getGameObjects(inventoryType: string): TabletopObject[] {
    return this.getInventory(inventoryType).tabletopObjects;
  }
  private calcFitHeightTimer: NodeJS.Timer = null;
  getInventoryTags(gameObject: TextNote): DataElement[] {
    return this.getInventory(gameObject.location.name).dataElementMap.get(gameObject.identifier);
  }
  GuestMode() {
    return Network.GuestMode();
  }
  settotable(gameObject) {
    if (this.GuestMode()) return;
    gameObject.setLocation('table');
  }
  settocommon(gameObject) {
    if (this.GuestMode()) return;
    gameObject.setLocation('common');
  }
  showgameObject(GObject) {
    // console.log('GObject', GObject)
    return GObject.title || "NOT WORK?"
  }
  isittable(note) {
    if (note.location.name == 'table')
      return true;
  }


  toggleEdit() {
    this.isEdit = !this.isEdit;
  }








  trackByGameObject(index: number, gameObject: TextNote) {
    //  console.log('trackByGameObject', gameObject)
    return gameObject ? gameObject.identifier : index;
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
