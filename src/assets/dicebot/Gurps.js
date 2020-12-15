/* Generated by Opal 1.0.3 */
(function(Opal) {
  function $rb_minus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
  }
  function $rb_le(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs <= rhs : lhs['$<='](rhs);
  }
  function $rb_ge(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs >= rhs : lhs['$>='](rhs);
  }
  function $rb_plus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
  }
  function $rb_gt(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs > rhs : lhs['$>'](rhs);
  }
  function $rb_lt(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs < rhs : lhs['$<'](rhs);
  }
  var self = Opal.top, $nesting = [], nil = Opal.nil, $$$ = Opal.const_get_qualified, $$ = Opal.const_get_relative, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $send = Opal.send, $truthy = Opal.truthy;

  Opal.add_stubs(['$setPrefixes', '$==', '$size', '$-', '$<=', '$>=', '$getRollDiceResult', '$nil?', '$getCFTableResult', '$getFearResult', '$getReactResult', '$getHitResult', '$===', '$last_match', '$roll', '$sort', '$map', '$split', '$to_proc', '$getValue', '$+', '$check_nD6', '$get_table_by_nD6', '$to_i', '$>', '$[]', '$<', '$empty?', '$parren_killer']);
  return (function($base, $super, $parent_nesting) {
    var self = $klass($base, $super, 'Gurps');

    var $nesting = [self].concat($parent_nesting), $Gurps_initialize$1, $Gurps_check_nD6$2, $Gurps_rollDiceCommand$3, $Gurps_getRollDiceResult$4, $Gurps_getCFTableResult$5, $Gurps_getFearResult$6, $Gurps_getReactResult$7, $Gurps_getHitResult$8, $Gurps_getValue$9;

    
    Opal.const_set($nesting[0], 'ID', "GURPS");
    Opal.const_set($nesting[0], 'NAME', "ガープス");
    Opal.const_set($nesting[0], 'SORT_KEY', "かあふす");
    Opal.const_set($nesting[0], 'HELP_MESSAGE', "" + "・判定においてクリティカル・ファンブルの自動判別、成功度の自動計算。(3d6<=目標値／目標値-3d6)\n" + " ・祝福等のダイス目にかかる修正は「3d6-1<=目標値」といった記述で計算されます。(ダイス目の修正値はクリティカル・ファンブルに影響を与えません)\n" + " ・クリティカル値・ファンブル値への修正については現在対応していません。\n" + "・クリティカル表 (CRT)\n" + "・頭部打撃クリティカル表 (HCRT)\n" + "・ファンブル表 (FMB)\n" + "・呪文ファンブル表 (MFMB)\n" + "・妖魔夜行スペシャルクリティカル表 (YSCRT)\n" + "・妖魔夜行スペシャルファンブル表 (YSFMB)\n" + "・妖術ファンブル表 (YFMB)\n" + "・命中部位表 (HIT)\n" + "・恐怖表 (FEAR+n)\n" + "　nには恐怖判定の失敗度を入れてください。\n" + "・反応判定表 (REACT, REACT±n)\n" + "　nには反応修正を入れてください。\n" + "・D66ダイスあり\n");
    self.$setPrefixes(["\\w*CRT", "\\w*FMB", "HIT", "FEAR((\\+)?\\d*)", "REACT((\\+|\\-)?\\d*)", "[\\d\\+\\-]+\\-3[dD]6?[\\d\\+\\-]*"]);
    
    Opal.def(self, '$initialize', $Gurps_initialize$1 = function $$initialize() {
      var $iter = $Gurps_initialize$1.$$p, $yield = $iter || nil, self = this, $zuper = nil, $zuper_i = nil, $zuper_ii = nil;

      if ($iter) $Gurps_initialize$1.$$p = null;
      // Prepare super implicit arguments
      for($zuper_i = 0, $zuper_ii = arguments.length, $zuper = new Array($zuper_ii); $zuper_i < $zuper_ii; $zuper_i++) {
        $zuper[$zuper_i] = arguments[$zuper_i];
      }
      
      $send(self, Opal.find_super_dispatcher(self, 'initialize', $Gurps_initialize$1, false), $zuper, $iter);
      self.sendMode = 2;
      return (self.d66Type = 1);
    }, $Gurps_initialize$1.$$arity = 0);
    
    Opal.def(self, '$check_nD6', $Gurps_check_nD6$2 = function $$check_nD6(total, dice_total, dice_list, cmp_op, target) {
      var $a, self = this, success = nil, crt_string = nil, fmb_string = nil, fail_string = nil;

      
      if (target['$==']("?")) {
        return ""};
      if ($truthy((($a = dice_list.$size()['$=='](3)) ? cmp_op['$==']("<=") : dice_list.$size()['$=='](3)))) {
      } else {
        return ""
      };
      success = $rb_minus(target, total);
      crt_string = "" + " ＞ クリティカル(成功度：" + (success) + ")";
      fmb_string = "" + " ＞ ファンブル(失敗度：" + (success) + ")";
      fail_string = "" + " ＞ 自動失敗(失敗度：" + (success) + ")";
      if ($truthy(($truthy($a = $rb_le(dice_total, 6)) ? $rb_ge(target, 16) : $a))) {
        return crt_string
      } else if ($truthy(($truthy($a = $rb_le(dice_total, 5)) ? $rb_ge(target, 15) : $a))) {
        return crt_string
      } else if ($truthy($rb_le(dice_total, 4))) {
        return crt_string};
      if ($truthy($rb_le($rb_minus(target, dice_total), -10))) {
        return fmb_string
      } else if ($truthy(($truthy($a = $rb_ge(dice_total, 17)) ? $rb_le(target, 15) : $a))) {
        return fmb_string
      } else if ($truthy($rb_ge(dice_total, 18))) {
        return fmb_string
      } else if ($truthy($rb_ge(dice_total, 17))) {
        return fail_string};
      if ($truthy($rb_le(total, target))) {
        return "" + " ＞ 成功(成功度：" + (success) + ")"
      } else {
        return "" + " ＞ 失敗(失敗度：" + (success) + ")"
      };
    }, $Gurps_check_nD6$2.$$arity = 5);
    
    Opal.def(self, '$rollDiceCommand', $Gurps_rollDiceCommand$3 = function $$rollDiceCommand(command) {
      var self = this, result = nil;

      
      result = self.$getRollDiceResult(command);
      if ($truthy(result['$nil?']())) {
      } else {
        return result
      };
      result = self.$getCFTableResult(command);
      if ($truthy(result['$nil?']())) {
      } else {
        return result
      };
      result = self.$getFearResult(command);
      if ($truthy(result['$nil?']())) {
      } else {
        return result
      };
      result = self.$getReactResult(command);
      if ($truthy(result['$nil?']())) {
      } else {
        return result
      };
      result = self.$getHitResult(command);
      if ($truthy(result['$nil?']())) {
      } else {
        return result
      };
      return "";
    }, $Gurps_rollDiceCommand$3.$$arity = 1);
    
    Opal.def(self, '$getRollDiceResult', $Gurps_getRollDiceResult$4 = function $$getRollDiceResult(command) {
      var $a, $b, self = this, diffStr = nil, modStr = nil, dice_cnt = nil, dice_max = nil, dice_n = nil, dice_str = nil, diceList = nil, diff = nil, total_n = nil, result = nil;

      
      if ($truthy(/([\d\+\-]+)\-3[dD]6?([\d\+\-]*)/['$==='](command))) {
      } else {
        return nil
      };
      diffStr = $$($nesting, 'Regexp').$last_match(1);
      modStr = ($truthy($a = $$($nesting, 'Regexp').$last_match(2)) ? $a : "");
      dice_cnt = 3;
      dice_max = 6;
      $b = self.$roll(dice_cnt, dice_max), $a = Opal.to_ary($b), (dice_n = ($a[0] == null ? nil : $a[0])), (dice_str = ($a[1] == null ? nil : $a[1])), $b;
      diceList = $send(dice_str.$split(","), 'map', [], "to_i".$to_proc()).$sort();
      diff = self.$getValue(diffStr, 0);
      total_n = $rb_plus(dice_n, self.$getValue(modStr, 0));
      result = "" + "(3D6" + (modStr) + "<=" + (diff) + ") ＞ " + (dice_n) + "[" + (dice_str) + "]" + (modStr) + " ＞ " + (total_n) + (self.$check_nD6(total_n, dice_n, diceList, "<=", diff));
      return result;
    }, $Gurps_getRollDiceResult$4.$$arity = 1);
    
    Opal.def(self, '$getCFTableResult', $Gurps_getCFTableResult$5 = function $$getCFTableResult(command) {
      var $a, $b, self = this, $case = nil, tableName = nil, table = nil, result = nil, number = nil;

      
      if ($truthy(/\w*(FMB|CRT)/['$==='](command))) {
      } else {
        return nil
      };
      $case = command;
      if ("CRT"['$===']($case)) {
      tableName = "クリティカル表";
      table = ["体を狙っていたら、相手は気絶(回復は30分後に生命力判定)。他はダメージ3倍。", "相手の防御点を無視。", "ダメージ3倍。", "ダメージ2倍。", "相手は生命力判定を行い、失敗すると朦朧状態となる。", "四肢を狙っていたら、6ターンそこが使えなくなる。通常ダメージ。", "通常ダメージ。", "通常ダメージ。", "通常ダメージ。", "四肢を狙っていたら、6ターンそこが使えなくなる。通常ダメージ。", "相手の防御点を無視。", "四肢を狙っていたら、そこが使えなくなる(通常ダメージ)。他は2倍ダメージ。", "相手は武器を落とす。通常ダメージ。", "ダメージ2倍。", "ダメージ3倍。", "体を狙っていたら、相手は気絶(回復は30分後に生命力判定)。他はダメージ3倍。"];}
      else if ("HCRT"['$===']($case)) {
      tableName = "頭部打撃クリティカル表";
      table = ["敵は即死する。", "敵は意識を失う。30分ごとに生命力判定をして、成功すると意識を回復する。", "敵は意識を失う。30分ごとに生命力判定をして、成功すると意識を回復する。", "敵は両目を負傷する。朦朧状態になる。目が見えないので、敏捷力-10。", "敵は片目を負傷する。朦朧状態になる。敏捷力-2。", "敵はバランスを失う。次のターンまで、防御しかできない。", "通常ダメージのみ。", "通常ダメージのみ。", "通常ダメージのみ。", "「叩き」攻撃なら、敵は24時間のあいだ耳が聞こえなくなる。「切り」「刺し」なら、1点しかダメージを与えられないが、傷跡が残る。", "「叩き」攻撃なら、敵は耳が聞こえなくなる。「切り」「刺し」なら、2点しかダメージを与えられないが、傷跡が残る。", "敵は逃げ腰になって武器を落とす(両手に武器を持っていたらランダムに決定)。", "敵は通常のダメージを受け、朦朧状態になる。", "敵は通常のダメージを受け、朦朧状態になる。", "敵は通常のダメージを受け、朦朧状態になる。", "敵は通常のダメージを受け、朦朧状態になる。"];}
      else if ("FMB"['$===']($case)) {
      tableName = "ファンブル表";
      table = ["武器が壊れる。ただし、メイスなど固い\"叩き\"武器は壊れない(ふりなおし)。", "武器が壊れる。ただし、フレイルなど固い\"叩き\"武器は壊れない(ふりなおし)。", "自分の腕か足に命中(通常ダメージ)。ただし\"刺し\"武器や射撃ならふりなおし。", "自分の腕か足に命中(半分ダメージ)。ただし\"刺し\"武器や射撃ならふりなおし。", "バランスを失い、次ターンは行動不可。次ターンの行動の番まで、能動防御-2。", "使った武器が非準備状態になる。1ターンよぶんに準備行動を行わないと、準備状態にならない。", "武器を落とす。", "武器を落とす。", "武器を落とす。", "使った武器が非準備状態になる。1ターンよぶんに準備行動を行わないと、準備状態にならない。", "バランスを失い、次ターンは行動不可。次ターンの行動の番まで、能動防御-2。", "前か後ろ(ランダム)に武器が1メートル飛んでいく。その場にいる角色は敏捷力判定を行い、失敗するとダメージ(通常の半分)を受ける。ただし、\"刺し\"武器や弓矢はその場に落ちるだけ。", "利き腕をくじいてしまう。30分間、攻撃にも防御にも使えない。", "足をすべらせ、その場に倒れる。", "武器が壊れる。ただし、モールなど固い\"叩き\"武器は壊れない(ふりなおし)。", "武器が壊れる。ただし、金属バットなど固い\"叩き\"武器は壊れない(ふりなおし)。"];}
      else if ("MFMB"['$===']($case)) {
      tableName = "呪文ファンブル表";
      table = ["呪文が完全に失敗する。術者は1D点のダメージを受ける。", "呪文が術者にかかる。", "呪文が術者の仲間にかかる(対象はランダムに決定)。", "呪文が近くの敵にかかる(対象はランダムに決定)。", "哀れな物音があがり、硫黄のひどい匂いが立ち込める。", "呪文が目標以外のもの(仲間、敵、品物)にかかる。対象はランダムに決定するか、おもしろくなるようにGMが決定する。", "呪文が完全に失敗する。術者は1点のダメージを受ける。", "呪文が完全に失敗する。術者は朦朧状態になる(立ち直るには知力判定を行う)。", "大きな物音があがり、色とりどりの閃光が走る。", "見せ掛けの効果があらわれるが、弱くてとても役に立たない。", "意図した効果と逆の効果があらわれる。", "違った目標に、意図した効果とは逆の効果があらわれる(対象はランダムに決定)。", "何も起こらないが、術者は一時的にその呪文を忘れてしまう。思い出すまで、1週間ごとに知力判定を行う。", "呪文がかかったように思えるが、役に立たないただの見せかけだけ。", "呪文が完全に失敗し、術者の右腕が損なわれる。回復に1週間を要する。", "呪文が完全に失敗する。GMから見て、術者や呪文が純粋で善良なものでなければ、悪魔(第3版文庫版P.384参照)があらわれ、術者を攻撃する。"];}
      else if ("YSCRT"['$===']($case)) {
      tableName = "妖魔夜行スペシャルクリティカル表";
      table = ["目(あるいは急所)に当たった！目(あるいは急所)が無ければ3倍ダメージ。", "胴体を狙っていたら、相手は気絶(回復は30分後に生命力判定)。他は3倍ダメージ。", "相手の防護点を無視。通常ダメージ。", "ダメージ3倍。", "ダメージ2倍", "敵は転倒する。通常ダメージ。", "四肢を狙っていたら、6ターンの間そこが使えなくなる。通常ダメージ。", "通常ダメージ。", "相手は武器を落とす。通常ダメージ。", "相手は生命力判定を行い、失敗すると朦朧状態になる。回復判定は毎ターンはじめに行う。通常ダメージ。", "相手の防護点を無視。通常ダメージ。", "四肢を狙っていたら、その四肢は使えなくなる(通常ダメージ)。他は2倍ダメージ。", "攻撃者は、目(あるいはその他の主要感覚部位)がくらんでしまう。1D-3ターン(最低1ターン)盲目状態。通常ダメージ。", "ダメージ2倍。", "ダメージ3倍。", "胴体を狙っていたら、相手は気絶(回復は30分後に生命力判定)。他は3倍ダメージ。"];}
      else if ("YSFMB"['$===']($case)) {
      tableName = "妖魔夜行スペシャルファンブル表";
      table = ["この表を2回振って、両方の結果を適用する。", "自分に命中。通常ダメージ。防護点、吸収、反射は無視(「◯◯に無敵」の妖力は有効)。", "自分に命中。半分ダメージ。防護点、吸収、反射は無視(「◯◯に無敵」の妖力は有効)。", "足などが傷つき、30分のあいだ、移動手段が失われる。能動防御-4。", "攻撃に使った部位に1D点のダメージ。防護点は無視。", "バランスを失い、次ターンは行動不可。次ターンの行動の番まで、能動防御-2。", "攻撃に使った部位に1D-2点のダメージ。防護点は無視。", "よろけてしまう。次のターンは移動できない。", "バランスを失う。次のターンの行動の番まで、能動防御-2。", "足をすべらせその場に倒れる。飛行中なら50m落下(高度が50m以下なら墜落)。", "近くに味方(または無関係の人物)がいれば、攻撃が命中してしまう。いなければ、振り直し。", "大きな隙ができる。接近戦なら、敵は、即座に一撃をくわえられる。能動防御は-2で可能。射撃戦なら振り直し。", "攻撃に使った部位をくじいてしまう。30分間、攻撃にも防御にも使えない。", "攻撃者は、目(あるいはその他の主要感覚部位)がくらんでしまう。1D-3ターン(最低1ターン)盲目状態。通常ダメージ。", "自分に命中。半分ダメージ。防護点は無効。", "この表を2回振って、玩家が好きな方を適用する。"];}
      else if ("YFMB"['$===']($case)) {
      tableName = "妖術ファンブル表";
      table = ["妖術が完全に失敗する。術者は3D点のダメージを受ける。", "妖術が完全に失敗する。術者は1D点のダメージを受ける。", "妖術が術者にかかる。", "妖術が術者の仲間にかかる(誰にかかるかは、ランダムに決定する)。", "妖術が近くの敵にかかる(誰にかかるかは、ランダムに決定する)。", "妖術が目標以外のもの(仲間、敵、品物)にかかる。何にかかるかは、ランダムに決定するか、おもしろくなるようにGMが選ぶ。", "妖術が発動したように見えるが、実際の効果はない。効果があったように見えても、GMがいちばん面白いと思った時に消滅させられる。", "妖術は発動するが、威力レベルが半分になっている。", "妖術は発動するが、威力レベルが半分になっている。さらに大きな音があがり、色とりどりの閃光が走り、悪臭(善い意図で使われたなら芳香)がたちこめる。", "妖術が完全に失敗する。術者は朦朧状態になる(立ち直るにはターンの頭ごとに意志判定を行う)。", "妖術は発動する。しかし制御することができない。次のターンでも、妖術を使ってしまうが、自動的にファンブルになる。", "目標に、意図した効果と正反対の効果があらわれる。", "何も怒らない。術者は一時的にその妖術を忘れてしまう。思い出すまで、1日ごとに知力判定を行う。", "違った目標に、意図した効果とは正反対の効果があらわれる(どこにあらわれるかはランダムに決定)。とっさに思いつかなければ\"振り直す\"。", "妖術が完全に失敗し、術者の弱点が明らかにされる。弱点がなければ振り直して良い。", "妖術が完全に失敗する。術者は完全な行動不能におちいる。回復は反日ごとに生命力で判定を行う。"];}
      else {return nil};
      $b = self.$get_table_by_nD6(table, 3), $a = Opal.to_ary($b), (result = ($a[0] == null ? nil : $a[0])), (number = ($a[1] == null ? nil : $a[1])), $b;
      return "" + (tableName) + "(" + (number) + ")：" + (result);
    }, $Gurps_getCFTableResult$5.$$arity = 1);
    
    Opal.def(self, '$getFearResult', $Gurps_getFearResult$6 = function $$getFearResult(command) {
      var $a, $b, self = this, modify = nil, tableName = nil, table = nil, dice = nil, number = nil, num = nil, result = nil;

      
      if ($truthy(/FEAR((\+)?\d+)?/['$==='](command))) {
      } else {
        return nil
      };
      modify = $$($nesting, 'Regexp').$last_match(1).$to_i();
      tableName = "恐怖表";
      table = ["1ターン朦朧状態。2ターン目に自動回復。", "1ターン朦朧状態。2ターン目に自動回復。", "1ターン朦朧状態。以後、毎ターン不利な修正を無視した意志判定を行い、成功すると回復。", "1ターン朦朧状態。以後、毎ターン不利な修正を無視した意志判定を行い、成功すると回復。", "1ターン朦朧状態。以後、毎ターン通常の意志判定を行い、成功すると回復。", "1ターン朦朧状態。以後、毎ターン通常の意志判定を行い、成功すると回復。", "1Dターン朦朧状態。以後、毎ターン通常の意志判定を行い、成功すると回復。", "2Dターン朦朧状態。以後、毎ターン通常の意志判定を行い、成功すると回復。", "思考不能。15ターン朦朧状態。以後、毎ターン通常の意志判定を行い、成功すると回復。", "新たな癖をひとつ植え付けられる。", "1D点疲労。さらに1Dターン朦朧状態。以後、毎ターン通常の意志判定を行い、成功すると回復。", "1D点疲労。さらに1Dターン朦朧状態。以後、毎ターン通常の意志判定を行い、成功すると回復。", "新たな癖をひとつ獲得。さらに1Dターン朦朧状態。以後、毎ターン通常の意志判定を行い、成功すると回復。", "1D分間意識を失う。以後、1分ごとに生命力判定を行い、成功すると回復。", "生命力判定を行い、失敗すると1点の負傷を受ける。さらに1D分間意識を失う。以後、1分ごとに生命力判定を行い、成功すると回復。", "1点負傷。2D分間意識を失う。以後、1分ごとに生命力判定を行い、成功すると回復。", "卒倒。4D分間意識不明。1D点疲労。", "パニック。1D分間のあいだ、叫びながら走り回ったり、座り込んで泣きわめいたりする。以後、1分ごとに知力判定(修正なし)を行い、成功すると回復。", "-10CPの妄想を植え付けられる。", "-10CPの軽い恐怖症を植え付けられる。", "肉体的な変化。髪が真白になったり、老化したりする。-15CPぶんの肉体的特徴に等しい。", "その恐怖に関連する軽い恐怖症を持っているならそれが強い恐怖症(CP2倍)になる。そうでなければ、-10CPぶんの精神的特徴を植え付けられる。", "-10CPの妄想を植え付けられる。生命力判定を行い、失敗すると1点の負傷を受ける。さらに1D分間意識を失う。以後、1分ごとに生命力判定を行い、成功すると回復。", "-10CPの軽い恐怖症を植え付けられる。生命力判定を行い、失敗すると1点の負傷を受ける。さらに1D分間意識を失う。以後、1分ごとに生命力判定を行い、成功すると回復。", "浅い昏睡状態。30分ごとに生命力判定を行い、成功すると目覚める。目覚めてから6時間はあらゆる判定に-2の修正。", "昏睡状態。1時間ごとに生命力判定を行い、成功すると目覚める。目覚めてから6時間はあらゆる判定に-2の修正。", "硬直。1D日のあいだ身動きしない。その時点で生命力判定を行い、成功すると動けるようになる。失敗するとさらに1D日硬直。その間、適切な医学的処置を受けていないかぎり、初日に1点、2日目に2点、3日目に3点と生命力を失っていく。動けるようになってからも、硬直していたのと同じ日数だけ、あらゆる判定に-2の修正。", "痙攣。1D分間地面に倒れて痙攣する。2D点疲労。また、生命力判定に失敗すると1D点負傷。これがファンブルなら生命力1点を永遠に失う。", "発作。軽い心臓発作を起こし、地面に倒れる。2D点負傷。", "大パニック。キャラクターは支離滅裂な行動に出る。GMが3Dを振り、目が大きければ大きいほど馬鹿げた行動を行う。その行動が終わったら知力判定を行い、成功すると我に返る。失敗すると新たな馬鹿げた行動をとる。", "強い妄想(-15CP)を植え付けられる。", "強い恐怖症、ないし-15CPぶんの精神的特徴を植え付けられる。", "激しい肉体的変化。髪が真白になったり、老化したりする。-20CPぶんの肉体的特徴に等しい。", "激しい肉体的変化。髪が真白になったり、老化したりする。-30CPぶんの肉体的特徴に等しい。", "昏睡状態。1時間ごとに生命力判定を行い、成功すると目覚める。目覚めてから6時間はあらゆる判定に-2の修正。さらに強い妄想(-15CP)を植え付けられる。", "昏睡状態。1時間ごとに生命力判定を行い、成功すると目覚める。目覚めてから6時間はあらゆる判定に-2の修正。さらに強い恐怖症、ないし-30CPぶんの精神的特徴を植え付けられる。", "昏睡状態。1時間ごとに生命力判定を行い、成功すると目覚める。目覚めてから6時間はあらゆる判定に-2の修正。さらに強い恐怖症、ないし-30CPぶんの精神的特徴を植え付けられる。知力が1点永遠に低下する。あわせて精神系の技能、呪文、超能力のレベルも低下する。"];
      $b = self.$roll(3, 6), $a = Opal.to_ary($b), (dice = ($a[0] == null ? nil : $a[0])), $b;
      number = $rb_plus(dice, modify);
      if ($truthy($rb_gt(number, 40))) {
        num = 36
      } else {
        num = $rb_minus(number, 4)
      };
      result = table['$[]'](num);
      return "" + (tableName) + "(" + (number) + ")：" + (result);
    }, $Gurps_getFearResult$6.$$arity = 1);
    
    Opal.def(self, '$getReactResult', $Gurps_getReactResult$7 = function $$getReactResult(command) {
      var $a, $b, self = this, modify = nil, tableName = nil, dice = nil, number = nil, result = nil;

      
      if ($truthy(/REACT((\+|\-)?\d*)/['$==='](command))) {
      } else {
        return nil
      };
      modify = $$($nesting, 'Regexp').$last_match(1).$to_i();
      tableName = "反応表";
      $b = self.$roll(3, 6), $a = Opal.to_ary($b), (dice = ($a[0] == null ? nil : $a[0])), $b;
      number = $rb_plus(dice, modify);
      if ($truthy($rb_lt(number, 1))) {
        result = "最悪"
      } else if ($truthy($rb_lt(number, 4))) {
        result = "とても悪い"
      } else if ($truthy($rb_lt(number, 7))) {
        result = "悪い"
      } else if ($truthy($rb_lt(number, 10))) {
        result = "良くない"
      } else if ($truthy($rb_lt(number, 13))) {
        result = "中立"
      } else if ($truthy($rb_lt(number, 16))) {
        result = "良い"
      } else if ($truthy($rb_lt(number, 19))) {
        result = "とても良い"
      } else {
        result = "最高"
      };
      return "" + (tableName) + "(" + (number) + ")：" + (result);
    }, $Gurps_getReactResult$7.$$arity = 1);
    
    Opal.def(self, '$getHitResult', $Gurps_getHitResult$8 = function $$getHitResult(command) {
      var $a, $b, self = this, tableName = nil, table = nil, result = nil, number = nil;

      
      if ($truthy("HIT"['$==='](command))) {
      } else {
        return nil
      };
      tableName = "命中部位表";
      table = ["脳", "脳", "頭", "遠い腕", "手首(左右ランダム)", "近い腕", "胴体", "胴体", "胴体", "遠い足", "近い足", "近い足", "足首(左右ランダム)", "足首(左右ランダム)", "重要機関(胴体の)", "武器"];
      $b = self.$get_table_by_nD6(table, 3), $a = Opal.to_ary($b), (result = ($a[0] == null ? nil : $a[0])), (number = ($a[1] == null ? nil : $a[1])), $b;
      return "" + (tableName) + "(" + (number) + ")：" + (result);
    }, $Gurps_getHitResult$8.$$arity = 1);
    return (Opal.def(self, '$getValue', $Gurps_getValue$9 = function $$getValue(text, defaultValue) {
      var $a, self = this;

      
      if ($truthy(($truthy($a = text['$nil?']()) ? $a : text['$empty?']()))) {
        return defaultValue};
      return self.$parren_killer($rb_plus($rb_plus("(0", text), ")")).$to_i();
    }, $Gurps_getValue$9.$$arity = 2), nil) && 'getValue';
  })($nesting[0], $$($nesting, 'DiceBot'), $nesting)
})(Opal);
