import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { ChatPalette } from '@udonarium/chat-palette';
import { ChatTab } from '@udonarium/chat-tab';
import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { EventSystem, Network } from '@udonarium/core/system';
import { PeerContext } from '@udonarium/core/system/network/peer-context';
import { DiceBot } from '@udonarium/dice-bot';
import { GameCharacter } from '@udonarium/game-character';
import { PeerCursor } from '@udonarium/peer-cursor';

import { TextViewComponent } from 'component/text-view/text-view.component';
import { ChatMessageService } from 'service/chat-message.service';
import { PanelOption, PanelService } from 'service/panel.service';
import { PointerDeviceService } from 'service/pointer-device.service';

@Component({
  selector: 'chat-palette',
  templateUrl: './chat-palette.component.html',
  styleUrls: ['./chat-palette.component.css']
})
export class ChatPaletteComponent implements OnInit, OnDestroy {
  @ViewChild('textArea', { static: true }) textAreaElementRef: ElementRef;
  @Input() character: GameCharacter = null;

  get palette(): ChatPalette { return this.character.chatPalette; }
  sendTo: string = '';
  get isDirect(): boolean { return this.sendTo != null && this.sendTo.length ? true : false }
  private _gameType: string = '';
  get gameType(): string { return this._gameType };
  set gameType(gameType: string) {
    this._gameType = gameType;
    if (this.character.chatPalette) this.character.chatPalette.dicebot = gameType;
  };
  chatTabidentifier: string = '';
  text: string = '';

  isEdit: boolean = false;
  editPalette: string = '';

  private shouldUpdateCharacterList: boolean = true;
  private _gameCharacters: GameCharacter[] = [];
  get gameCharacters(): GameCharacter[] {
    if (this.shouldUpdateCharacterList) {
      this.shouldUpdateCharacterList = false;
      this._gameCharacters = ObjectStore.instance
        .getObjects<GameCharacter>(GameCharacter)
        .filter(character => this.allowsChat(character));
    }
    return this._gameCharacters;
  }

  private writingEventInterval: NodeJS.Timer = null;
  private previousWritingLength: number = 0;

  private doubleClickTimer: NodeJS.Timer = null;

  get diceBotInfos() { return DiceBot.diceBotInfos }

  get chatTab(): ChatTab { return ObjectStore.instance.get<ChatTab>(this.chatTabidentifier); }
  get myPeer(): PeerCursor { return PeerCursor.myCursor; }
  get otherPeers(): PeerCursor[] { return ObjectStore.instance.getObjects(PeerCursor); }

  constructor(
    public chatMessageService: ChatMessageService,
    private panelService: PanelService,
    private pointerDeviceService: PointerDeviceService
  ) { }

  ngOnInit() {
    this.panelService.title = this.character.name + ' 的對話組合板';
    this.chatTabidentifier = this.chatMessageService.chatTabs ? this.chatMessageService.chatTabs[0].identifier : '';
    this.gameType = this.character.chatPalette ? this.character.chatPalette.dicebot : '';
    EventSystem.register(this)
      .on('UPDATE_GAME_OBJECT', -1000, event => {
        if (event.data.aliasName !== GameCharacter.aliasName) return;
        this.shouldUpdateCharacterList = true;
        if (this.character && !this.allowsChat(this.character)) {
          if (0 < this.gameCharacters.length) this.onSelectedCharacter(this.gameCharacters[0].identifier);
        }
      })
      .on('DISCONNECT_PEER', event => {
        let object = ObjectStore.instance.get(this.sendTo);
        if (object instanceof PeerCursor && object.peerId === event.data.peer) {
          this.sendTo = '';
        }
      });
  }

  ngOnDestroy() {
    EventSystem.unregister(this);
    if (this.isEdit) this.toggleEditMode();
  }

  updatePanelTitle() {
    this.panelService.title = this.character.name + ' 的對話組合板';
  }

  onSelectedCharacter(identifier: string) {
    if (this.isEdit) this.toggleEditMode();
    let object = ObjectStore.instance.get(identifier);
    if (object instanceof GameCharacter) this.character = object;
    this.updatePanelTitle();
  }

  selectPalette(line: string) {
    if (this.doubleClickTimer && this.text === line) {
      clearTimeout(this.doubleClickTimer);
      this.doubleClickTimer = null;
      this.sendChat(null);
    } else {
      this.text = line;
      let textArea: HTMLTextAreaElement = this.textAreaElementRef.nativeElement;
      textArea.value = this.text;
      this.doubleClickTimer = setTimeout(() => { this.doubleClickTimer = null }, 400);
    }
  }

  onChangeGameType(gameType: string) {
    console.log('onChangeGameType ready');
    DiceBot.getHelpMessage(this.gameType).then(help => {
      console.log('onChangeGameType done\n' + help);
    });
  }
  
  private _color: string = "#000000";
  onChangeColor(color: string) {
    this._color = color;
  }

  showDicebotHelp() {
    DiceBot.getHelpMessage(this.gameType).then(help => {
      let gameName: string = '擲骰系統';
      for (let diceBotInfo of DiceBot.diceBotInfos) {
        if (diceBotInfo.script === this.gameType) {
          gameName = '擲骰系統<' + diceBotInfo.game + '＞'
        }
      }
      gameName += '的説明';

      let coordinate = this.pointerDeviceService.pointers[0];
      let option: PanelOption = { left: coordinate.x, top: coordinate.y, width: 600, height: 500 };
      let textView = this.panelService.open(TextViewComponent, option);
      textView.title = gameName;
      textView.text =
        '【擲骰系統】在聊天視窗輸入擲骰指令，即可進行擲骰。\n'
        + '輸入範例）２ｄ６＋１　攻撃！\n'
        + '輸出範例）2d6+1　攻撃！\n'
        + '　　　　  diceBot: (2d6) → 7\n'
        + '如上所述，在擲骰指令後的空白可以輸入其他文字，而不會影響擲骰。\n'
        + '以下為各種指令的使用範例：\n'
        + '　3D6+1>=9 ：3d6+1的結果是否在目標値9以上的判定\n'
        + '　1D100<=50 ：D100是否骰出低於50％目標\n'
        + '　3U6[5] ：3d6有任一骰面在5以上即可再擲一顆骰，並統計其總和（無上限）\n'
        + '　3B6 ：3d6的骰面各自表示（並不會加總）\n'
        + '　10B6>=4 ：10d6骰出4以上的骰面的骰子數量\n'
        + '　(8/2)D(4+6)<=(5*3)：骰數・骰子・達成値皆可進行四則運算\n'
        + '　C(10-4*3/2+2)：C(計算式）也可以只進行數值計算\n'
        + '　choice[a,b,c]：從列出的選項中選擇一個。可以用於隨機決定攻擊對象等\n'
        + '　S3d6 ： 在擲骰指令前加上「S」，便可以進行其他人看不見結果的暗骰\n'
        + '　3d6/2 ： 對擲骰結果進行除法（小數點捨去）。若要小數點進位則指令為 /2U、四捨五入則為 /2R。\n'
        + '　D66 ： D66骰。順序取決於遊戲順序。D66N：維持、D66S：升冪。\n'
        + '===================================\n'
        + help;
      console.log('onChangeGameType done');
    });
  }

  sendChat(event: KeyboardEvent) {
    if (event) event.preventDefault();

    if (!this.text.length) return;
    if (event && event.keyCode !== 13) return;

    if (this.chatTab) {
      let text = this.palette.evaluate(this.text, this.character.rootDataElement);
      this.chatMessageService.sendMessage(this.chatTab, text, this.gameType, this.character.identifier, this.sendTo, this._color);
    }
    this.text = '';
    this.previousWritingLength = this.text.length;
    let textArea: HTMLTextAreaElement = this.textAreaElementRef.nativeElement;
    textArea.value = '';
    this.calcFitHeight();
  }

  toggleEditMode() {
    this.isEdit = this.isEdit ? false : true;
    if (this.isEdit) {
      this.editPalette = this.palette.value + '';
    } else {
      this.palette.setPalette(this.editPalette);
    }
  }

  onInput() {
    if (this.writingEventInterval === null && this.previousWritingLength <= this.text.length) {
      let sendTo: string = null;
      if (this.isDirect) {
        let object = ObjectStore.instance.get(this.sendTo);
        if (object instanceof PeerCursor) {
          let peer = PeerContext.create(object.peerId);
          if (peer) sendTo = peer.id;
        }
      }
      EventSystem.call('WRITING_A_MESSAGE', this.chatTabidentifier, sendTo);
      this.writingEventInterval = setTimeout(() => {
        this.writingEventInterval = null;
      }, 200);
    }
    this.previousWritingLength = this.text.length;
    this.calcFitHeight();
  }

  calcFitHeight() {
    let textArea: HTMLTextAreaElement = this.textAreaElementRef.nativeElement;
    textArea.style.height = '';
    if (textArea.scrollHeight >= textArea.offsetHeight) {
      textArea.style.height = textArea.scrollHeight + 'px';
    }
  }

  private allowsChat(gameCharacter: GameCharacter): boolean {
    switch (gameCharacter.location.name) {
      case 'table':
      case this.myPeer.peerId:
        return true;
      case 'graveyard':
        return false;
      default:
        for (const conn of Network.peerContexts) {
          if (conn.isOpen && gameCharacter.location.name === conn.fullstring) {
            return false;
          }
        }
        return true;
    }
  }
}
