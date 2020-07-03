/* Generated by Opal 1.0.3 */
(function(Opal) {
  function $rb_gt(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs > rhs : lhs['$>'](rhs);
  }
  function $rb_plus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
  }
  var self = Opal.top, $nesting = [], nil = Opal.nil, $$$ = Opal.const_get_qualified, $$ = Opal.const_get_relative, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $send = Opal.send, $truthy = Opal.truthy;

  Opal.add_stubs(['$setPrefixes', '$===', '$to_i', '$last_match', '$delete', '$sort', '$checkRoll', '$roll', '$gsub', '$collect', '$split', '$each', '$count', '$>', '$push', '$+', '$join']);
  return (function($base, $super, $parent_nesting) {
    var self = $klass($base, $super, 'OrgaRain');

    var $nesting = [self].concat($parent_nesting), $OrgaRain_initialize$1, $OrgaRain_rollDiceCommand$2, $OrgaRain_checkRoll$3;

    self.$$prototype.sortType = nil;
    
    Opal.const_set($nesting[0], 'ID', "OrgaRain");
    Opal.const_set($nesting[0], 'NAME', "\u5728\u308A\u3066\u904D\u304F\u30AA\u30EB\u30AC\u30EC\u30A4\u30F3");
    Opal.const_set($nesting[0], 'SORT_KEY', "\u304A\u308B\u304B\u308C\u3044\u3093");
    Opal.const_set($nesting[0], 'HELP_MESSAGE', "" + "\u5224\u5B9A\uFF1A[n]OR(count)\n" + "\n" + "[]\u5185\u306E\u30B3\u30DE\u30F3\u30C9\u306F\u7701\u7565\u53EF\u80FD\u3002\n" + "\u300Cn\u300D\u3067\u30C0\u30A4\u30B9\u6570\u3092\u6307\u5B9A\u3002\u7701\u7565\u6642\u306F\u300C1\u300D\u3002\n" + "(count)\u3067\u547D\u6570\u3092\u6307\u5B9A\u3002\u300C3111\u300D\u306E\u3088\u3046\u306B\u8A18\u8FF0\u3002\u6700\u59276\u3064\u3002\u9806\u4E0D\u540C\u53EF\u3002\n" + "\n" + "\u3010\u66F8\u5F0F\u4F8B\u3011\n" + "\u30FB5OR6042 \u2192 5d\u3067\u547D\u6570\u300C0,2,4,6\u300D\u306E\u5224\u5B9A\n" + "\u30FB6OR33333 \u2192 6d\u3067\u547D\u6570\u300C3,3,3,3,3\u300D\u306E\u5224\u5B9A\u3002\n");
    
    Opal.def(self, '$initialize', $OrgaRain_initialize$1 = function $$initialize() {
      var $iter = $OrgaRain_initialize$1.$$p, $yield = $iter || nil, self = this, $zuper = nil, $zuper_i = nil, $zuper_ii = nil;

      if ($iter) $OrgaRain_initialize$1.$$p = null;
      // Prepare super implicit arguments
      for($zuper_i = 0, $zuper_ii = arguments.length, $zuper = new Array($zuper_ii); $zuper_i < $zuper_ii; $zuper_i++) {
        $zuper[$zuper_i] = arguments[$zuper_i];
      }
      
      $send(self, Opal.find_super_dispatcher(self, 'initialize', $OrgaRain_initialize$1, false), $zuper, $iter);
      return (self.sortType = 1);
    }, $OrgaRain_initialize$1.$$arity = 0);
    self.$setPrefixes(["(\\d+)?OR([0-9])?([0-9])?([0-9])?([0-9])?([0-9])?([0-9])?"]);
    
<<<<<<< HEAD
    Opal.defn(self, '$gameName', TMP_OrgaRain_gameName_2 = function $$gameName() {
      var self = this;

      return "在りて遍くオルガレイン"
    }, TMP_OrgaRain_gameName_2.$$arity = 0);
    
    Opal.defn(self, '$gameType', TMP_OrgaRain_gameType_3 = function $$gameType() {
      var self = this;

      return "OrgaRain"
    }, TMP_OrgaRain_gameType_3.$$arity = 0);
    
    Opal.defn(self, '$getHelpMessage', TMP_OrgaRain_getHelpMessage_4 = function $$getHelpMessage() {
      var self = this;

      return "" + "判定：[n]OR(count)\n" + "\n" + "[]内のコマンドは省略可能。\n" + "「n」で骰子数を指定。省略時は「1」。\n" + "(count)で命数を指定。「3111」のように記述。最大6つ。順不同可。\n" + "\n" + "【書式例】\n" + "・5OR6042 → 5dで命数「0,2,4,6」の判定\n" + "・6OR33333 → 6dで命数「3,3,3,3,3」の判定。\n"
    }, TMP_OrgaRain_getHelpMessage_4.$$arity = 0);
    
    Opal.defn(self, '$rollDiceCommand', TMP_OrgaRain_rollDiceCommand_5 = function $$rollDiceCommand(command) {
=======
    Opal.def(self, '$rollDiceCommand', $OrgaRain_rollDiceCommand$2 = function $$rollDiceCommand(command) {
>>>>>>> 0dfe93a1d368ac1ad3ef24167156b31a70848848
      var $a, self = this, diceCount = nil, countNo = nil;

      
      if ($truthy(/(\d+)?OR([0-9])?([0-9])?([0-9])?([0-9])?([0-9])?([0-9])?$/i['$==='](command))) {
        
        diceCount = ($truthy($a = $$($nesting, 'Regexp').$last_match(1)) ? $a : 1).$to_i();
        countNo = [($truthy($a = $$($nesting, 'Regexp').$last_match(2)) ? $a : -1).$to_i(), ($truthy($a = $$($nesting, 'Regexp').$last_match(3)) ? $a : -1).$to_i(), ($truthy($a = $$($nesting, 'Regexp').$last_match(4)) ? $a : -1).$to_i(), ($truthy($a = $$($nesting, 'Regexp').$last_match(5)) ? $a : -1).$to_i(), ($truthy($a = $$($nesting, 'Regexp').$last_match(6)) ? $a : -1).$to_i(), ($truthy($a = $$($nesting, 'Regexp').$last_match(7)) ? $a : -1).$to_i()];
        countNo.$delete(-1);
        countNo = countNo.$sort();
        return self.$checkRoll(diceCount, countNo);};
      return nil;
    }, $OrgaRain_rollDiceCommand$2.$$arity = 1);
    return (Opal.def(self, '$checkRoll', $OrgaRain_checkRoll$3 = function $$checkRoll(diceCount, countNo) {
      var $a, $b, $$4, $$5, self = this, _dice = nil, diceText = nil, diceText2 = nil, diceArray = nil, resultArray = nil, success = nil, countText = nil, resultText = nil, result = nil;

      
      $b = self.$roll(diceCount, 10, self.sortType), $a = Opal.to_ary($b), (_dice = ($a[0] == null ? nil : $a[0])), (diceText = ($a[1] == null ? nil : $a[1])), $b;
      diceText2 = diceText.$gsub("10", "0");
      diceArray = $send(diceText2.$split(/,/), 'collect', [], ($$4 = function(i){var self = $$4.$$s || this;

      
        
        if (i == null) {
          i = nil;
        };
        return i.$to_i();}, $$4.$$s = self, $$4.$$arity = 1, $$4));
      resultArray = [];
      success = 0;
      $send(diceArray, 'each', [], ($$5 = function(i){var self = $$5.$$s || this, multiple = nil;

      
        
        if (i == null) {
          i = nil;
        };
        multiple = countNo.$count(i);
        if ($truthy($rb_gt(multiple, 0))) {
          
          resultArray.$push("" + (i) + "(x" + (multiple) + ")");
          return (success = $rb_plus(success, multiple));
        } else {
          return resultArray.$push("\u00D7")
        };}, $$5.$$s = self, $$5.$$arity = 1, $$5));
      countText = countNo.$join(",");
      resultText = resultArray.$join(",");
      result = "" + (diceCount) + "D10(\u547D\u6570\uFF1A" + (countText) + ") \uFF1E " + (diceText) + " \uFF1E " + (resultText) + " \uFF1E \u6210\u529F\u6570\uFF1A" + (success);
      return result;
    }, $OrgaRain_checkRoll$3.$$arity = 2), nil) && 'checkRoll';
  })($nesting[0], $$($nesting, 'DiceBot'), $nesting)
})(Opal);
