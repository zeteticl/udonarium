/* Generated by Opal 0.11.4 */
(function(Opal) {
  function $rb_gt(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs > rhs : lhs['$>'](rhs);
  }
  function $rb_le(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs <= rhs : lhs['$<='](rhs);
  }
  function $rb_plus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
  }
  function $rb_times(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs * rhs : lhs['$*'](rhs);
  }
  var self = Opal.top, $nesting = [], nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $send = Opal.send, $truthy = Opal.truthy;

  Opal.add_stubs(['$setPrefixes', '$===', '$to_i', '$last_match', '$nil?', '$==', '$checkRoll', '$>', '$roll', '$collect', '$split', '$each', '$<=', '$+', '$empty?', '$!=', '$*']);
  return (function($base, $super, $parent_nesting) {
    function $Alsetto(){};
    var self = $Alsetto = $klass($base, $super, 'Alsetto', $Alsetto);

    var def = self.$$proto, $nesting = [self].concat($parent_nesting), TMP_Alsetto_initialize_1, TMP_Alsetto_gameName_2, TMP_Alsetto_gameType_3, TMP_Alsetto_getHelpMessage_4, TMP_Alsetto_rollDiceCommand_5, TMP_Alsetto_checkRoll_8;

    def.sortType = nil;
    
    self.$setPrefixes(["\\d+AL(C|G)?(\\d+)?(x|\\*)\\d+", "\\d+ALC?(\\d+)?"]);
    
    Opal.defn(self, '$initialize', TMP_Alsetto_initialize_1 = function $$initialize() {
      var self = this, $iter = TMP_Alsetto_initialize_1.$$p, $yield = $iter || nil, $zuper = nil, $zuper_i = nil, $zuper_ii = nil;

      if ($iter) TMP_Alsetto_initialize_1.$$p = null;
      // Prepare super implicit arguments
      for($zuper_i = 0, $zuper_ii = arguments.length, $zuper = new Array($zuper_ii); $zuper_i < $zuper_ii; $zuper_i++) {
        $zuper[$zuper_i] = arguments[$zuper_i];
      }
      
      $send(self, Opal.find_super_dispatcher(self, 'initialize', TMP_Alsetto_initialize_1, false), $zuper, $iter);
      return (self.sortType = 1);
    }, TMP_Alsetto_initialize_1.$$arity = 0);
    
    Opal.defn(self, '$gameName', TMP_Alsetto_gameName_2 = function $$gameName() {
      var self = this;

      return "詩片のアルセット"
    }, TMP_Alsetto_gameName_2.$$arity = 0);
    
    Opal.defn(self, '$gameType', TMP_Alsetto_gameType_3 = function $$gameType() {
      var self = this;

      return "Alsetto"
    }, TMP_Alsetto_gameType_3.$$arity = 0);
    
    Opal.defn(self, '$getHelpMessage', TMP_Alsetto_getHelpMessage_4 = function $$getHelpMessage() {
      var self = this;

      return "" + "・成功判定：nAL[m]　　　　・トライアンフ無し：nALC[m]\n" + "・命中判定：nAL[m]*p　　　・トライアンフ無し：nALC[m]*p\n" + "・命中判定（ガンスリンガーの根源詩）：nALG[m]*p\n" + "[]内は省略可能。\n" + "\n" + "ALコマンドはトライアンフの分だけ、自動で振り足し処理を行います。\n" + "「n」で骰子数を指定。\n" + "「m」で目標値を指定。省略時は、デフォルトの「3」が使用されます。\n" + "「p」で攻撃力を指定。「*」は「x」でも可。\n" + "攻撃力指定で命中判定となり、成功数ではなく、ダメージを結果表示します。\n" + "\n" + "ALCコマンドはトライアンフ無しで、成功数、ダメージを結果表示します。\n" + "ALGコマンドは「2以下」でトライアンフ処理を行います。\n" + "\n" + "【書式例】\n" + "・5AL → 5d6で目標値3。\n" + "・5ALC → 5d6で目標値3。トライアンフ無し。\n" + "・6AL2 → 6d6で目標値2。\n" + "・4AL*5 → 4d6で目標値3、攻撃力5の命中判定。\n" + "・7AL2x10 → 7d6で目標値2、攻撃力10の命中判定。\n" + "・8ALC4x5 → 8d6で目標値4、攻撃力5、トライアンフ無しの命中判定。\n"
    }, TMP_Alsetto_getHelpMessage_4.$$arity = 0);
    
    Opal.defn(self, '$rollDiceCommand', TMP_Alsetto_rollDiceCommand_5 = function $$rollDiceCommand(command) {
      var $a, self = this, rapid = nil, isCritical = nil, criticalNumber = nil, target = nil, damage = nil;

      
      if ($truthy(/(\d+)AL(C|G)?(\d+)?((x|\*)(\d+))?$/i['$==='](command))) {
        
        rapid = Opal.const_get_relative($nesting, 'Regexp').$last_match(1).$to_i();
        isCritical = Opal.const_get_relative($nesting, 'Regexp').$last_match(2)['$nil?']();
        if ($truthy(isCritical)) {
          criticalNumber = 1
        } else if (Opal.const_get_relative($nesting, 'Regexp').$last_match(2)['$==']("G")) {
          
          isCritical = true;
          criticalNumber = 2;
          } else {
          criticalNumber = 0
        };
        target = ($truthy($a = Opal.const_get_relative($nesting, 'Regexp').$last_match(3)) ? $a : 3).$to_i();
        damage = ($truthy($a = Opal.const_get_relative($nesting, 'Regexp').$last_match(6)) ? $a : 0).$to_i();
        return self.$checkRoll(rapid, target, damage, isCritical, criticalNumber);};
      return nil;
    }, TMP_Alsetto_rollDiceCommand_5.$$arity = 1);
    return (Opal.defn(self, '$checkRoll', TMP_Alsetto_checkRoll_8 = function $$checkRoll(rapid, target, damage, isCritical, criticalNumber) {
      var $a, $b, $c, TMP_6, TMP_7, self = this, totalSuccessCount = nil, totalCriticalCount = nil, text = nil, rollCount = nil, _dice = nil, diceText = nil, diceArray = nil, successCount = nil, criticalCount = nil, isDamage = nil, totalDamage = nil, result = nil;

      
      totalSuccessCount = 0;
      totalCriticalCount = 0;
      text = "";
      rollCount = rapid;
      while ($truthy($rb_gt(rollCount, 0))) {
        
        $c = self.$roll(rollCount, 6, self.sortType), $b = Opal.to_ary($c), (_dice = ($b[0] == null ? nil : $b[0])), (diceText = ($b[1] == null ? nil : $b[1])), $c;
        diceArray = $send(diceText.$split(/,/), 'collect', [], (TMP_6 = function(i){var self = TMP_6.$$s || this;
if (i == null) i = nil;
        return i.$to_i()}, TMP_6.$$s = self, TMP_6.$$arity = 1, TMP_6));
        successCount = 0;
        criticalCount = 0;
        $send(diceArray, 'each', [], (TMP_7 = function(i){var self = TMP_7.$$s || this;
if (i == null) i = nil;
        
          if ($truthy($rb_le(i, target))) {
            successCount = $rb_plus(successCount, 1)};
          if ($truthy($rb_le(i, criticalNumber))) {
            return (criticalCount = $rb_plus(criticalCount, 1))
            } else {
            return nil
          };}, TMP_7.$$s = self, TMP_7.$$arity = 1, TMP_7));
        totalSuccessCount = $rb_plus(totalSuccessCount, successCount);
        if (criticalCount['$=='](0)) {
          } else {
          totalCriticalCount = $rb_plus(totalCriticalCount, 1)
        };
        if ($truthy(text['$empty?']())) {
          } else {
          text = $rb_plus(text, "+")
        };
        text = $rb_plus(text, "" + (successCount) + "[" + (diceText) + "]");
        if ($truthy(isCritical)) {
          } else {
          break;
        };
        rollCount = criticalCount;
      };
      isDamage = damage['$!='](0);
      if ($truthy(isDamage)) {
        
        totalDamage = $rb_times(totalSuccessCount, damage);
        result = "" + "(" + (rapid) + "D6<=" + (target) + ") ＞ " + (text) + " ＞ Hits：" + (totalSuccessCount) + "*" + (damage) + " ＞ " + (totalDamage) + "ダメージ";
        if ($truthy(isCritical)) {
          result = $rb_plus(result, "" + " / " + (totalCriticalCount) + "トライアンフ")};
        } else {
        
        result = "" + "(" + (rapid) + "D6<=" + (target) + ") ＞ " + (text) + " ＞ 成功数：" + (totalSuccessCount);
        if ($truthy(isCritical)) {
          result = $rb_plus(result, "" + " / " + (totalCriticalCount) + "トライアンフ")};
      };
      return result;
    }, TMP_Alsetto_checkRoll_8.$$arity = 5), nil) && 'checkRoll';
  })($nesting[0], Opal.const_get_relative($nesting, 'DiceBot'), $nesting)
})(Opal);

/* Generated by Opal 0.11.4 */
(function(Opal) {
  var self = Opal.top, $nesting = [], nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice;

  Opal.add_stubs(['$exit']);
  return Opal.const_get_relative($nesting, 'Kernel').$exit()
})(Opal);
