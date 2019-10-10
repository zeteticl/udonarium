import { ChatPalette } from './chat-palette';
import { SyncObject, SyncVar } from './core/synchronize-object/decorator';
import { DataElement } from './data-element';
import { TabletopObject } from './tabletop-object';

@SyncObject('character')
export class GameCharacter extends TabletopObject {
  @SyncVar() rotate: number = 0;
  @SyncVar() roll: number = 0;

  get name(): string { return this.getCommonValue('name', ''); }
  get size(): number { return this.getCommonValue('size', 1); }

  get chatPalette(): ChatPalette {
    for (let child of this.children) {
      if (child instanceof ChatPalette) return child;
    }
    return null;
  }

  set name(value:string) { this.setCommonValue('name', value); }

  static create(name: string, size: number, imageIdentifier: string): GameCharacter {
    let gameCharacter: GameCharacter = new GameCharacter();
    gameCharacter.createDataElements();
    gameCharacter.initialize();
    gameCharacter.createTestGameDataElement(name, size, imageIdentifier);

    return gameCharacter;
  }

  static easyCreate(raw_obj): GameCharacter {
    let game_obj: GameCharacter = new GameCharacter();
    let key_arr = ["location", "posZ", "roll", "rotate"];
    game_obj.easyAssign(raw_obj, key_arr)
    game_obj.initialize();
    game_obj.easyCreateGameData(raw_obj.commonDataElement, raw_obj.imageDataElement, raw_obj.detailDataElement);

    // ChatPalette
    let palette: ChatPalette = new ChatPalette('ChatPalette_' + game_obj.identifier);
    palette.setPalette(raw_obj.chatPalette.value);
    palette.color = raw_obj.chatPalette.color;
    palette.dicebot = raw_obj.chatPalette.dicebot;
    palette.initialize();
    game_obj.appendChild(palette);

    return game_obj
  }

  createTestGameDataElement(name: string, size: number, imageIdentifier: string) {
    this.createDataElements();

    let nameElement: DataElement = DataElement.create('name', name, {}, 'name_' + this.identifier);
    let sizeElement: DataElement = DataElement.create('size', size, {}, 'size_' + this.identifier);

    if (this.imageDataElement.getFirstElementByName('imageIdentifier')) {
      this.imageDataElement.getFirstElementByName('imageIdentifier').value = imageIdentifier;
    }

    let resourceElement: DataElement = DataElement.create('基本數值', '', {}, '基本數值' + this.identifier);
    let hpElement: DataElement = DataElement.create('HP', 100, { 'type': 'numberResource', 'currentValue': '100' }, 'HP_' + this.identifier);

    this.commonDataElement.appendChild(nameElement);
    this.commonDataElement.appendChild(sizeElement);

    this.detailDataElement.appendChild(resourceElement);
    resourceElement.appendChild(hpElement);
    resourceElement.appendChild(DataElement.create('AC', 10, {}, 'AC' + this.identifier));
    resourceElement.appendChild(DataElement.create('先攻序', 0, {}, '先攻序' + this.identifier));

    //TEST
    let testElement: DataElement = DataElement.create('情報', '', {}, '情報' + this.identifier);
    this.detailDataElement.appendChild(testElement);
    testElement.appendChild(DataElement.create('説明', '在這裡寫下說明文字', { 'type': 'note' }, '説明' + this.identifier));
    testElement.appendChild(DataElement.create('註記', '任意文字\n１\n２\n３', { 'type': 'note' }, '註記' + this.identifier));

    //TEST
    testElement = DataElement.create('屬性調整值', '', {}, '屬性調整值' + this.identifier);
    this.detailDataElement.appendChild(testElement);
    testElement.appendChild(DataElement.create('力量', 0, {}, '力量' + this.identifier));
    testElement.appendChild(DataElement.create('敏捷', 0, {}, '敏捷' + this.identifier));
    testElement.appendChild(DataElement.create('體質', 0, {}, '體質' + this.identifier));
    testElement.appendChild(DataElement.create('智力', 0, {}, '智力' + this.identifier));
    testElement.appendChild(DataElement.create('睿知', 0, {}, '睿知' + this.identifier));
    testElement.appendChild(DataElement.create('魅力', 0, {}, '魅力' + this.identifier));

    let domParser: DOMParser = new DOMParser();
    let gameCharacterXMLDocument: Document = domParser.parseFromString(this.rootDataElement.toXml(), 'application/xml');

    let palette: ChatPalette = new ChatPalette('ChatPalette_' + this.identifier);
    palette.setPalette(`對話組合板的使用範例：
2d6+1 擲骰
１ｄ２０＋{敏捷}＋｛格鬥｝　{name}的格鬥檢定！
//格鬥＝1`);
    palette.initialize();
    this.appendChild(palette);
  }
}
