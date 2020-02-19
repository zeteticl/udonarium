import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { ChatMessage, ChatMessageContext } from '@udonarium/chat-message';
import { ChatTab } from '@udonarium/chat-tab';
import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { EventSystem } from '@udonarium/core/system';

import { ChatMessageService } from 'service/chat-message.service';
import { PanelService } from 'service/panel.service';

const DEFAULT_MESSAGE_LENGTH = 200;

@Component({
  selector: 'chat-tab',
  templateUrl: './chat-tab.component.html',
  styleUrls: ['./chat-tab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatTabComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges, AfterViewChecked {
  maxMessages: number = 0;
  preScrollBottom: number = -1;

  sampleMessages: ChatMessageContext[] = [
    {
                            from: "System",
                            timestamp: 0,
                            imageIdentifier: "",
                            tag: "",
                            name: "教學Zzzzzz",
                            text: "在這個平台中，主要的資料由使用者之間彼此傳送，HKTRPG只是提供一個平台，棋子圖片等等都是儲存在使用者的電腦之中，所以離開前，請大家先按《保存房間》生成ZIP檔案，下次再使用時按《讀取房間》上傳檔案，不然房間就會像煙火一樣燒光。"
                        }, {
                            from: "System",
                            to: "???",
                            timestamp: 0,
                            imageIdentifier: "",
                            tag: "",
                            name: "教學Zzzzzz > 玩家",
                            text: "使用教學: 對桌面右鍵->新增角色(或其他)，再對它按右鍵->顯示詳情，編輯內容，以後可以收進倉庫中。而在倉庫中，也是按右鍵，把角色移到桌面"
                        }, {
                            from: "System",
                            to: "???",
                            timestamp: 0,
                            imageIdentifier: "",
                            tag: "",
                            name: "教學Zzzzzz > 玩家",
                            text: "密語並不會儲存到ZIP中。而當你的ID更新之後，你將無法再看見之前傳給您的密語，還請多加注意。"
                        }, {
                            from: "System",
                            timestamp: 0,
                            imageIdentifier: "",
                            tag: "",
                            name: "教學Zzzzzz",
                            text: "推薦使用桌面版Chrome。目前不支援以手機進行操作。\n因為渣技術，只簡單加了一個關上網頁前會彈出提示的功能。"
                        },
  ];

  private oldestTimestamp = 0;
  private needUpdate = true;
  private _chatMessages: ChatMessage[] = [];
  get chatMessages(): ChatMessage[] {
    if (!this.chatTab) return [];
    if (this.needUpdate) {
      let chatMessages = this.chatTab.chatMessages;
      let length = chatMessages.length;
      this._chatMessages = length <= this.maxMessages
        ? chatMessages
        : chatMessages.slice(length - this.maxMessages);
      this.oldestTimestamp = 0 < this._chatMessages.length ? this._chatMessages[0].timestamp : 0;
      this.needUpdate = false;
    }
    return this._chatMessages;
  }

  get hasMany(): boolean {
    if (!this.chatTab) return false;
    return this.maxMessages < this.chatTab.chatMessages.length;
  };

  private callbackOnScroll: any = (e) => this.onScroll(e);

  private asyncMessagesInitializeTimer: NodeJS.Timer;

  @Input() chatTab: ChatTab;
  @Output() onAddMessage: EventEmitter<null> = new EventEmitter();

  constructor(
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef,
    private chatMessageService: ChatMessageService,
    private panelService: PanelService
  ) { }

  ngOnInit() {
    let messages: ChatMessage[] = [];
    for (let context of this.sampleMessages) {
      let message = new ChatMessage();
      for (let key in context) {
        if (key === 'identifier') continue;
        if (key === 'tabIdentifier') continue;
        if (key === 'text') {
          message.value = context[key];
          continue;
        }
        if (context[key] == null || context[key] === '') continue;
        message.setAttribute(key, context[key]);
      }
      messages.push(message);
    }
    this.sampleMessages = messages;

    EventSystem.register(this)
      .on('MESSAGE_ADDED', event => {
        let message = ObjectStore.instance.get<ChatMessage>(event.data.messageIdentifier);
        if (!message || message.parent !== this.chatTab) return;
        let time = this.chatMessageService.getTime();

        if (!this.needUpdate && this.oldestTimestamp < message.timestamp) this.changeDetector.markForCheck();
        this.needUpdate = true;

        if (time - (1000 * 60 * 3) < message.timestamp) {
          let top = this.panelService.scrollablePanel.scrollHeight - this.panelService.scrollablePanel.clientHeight;
          if (this.panelService.scrollablePanel.scrollTop < top - 150) {
            this.maxMessages += 1;
          }
        } else {
          this.maxMessages = 3;
          clearInterval(this.asyncMessagesInitializeTimer);
          this.asyncMessagesInitializeTimer = setInterval(() => {
            clearInterval(this.asyncMessagesInitializeTimer);
            this.ngZone.run(() => this.resetMessages());
          }, 2000);
        }
      })
      .on('UPDATE_GAME_OBJECT', event => {
        let message = ObjectStore.instance.get(event.data.identifier);
        if (message && message instanceof ChatMessage && this.oldestTimestamp <= message.timestamp && this.chatTab.contains(message)) this.changeDetector.markForCheck();
      });
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => this.panelService.scrollablePanel.addEventListener('scroll', this.callbackOnScroll, false));
    });
  }

  ngOnDestroy() {
    EventSystem.unregister(this);
    this.panelService.scrollablePanel.removeEventListener('scroll', this.callbackOnScroll, false);
  }

  ngOnChanges() {
    this.resetMessages();
  }

  ngAfterViewChecked() {
    if (0 <= this.preScrollBottom) {
      this.panelService.scrollablePanel.scrollTop = this.panelService.scrollablePanel.scrollHeight - this.preScrollBottom;
      this.preScrollBottom = -1;
    }
  }

  moreMessages(length: number = 100) {
    if (!this.hasMany) return;

    this.maxMessages += length;
    let maxLength = this.chatTab.chatMessages.length;
    if (this.chatTab && maxLength < this.maxMessages) this.maxMessages = maxLength;
    this.changeDetector.markForCheck();
    this.needUpdate = true;

    this.preScrollBottom = this.panelService.scrollablePanel.scrollHeight - this.panelService.scrollablePanel.scrollTop;
  }

  onMessageInit() {
    this.onAddMessage.emit();
  }

  resetMessages() {
    this.needUpdate = true;
    this.maxMessages = 10;

    clearInterval(this.asyncMessagesInitializeTimer);
    let length = DEFAULT_MESSAGE_LENGTH;
    this.asyncMessagesInitializeTimer = setInterval(() => {
      if (this.hasMany && 0 < length) {
        length -= 10;
        this.moreMessages(10);
      } else {
        clearInterval(this.asyncMessagesInitializeTimer);
      }
    }, 0);
  }

  trackByChatMessage(index: number, message: ChatMessage) {
    return message.identifier;
  }

  private onScroll(e: Event) {
    if (this.hasMany && this.panelService.scrollablePanel.scrollTop <= 200) {
      this.moreMessages(8);
      this.ngZone.run(() => { });
    } else if (this.chatTab.hasUnread) {
      let top = this.panelService.scrollablePanel.scrollHeight - this.panelService.scrollablePanel.clientHeight;
      if (top - 100 <= this.panelService.scrollablePanel.scrollTop) {
        this.chatTab.markForRead();
        this.ngZone.run(() => { });
      }
    }
  }
}
