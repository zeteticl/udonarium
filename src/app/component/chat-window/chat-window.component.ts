import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { ChatMessage } from '@udonarium/chat-message';
import { ChatTab } from '@udonarium/chat-tab';
import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { EventSystem, Network } from '@udonarium/core/system';
import { PeerContext } from '@udonarium/core/system/network/peer-context';
import { DiceBot } from '@udonarium/dice-bot';
import { GameCharacter } from '@udonarium/game-character';
import { PeerCursor } from '@udonarium/peer-cursor';

import { ChatTabSettingComponent } from 'component/chat-tab-setting/chat-tab-setting.component';
import { TextViewComponent } from 'component/text-view/text-view.component';
import { ChatMessageService } from 'service/chat-message.service';
import { PanelOption, PanelService } from 'service/panel.service';
import { PointerDeviceService } from 'service/pointer-device.service';

@Component({
  selector: 'chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'scale3d(1, 1, 1)' })),
      transition('void => *', [
        animate('600ms ease', keyframes([
          style({ transform: 'scale3d(0, 0, 0)', offset: 0 }),
          style({ transform: 'scale3d(1.5, 1.5, 1.5)', offset: 0.5 }),
          style({ transform: 'scale3d(0.75, 0.75, 0.75)', offset: 0.75 }),
          style({ transform: 'scale3d(1.125, 1.125, 1.125)', offset: 0.875 }),
          style({ transform: 'scale3d(1.0, 1.0, 1.0)', offset: 1.0 })
        ]))
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'scale3d(0, 0, 0)' }))
      ])
    ])
  ]
})

export class ChatWindowComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('textArea', { static: true }) textAreaElementRef: ElementRef;

  sender: string = 'Guest';
  text: string = '';
  sendTo: string = '';
  get isDirect(): boolean { return this.sendTo != null && this.sendTo.length ? true : false }
  get gameType(): string { return this.chatMessageService.gameType; }
  set gameType(gameType: string) { this.chatMessageService.gameType = gameType; }
  gameHelp: string = '';

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

  gameCharacter: GameCharacter = null;

  private _chatTabidentifier: string = '';
  get chatTabidentifier(): string { return this._chatTabidentifier; }
  set chatTabidentifier(chatTabidentifier: string) {
    let hasChanged: boolean = this._chatTabidentifier !== chatTabidentifier;
    this._chatTabidentifier = chatTabidentifier;
    this.updatePanelTitle();
    if (hasChanged) {
      this.scrollToBottom(true);
      if (this.chatTab) this.chatTab.markForRead();
    }
  }

  get chatTab(): ChatTab { return ObjectStore.instance.get<ChatTab>(this.chatTabidentifier); }
  maxLogLength: number = 1000;
  isAutoScroll: boolean = true;
  scrollToBottomTimer: NodeJS.Timer = null;

  private writingEventInterval: NodeJS.Timer = null;
  private previousWritingLength: number = 0;
  writingPeers: Map<string, NodeJS.Timer> = new Map();
  writingPeerNames: string[] = [];

  get diceBotInfos() { return DiceBot.diceBotInfos }
  get myPeer(): PeerCursor { return PeerCursor.myCursor; }
  get otherPeers(): PeerCursor[] { return ObjectStore.instance.getObjects(PeerCursor); }

  constructor(
    private ngZone: NgZone,
    public chatMessageService: ChatMessageService,
    private panelService: PanelService,
    private pointerDeviceService: PointerDeviceService
  ) { }

  ngOnInit() {
    this.sender = this.myPeer.identifier;
    console.log(this.chatMessageService.chatTabs);
    this._chatTabidentifier = 0 < this.chatMessageService.chatTabs.length ? this.chatMessageService.chatTabs[0].identifier : '';

    EventSystem.register(this)
      .on('MESSAGE_ADDED', event => {
        let message = ObjectStore.instance.get<ChatMessage>(event.data.messageIdentifier);
        if (message && message.isSendFromSelf && event.data.tabIdentifier === this.chatTabidentifier) {
          this.isAutoScroll = true;
        } else {
          this.checkAutoScroll();
        }
        if (this.isAutoScroll && event.data.tabIdentifier === this.chatTabidentifier && this.chatTab) this.chatTab.markForRead();
        let sendFrom = message ? message.from : '?';
        if (this.writingPeers.has(sendFrom)) {
          clearTimeout(this.writingPeers.get(sendFrom));
          this.writingPeers.delete(sendFrom);
          this.updateWritingPeerNames();
        }
      })
      .on('UPDATE_GAME_OBJECT', -1000, event => {
        if (event.data.aliasName !== GameCharacter.aliasName) return;
        this.shouldUpdateCharacterList = true;
        if (this.gameCharacter && !this.allowsChat(this.gameCharacter)) {
          this.gameCharacter = null;
          this.sender = this.myPeer.identifier;
        }
      })
      .on('DISCONNECT_PEER', event => {
        let object = ObjectStore.instance.get(this.sendTo);
        if (object instanceof PeerCursor && object.peerId === event.data.peer) {
          this.sendTo = '';
        }
      })
      .on<string>('WRITING_A_MESSAGE', event => {
        if (event.isSendFromSelf || event.data !== this.chatTabidentifier) return;
        this.ngZone.run(() => {
          if (this.writingPeers.has(event.sendFrom)) clearTimeout(this.writingPeers.get(event.sendFrom));
          this.writingPeers.set(event.sendFrom, setTimeout(() => {
            this.writingPeers.delete(event.sendFrom);
            this.updateWritingPeerNames();
          }, 2000));
          this.updateWritingPeerNames();
        });
      });
    this.updatePanelTitle();
  }

  ngAfterViewInit() {
    this.scrollToBottom(true);
  }

  ngOnDestroy() {
    EventSystem.unregister(this);
  }

  private updateWritingPeerNames() {
    this.writingPeerNames = Array.from(this.writingPeers.keys()).map(peerId => {
      let peer = PeerCursor.find(peerId);
      return peer ? peer.name : '';
    });
  }

  // @TODO やり方はもう少し考えた方がいいい
  scrollToBottom(isForce: boolean = false) {
    if (isForce) this.isAutoScroll = true;
    if (this.scrollToBottomTimer != null || !this.isAutoScroll) return;
    this.scrollToBottomTimer = setTimeout(() => {
      if (this.chatTab) this.chatTab.markForRead();
      this.scrollToBottomTimer = null;
      this.isAutoScroll = false;
      if (this.panelService.scrollablePanel) this.panelService.scrollablePanel.scrollTop = this.panelService.scrollablePanel.scrollHeight;
    }, 0);
  }

  // @TODO
  checkAutoScroll() {
    if (!this.panelService.scrollablePanel) return;
    let top = this.panelService.scrollablePanel.scrollHeight - this.panelService.scrollablePanel.clientHeight;
    if (top - 150 <= this.panelService.scrollablePanel.scrollTop) {
      this.isAutoScroll = true;
    } else {
      this.isAutoScroll = false;
    }
  }

  updatePanelTitle() {
    if (this.chatTab) {
      this.panelService.title = '聊天視窗 - ' + this.chatTab.name;
    } else {
      this.panelService.title = '聊天視窗';
    }
  }

  onSelectedTab(identifier: string) {
    this.updatePanelTitle();
  }

  onSelectedCharacter(identifier: string) {
    let object = ObjectStore.instance.get(identifier);
    if (object instanceof GameCharacter) {
      this.gameCharacter = object;
    } else {
      this.gameCharacter = null;
    }
    this.sender = identifier;
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
      this.gameHelp = help;

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
        + this.gameHelp;
    });
  }

  sendChat(event: KeyboardEvent) {
    if (event) event.preventDefault();

    if (!this.text.length) return;
    if (event && event.keyCode !== 13) return;

    if (!this.sender.length) this.sender = this.myPeer.identifier;
    if (this.chatTab) {
      this.chatMessageService.sendMessage(this.chatTab, this.text, this.gameType, this.sender, this.sendTo, this._color);
    }
    this.text = '';
    this.previousWritingLength = this.text.length;
    let textArea: HTMLTextAreaElement = this.textAreaElementRef.nativeElement;
    textArea.value = '';
    this.calcFitHeight();
  }

  showTabSetting() {
    let coordinate = this.pointerDeviceService.pointers[0];
    let option: PanelOption = { left: coordinate.x - 250, top: coordinate.y - 175, width: 500, height: 350 };
    let component = this.panelService.open<ChatTabSettingComponent>(ChatTabSettingComponent, option);
    component.selectedTab = this.chatTab;
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

  trackByChatTab(index: number, chatTab: ChatTab) {
    return chatTab.identifier;
  }

  isWatchMode(): boolean { return Network.isSelfWatchMode(); }
  isPeerWatchMode(peer: PeerCursor): boolean {
    return (peer.peerId.match(/-true$/) != null);
  }
}
