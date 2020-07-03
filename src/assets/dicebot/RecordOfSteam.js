/* Generated by Opal 1.0.3 */
(function(Opal) {
  function $rb_ge(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs >= rhs : lhs['$>='](rhs);
  }
  function $rb_gt(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs > rhs : lhs['$>'](rhs);
  }
  function $rb_plus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
  }
  function $rb_le(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs <= rhs : lhs['$<='](rhs);
  }
  function $rb_times(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs * rhs : lhs['$*'](rhs);
  }
  var self = Opal.top, $nesting = [], nil = Opal.nil, $$$ = Opal.const_get_qualified, $$ = Opal.const_get_relative, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $truthy = Opal.truthy, $gvars = Opal.gvars, $send = Opal.send;

  Opal.add_stubs(['$setPrefixes', '$=~', '$to_i', '$last_match', '$>=', '$getDiceRollResult', '$>', '$length', '$getRoundCountText', '$getSuccessText', '$getSpecialText', '$getFumbleText', '$roll', '$debug', '$!=', '$+', '$collect', '$split', '$==', '$uniq', '$<=', '$first', '$*', '$map']);
  return (function($base, $super, $parent_nesting) {
    var self = $klass($base, $super, 'RecordOfSteam');

    var $nesting = [self].concat($parent_nesting), $RecordOfSteam_rollDiceCommand$1, $RecordOfSteam_getDiceRollResult$2, $RecordOfSteam_getRoundCountText$5, $RecordOfSteam_getSuccessText$6, $RecordOfSteam_getSpecialText$7, $RecordOfSteam_getFumbleText$8;

    
    Opal.const_set($nesting[0], 'ID', "RecordOfSteam");
    Opal.const_set($nesting[0], 'NAME', "Record of Steam");
    Opal.const_set($nesting[0], 'SORT_KEY', "\u308C\u3053\u304A\u3068\u304A\u3075\u3059\u3061\u3044\u3080");
    Opal.const_set($nesting[0], 'HELP_MESSAGE', "" + "2S2@1\n" + "RecordOfSteam : (2S2@1) \uFF1E 1,2,3,4 \uFF1E 1\u56DE\u8EE2 \uFF1E \u6210\u529F\u65702\n" + "\n" + "4S3@2\n" + "RecordOfSteam : (4S3@2) \uFF1E 2,1,2,4,4,4,2,3,4,5,6,6 \uFF1E 4\u56DE\u8EE2 \uFF1E \u6210\u529F\u65705\n");
    self.$setPrefixes(["\\d+S\\d+.*"]);
    
    Opal.def(self, '$rollDiceCommand', $RecordOfSteam_rollDiceCommand$1 = function $$rollDiceCommand(command) {
      var $a, $b, self = this, diceCount = nil, targetNumber = nil, criticalValue = nil, specialValue = nil, rollResult = nil, successCount = nil, roundCount = nil, specialCount = nil, fumbleCount = nil, output = nil, roundCountText = nil, successText = nil, specialText = nil, fumbleText = nil, result = nil;
      if ($gvars.SEND_STR_MAX == null) $gvars.SEND_STR_MAX = nil;

      
      if ($truthy(/(\d+)[sS](\d+)(@(\d+))?/i['$=~'](command))) {
      } else {
        return "1"
      };
      diceCount = $$($nesting, 'Regexp').$last_match(1).$to_i();
      targetNumber = $$($nesting, 'Regexp').$last_match(2).$to_i();
      criticalValue = $$($nesting, 'Regexp').$last_match(4);
      criticalValue = ($truthy($a = criticalValue) ? $a : 1);
      criticalValue = criticalValue.$to_i();
      if ($truthy($rb_ge(diceCount, 150))) {
        return "(\u591A\u5206)\u7121\u9650\u500B\u306A\u306E\u3067\u632F\u308C\u307E\u305B\u3093\uFF01 \u30E4\u30E1\u30C6\u30AF\u30C0\u30B5\u30A4\u3001(\u30D7\u30ED\u30BB\u30B9\u304C)\u6B7B\u3093\u3067\u3057\u307E\u3044\u307E\u3059\u3063"};
      if ($truthy($rb_ge(criticalValue, 3))) {
        return "(\u591A\u5206)\u7121\u9650\u500B\u306A\u306E\u3067\u632F\u308C\u307E\u305B\u3093\uFF01 \u30E4\u30E1\u30C6\u30AF\u30C0\u30B5\u30A4\u3001(\u30D7\u30ED\u30BB\u30B9\u304C)\u6B7B\u3093\u3067\u3057\u307E\u3044\u307E\u3059\u3063"};
      specialValue = criticalValue;
      $b = self.$getDiceRollResult(diceCount, targetNumber, criticalValue, specialValue), $a = Opal.to_ary($b), (rollResult = ($a[0] == null ? nil : $a[0])), (successCount = ($a[1] == null ? nil : $a[1])), (roundCount = ($a[2] == null ? nil : $a[2])), (specialCount = ($a[3] == null ? nil : $a[3])), (fumbleCount = ($a[4] == null ? nil : $a[4])), $b;
      output = "" + "(" + (command) + ") \uFF1E " + (rollResult);
      if ($truthy($rb_gt(output.$length(), $gvars.SEND_STR_MAX))) {
        output = "" + "(" + (command) + ") \uFF1E ..."};
      roundCountText = self.$getRoundCountText(roundCount);
      successText = self.$getSuccessText(successCount);
      specialText = self.$getSpecialText(specialCount);
      fumbleText = self.$getFumbleText(fumbleCount);
      result = "" + (output) + (roundCountText) + (specialText) + (successText) + (fumbleText);
      return result;
    }, $RecordOfSteam_rollDiceCommand$1.$$arity = 1);
    
    Opal.def(self, '$getDiceRollResult', $RecordOfSteam_getDiceRollResult$2 = function $$getDiceRollResult(diceCount, targetNumber, criticalValue, specialValue) {
      var $a, $b, $c, $$3, $$4, self = this, successCount = nil, roundCount = nil, rollResult = nil, specialCount = nil, specialFlag = nil, fumbleCount = nil, fumbleFlag = nil, _ = nil, diceListText = nil, diceList = nil;

      
      successCount = 0;
      roundCount = 0;
      rollResult = "";
      specialCount = 0;
      specialFlag = false;
      fumbleCount = 0;
      fumbleFlag = false;
      while ($truthy($rb_gt(diceCount, 0))) {
        
        $c = self.$roll(diceCount, 6), $b = Opal.to_ary($c), (_ = ($b[0] == null ? nil : $b[0])), (diceListText = ($b[1] == null ? nil : $b[1])), $c;
        self.$debug("diceListText", diceListText);
        if ($truthy(rollResult['$!='](""))) {
          rollResult = $rb_plus(rollResult, ",")};
        rollResult = $rb_plus(rollResult, diceListText);
        diceList = $send(diceListText.$split(/,/), 'collect', [], ($$3 = function(i){var self = $$3.$$s || this;

        
          
          if (i == null) {
            i = nil;
          };
          return i.$to_i();}, $$3.$$s = self, $$3.$$arity = 1, $$3));
        if ($truthy((($b = diceList.$uniq().$length()['$=='](1)) ? roundCount['$=='](0) : diceList.$uniq().$length()['$=='](1)))) {
          if ($truthy($rb_le(diceList.$uniq().$first(), specialValue))) {
            specialFlag = true
          } else if (diceList.$uniq().$first()['$=='](6)) {
            fumbleFlag = true}};
        self.$debug("diceList", diceList);
        if ($truthy(specialFlag)) {
          
          specialCount = 1;
          successCount = $rb_times(diceCount, 3);
          return [rollResult, successCount, roundCount, specialCount, fumbleCount];
        } else if ($truthy(fumbleFlag)) {
          
          fumbleCount = 1;
          return [rollResult, successCount, roundCount, specialCount, fumbleCount];};
        diceCount = 0;
        $send(diceList, 'map', [], ($$4 = function(diceValue){var self = $$4.$$s || this;

        
          
          if (diceValue == null) {
            diceValue = nil;
          };
          self.$debug("diceValue", diceValue);
          self.$debug("criticalValue", criticalValue);
          self.$debug("specialValue", specialValue);
          if ($truthy($rb_le(diceValue, criticalValue))) {
            
            diceCount = $rb_plus(diceCount, 2);
            roundCount = $rb_plus(roundCount, 1);};
          if ($truthy($rb_le(diceValue, targetNumber))) {
            return (successCount = $rb_plus(successCount, 1))
          } else {
            return nil
          };}, $$4.$$s = self, $$4.$$arity = 1, $$4));
      };
      return [rollResult, successCount, roundCount, specialCount, fumbleCount];
    }, $RecordOfSteam_getDiceRollResult$2.$$arity = 4);
    
    Opal.def(self, '$getRoundCountText', $RecordOfSteam_getRoundCountText$5 = function $$getRoundCountText(roundCount) {
      var self = this;

      
      if ($truthy($rb_le(roundCount, 0))) {
        return ""};
      return "" + " \uFF1E " + (roundCount) + "\u56DE\u8EE2";
    }, $RecordOfSteam_getRoundCountText$5.$$arity = 1);
    
    Opal.def(self, '$getSuccessText', $RecordOfSteam_getSuccessText$6 = function $$getSuccessText(successCount) {
      var self = this;

      
      if ($truthy($rb_gt(successCount, 0))) {
        return "" + " \uFF1E \u6210\u529F\u6570" + (successCount)};
      return " \uFF1E \u5931\u6557";
    }, $RecordOfSteam_getSuccessText$6.$$arity = 1);
    
    Opal.def(self, '$getSpecialText', $RecordOfSteam_getSpecialText$7 = function $$getSpecialText(specialCount) {
      var self = this;

      if (specialCount['$=='](1)) {
        return " \uFF1E \u30B9\u30DA\u30B7\u30E3\u30EB"
      } else {
        return nil
      }
    }, $RecordOfSteam_getSpecialText$7.$$arity = 1);
    return (Opal.def(self, '$getFumbleText', $RecordOfSteam_getFumbleText$8 = function $$getFumbleText(fumbleCount) {
      var self = this;

      if (fumbleCount['$=='](1)) {
        return " \uFF1E \u30D5\u30A1\u30F3\u30D6\u30EB"
      } else {
        return nil
      }
    }, $RecordOfSteam_getFumbleText$8.$$arity = 1), nil) && 'getFumbleText';
  })($nesting[0], $$($nesting, 'DiceBot'), $nesting)
})(Opal);
