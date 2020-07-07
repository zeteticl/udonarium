/* Generated by Opal 1.0.3 */
(function(Opal) {
  function $rb_plus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
  }
  function $rb_le(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs <= rhs : lhs['$<='](rhs);
  }
  function $rb_minus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
  }
  function $rb_ge(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs >= rhs : lhs['$>='](rhs);
  }
  var self = Opal.top, $nesting = [], nil = Opal.nil, $$$ = Opal.const_get_qualified, $$ = Opal.const_get_relative, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $truthy = Opal.truthy, $send = Opal.send, $range = Opal.range;

  Opal.add_stubs(['$setPrefixes', '$getJudgeResult', '$nil?', '$getDamageResult', '$upcase', '$===', '$get_radiomarietta_table', '$get_takeoff_table', '$get_exploration_table', '$get_flightsupply_table', '$to_i', '$last_match', '$times', '$[]', '$roll', '$==', '$to_s', '$+', '$include?', '$<=', '$[]=', '$-', '$new', '$each', '$>=']);
  return (function($base, $super, $parent_nesting) {
    var self = $klass($base, $super, 'Paradiso');

    var $nesting = [self].concat($parent_nesting), $Paradiso_rollDiceCommand$1, $Paradiso_getJudgeResult$2, $Paradiso_getDamageResult$4, $Paradiso_get_radiomarietta_table$7, $Paradiso_get_takeoff_table$8, $Paradiso_get_exploration_table$9, $Paradiso_get_flightsupply_table$10;

    
    Opal.const_set($nesting[0], 'ID', "Paradiso");
    Opal.const_set($nesting[0], 'NAME', "チェレステ色のパラディーゾ");
    Opal.const_set($nesting[0], 'SORT_KEY', "ちえれすていろのはらていいそ");
    Opal.const_set($nesting[0], 'HELP_MESSAGE', "" + "◆判定　(nCPt[f]@c)、(nD20<=t[f]@c)　n:ダイス数（省略時:1）　t:目標値（省略時:14）　f:絶不調の追加ファンブル値　c:人機一体の追加クリティカル値\n" + "　例）CP12　CP(13+1)　3CP12[18,19]@7\n" + "◆各種表\n" + "　・ラジオ・マリエッタ表　RMT\n" + "　・移動表　TOT\n" + "　・探索表　EXT\n" + "　・補給表　SUT\n" + "◆ダメージチェック　(DCa[20,30])　a:【攻撃力】、[20]:20mm機銃追加、[30]:30mmガンポッド追加\n" + "　例）DC4:【攻撃力】4でダメージチェック　DC5[20]:【攻撃力】5でダメージチェック、うち1つは20mm機銃　DC5[20,30]:【攻撃力】5でダメージチェック、うち1つは20mm機銃、うち1つは30mmガンポッド\n");
    self.$setPrefixes(["(\\d+)*D20<=.*", "(\\d+)*CP.*", "RMT", "TOT", "EXT", "SUT", "DC(\\d+).*"]);
    
    Opal.def(self, '$rollDiceCommand', $Paradiso_rollDiceCommand$1 = function $$rollDiceCommand(command) {
      var self = this, result = nil, $case = nil;

      
      result = self.$getJudgeResult(command);
      if ($truthy(result['$nil?']())) {
      } else {
        return result
      };
      result = self.$getDamageResult(command);
      if ($truthy(result['$nil?']())) {
      } else {
        return result
      };
      $case = command.$upcase();
      if ("RMT"['$===']($case)) {result = self.$get_radiomarietta_table()}
      else if ("TOT"['$===']($case)) {result = self.$get_takeoff_table()}
      else if ("EXT"['$===']($case)) {result = self.$get_exploration_table()}
      else if ("SUT"['$===']($case)) {result = self.$get_flightsupply_table()};
      if ($truthy(result['$nil?']())) {
        return nil
      } else {
        return result
      };
    }, $Paradiso_rollDiceCommand$1.$$arity = 1);
    
    Opal.def(self, '$getJudgeResult', $Paradiso_getJudgeResult$2 = function $$getJudgeResult(command) {
      var $a, $$3, self = this, $case = nil, number = nil, target = nil, fumble1 = nil, fumble2 = nil, critical = nil, dice = nil, dicetext = nil, crit_flg = nil, fumb_flg = nil, succ_flg = nil, result = nil, text = nil;

      
      $case = command;
      if (/^(\d+)*D20<=(\d+)?(\[(\d+)(,(\d+))?\])?(\@(\d+))?$/i['$===']($case)) {
      number = ($truthy($a = $$($nesting, 'Regexp').$last_match(1)) ? $a : 1).$to_i();
      target = ($truthy($a = $$($nesting, 'Regexp').$last_match(2)) ? $a : 14).$to_i();
      fumble1 = ($truthy($a = $$($nesting, 'Regexp').$last_match(4)) ? $a : 21).$to_i();
      fumble2 = ($truthy($a = $$($nesting, 'Regexp').$last_match(6)) ? $a : 21).$to_i();
      critical = ($truthy($a = $$($nesting, 'Regexp').$last_match(8)) ? $a : 21).$to_i();}
      else if (/^(\d+)*CP(\d+)?(\[(\d+)(,(\d+))?\])?(\@(\d+))?$/i['$===']($case)) {
      number = ($truthy($a = $$($nesting, 'Regexp').$last_match(1)) ? $a : 1).$to_i();
      target = ($truthy($a = $$($nesting, 'Regexp').$last_match(2)) ? $a : 14).$to_i();
      fumble1 = ($truthy($a = $$($nesting, 'Regexp').$last_match(4)) ? $a : 21).$to_i();
      fumble2 = ($truthy($a = $$($nesting, 'Regexp').$last_match(6)) ? $a : 21).$to_i();
      critical = ($truthy($a = $$($nesting, 'Regexp').$last_match(8)) ? $a : 21).$to_i();}
      else {return nil};
      dice = 0;
      dicetext = "";
      crit_flg = false;
      fumb_flg = false;
      succ_flg = false;
      $send(number, 'times', [], ($$3 = function(){var self = $$3.$$s || this;

      
        dice = self.$roll(1, 20)['$[]'](0);
        if (dicetext['$==']("")) {
          dicetext = dice.$to_s()
        } else {
          dicetext = $rb_plus($rb_plus(dicetext, ","), dice.$to_s())
        };
        if ($truthy([1, critical]['$include?'](dice))) {
          return (crit_flg = true)
        } else if ($truthy([20, fumble1, fumble2]['$include?'](dice))) {
          return (fumb_flg = true)
        } else if ($truthy($rb_le(dice, target))) {
          return (succ_flg = true)
        } else {
          return nil
        };}, $$3.$$s = self, $$3.$$arity = 0, $$3));
      if (crit_flg['$=='](true)) {
        result = "クリティカル"
      } else if (fumb_flg['$=='](true)) {
        result = "ファンブル"
      } else if (succ_flg['$=='](true)) {
        result = "成功"
      } else {
        result = "失敗"
      };
      text = "" + "(" + (number) + "D20 目標値" + (target) + ") ＞ (" + (dicetext) + ") ＞ " + (result);
      return text;
    }, $Paradiso_getJudgeResult$2.$$arity = 1);
    
    Opal.def(self, '$getDamageResult', $Paradiso_getDamageResult$4 = function $$getDamageResult(command) {
      var $a, $$5, $$6, self = this, biggun = nil, $case = nil, attack = nil, $writer = nil, dice = nil, dicetext = nil, damage = nil, doubledam = nil, tripledam = nil, result = nil, text = nil;

      
      biggun = [0, 0, 0];
      $case = command;
      if (/^DC(\d+)(\[(\d+)(,(\d+))?(,(\d+))?\])?$/i['$===']($case)) {
      attack = ($truthy($a = $$($nesting, 'Regexp').$last_match(1)) ? $a : 1).$to_i();
      
      $writer = [0, ($truthy($a = $$($nesting, 'Regexp').$last_match(3)) ? $a : 0).$to_i()];
      $send(biggun, '[]=', Opal.to_a($writer));
      $writer[$rb_minus($writer["length"], 1)];;
      
      $writer = [1, ($truthy($a = $$($nesting, 'Regexp').$last_match(5)) ? $a : 0).$to_i()];
      $send(biggun, '[]=', Opal.to_a($writer));
      $writer[$rb_minus($writer["length"], 1)];;
      
      $writer = [2, ($truthy($a = $$($nesting, 'Regexp').$last_match(7)) ? $a : 0).$to_i()];
      $send(biggun, '[]=', Opal.to_a($writer));
      $writer[$rb_minus($writer["length"], 1)];;}
      else {return nil};
      dice = 0;
      dicetext = "";
      damage = $$($nesting, 'Array').$new(20, 0);
      doubledam = 0;
      tripledam = 0;
      $send(biggun, 'each', [], ($$5 = function(bg){var self = $$5.$$s || this;

      
        
        if (bg == null) {
          bg = nil;
        };
        return (function() {$case = bg;
        if ((30)['$===']($case)) {return (tripledam = $rb_plus(tripledam, 1))}
        else if ((20)['$===']($case)) {return (doubledam = $rb_plus(doubledam, 1))}
        else { return nil }})();}, $$5.$$s = self, $$5.$$arity = 1, $$5));
      $send(attack, 'times', [], ($$6 = function(){var self = $$6.$$s || this;

      
        dice = self.$roll(1, 20)['$[]'](0);
        if (dicetext['$==']("")) {
          dicetext = dice.$to_s()
        } else {
          dicetext = $rb_plus($rb_plus(dicetext, ","), dice.$to_s())
        };
        if ($truthy($rb_ge(tripledam, 1))) {
          
          
          $writer = [$rb_minus(dice, 1), $rb_plus(damage['$[]']($rb_minus(dice, 1)), 3)];
          $send(damage, '[]=', Opal.to_a($writer));
          $writer[$rb_minus($writer["length"], 1)];;
          tripledam = $rb_plus(tripledam, -1);
          return (dicetext = $rb_plus(dicetext, "【30mm】"));
        } else if ($truthy($rb_ge(doubledam, 1))) {
          
          
          $writer = [$rb_minus(dice, 1), $rb_plus(damage['$[]']($rb_minus(dice, 1)), 2)];
          $send(damage, '[]=', Opal.to_a($writer));
          $writer[$rb_minus($writer["length"], 1)];;
          doubledam = $rb_plus(doubledam, -1);
          return (dicetext = $rb_plus(dicetext, "【20mm】"));
        } else {
          
          $writer = [$rb_minus(dice, 1), $rb_plus(damage['$[]']($rb_minus(dice, 1)), 1)];
          $send(damage, '[]=', Opal.to_a($writer));
          return $writer[$rb_minus($writer["length"], 1)];
        };}, $$6.$$s = self, $$6.$$arity = 0, $$6));
      result = "" + "\n" + (damage['$[]'](0)) + (damage['$[]'](1)) + (damage['$[]'](2)) + (damage['$[]'](3)) + (damage['$[]'](4)) + "\n" + (damage['$[]'](5)) + (damage['$[]'](6)) + (damage['$[]'](7)) + (damage['$[]'](8)) + (damage['$[]'](9)) + "\n" + (damage['$[]'](10)) + (damage['$[]'](11)) + (damage['$[]'](12)) + (damage['$[]'](13)) + (damage['$[]'](14)) + "\n" + (damage['$[]'](15)) + (damage['$[]'](16)) + (damage['$[]'](17)) + (damage['$[]'](18)) + (damage['$[]'](19));
      text = "" + "攻撃力" + (attack) + "ダメージチェック ＞ (" + (dicetext) + ") ＞ " + (result);
      return text;
    }, $Paradiso_getDamageResult$4.$$arity = 1);
    
    Opal.def(self, '$get_radiomarietta_table', $Paradiso_get_radiomarietta_table$7 = function $$get_radiomarietta_table() {
      var self = this, dice = nil, $case = nil, text = nil;

      
      dice = self.$roll(1, 20)['$[]'](0);
      $case = dice;
      if ((1)['$===']($case)) {text = "「なんてこった！　ここで事故のお知らせだ！」\n通行止め……。ランダムなマス1つを決定する。この一日中、そのマスに移動する事はできない。"}
      else if ($range(2, 4, false)['$===']($case)) {text = "「今日はまたずいぶんと湿気てるねぇ……。古傷がある人は要注意だよ」\n天候が悪い。この一日中、「●移動」のアクションで移動できるマス数は常に1マス低くなる。"}
      else if ($range(5, 10, false)['$===']($case)) {text = "「日常は至上！　異常は退場！　なんにもないからラジオは以上！　……なんつて」\nいつもどおりの日々。のんびりとした風で、何事もなし。"}
      else if ((11)['$===']($case) || (12)['$===']($case)) {text = "「それじゃ、本日のメインコーナー。行ってみよう！」\n軽妙なトーク。PC全員の【乗り手コンディション】が1点小さくなる。"}
      else if ($range(13, 15, false)['$===']($case)) {text = "「いーなー、こんな日はボクも飛んでみたい気分だよ！　ブオノあたりまでバーッとね！」\nとんでもなく快晴で絶好のフライト日和。【機体コンディション】【乗り手コンディション】がそれぞれ1点小さくなる。"}
      else if ((16)['$===']($case)) {text = "「店頭で言えば嬉しい値引き。本日のラッキーワードをメモする用意はできたかい？」\nおトクな情報。この一日中、各PCごとに一回ずつ、「価格」の効果値が2低いものとして効果を処理できる（最低値0）"}
      else if ((17)['$===']($case)) {text = "「いっやー……熱演だったね。もーぅ次回が待ちきれなぁい！！」\nラジオドラマが神回だった。その日一日に行う「交流」で獲得できる【キズナ】の点数が+1される。"}
      else if ((18)['$===']($case)) {text = "「イエス！ナイス！エレガンス！あのサーカス団が帰ってくる！」\nサーカス団がやってくる！ランダムなマス1つを決定する。\nこの一日中、そのマスは「娯楽施設：5」（P.55）の効果を得る。"}
      else if ((19)['$===']($case)) {text = "「ラジオネーム、ハプニングさんからのお便り！　おっとぉ、これは興味深い相談だ」\nラジオの話している内容から手がかりが見つかる。[手がかり]が1箇所追加で配置される。"}
      else if ((20)['$===']($case)) {text = "「今夜は素敵なパーリィデイ！　みんな！今夜の仮装を何にするかはもう決めてるかな？」\n酒場でパーティだ！「酒場」のスポット効果を持つスポットに「レストラン：「パーティ」」が追加される。"};
      return $rb_plus($rb_plus($rb_plus($rb_plus("ラジオマリエッタ表", "("), dice.$to_s()), ")："), text);
    }, $Paradiso_get_radiomarietta_table$7.$$arity = 0);
    
    Opal.def(self, '$get_takeoff_table', $Paradiso_get_takeoff_table$8 = function $$get_takeoff_table() {
      var self = this, dice = nil, $case = nil, text = nil;

      
      dice = self.$roll(1, 20)['$[]'](0);
      $case = dice;
      if ((1)['$===']($case)) {text = "エンジンがぶっ壊れた！ただちに【機体コンディション】が「20」となり、このターン中は2つ目のアクションも含め「●移動」することができない。"}
      else if ((2)['$===']($case)) {text = "離水に失敗した！　キミの愛機のダメージマップ上の任意の「翼」部位のダメージボックスに1点のダメージを与え、このターン中は2つ目のアクションも含め「●移動」することができない。"}
      else if ((3)['$===']($case)) {text = "軽いエンジントラブル。このアクションでは移動することができない。"}
      else if ((4)['$===']($case)) {text = "同業者に遭遇。しかし煽られて曲芸飛行につきあわされる。\n任意の方向に強制的に3マス移動し、【物資点】3点を失う。"}
      else if ((5)['$===']($case)) {text = "道を間違えたらしい。【物資点】を5点消費し、ランダムな方向に1マス移動する効果を3回繰り返す。"}
      else if ((6)['$===']($case)) {text = "気づいたらオイル漏れを起こしていた！【物資点】を3点消費する。その後、1マスにつき1点の【物資点】を消費して最大4マスまで移動できる。"}
      else if ((7)['$===']($case)) {text = "あいにくのにわか雨。あまり飛びたくないなあ。1マスにつき1点の【物資点】を消費して最大2マスまで移動できる。"}
      else if ((8)['$===']($case)) {text = "唐突な襲撃。一撃加えたあと、謎の襲撃者はいずこかへ去っていった……。命中判定の達成値が12であると扱う、【火力】3のダメージチェックを受ける。その後、1マスにつき1点の【物資点】を消費して最大4マスまで移動できる。"}
      else if ((9)['$===']($case)) {text = "んー、少し調子が悪いかな？　1マスにつき1点の【物資点】を消費して最大3マスまで移動できる。"}
      else if ($range(10, 12, false)['$===']($case)) {text = "順調な空の旅。1マスにつき1点の【物資点】を消費して最大5マスまで移動できる。"}
      else if ((13)['$===']($case)) {text = "島巡りの観光艇と遭遇。ちやほやされていい気分。1マスにつき1点の【物資点】を消費して最大5マスまで移動できる上、キミの【乗り手コンディション】を2点までの任意の点数下げる事ができる。"}
      else if ((14)['$===']($case)) {text = "同業者と遭遇。1マスにつき1点の【物資点】を消費して最大5マスまで移動できる上、同業者は「キミへの【キズナ】」を1点得る。同業者はこのセッション中、キミが望む場面でキミに「判定支援」を行ってくれる。"}
      else if ((15)['$===']($case)) {text = "すごく調子がいいぞ！1マスにつき1点の【物資点】を消費して最大7マスまで移動できる上、キミの【機体コンディション】を2点までの任意の点数下げる事ができる。"}
      else if ((16)['$===']($case)) {text = "すごく調子がいいぞ！1マスにつき1点の【物資点】を消費して最大5マスまで移動できる上、このアクションがこのターンに行う1回目のアクションである場合、2回目のアクションでも続けて「●移動」を行う事ができる。"}
      else if ((17)['$===']($case)) {text = "通りかかった先に思わぬ情報が！1マスにつき1点の【物資点】を消費して最大5マスまで移動できる上、このアクションがこのターンに行う1回目のアクションである場合、2回目のアクションでは今いるマスに[手がかり]が配置されているものとして「●探索」が行える。"}
      else if ((18)['$===']($case)) {text = "酒場が恋しい……。【物資点】を5点消費し、即座に同じ「クエストマップ」内の「酒場」のスポット効果を持つマスに移動する。"}
      else if ((19)['$===']($case)) {text = "アジトが恋しい……。【物資点】を5点消費し、即座に同じ「クエストマップ」内の任意のキミの「アジト」に移動する。"}
      else if ((20)['$===']($case)) {text = "仲間が恋しい……。【物資点】を5点消費し、即座に任意のPC一人のいる場所に移動する。"};
      return $rb_plus($rb_plus($rb_plus($rb_plus("移動表", "("), dice.$to_s()), ")："), text);
    }, $Paradiso_get_takeoff_table$8.$$arity = 0);
    
    Opal.def(self, '$get_exploration_table', $Paradiso_get_exploration_table$9 = function $$get_exploration_table() {
      var self = this, dice = nil, $case = nil, text = nil;

      
      dice = self.$roll(1, 20)['$[]'](0);
      $case = dice;
      if ((1)['$===']($case)) {text = "クソっ！このマスに付与されていた[手がかり]を失う。"}
      else if ((2)['$===']($case)) {text = "「ツケ払いやがれ！」見に覚えがあるかないか。キミに詰め寄ってくるヤツがいる。【物資点】を10点消費するか、「ツケを伸ばす」のどちらかを選択する。ツケを伸ばすを選択した場合、次にキミが行う「●探索」のアクションでも、探索表の結果は参照せず、自動的にこの効果が適用される。"}
      else if ((3)['$===']($case)) {text = "謎は深まる。このマスに付与されていた[手がかり]を失い、ランダムな場所に再付与する。【情報点】は得られない。"}
      else if ((4)['$===']($case)) {text = "コネクションは大事だ。「支援チェック」をチェックしていない【キズナ】が1点以上存在すれば、その「支援チェック」を入れたあと、このマスに付与されていた[手がかり]を失い、【情報点】を1点獲得する。"}
      else if ($range(5, 8, false)['$===']($case)) {text = "情報を手に入れるためには、少し骨を折る必要がありそうだ。好きな能力値を2つ組み合わせて｛探索判定｝を行う。成功すればこのマスに付与されていた[手がかり]を失い、【情報点】を1点獲得する。"}
      else if ((9)['$===']($case)) {text = "情報を提供してくれるというアイツは見返りを要求してきた。【物資点】を4点消費できる。そうした場合、このマスに付与されていた[手がかり]を失い、【情報点】を1点獲得する。"}
      else if ($range(10, 13, false)['$===']($case)) {text = "危なげなく情報ゲット。このマスに付与されていた[手がかり]を失い、【情報点】を1点獲得する。"}
      else if ((14)['$===']($case)) {text = "手がかりを追っている事を話すと、ソイツは協力を持ちかけてきてくれた。このマスに付与されていた[手がかり]を失い、【情報点】を1点獲得する。さらに、【物資点】を5点獲得する。"}
      else if ((15)['$===']($case)) {text = "手がかりを追っている事を話すと、ソイツは協力を持ちかけてきてくれた。このマスに付与されていた[手がかり]を失い、【情報点】を1点獲得する。さらに、アイテム「チケット」（P.69）を入手する。"}
      else if ((16)['$===']($case)) {text = "昔の仲間から手がかりについて聞くことになった。ついでに積もる話も少々。このマスに付与されていた[手がかり]を失い、【情報点】を1点獲得する。さらに同業者は「キミへの【キズナ】」を1点得る。同業者はこのセッション中、キミが望む場面でキミに「判定支援」を行ってくれる。"}
      else if ((17)['$===']($case)) {text = "空軍にいる友人から手がかりについて聞くことになった。「なあ、お前もフラフラしてないで空軍に入ったらどうだ？」耳に痛い。このマスに付与されていた[手がかり]を失い、【情報点】を1点獲得する。さらに、アイテム「空軍のツテ」（P.69）を入手する。"}
      else if ((18)['$===']($case)) {text = "手がかりを追っていたら他にもボロボロと……。このマスに付与されていた[手がかり]を失い、【情報点】を1点獲得する。さらに、1D20を二回振り、この「クエストマップ」上のランダムなマス2つを求める。それらのマスに[手がかり]が付与されていなければ、[手がかり]を付与する。"}
      else if ((19)['$===']($case)) {text = "あっさり情報を掴むことができてしまった。このマスに付与されていた[手がかり]を失い、【情報点】を1点獲得する。この「●探索」ではアクションを消費せず、追加で別のアクションを宣言する事ができる。"}
      else if ((20)['$===']($case)) {text = "これは重要な手がかりだ！　このマスに付与されていた[手がかり]を失い、【情報点】を2点獲得する。"};
      return $rb_plus($rb_plus($rb_plus($rb_plus("探索表", "("), dice.$to_s()), ")："), text);
    }, $Paradiso_get_exploration_table$9.$$arity = 0);
    return (Opal.def(self, '$get_flightsupply_table', $Paradiso_get_flightsupply_table$10 = function $$get_flightsupply_table() {
      var self = this, dice = nil, $case = nil, text = nil;

      
      dice = self.$roll(1, 20)['$[]'](0);
      $case = dice;
      if ((1)['$===']($case)) {text = "……えっ？！　キミの【物資点】は0点となる。"}
      else if ((2)['$===']($case)) {text = "おいおい勘弁してくれよ……。このアクションがそのセグメントの一回目のアクションだった場合、キミは2回目のアクションを行えない。その後【物資点】を5点獲得する。"}
      else if ((3)['$===']($case)) {text = "取材に巻き込まれる。【物資点】は獲得できないが、記者の発言からはぽろりとなにかが見えたような?1D20を振り、出た目に対応したマスに「手がかり」を1つ配置する。"}
      else if ((4)['$===']($case)) {text = "成果ゼロ。ま、こんな日もあるかな。【物資点】は獲得できない。"}
      else if ((5)['$===']($case)) {text = "うまいこと補給できなかった。【物資点】を5点獲得する。"}
      else if ((6)['$===']($case)) {text = "「一稼ぎと言ったらこれだろ?」と声をかけてくる悪友たち。「カジノ」(『基本ルールブック』P.55)のスポット効果を即座に適用する。ただしこの処理では判定の失敗により「刑務所」のスポット効果を持つスポットに移動する効果は発生せず、代わりに「酒場」のスポット効果を持つスポットに移動した上で、自身が持つ全ての【キズナ】の「支援チェック」にチェックを入れる。その後、次のセグメントが終了するまでの間アクションは行えない。"}
      else if ($range(7, 9, false)['$===']($case)) {text = "のんびり釣りといこう。釣果は運次第だ。1D20を振り、出た目と同じ数だけ【物資点】を獲得する。"}
      else if ($range(10, 12, false)['$===']($case)) {text = "なにごともなく補給が完了する。【物資点】を10点獲得する。"}
      else if ((13)['$===']($case)) {text = "ラジオの音が聞こえる。PCが望むなら、1D20を振り、出た目を「ラジオ・マリエッタ表」(『基本ルールブック』P.29)に照らし合わせて、その結果を反映する。これ以後、朝セグメントで振られたラジオ・マリエッタ表の効果は失われる。その後【物資点】を10点獲得する。"}
      else if ((14)['$===']($case)) {text = "補給の合間、ちょっと口寂しくなってしまって露店へ。【物資点】を8点獲得し、アイテム「レモネード」(『基本ルールブック』P.69)を入手する。"}
      else if ((15)['$===']($case)) {text = "補給の合間、軽くメンテナンス。【機体コンディション】を1点下げることができる。その後【物資点】を10点獲得する。"}
      else if ((16)['$===']($case)) {text = "補給の合間、店主と軽く談笑。【乗り手コンデイション】を1点下げることができる。その後【物資点】を10点獲得する。"}
      else if ((17)['$===']($case)) {text = "補給の合間、仲間に軽く挨拶しておこうか。同じマスに他のPCがいた場合、そのPC1人への【キズナ】を1点獲得する。その後【物資点】を10点獲得する。"}
      else if ((18)['$===']($case)) {text = "補給の合間に通りがかった相手と意気投合。相手はキミへの【キズナ】を1点取得する。【物資点】を10点獲得する。"}
      else if ((19)['$===']($case)) {text = "あっさり補給が終わってしまった。どうしようかな。この補給ではアクションを消費せず、【物資点】を10点獲得する。"}
      else if ((20)['$===']($case)) {text = "降って湧いた幸運！【物資点】が20点になる。"};
      return $rb_plus($rb_plus($rb_plus($rb_plus("補給表", "("), dice.$to_s()), ")："), text);
    }, $Paradiso_get_flightsupply_table$10.$$arity = 0), nil) && 'get_flightsupply_table';
  })($nesting[0], $$($nesting, 'DiceBot'), $nesting)
})(Opal);
