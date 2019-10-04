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

import { PanelService } from 'service/panel.service';

const DEFAULT_MESSAGE_LENGTH = 100;

@Component({
  selector: 'chat-tab',
  templateUrl: './chat-tab.component.html',
  styleUrls: ['./chat-tab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatTabComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges, AfterViewChecked {
  maxMessages: number = 0;
  preScrollBottom: number = -1;
  isFirst: boolean = false;

  sampleMessages: ChatMessageContext[] = [
    { from: 'System', timestamp: 0, imageIdentifier: '', tag: '', name: '教學說明', text: '此為不使用伺服器的TRPG線上平台。参與者將彼此連線，同步棋子和圖片等檔案。\n由於所有資料都儲存在參與者各自的瀏覽器中，因此下次若要在下次進入時保留房間狀態，請一定要執行「儲存」以生成存檔(.zip)。將存檔zip拖曳至瀏覽器畫面即可將房間資料上傳。' },
    { from: 'System', to: '???', timestamp: 0, imageIdentifier: '', tag: '', name: '教學說明 > 玩家', text: '直達訊息（密語）並不會儲存到存檔。\n此外，在您的ID更新之後，你將無法再看見之前傳給您的密語，還請多加注意。' },
    { from: 'System', timestamp: 0, imageIdentifier: '', tag: '', name: '教學說明', text: '推薦環境為桌面版Chrome。目前不支援以行動裝置進行操作。' },
  ];

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
    private panelService: PanelService
  ) { }

  ngOnInit() {
    let messages: ChatMessage[] = [];
    this.isFirst = true;
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
        if (message && message.parent === this.chatTab) {
          if (!this.needUpdate) this.changeDetector.markForCheck();
          this.needUpdate = true;
          this.maxMessages += 1;
          this.isFirst = false;
        }
      })
      .on('MESSAGE_CLEAR', event => {
        if(event.data.tabIdentifier == this.chatTab.identifier){
          if (!this.needUpdate) this.changeDetector.markForCheck();
          this.needUpdate = true;
        }
      })
      .on('UPDATE_GAME_OBJECT', event => {
        if (event.data.aliasName === ChatMessage.aliasName) this.changeDetector.markForCheck();
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.ngZone.runOutsideAngular(() => {
        this.panelService.scrollablePanel.addEventListener('scroll', this.callbackOnScroll, false);
      });
    });
  }

  ngOnDestroy() {
    EventSystem.unregister(this);
    this.panelService.scrollablePanel.removeEventListener('scroll', this.callbackOnScroll, false);
  }

  ngOnChanges() {
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
