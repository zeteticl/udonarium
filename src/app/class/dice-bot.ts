import { ChatMessage, ChatMessageContext } from './chat-message';
import { ChatTab } from './chat-tab';
import { SyncObject } from './core/synchronize-object/decorator';
import { GameObject } from './core/synchronize-object/game-object';
import { ObjectStore } from './core/synchronize-object/object-store';
import { EventSystem } from './core/system';
import { PromiseQueue } from './core/system/util/promise-queue';
import { StringUtil } from './core/system/util/string-util';

declare var Opal

interface DiceBotInfo {
  script: string;
  game: string;
}

interface DiceRollResult {
  result: string;
  isSecret: boolean;
}

@SyncObject('dice-bot')
export class DiceBot extends GameObject {
  private static loadedDiceBots: { [gameType: string]: boolean } = {};
  private static queue: PromiseQueue = new PromiseQueue('DiceBotQueue');

  public static diceBotInfos: DiceBotInfo[] = [
    { script: 'Cthulhu', game: 'CoC(日文)' },
    { script: 'Cthulhu7th', game: 'CoC第7版(日文)' },
    { script: 'Insane', game: 'Insane' },
    { script: 'Kamigakari', game: '神我狩' },
    { script: 'ShinobiGami', game: '忍神' },
    { script: 'SwordWorld', game: '劍世界' },
    { script: 'SwordWorld2_0', game: '劍世界2.0' },
    { script: 'SwordWorld2_5', game: '劍世界2.5' },
    { script: 'Airgetlamh', game: '朱的孤塔' },
    { script: 'Satasupe', game: '亞俠必死的冒險' },
    { script: 'ShadowRun', game: 'ShadowRun' },
    { script: 'ShadowRun4', game: 'ShadowRun第４版' },
    { script: 'ShadowRun5', game: 'ShadowRun第５版' },
    { script: 'BloodCrusade', game: 'ブラッド・クルセイド' },
    { script: 'HatsuneMiku', game: '初音TRPG ココロダンジョン' },
    { script: 'Utakaze', game: '歌風' },
    { script: 'KillDeathBusiness', game: '惡魔電視台' },
    { script: 'Pathfinder', game: 'Pathfinder' },
    { script: 'AFF2e', game: 'ADVANCED FIGHTING FANTASY 2nd Edition' },
    { script: 'AnimaAnimus', game: 'アニマアニムス' },
    { script: 'Amadeus', game: 'アマデウス' },
    { script: 'Arianrhod', game: 'アリアンロッドRPG' },
    { script: 'OrgaRain', game: '在りて遍くオルガレイン' },
    { script: 'Alshard', game: 'アルシャード' },
    { script: 'ArsMagica', game: 'アルスマギカ' },
    { script: 'AlterRaise', game: 'アルトレイズ' },
    { script: 'IthaWenUa', game: 'イサー・ウェン＝アー' },
    { script: 'EarthDawn', game: '地球黎明' },
    { script: 'EarthDawn3', game: '地球黎明3版' },
    { script: 'EarthDawn4', game: '地球黎明4版' },
    { script: 'YearZeroEngine', game: 'イヤーゼロエンジン' },
    { script: 'VampireTheMasquerade5th', game: 'ヴァンパイア：ザ マスカレード 第５版' },
    { script: 'WitchQuest', game: 'ウィッチクエスト' },
    { script: 'Warhammer', game: 'ウォーハンマー' },
    { script: 'Alsetto', game: '詩片的アルセット' },
    { script: 'AceKillerGene', game: 'エースキラージーン' },
    { script: 'EclipsePhase', game: 'エクリプス・フェイズ' },
    { script: 'EmbryoMachine', game: 'エムブリオマシンRPG' },
    { script: 'Elysion', game: 'エリュシオン' },
    { script: 'Elric', game: 'エルリック！' },
    { script: 'EndBreaker', game: 'エンドブレイカー！' },
    { script: 'Oukahoushin3rd', game: '央華封神RPG 第三版' },
    { script: 'OracleEngine', game: 'オラクルエンジン' },
    { script: 'GardenOrder', game: 'ガーデンオーダー' },
    { script: 'CardRanker', game: '卡牌ランカー' },
    { script: 'Gurps', game: 'GURPS' },
    { script: 'GurpsFW', game: 'GURPSFW' },
    { script: 'ChaosFlare', game: 'カオスフレア' },
    { script: 'OneWayHeroics', game: '片道勇者' },
    { script: 'Garako', game: 'ガラコと破界的塔' },
    { script: 'KanColle', game: '艦これRPG' },
    { script: 'Gundog', game: 'ガンドッグ' },
    { script: 'GundogZero', game: 'ガンドッグゼロ' },
    { script: 'GundogRevised', game: 'ガンドッグ・リヴァイズド' },
    { script: 'StellarKnights', game: '銀剣的ステラナイツ' },
    { script: 'CthulhuTech', game: 'CthulhuTech' },
    { script: 'KurayamiCrying', game: 'クラヤミクライン' },
    { script: 'GranCrest', game: 'グランクレストRPG' },
    { script: 'GeishaGirlwithKatana', game: 'ゲイシャ・ガール・ウィズ・カタナ' },
    { script: 'GehennaAn', game: 'ゲヘナ・アナスタシス' },
    { script: 'Illusio', game: '晃天的イルージオ' },
    { script: 'KemonoNoMori', game: '獸ノ森' },
    { script: 'StrangerOfSwordCity', game: '剣の街の異邦人TRPG' },
    { script: 'Illusio', game: '晃天のイルージオ' },
    { script: 'CodeLayerd', game: 'コード：レイヤード' },
    { script: 'Avandner', game: '黒絢的アヴァンドナー' },
    { script: 'Gorilla', game: 'GorillaTRPG' },
    { script: 'ColossalHunter', game: 'コロッサルハンター' },
    { script: 'Postman', game: '壊れた世界的ポストマン' },
    { script: 'SharedFantasia', game: 'Shared†Fantasia' },
    { script: 'JamesBond', game: 'ジェームズ・ボンド007' },
    { script: 'LiveraDoll', game: '紫縞的リヴラドール' },
    { script: 'ShoujoTenrankai', game: '少女展爛会' },
    { script: 'ShinkuuGakuen', game: '真空学園' },
    { script: 'ShinMegamiTenseiKakuseihen', game: '真・女神転生TRPG　覚醒篇' },
    { script: 'Skynauts', game: '歯車の塔の探空士' },
    { script: 'ScreamHighSchool', game: 'スクリームハイスクール' },
    { script: 'SRS', game: 'スタンダードRPGシステム' },
    { script: 'SteamPunkers', game: 'スチームパンカーズ' },
    { script: 'SterileLife', game: 'ステラーライフTRPG' },
    { script: 'StratoShout', game: 'ストラトシャウト' },
    { script: 'TherapieSein', game: '青春疾患セラフィザイン' },
    { script: 'EtrianOdysseySRS', game: '世界樹的迷宮SRS' },
    { script: 'ZettaiReido', game: '絶対隷奴' },
    { script: 'SevenFortressMobius', game: 'セブン＝フォートレス メビウス' },
    { script: 'Villaciel', game: '蒼天的ヴィラシエル' },
    { script: 'DarkSouls', game: 'DarkSoulsTRPG' },
    { script: 'DarkDaysDrive', game: 'ダークデイズドライブ' },
    { script: 'DarkBlaze', game: 'ダークブレイズ' },
    { script: 'DungeonsAndDoragons', game: 'DND' },
    { script: 'DiceOfTheDead', game: '骰子・オブ・ザ・デッド' },
    { script: 'DoubleCross', game: 'DX2nd,3rd' },
    { script: 'DungeonsAndDragons', game: 'ダンジョンズ＆ドラゴンズ' },
    { script: 'Paradiso', game: 'チェレステ色のパラディーゾ' },
    { script: 'Chill', game: 'Chill' },
    { script: 'Chill3', game: 'Chill 3rd Edition' },
    { script: 'CrashWorld', game: '墜落世界' },
    { script: 'StrangerOfSwordCity', game: '剣的街的異邦人TRPG' },
    { script: 'DetatokoSaga', game: 'DetatokoSaga' },
    { script: 'DeadlineHeroes', game: 'デッドラインヒーローズ' },
    { script: 'DemonParasite', game: 'デモンパラサイト' },
    { script: 'TokyoGhostResearch', game: '東京ゴーストリサーチ' },
    { script: 'TokyoNova', game: 'トーキョーN◎VA' },
    { script: 'Torg', game: 'トーグ' },
    { script: 'Torg1_5', game: 'トーグ1.5版' },
    { script: 'TorgEternity', game: 'TORG Eternity' },
    { script: 'TokumeiTenkousei', game: '特命転攻生' },
    { script: 'Dracurouge', game: 'ドラクルージュ' },
    { script: 'TrinitySeven', game: 'トリニティセブンRPG' },
    { script: 'TwilightGunsmoke', game: 'トワイライトガンスモーク' },
    { script: 'TunnelsAndTrolls', game: 'トンネルズ＆トロールズ' },
    { script: 'NightWizard', game: 'ナイトウィザード The 2nd Edition' },
    { script: 'NightWizard3rd', game: 'ナイトウィザード The 3rd Edition' },
    { script: 'NightmareHunterDeep', game: 'ナイトメアハンター=ディープ' },
    { script: 'NinjaSlayer', game: 'ニンジャスレイヤーTRPG' },
    { script: 'NjslyrBattle', game: 'NJSLYRBATTLE' },
    { script: 'Nuekagami', game: '鵺鏡' },
    { script: 'Nechronica', game: '永遠的後日談' },
    { script: 'HarnMaster', game: 'ハーンマスター' },
    { script: 'BadLife', game: '犯罪活劇RPGバッドライフ' },
    { script: 'BattleTech', game: 'バトルテック' },
    { script: 'ParasiteBlood', game: 'パラサイトブラッドRPG' },
    { script: 'Paranoia', game: 'パラノイア' },
    { script: 'ParanoiaRebooted', game: 'パラノイア リブーテッド' },
    { script: 'BarnaKronika', game: 'バルナ・クロニカ' },
    { script: 'PulpCthulhu', game: 'パルプ・クトゥルフ' },
    { script: 'Raisondetre', game: '叛逆レゾンデートル' },
    { script: 'HuntersMoon', game: 'ハンターズ・ムーン' },
    { script: 'Peekaboo', game: 'ピーカーブー' },
    { script: 'BeastBindTrinity', game: 'ビーストバインド トリニティ' },
    { script: 'BBN', game: 'BBNTRPG' },
    { script: 'Hieizan', game: '比叡山炎上' },
    { script: 'BeginningIdol', game: 'ビギニングアイドル' },
    { script: 'PhantasmAdventure', game: 'ファンタズム・アドベンチャー' },
    { script: 'Fiasco', game: 'フィアスコ' },
    { script: 'FilledWith', game: 'フィルトウィズ' },
    { script: 'FutariSousa', game: 'フタリソウサ' },
    { script: 'BlindMythos', game: 'ブラインド・ミトス' },
    { script: 'BloodMoon', game: 'ブラッド・ムーン' },
    { script: 'FullMetalPanic', game: 'フルメタル・パニック！RPG' },
    { script: 'BladeOfArcana', game: 'ブレイド・オブ・アルカナ' },
    { script: 'Strave', game: '碧空的ストレイヴ' },
    { script: 'Pendragon', game: 'ペンドラゴン' },
    { script: 'HouraiGakuen', game: '蓬莱学園的冒険!!' },
    { script: 'MagicaLogia', game: 'マギカロギア' },
    { script: 'InfiniteFantasia', game: '無限のファンタジア' },
    { script: 'MeikyuKingdom', game: '迷宮キングダム' },
    { script: 'MeikyuKingdomBasic', game: '迷宮キングダム 基本ルールブック' },
    { script: 'MeikyuDays', game: '迷宮デイズ' },
    { script: 'MetallicGuardian', game: 'メタリックガーディアンRPG' },
    { script: 'MetalHead', game: 'メタルヘッド' },
    { script: 'MetalHeadExtream', game: 'メタルヘッドエクストリーム' },
    { script: 'MonotoneMuseum', game: 'モノトーンミュージアムRPG' },
    { script: 'YankeeYogSothoth', game: 'ヤンキー＆ヨグ＝ソトース' },
    { script: 'GoldenSkyStories', game: 'ゆうやけこやけ' },
    { script: 'Ryutama', game: 'りゅうたま' },
    { script: 'RyuTuber', game: 'リューチューバーとちいさな奇跡' },
    { script: 'RuneQuest', game: 'ルーンクエスト' },
    { script: 'RecordOfSteam', game: 'Record of Steam' },
    { script: 'RecordOfLodossWar', game: 'ロードス島戦記RPG' },
    { script: 'RoleMaster', game: 'ロールマスター' },
    { script: 'LogHorizon', game: 'ログ・ホライズンTRPG' },
    { script: 'RokumonSekai2', game: '六門世界RPG セカンドエディション' },
    { script: 'LostRecord', game: 'ロストレコード' },
    { script: 'LostRoyal', game: 'ロストロイヤル' },
    { script: 'WaresBlade', game: 'ワースブレイド' },
    { script: 'WARPS', game: 'ワープス' },
    { script: 'WorldOfDarkness', game: 'ワールド・オブ・ダークネス' },
    { script: 'Cthulhu7th_ChineseTraditional', game: '克蘇魯神話第7版' },
    { script: 'Cthulhu_ChineseTraditional', game: '克蘇魯神話' },
    { script: 'KillDeathBusiness_Korean', game: 'Kill Death Business (한국어)' },
    { script: 'Nechronica_Korean', game: '네크로니카' },
    { script: 'DoubleCross_Korean', game: '더블크로스2nd,3rd' },
    { script: 'DetatokoSaga_Korean', game: '데타토코 사가' },
    { script: 'FutariSousa_Korean', game: '둘이서 수사(후타리소우사)' },
    { script: 'Dracurouge_Korean', game: '드라크루주' },
    { script: 'LogHorizon_Korean', game: '로그 호라이즌' },
    { script: 'MonotoneMuseum_Korean', game: '모노톤 뮤지엄' },
    { script: 'BeginningIdol_Korean', game: '비기닝 아이돌' },
    { script: 'StratoShout_Korean', game: '스트라토 샤우트' },
    { script: 'Amadeus_Korean', game: '아마데우스' },
    { script: 'Insane_Korean', game: '인세인' },
    { script: 'Kamigakari_Korean', game: '카미가카리' },
    { script: 'Cthulhu7th_Korean', game: '크툴루의 부름 7판' },
    { script: 'Cthulhu_Korean', game: '크툴루' },
    { script: 'Fiasco_Korean', game: '피아스코' },
  ];

  public static extratablesTables: string[] = [
    'BloodCrusade_TD2T.txt',
    'BloodCrusade_TD3T.txt',
    'BloodCrusade_TD4T.txt',
    'BloodCrusade_TD5T.txt',
    'BloodCrusade_TD6T.txt',
    'BloodCrusade_TDHT.txt',
    'BloodMoon_ID2T.txt',
    'BloodMoon_IDT.txt',
    'BloodMoon_RAT.txt',
    'CardRanker_BFT.txt',
    'CardRanker_CDT.txt',
    'CardRanker_CST.txt',
    'CardRanker_DT.txt',
    'CardRanker_GDT.txt',
    'CardRanker_OST.txt',
    'CardRanker_SST.txt',
    'CardRanker_ST.txt',
    'CardRanker_TDT.txt',
    'CardRanker_WT.txt',
    'Elysion_EBT.txt',
    'Elysion_GIT.txt',
    'Elysion_HBT.txt',
    'Elysion_HT.txt',
    'Elysion_IT.txt',
    'Elysion_JH.txt',
    'Elysion_KT.txt',
    'Elysion_NA.txt',
    'Elysion_NT.txt',
    'Elysion_OJ1.txt',
    'Elysion_OJ2.txt',
    'Elysion_TBT.txt',
    'Elysion_UBT.txt',
    'Elysion_UT1.txt',
    'Elysion_UT2.txt',
    'Elysion_UT3.txt',
    'Elysion_UT4.txt',
    'HuntersMoon_DS1ET.txt',
    'HuntersMoon_DS2ET.txt',
    'HuntersMoon_DS3ET.txt',
    'HuntersMoon_EE1ET.txt',
    'HuntersMoon_EE2ET.txt',
    'HuntersMoon_EE3ET.txt',
    'HuntersMoon_ERT.txt',
    'HuntersMoon_ET1ET.txt',
    'HuntersMoon_ET2ET.txt',
    'HuntersMoon_ET3ET.txt',
    'HuntersMoon_MST.txt',
    'HuntersMoon_TK1ET.txt',
    'HuntersMoon_TK2ET.txt',
    'HuntersMoon_TK3ET.txt',
    'Kamigakari_ET.txt',
    'Kamigakari_KT.txt',
    'Kamigakari_NT.txt',
    'KanColle_BT2.txt',
    'KanColle_BT3.txt',
    'KanColle_BT4.txt',
    'KanColle_BT5.txt',
    'KanColle_BT6.txt',
    'KanColle_BT7.txt',
    'KanColle_BT8.txt',
    'KanColle_BT9.txt',
    'KanColle_BT10.txt',
    'KanColle_BT11.txt',
    'KanColle_BT12.txt',
    'KanColle_ETIT.txt',
    'KanColle_LFDT.txt',
    'KanColle_LFVT.txt',
    'KanColle_LSFT.txt',
    'KanColle_WPCN.txt',
    'KanColle_WPFA.txt',
    'KanColle_WPMC.txt',
    'KanColle_WPMCN.txt',
    'KillDeathBusiness_ANSPT.txt',
    'KillDeathBusiness_MASPT.txt',
    'KillDeathBusiness_MOSPT.txt',
    'KillDeathBusiness_PASPT.txt',
    'KillDeathBusiness_POSPT.txt',
    'KillDeathBusiness_UMSPT.txt',
    'Oukahoushin3rd_BKT.txt',
    'Oukahoushin3rd_KKT.txt',
    'Oukahoushin3rd_NHT.txt',
    'Oukahoushin3rd_SDT.txt',
    'Oukahoushin3rd_SKT.txt',
    'Oukahoushin3rd_STT.txt',
    'Oukahoushin3rd_UKT.txt',
    'ShinobiGami_AKST.txt',
    'ShinobiGami_CLST.txt',
    'ShinobiGami_DXST.txt',
    'ShinobiGami_HC.txt',
    'ShinobiGami_HK.txt',
    'ShinobiGami_HLST.txt',
    'ShinobiGami_HM.txt',
    'ShinobiGami_HO.txt',
    'ShinobiGami_HR.txt',
    'ShinobiGami_HS.txt',
    'ShinobiGami_HT.txt',
    'ShinobiGami_HY.txt',
    'ShinobiGami_NTST.txt',
    'ShinobiGami_OTKRT.txt',
    'ShinobiGami_PLST.txt',
    'BloodCrusade_BDST.txt',
    'BloodCrusade_CYST.txt',
    'BloodCrusade_DMST.txt',
    'BloodCrusade_MNST.txt',
    'BloodCrusade_SLST.txt',
    'BloodCrusade_TD1T.txt',
    'Cthulhu7thChineseTraditional_Manias.txt', 
    'Cthulhu7thChineseTraditional_phobias.txt',
    'Cthulhu7thChineseTraditional_Realtime.txt',
    'Cthulhu7thChineseTraditional_Summary.txt',
    'CthulhuChineseTraditional_longer.txt',
    'CthulhuChineseTraditional_short.txt'
  ];

  // GameObject Lifecycle
  onStoreAdded() {
    super.onStoreAdded();
    DiceBot.queue.add(DiceBot.loadScriptAsync('./assets/cgiDiceBot.js'));
    EventSystem.register(this)
      .on('SEND_MESSAGE', async event => {
        let chatMessage = ObjectStore.instance.get<ChatMessage>(event.data.messageIdentifier);
        if (!chatMessage || !chatMessage.isSendFromSelf || chatMessage.isSystem) return;

        let text: string = StringUtil.toHalfWidth(chatMessage.text);
        let gameType: string = chatMessage.tag;

        try {
          let regArray = /^((\d+)?\s+)?([^\s]*)?/ig.exec(text);
          let repeat: number = (regArray[2] != null) ? Number(regArray[2]) : 1;
          let rollText: string = (regArray[3] != null) ? regArray[3] : text;

          let finalResult: DiceRollResult = { result: '', isSecret: false };
          for (let i = 0; i < repeat && i < 32; i++) {
            let rollResult = await DiceBot.diceRollAsync(rollText, gameType);
            if (rollResult.result.length < 1) break;

            finalResult.result += rollResult.result;
            finalResult.isSecret = finalResult.isSecret || rollResult.isSecret;
            if (1 < repeat) finalResult.result += ` #${i + 1}`;
          }
          this.sendResultMessage(finalResult, chatMessage);
        } catch (e) {
          console.error(e);
        }
        return;
      });
  }

  // GameObject Lifecycle
  onStoreRemoved() {
    super.onStoreRemoved();
    EventSystem.unregister(this);
  }

  private sendResultMessage(rollResult: DiceRollResult, originalMessage: ChatMessage) {
    let result: string = rollResult.result;
    let isSecret: boolean = rollResult.isSecret;

    if (result.length < 1) return;

    result = result.replace(/[＞]/g, s => '→').trim();

    let diceBotMessage: ChatMessageContext = {
      identifier: '',
      tabIdentifier: originalMessage.tabIdentifier,
      originFrom: originalMessage.from,
      from: 'System-BCDice',
      timestamp: originalMessage.timestamp + 1,
      imageIdentifier: '',
      tag: isSecret ? 'system secret' : 'system',
      name: isSecret ? '<Secret-BCDice：' + originalMessage.name + '>' : '<BCDice：' + originalMessage.name + '>',
      text: result
    };

    if (originalMessage.to != null && 0 < originalMessage.to.length) {
      diceBotMessage.to = originalMessage.to;
      if (originalMessage.to.indexOf(originalMessage.from) < 0) {
        diceBotMessage.to += ' ' + originalMessage.from;
      }
    }
    let chatTab = ObjectStore.instance.get<ChatTab>(originalMessage.tabIdentifier);
    if (chatTab) chatTab.addMessage(diceBotMessage);
  }

  static diceRollAsync(message: string, gameType: string): Promise<DiceRollResult> {
    DiceBot.queue.add(DiceBot.loadDiceBotAsync(gameType));
    return DiceBot.queue.add(() => {
      if ('Opal' in window === false) {
        console.warn('Opal is not loaded...');
        return { result: '', isSecret: false };
      }
      let result = [];
      let dir = [];
      let diceBotTablePrefix = 'diceBotTable_';
      let isNeedResult = true;
      try {
        Opal.gvars.isDebug = false;
        let cgiDiceBot = Opal.CgiDiceBot.$new();
        result = cgiDiceBot.$roll(message, gameType, dir, diceBotTablePrefix, isNeedResult);
        //console.log('diceRoll!!!', result);
        //console.log('isSecret!!!', cgiDiceBot.isSecret);
        return { result: result[0], isSecret: cgiDiceBot.isSecret };
      } catch (e) {
        console.error(e);
      }
      return { result: '', isSecret: false };
    });
  }

  static getHelpMessage(gameType: string): Promise<string> {
    DiceBot.queue.add(DiceBot.loadDiceBotAsync(gameType));
    return DiceBot.queue.add(() => {
      if ('Opal' in window === false) {
        console.warn('Opal is not loaded...');
        return '';
      }
      let help = '';
      try {
        let bcdice = Opal.CgiDiceBot.$new().$newBcDice();
        bcdice.$setGameByTitle(gameType);
        help = bcdice.diceBot.$getHelpMessage();
      } catch (e) {
        console.error(e);
      }
      return help;
    });
  }

  static loadDiceBotAsync(gameType: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      //console.log('loadDiceBotAsync');
      gameType = gameType.replace(/\./g, s => '_');

      if ((!gameType && gameType.length < 1) || DiceBot.loadedDiceBots[gameType]) {
        //console.log(gameType + ' is loaded');
        resolve();
        return;
      }

      DiceBot.loadedDiceBots[gameType] = false;

      let promises: Promise<void>[] = [];
      let scriptPath = './assets/dicebot/' + gameType + '.js';

      promises.push(DiceBot.loadScriptAsync(scriptPath));

      for (let table of DiceBot.extratablesTables) {
        if (!table.indexOf(gameType)) {
          let path = './assets/extratables/' + table;
          promises.push(DiceBot.loadExtratablesAsync(path, table));
        }
      }

      Promise.all(promises).then(() => {
        DiceBot.loadedDiceBots[gameType] = true;
        resolve();
      });
    });
  }

  private static loadScriptAsync(path: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let head = document.head;
      let script = document.createElement('script');
      script.src = path;
      head.appendChild(script);

      script.onload = (e) => {
        if (head && script.parentNode) head.removeChild(script);
        console.log(path + ' is loading OK!!!');
        resolve();
      };

      script.onabort = script.onerror = (e) => {
        if (head && script.parentNode) head.removeChild(script);
        console.error(e);
        resolve();
      }
    });
  }

  private static loadExtratablesAsync(path: string, table: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fetch(path)
        .then(response => {
          if (response.ok) return response.text();
          throw new Error('Network response was not ok.');
        })
        .then(text => {
          let array = /((.+)_(.+)).txt$/ig.exec(table);
          Opal.TableFileData.$setVirtualTableData(array[1], array[2], array[3], text);
          console.log(table + ' is loading OK!!!');
          resolve();
        })
        .catch(error => {
          console.warn('There has been a problem with your fetch operation: ', error.message);
          resolve();
        });
    });
  }
}
