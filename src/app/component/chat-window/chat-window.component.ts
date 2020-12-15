import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ChatMessage } from '@udonarium/chat-message';
import { ChatTab } from '@udonarium/chat-tab';
import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { EventSystem, Network } from '@udonarium/core/system';
import { PeerCursor } from '@udonarium/peer-cursor';
import { ChatTabSettingComponent } from 'component/chat-tab-setting/chat-tab-setting.component';
import { ChatMessageService } from 'service/chat-message.service';
import { PanelOption, PanelService } from 'service/panel.service';
import { PointerDeviceService } from 'service/pointer-device.service';
import { GameObjectInventoryService } from 'service/game-object-inventory.service';
import { FileSelecterComponent } from 'component/file-selecter/file-selecter.component';

import { ModalService } from 'service/modal.service';
@Component({
  selector: 'chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})



export class ChatWindowComponent implements OnInit, OnDestroy, AfterViewInit {
  public static SoundEffectSwitch: boolean = true;
  sendFrom: string;
  public onSoundEffectSwitchChanged() {
    if (ChatWindowComponent.SoundEffectSwitch) {
      ChatWindowComponent.SoundEffectSwitch = false
      localStorage.setItem('SoundEffectSwitch', 'false')
    }
    else {
      ChatWindowComponent.SoundEffectSwitch = true
      localStorage.setItem('SoundEffectSwitch', 'true')
    }
  }
  public SoundEffectSwitch2() {
    if (window.localStorage.getItem('SoundEffectSwitch') == 'true') {
      ChatWindowComponent.SoundEffectSwitch = true;
    }
    if (window.localStorage.getItem('SoundEffectSwitch') == 'false') {
      ChatWindowComponent.SoundEffectSwitch = false;
    }

    return ChatWindowComponent.SoundEffectSwitch;
  }
  GuestMode() {
    return Network.GuestMode();
  }

  get gameType(): string { return this.chatMessageService.gameType; }
  set gameType(gameType: string) { this.chatMessageService.gameType = gameType; }

  private _chatTabidentifier: string = '';
  get chatTabidentifier(): string { return this._chatTabidentifier; }
  set chatTabidentifier(chatTabidentifier: string) {
    let hasChanged: boolean = this._chatTabidentifier !== chatTabidentifier;
    this._chatTabidentifier = chatTabidentifier;
    this.updatePanelTitle();
    if (hasChanged) {
      this.scrollToBottom(true);
    }
  }

  get chatTab(): ChatTab { return ObjectStore.instance.get<ChatTab>(this.chatTabidentifier); }
  isAutoScroll: boolean = true;
  scrollToBottomTimer: NodeJS.Timer = null;

  constructor(
    public chatMessageService: ChatMessageService,
    private panelService: PanelService,
    private pointerDeviceService: PointerDeviceService,
    private inventoryService: GameObjectInventoryService
  ) { }

  ngOnInit() {
    this.sendFrom = PeerCursor.myCursor.identifier;
    this._chatTabidentifier = 0 < this.chatMessageService.chatTabs.length ? this.chatMessageService.chatTabs[0].identifier : '';
    this.gameType = this.inventoryService.gameType;

    EventSystem.register(this)
      .on('MESSAGE_ADDED', event => {
        if (event.data.tabIdentifier !== this.chatTabidentifier) return;
        let message = ObjectStore.instance.get<ChatMessage>(event.data.messageIdentifier);
        if (message && message.isSendFromSelf) {
          this.isAutoScroll = true;
        } else {
          this.checkAutoScroll();
        }
        if (this.isAutoScroll && this.chatTab) this.chatTab.markForRead();
      });
    Promise.resolve().then(() => this.updatePanelTitle());
  }

  ngAfterViewInit() {
    this.scrollToBottom(true);
  }

  ngOnDestroy() {
    EventSystem.unregister(this);
  }

  // @TODO やり方はもう少し考えた方がいいい
  scrollToBottom(isForce: boolean = false) {
    if (isForce) this.isAutoScroll = true;
    if (this.scrollToBottomTimer != null || !this.isAutoScroll) return;
    this.scrollToBottomTimer = setTimeout(() => {
      if (this.chatTab) this.chatTab.markForRead();
      this.scrollToBottomTimer = null;
      this.isAutoScroll = false;
      if (this.panelService.scrollablePanel) {
        this.panelService.scrollablePanel.scrollTop = this.panelService.scrollablePanel.scrollHeight;
        let event = new CustomEvent('scrolltobottom', {});
        this.panelService.scrollablePanel.dispatchEvent(event);
      }
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
  private _color: string = "#000000";
  onChangeColor(color: string) {
    this._color = color;
  }
  showTabSetting() {
    if (this.GuestMode()) return;
    let coordinate = this.pointerDeviceService.pointers[0];
    let option: PanelOption = { left: coordinate.x - 250, top: coordinate.y - 175, width: 500, height: 350 };
    let component = this.panelService.open<ChatTabSettingComponent>(ChatTabSettingComponent, option);
    component.selectedTab = this.chatTab;
  }

  sendChat(value: { text: string, gameType: string, sendFrom: string, sendTo: string }) {
    if (this.chatTab) {
      this.chatMessageService.sendMessage(this.chatTab, value.text, value.gameType, value.sendFrom, value.sendTo, this._color);
    }
  }
  clearTab() {
    if (this.GuestMode()) return;
    if (this.chatTab && this.chatTab.chatMessages.length > 0 && confirm("你將會刪除本分頁紀錄")) {
      this.chatTab.destroyChat();
      EventSystem.trigger('MESSAGE_CLEARTAB', { tabIdentifier: this.chatTab.identifier });
      this.sendLogMessage(PeerCursor.myCursor.name + '已刪除 ' + this.chatTab.name + ' 分頁紀錄');
    }
  }
  private sendLogMessage(text: string): void {
    this.chatMessageService.sendSystemMessage('', text, PeerCursor.myCursor.name);
  }
  changeIcon() {
    /////////////////////////////////
    //this.modalService.open<string>(FileSelecterComponent).then(value => {
    //   if (!this.myPeer || !value) return;
    //  this.myPeer.imageIdentifier = value;
    // });
  }

  trackByChatTab(index: number, chatTab: ChatTab) {
    return chatTab.identifier;
  }
}
