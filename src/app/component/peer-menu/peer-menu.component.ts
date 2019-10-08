import { AfterViewInit, Component, NgZone, OnDestroy, OnInit } from '@angular/core';

import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { PeerContext } from '@udonarium/core/system/network/peer-context';
import { EventSystem, Network } from '@udonarium/core/system';
import { PeerCursor } from '@udonarium/peer-cursor';

import { FileSelecterComponent } from 'component/file-selecter/file-selecter.component';
import { LobbyComponent } from 'component/lobby/lobby.component';
import { AppConfigService } from 'service/app-config.service';
import { ModalService } from 'service/modal.service';
import { PanelService } from 'service/panel.service';

import { ImageStorage } from '@udonarium/core/file-storage/image-storage';

@Component({
  selector: 'peer-menu',
  templateUrl: './peer-menu.component.html',
  styleUrls: ['./peer-menu.component.css']
})
export class PeerMenuComponent implements OnInit, OnDestroy, AfterViewInit {

  targetPeerId: string = '';
  networkService = Network
  gameRoomService = ObjectStore.instance;
  help: string = '';

  get myPeer(): PeerCursor { return PeerCursor.myCursor; }

  constructor(
    private ngZone: NgZone,
    private modalService: ModalService,
    private panelService: PanelService,
    public appConfigService: AppConfigService
  ) { }

  ngOnInit() {
    this.panelService.title = '連線情報';
  }

  ngAfterViewInit() {
    EventSystem.register(this)
      .on('OPEN_NETWORK', event => {
        this.ngZone.run(() => { });
      });
  }

  ngOnDestroy() {
    EventSystem.unregister(this);
  }

  changeIcon() {
    this.modalService.open<string>(FileSelecterComponent).then(value => {
      if (!this.myPeer || !value) return;
      this.myPeer.imageIdentifier = value;
      localStorage.setItem("PlayerIcon", value);
    });
  }

  private resetPeerIfNeeded() {
    if (Network.peerContexts.length < 1) {
      Network.open();
      PeerCursor.myCursor.peerId = Network.peerId;
    }
  }

  connectPeer() {
    this.help = '';
    if(this.targetPeerId=="") return;
    let context = PeerContext.create(this.targetPeerId);
    if (!context.isRoom) {
      this.clearGameObject();
      ObjectStore.instance.clearDeleteHistory();
      Network.connect(this.targetPeerId);
    } else {
      if (Network.peerContexts.length) {
        this.help = '入力されたIDはルーム用のIDのようですが、ルーム用IDと通常のIDを混在させることはできません。プライベート接続を切ってください。（※ページリロードで切断ができます）';
        return;
      }

      Network.open(Network.peerContext.id, context.room, context.roomName, context.password);
      PeerCursor.myCursor.peerId = Network.peerId;

      let dummy = {};
      EventSystem.register(dummy)
        .on('OPEN_NETWORK', event => {
          this.clearGameObject();
          ObjectStore.instance.clearDeleteHistory();
          Network.connect(this.targetPeerId);
          EventSystem.unregister(dummy);
          EventSystem.register(dummy)
            .on('CONNECT_PEER', event => {
              console.log('接続成功！', event.data.peer);
              this.resetPeerIfNeeded();
              EventSystem.unregister(dummy);
            })
            .on('DISCONNECT_PEER', event => {
              console.warn('接続失敗', event.data.peer);
              this.resetPeerIfNeeded();
              EventSystem.unregister(dummy);
            });
        });
    }
  }

  async connectPeerHistory() {
    this.help = '';
    let conectPeers: PeerContext[] = [];
    let room: string = '';

    for (let peer of this.appConfigService.peerHistory) {
      let context = PeerContext.create(peer);
      if (context.isRoom) {
        if (room !== context.room) conectPeers = [];
        room = context.room;
        conectPeers.push(context);
      } else {
        if (room !== context.room) conectPeers = [];
        conectPeers.push(context);
      }
    }

    if (room.length) {
      console.warn('connectPeerRoom <' + room + '>');
      let conectPeers = [];
      let peerIds = await Network.listAllPeers();
      for (let id of peerIds) {
        console.log(id);
        let context = new PeerContext(id);
        if (context.room === room) {
          conectPeers.push(context);
        }
      }
      if (conectPeers.length < 1) {
        this.help = '前回接続していたルームが見つかりませんでした。既に解散しているかもしれません。';
        console.warn('Room is already closed...');
        return;
      }
      Network.open(PeerContext.generateId(), conectPeers[0].room, conectPeers[0].roomName, conectPeers[0].password);
    } else {
      console.warn('connectPeers ' + conectPeers.length);
      Network.open();
    }

    PeerCursor.myCursor.peerId = Network.peerId;

    let listener = EventSystem.register(this);
    listener.on('OPEN_NETWORK', event => {
      console.log('OPEN_NETWORK', event.data.peer);
      EventSystem.unregisterListener(listener);
      ObjectStore.instance.clearDeleteHistory();
      for (let context of conectPeers) {
        Network.connect(context.fullstring);
      }
    });
  }

  showLobby() {
    this.modalService.open(LobbyComponent, { width: 700, height: 400, left: 0, top: 400 });
  }

  saveNickname(nickname: string) {
    localStorage.setItem("PlayerNickname", nickname);
  }

  findPeerName(peerId: string) {
    const peerCursor = PeerCursor.find(peerId);
    return peerCursor ? peerCursor.name : '';
  }
  isWatchMode(): boolean { return Network.isSelfWatchMode(); }
  test(){
    console.log("TEST ============");
    let objects_arr={}, arr=[];
    for(let object of ObjectStore.instance.getAllGameObject()){
      switch(object.aliasName){
        case "summary-setting":
          localStorage.setItem("SummarySetting", object["dataTag"]); break;
        case "chat-tab":
          if(!objects_arr["chat-tab"]) objects_arr["chat-tab"] = [];
          let children = [];
          for(let msg of object["children"]){
            children.push({
              from: msg["from"],
              name: msg["name"],
              imageIdentifier: msg["imageIdentifier"],
              timestamp: msg["timestamp"],
              color: msg["color"],
              text: msg["text"]
            });
          }
          objects_arr["chat-tab"].push({
            name: object["name"],
            children: children
          });
          break;
        case "game-table":
          console.log(object);

        default:
          arr.push(object);
      }
    }
    
    // Set Local Storage
    if(objects_arr["chat-tab"])
      localStorage.setItem("ChatTab", JSON.stringify(objects_arr["chat-tab"]));

    console.log(arr);

    //console.log(ImageStorage.instance.images);
    //localStorage.setItem("Objects", JSON.stringify(arr));
    //console.log(localStorage.getItem("SummarySetting"));
  }
  test2() {
    localStorage.clear();
  }
  clearGameObject() {
    for (let object of ObjectStore.instance.getAllGameObject()) {
      if(object["location"]!=null || object.aliasName=="chat-tab") object.destroy();
    }
  }
}
