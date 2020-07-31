/* Generated by Opal 1.0.3 */
(function(Opal) {
  function $rb_gt(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs > rhs : lhs['$>'](rhs);
  }
  function $rb_lt(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs < rhs : lhs['$<'](rhs);
  }
  function $rb_minus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
  }
  function $rb_plus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
  }
  function $rb_ge(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs >= rhs : lhs['$>='](rhs);
  }
  var self = Opal.top, $nesting = [], nil = Opal.nil, $$$ = Opal.const_get_qualified, $$ = Opal.const_get_relative, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $send = Opal.send, $truthy = Opal.truthy;

  Opal.add_stubs(['$setPrefixes', '$ed_step', '$getStepResult', '$=~', '$to_i', '$last_match', '$>', '$<', '$getStepTable', '$[]', '$-', '$===', '$+', '$debug', '$rollStep', '$!=', '$to_s', '$==', '$>=', '$empty?', '$times', '$roll']);
  return (function($base, $super, $parent_nesting) {
    var self = $klass($base, $super, 'EarthDawn');

    var $nesting = [self].concat($parent_nesting), $EarthDawn_initialize$1, $EarthDawn_rollDiceCommand$2, $EarthDawn_ed_step$3, $EarthDawn_getStepResult$4, $EarthDawn_getStepTable$5, $EarthDawn_rollStep$6;

    self.$$prototype.string = self.$$prototype.isFailed = nil;
    
    Opal.const_set($nesting[0], 'ID', "EarthDawn");
    Opal.const_set($nesting[0], 'NAME', "アースドーン");
    Opal.const_set($nesting[0], 'SORT_KEY', "ああすとおん");
    Opal.const_set($nesting[0], 'HELP_MESSAGE', "" + "ステップダイス　(xEn+k)\n" + "ステップx、目標値n(省略可能）、カルマダイスk(D2-D20)でステップダイスをロールします。\n" + "振り足しも自動。\n" + "例）9E　10E8　10E+D12\n");
    self.$setPrefixes(["\\d+e.*"]);
    
    Opal.def(self, '$initialize', $EarthDawn_initialize$1 = function $$initialize() {
      var $iter = $EarthDawn_initialize$1.$$p, $yield = $iter || nil, self = this, $zuper = nil, $zuper_i = nil, $zuper_ii = nil;

      if ($iter) $EarthDawn_initialize$1.$$p = null;
      // Prepare super implicit arguments
      for($zuper_i = 0, $zuper_ii = arguments.length, $zuper = new Array($zuper_ii); $zuper_i < $zuper_ii; $zuper_i++) {
        $zuper[$zuper_i] = arguments[$zuper_i];
      }
      
      $send(self, Opal.find_super_dispatcher(self, 'initialize', $EarthDawn_initialize$1, false), $zuper, $iter);
      self.sendMode = 2;
      return (self.sortType = 1);
    }, $EarthDawn_initialize$1.$$arity = 0);
    
    Opal.def(self, '$rollDiceCommand', $EarthDawn_rollDiceCommand$2 = function $$rollDiceCommand(command) {
      var self = this;

      return self.$ed_step(command)
    }, $EarthDawn_rollDiceCommand$2.$$arity = 1);
    
    Opal.def(self, '$ed_step', $EarthDawn_ed_step$3 = function $$ed_step(str) {
      var self = this, output = nil;

      
      output = self.$getStepResult(str);
      return output;
    }, $EarthDawn_ed_step$3.$$arity = 1);
    
    Opal.def(self, '$getStepResult', $EarthDawn_getStepResult$4 = function $$getStepResult(str) {
      var self = this, stepTotal = nil, step = nil, targetNumber = nil, hasKarmaDice = nil, karmaDiceCount = nil, karmaDiceType = nil, stable = nil, nmod = nil, d20step = nil, d12step = nil, d10step = nil, d8step = nil, d6step = nil, d4step = nil, $case = nil, output = nil, excelentSuccessNumber = nil, superSuccessNumber = nil, goodSuccessNumber = nil, failedNumber = nil;

      
      if ($truthy(/(\d+)E(\d+)?(\+)?(\d+)?(d\d+)?/i['$=~'](str))) {
      } else {
        return nil
      };
      stepTotal = 0;
      self.isFailed = true;
      step = $$($nesting, 'Regexp').$last_match(1).$to_i();
      targetNumber = 0;
      hasKarmaDice = false;
      karmaDiceCount = 0;
      karmaDiceType = 0;
      if ($truthy($rb_gt(step, 40))) {
        step = 40};
      if ($truthy($$($nesting, 'Regexp').$last_match(2))) {
        
        targetNumber = $$($nesting, 'Regexp').$last_match(2).$to_i();
        if ($truthy($rb_gt(targetNumber, 43))) {
          targetNumber = 42};};
      if ($truthy($$($nesting, 'Regexp').$last_match(3))) {
        hasKarmaDice = $$($nesting, 'Regexp').$last_match(3).$to_i()};
      if ($truthy($$($nesting, 'Regexp').$last_match(4))) {
        karmaDiceCount = $$($nesting, 'Regexp').$last_match(4).$to_i()};
      if ($truthy($$($nesting, 'Regexp').$last_match(5))) {
        karmaDiceType = $$($nesting, 'Regexp').$last_match(5)};
      if ($truthy($rb_lt(targetNumber, 0))) {
        return nil};
      stable = self.$getStepTable();
      nmod = stable['$[]'](0)['$[]']($rb_minus(step, 1));
      d20step = stable['$[]'](1)['$[]']($rb_minus(step, 1));
      d12step = stable['$[]'](2)['$[]']($rb_minus(step, 1));
      d10step = stable['$[]'](3)['$[]']($rb_minus(step, 1));
      d8step = stable['$[]'](4)['$[]']($rb_minus(step, 1));
      d6step = stable['$[]'](5)['$[]']($rb_minus(step, 1));
      d4step = stable['$[]'](6)['$[]']($rb_minus(step, 1));
      if ($truthy(hasKarmaDice)) {
        $case = karmaDiceType;
        if (/d20/i['$===']($case)) {d20step = $rb_plus(d20step, karmaDiceCount)}
        else if (/d12/i['$===']($case)) {d12step = $rb_plus(d12step, karmaDiceCount)}
        else if (/d10/i['$===']($case)) {d10step = $rb_plus(d10step, karmaDiceCount)}
        else if (/d8/i['$===']($case)) {d8step = $rb_plus(d8step, karmaDiceCount)}
        else if (/d6/i['$===']($case)) {d6step = $rb_plus(d6step, karmaDiceCount)}
        else if (/d4/i['$===']($case)) {d4step = $rb_plus(d4step, karmaDiceCount)}
        else {nmod = $rb_plus(nmod, karmaDiceCount)}};
      self.string = "";
      self.$debug("d20step, d12step, d10step, d8step, d6step, d4step", d20step, d12step, d10step, d8step, d6step, d4step);
      stepTotal = $rb_plus(stepTotal, self.$rollStep(20, d20step));
      stepTotal = $rb_plus(stepTotal, self.$rollStep(12, d12step));
      stepTotal = $rb_plus(stepTotal, self.$rollStep(10, d10step));
      stepTotal = $rb_plus(stepTotal, self.$rollStep(8, d8step));
      stepTotal = $rb_plus(stepTotal, self.$rollStep(6, d6step));
      stepTotal = $rb_plus(stepTotal, self.$rollStep(4, d4step));
      if ($truthy($rb_gt(nmod, 0))) {
        self.string = $rb_plus(self.string, "+")};
      if ($truthy(nmod['$!='](0))) {
        
        self.string = $rb_plus(self.string, nmod.$to_s());
        stepTotal = $rb_plus(stepTotal, nmod);};
      self.string = $rb_plus(self.string, "" + " ＞ " + (stepTotal));
      output = "" + "ステップ" + (step) + " ＞ " + (self.string);
      if (targetNumber['$=='](0)) {
        return output};
      self.string = $rb_plus(self.string, " ＞ ");
      excelentSuccessNumber = stable['$[]'](7)['$[]']($rb_minus(targetNumber, 1));
      superSuccessNumber = stable['$[]'](8)['$[]']($rb_minus(targetNumber, 1));
      goodSuccessNumber = stable['$[]'](9)['$[]']($rb_minus(targetNumber, 1));
      failedNumber = stable['$[]'](11)['$[]']($rb_minus(targetNumber, 1));
      if ($truthy(self.isFailed)) {
        self.string = $rb_plus(self.string, "自動失敗")
      } else if ($truthy($rb_ge(stepTotal, excelentSuccessNumber))) {
        self.string = $rb_plus(self.string, "最良成功")
      } else if ($truthy($rb_ge(stepTotal, superSuccessNumber))) {
        self.string = $rb_plus(self.string, "優成功")
      } else if ($truthy($rb_ge(stepTotal, goodSuccessNumber))) {
        self.string = $rb_plus(self.string, "良成功")
      } else if ($truthy($rb_ge(stepTotal, targetNumber))) {
        self.string = $rb_plus(self.string, "成功")
      } else if ($truthy($rb_lt(stepTotal, failedNumber))) {
        self.string = $rb_plus(self.string, "大失敗")
      } else {
        self.string = $rb_plus(self.string, "失敗")
      };
      output = "" + "ステップ" + (step) + ">=" + (targetNumber) + " ＞ " + (self.string);
      return output;
    }, $EarthDawn_getStepResult$4.$$arity = 1);
    
    Opal.def(self, '$getStepTable', $EarthDawn_getStepTable$5 = function $$getStepTable() {
      var self = this, mod = nil, d20 = nil, d12 = nil, d10 = nil, d8 = nil, d6 = nil, d4 = nil, exsuc = nil, ssuc = nil, gsuc = nil, nsuc = nil, fsuc = nil, stable = nil;

      
      mod = [-2, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      d20 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      d12 = [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1];
      d10 = [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 2, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 2, 3, 2, 1, 1, 1, 2, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 2, 1];
      d8 = [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 2, 1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0];
      d6 = [0, 0, 0, 1, 0, 0, 0, 2, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 2, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 2, 1, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 2, 1, 1, 0, 0, 0];
      d4 = [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      exsuc = [6, 8, 10, 12, 14, 17, 19, 20, 22, 24, 25, 27, 29, 32, 33, 35, 37, 38, 39, 41, 42, 44, 45, 47, 48, 49, 51, 52, 54, 55, 56, 58, 59, 60, 62, 64, 65, 67, 68, 70, 71, 72];
      ssuc = [4, 6, 8, 10, 11, 13, 15, 16, 18, 19, 21, 22, 24, 26, 27, 29, 30, 32, 33, 34, 35, 37, 38, 40, 41, 42, 43, 45, 46, 47, 48, 49, 51, 52, 53, 55, 56, 58, 59, 60, 61, 62];
      gsuc = [2, 4, 6, 7, 9, 10, 12, 13, 14, 15, 17, 18, 20, 21, 22, 24, 25, 26, 27, 28, 29, 31, 32, 33, 34, 35, 36, 38, 39, 40, 41, 42, 43, 45, 46, 47, 48, 50, 51, 52, 53, 54];
      nsuc = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42];
      fsuc = [0, 1, 1, 1, 1, 2, 2, 3, 4, 5, 5, 6, 6, 7, 8, 8, 9, 10, 11, 12, 13, 13, 14, 15, 16, 17, 18, 18, 18, 20, 21, 22, 23, 23, 24, 25, 26, 26, 27, 28, 29, 30];
      stable = [mod, d20, d12, d10, d8, d6, d4, exsuc, ssuc, gsuc, nsuc, fsuc];
      return stable;
    }, $EarthDawn_getStepTable$5.$$arity = 0);
    return (Opal.def(self, '$rollStep', $EarthDawn_rollStep$6 = function $$rollStep(diceType, diceCount) {
      var $$7, self = this, stepTotal = nil;

      
      self.$debug("rollStep diceType, diceCount, @string", diceType, diceCount, self.string);
      stepTotal = 0;
      if ($truthy($rb_gt(diceCount, 0))) {
      } else {
        return stepTotal
      };
      if ($truthy(self.string['$empty?']())) {
      } else {
        self.string = $rb_plus(self.string, "+")
      };
      self.string = $rb_plus(self.string, "" + (diceCount) + "d" + (diceType) + "[");
      self.$debug("rollStep @string", self.string);
      $send(diceCount, 'times', [], ($$7 = function(i){var self = $$7.$$s || this, $a, $b, $c, dice_now = nil, dice_in = nil;
        if (self.string == null) self.string = nil;

      
        
        if (i == null) {
          i = nil;
        };
        $b = self.$roll(1, diceType), $a = Opal.to_ary($b), (dice_now = ($a[0] == null ? nil : $a[0])), $b;
        if ($truthy(dice_now['$!='](1))) {
          self.isFailed = false};
        dice_in = dice_now;
        while (dice_now['$=='](diceType)) {
          
          $c = self.$roll(1, diceType), $b = Opal.to_ary($c), (dice_now = ($b[0] == null ? nil : $b[0])), $c;
          dice_in = $rb_plus(dice_in, dice_now);
        };
        stepTotal = $rb_plus(stepTotal, dice_in);
        if ($truthy(i['$!='](0))) {
          self.string = $rb_plus(self.string, ",")};
        return (self.string = $rb_plus(self.string, dice_in.$to_s()));}, $$7.$$s = self, $$7.$$arity = 1, $$7));
      self.string = $rb_plus(self.string, "]");
      return stepTotal;
    }, $EarthDawn_rollStep$6.$$arity = 2), nil) && 'rollStep';
  })($nesting[0], $$($nesting, 'DiceBot'), $nesting)
})(Opal);
Opal.loaded(["diceBot/EarthDawn.js"]);
/* Generated by Opal 1.0.3 */
(function(Opal) {
  function $rb_minus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
  }
  function $rb_lt(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs < rhs : lhs['$<'](rhs);
  }
  function $rb_plus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
  }
  function $rb_gt(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs > rhs : lhs['$>'](rhs);
  }
  function $rb_le(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs <= rhs : lhs['$<='](rhs);
  }
  function $rb_divide(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs / rhs : lhs['$/'](rhs);
  }
  function $rb_ge(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs >= rhs : lhs['$>='](rhs);
  }
  var self = Opal.top, $nesting = [], nil = Opal.nil, $$$ = Opal.const_get_qualified, $$ = Opal.const_get_relative, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $send = Opal.send, $truthy = Opal.truthy;

  Opal.add_stubs(['$require', '$setPrefixes', '$ed_step', '$getStepResult', '$=~', '$to_i', '$last_match', '$min', '$!', '$nil?', '$max', '$new', '$[]=', '$-', '$<', '$getStepInfo', '$debug', '$each', '$+', '$rollStep', '$shift', '$getModifyText', '$==', '$getSuccess', '$>', '$to_s', '$getBaseStepTable', '$first', '$last', '$<=', '$get_table_by_number', '$floor', '$/', '$size', '$times', '$addStepToResult', '$%', '$[]', '$getSuccessTable', '$>=', '$empty?', '$roll', '$!=']);
  
  self.$require("diceBot/EarthDawn");
  return (function($base, $super, $parent_nesting) {
    var self = $klass($base, $super, 'EarthDawn3');

    var $nesting = [self].concat($parent_nesting), $EarthDawn3_initialize$1, $EarthDawn3_rollDiceCommand$2, $EarthDawn3_ed_step$3, $EarthDawn3_getStepResult$4, $EarthDawn3_getModifyText$7, $EarthDawn3_getBaseStepTable$8, $EarthDawn3_getStepInfo$9, $EarthDawn3_addStepToResult$11, $EarthDawn3_getSuccess$13, $EarthDawn3_getSuccessTable$14, $EarthDawn3_rollStep$15;

    self.$$prototype.string = self.$$prototype.isFailed = nil;
    
    Opal.const_set($nesting[0], 'ID', "EarthDawn3");
    Opal.const_set($nesting[0], 'NAME', "アースドーン3版");
    Opal.const_set($nesting[0], 'SORT_KEY', "ああすとおん3");
    Opal.const_set($nesting[0], 'HELP_MESSAGE', "" + "ステップダイス　(xEn+k)\n" + "ステップx、目標値n(省略可能）、カルマダイスk(D2～D20)でステップダイスをロールします。\n" + "振り足しも自動。\n" + "例）ステップ10：10E\n" + "　　ステップ10、目標値8：10E8\n" + "　　ステップ12、目標値8、カルマダイスD12：10E8+1D6\n");
    self.$setPrefixes(["\\d+e.*"]);
    
    Opal.def(self, '$initialize', $EarthDawn3_initialize$1 = function $$initialize() {
      var $iter = $EarthDawn3_initialize$1.$$p, $yield = $iter || nil, self = this, $zuper = nil, $zuper_i = nil, $zuper_ii = nil;

      if ($iter) $EarthDawn3_initialize$1.$$p = null;
      // Prepare super implicit arguments
      for($zuper_i = 0, $zuper_ii = arguments.length, $zuper = new Array($zuper_ii); $zuper_i < $zuper_ii; $zuper_i++) {
        $zuper[$zuper_i] = arguments[$zuper_i];
      }
      
      $send(self, Opal.find_super_dispatcher(self, 'initialize', $EarthDawn3_initialize$1, false), $zuper, $iter);
      self.sendMode = 2;
      return (self.sortType = 1);
    }, $EarthDawn3_initialize$1.$$arity = 0);
    
    Opal.def(self, '$rollDiceCommand', $EarthDawn3_rollDiceCommand$2 = function $$rollDiceCommand(command) {
      var self = this;

      return self.$ed_step(command)
    }, $EarthDawn3_rollDiceCommand$2.$$arity = 1);
    
    Opal.def(self, '$ed_step', $EarthDawn3_ed_step$3 = function $$ed_step(str) {
      var self = this, output = nil;

      
      output = self.$getStepResult(str);
      return output;
    }, $EarthDawn3_ed_step$3.$$arity = 1);
    
    Opal.def(self, '$getStepResult', $EarthDawn3_getStepResult$4 = function $$getStepResult(str) {
      var $$5, $$6, self = this, stepTotal = nil, step = nil, targetNumber = nil, hasKarmaDice = nil, karmaDiceCount = nil, karmaDiceType = nil, diceModify = nil, karmaDiceInfo = nil, $writer = nil, stepInfo = nil, diceTypes = nil, modify = nil, output = nil;

      
      if ($truthy(/^(\d+)E(\d+)?(\+(\d*)D(\d+))?(\+\d)?/i['$=~'](str))) {
      } else {
        return nil
      };
      stepTotal = 0;
      self.isFailed = true;
      step = $$($nesting, 'Regexp').$last_match(1).$to_i();
      targetNumber = [$$($nesting, 'Regexp').$last_match(2).$to_i(), 20].$min();
      hasKarmaDice = $$($nesting, 'Regexp').$last_match(3)['$nil?']()['$!']();
      karmaDiceCount = [1, $$($nesting, 'Regexp').$last_match(4).$to_i()].$max();
      karmaDiceType = $$($nesting, 'Regexp').$last_match(5).$to_i();
      diceModify = $$($nesting, 'Regexp').$last_match(6).$to_i();
      karmaDiceInfo = $$($nesting, 'Hash').$new(0);
      if ($truthy(hasKarmaDice)) {
        
        $writer = [karmaDiceType, karmaDiceCount];
        $send(karmaDiceInfo, '[]=', Opal.to_a($writer));
        $writer[$rb_minus($writer["length"], 1)];};
      if ($truthy($rb_lt(targetNumber, 0))) {
        return nil};
      stepInfo = self.$getStepInfo(step);
      self.$debug("stepInfo", stepInfo);
      self.string = "";
      diceTypes = [20, 12, 10, 8, 6, 4];
      $send(diceTypes, 'each', [], ($$5 = function(type){var self = $$5.$$s || this;

      
        
        if (type == null) {
          type = nil;
        };
        return (stepTotal = $rb_plus(stepTotal, self.$rollStep(type, stepInfo.$shift())));}, $$5.$$s = self, $$5.$$arity = 1, $$5));
      modify = stepInfo.$shift();
      $send(karmaDiceInfo, 'each', [], ($$6 = function(diceType, diceCount){var self = $$6.$$s || this;

      
        
        if (diceType == null) {
          diceType = nil;
        };
        
        if (diceCount == null) {
          diceCount = nil;
        };
        return (stepTotal = $rb_plus(stepTotal, self.$rollStep(diceType, diceCount)));}, $$6.$$s = self, $$6.$$arity = 2, $$6));
      self.string = $rb_plus(self.string, $rb_plus(self.$getModifyText(modify), self.$getModifyText(diceModify)));
      stepTotal = $rb_plus(stepTotal, $rb_plus(modify, diceModify));
      self.string = $rb_plus(self.string, "" + " ＞ " + (stepTotal));
      output = "" + "ステップ" + (step) + " ＞ " + (self.string);
      if (targetNumber['$=='](0)) {
        return output};
      self.string = $rb_plus(self.string, $rb_plus(" ＞ ", self.$getSuccess(targetNumber, stepTotal)));
      output = "" + "ステップ" + (step) + ">=" + (targetNumber) + " ＞ " + (self.string);
      return output;
    }, $EarthDawn3_getStepResult$4.$$arity = 1);
    
    Opal.def(self, '$getModifyText', $EarthDawn3_getModifyText$7 = function $$getModifyText(modify) {
      var self = this;

      
      self.string = "";
      if (modify['$=='](0)) {
        return self.string};
      if ($truthy($rb_gt(modify, 0))) {
        self.string = $rb_plus(self.string, "+")};
      self.string = $rb_plus(self.string, modify.$to_s());
      return self.string;
    }, $EarthDawn3_getModifyText$7.$$arity = 1);
    
    Opal.def(self, '$getBaseStepTable', $EarthDawn3_getBaseStepTable$8 = function $$getBaseStepTable() {
      var self = this, stepTable = nil;

      
      stepTable = [[1, [0, 0, 0, 0, 1, 0, -3]], [2, [0, 0, 0, 0, 1, 0, -2]], [3, [0, 0, 0, 0, 1, 0, -1]], [4, [0, 0, 0, 0, 1, 0, 0]], [5, [0, 0, 0, 1, 0, 0, 0]], [6, [0, 0, 1, 0, 0, 0, 0]], [7, [0, 1, 0, 0, 0, 0, 0]]];
      return stepTable;
    }, $EarthDawn3_getBaseStepTable$8.$$arity = 0);
    
    Opal.def(self, '$getStepInfo', $EarthDawn3_getStepInfo$9 = function $$getStepInfo(step) {
      var $$10, self = this, baseStepTable = nil, baseMaxStep = nil, baseStepInfo = nil, overStep = nil, stepRythm = nil, result = nil, loopCount = nil, index = nil, restStepInfo = nil;

      
      baseStepTable = self.$getBaseStepTable();
      baseMaxStep = baseStepTable.$last().$first();
      if ($truthy($rb_le(step, baseMaxStep))) {
        return self.$get_table_by_number(step, baseStepTable)};
      baseStepInfo = [0, 1, 0, 0, 0, 0, 0];
      overStep = $rb_minus($rb_minus(step, baseMaxStep), 1);
      stepRythm = [[0, 0, 0, 0, 2, 0, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 0, 2, 0, 0, 0], [0, 0, 1, 1, 0, 0, 0], [0, 0, 2, 0, 0, 0, 0], [0, 1, 1, 0, 0, 0, 0], [0, 2, 0, 0, 0, 0, 0]];
      result = [0, 0, 0, 0, 0, 0, 0];
      loopCount = $rb_divide(overStep, stepRythm.$size()).$floor();
      $send(loopCount, 'times', [], ($$10 = function(){var self = $$10.$$s || this;

      return self.$addStepToResult(result, baseStepInfo)}, $$10.$$s = self, $$10.$$arity = 0, $$10));
      index = overStep['$%'](stepRythm.$size());
      restStepInfo = stepRythm['$[]'](index);
      self.$addStepToResult(result, restStepInfo);
      return result;
    }, $EarthDawn3_getStepInfo$9.$$arity = 1);
    
    Opal.def(self, '$addStepToResult', $EarthDawn3_addStepToResult$11 = function $$addStepToResult(result, step) {
      var $$12, self = this;

      
      $send(result.$size(), 'times', [], ($$12 = function(i){var self = $$12.$$s || this, $writer = nil;

      
        
        if (i == null) {
          i = nil;
        };
        $writer = [i, $rb_plus(result['$[]'](i), step['$[]'](i))];
        $send(result, '[]=', Opal.to_a($writer));
        return $writer[$rb_minus($writer["length"], 1)];}, $$12.$$s = self, $$12.$$arity = 1, $$12));
      return result;
    }, $EarthDawn3_addStepToResult$11.$$arity = 2);
    
    Opal.def(self, '$getSuccess', $EarthDawn3_getSuccess$13 = function $$getSuccess(targetNumber, stepTotal) {
      var $a, $b, self = this, successTable = nil, successInfo = nil, pathetic = nil, poor = nil, average = nil, good = nil, excelent = nil, extraordinary = nil;

      
      if ($truthy(self.isFailed)) {
        return "自動失敗"};
      successTable = self.$getSuccessTable();
      successInfo = self.$get_table_by_number(targetNumber, successTable);
      $b = successInfo, $a = Opal.to_ary($b), (pathetic = ($a[0] == null ? nil : $a[0])), (poor = ($a[1] == null ? nil : $a[1])), (average = ($a[2] == null ? nil : $a[2])), (good = ($a[3] == null ? nil : $a[3])), (excelent = ($a[4] == null ? nil : $a[4])), (extraordinary = ($a[5] == null ? nil : $a[5])), $b;
      if ($truthy($rb_ge(stepTotal, extraordinary))) {
        return "Extraordinary(極上)"};
      if ($truthy($rb_ge(stepTotal, excelent))) {
        return "Excelent(最高)"};
      if ($truthy($rb_ge(stepTotal, good))) {
        return "Good(上出来)"};
      if ($truthy($rb_ge(stepTotal, average))) {
        return "Average(そこそこ)"};
      if ($truthy($rb_ge(stepTotal, poor))) {
        return "Poor(お粗末)"};
      if ($truthy($rb_ge(stepTotal, pathetic))) {
        return "Pathetic(惨め)"
      } else {
        return nil
      };
    }, $EarthDawn3_getSuccess$13.$$arity = 2);
    
    Opal.def(self, '$getSuccessTable', $EarthDawn3_getSuccessTable$14 = function $$getSuccessTable() {
      var self = this, successTable = nil;

      
      successTable = [[2, [0, 1, 2, 5, 7, 9]], [3, [0, 1, 3, 6, 8, 10]], [4, [0, 1, 4, 7, 10, 12]], [5, [1, 2, 5, 8, 11, 14]], [6, [1, 2, 6, 9, 13, 17]], [7, [1, 3, 7, 11, 15, 19]], [8, [1, 4, 8, 13, 16, 20]], [9, [1, 5, 9, 15, 18, 22]], [10, [1, 6, 10, 16, 20, 24]], [11, [1, 6, 11, 17, 21, 25]], [12, [1, 7, 12, 18, 23, 27]], [13, [1, 7, 13, 20, 25, 29]], [14, [1, 8, 14, 21, 26, 31]], [15, [1, 9, 15, 23, 27, 31]], [16, [1, 10, 16, 24, 28, 33]], [17, [1, 11, 17, 25, 30, 34]], [18, [1, 12, 18, 26, 31, 36]], [19, [1, 12, 19, 28, 33, 37]], [20, [1, 13, 20, 29, 34, 39]], [21, [1, 14, 21, 30, 36, 41]], [22, [1, 15, 22, 31, 37, 42]], [23, [1, 16, 23, 33, 38, 43]], [24, [1, 16, 24, 34, 39, 44]], [25, [1, 17, 25, 35, 41, 46]], [26, [1, 18, 26, 36, 42, 47]], [27, [1, 19, 27, 37, 43, 49]], [28, [1, 19, 28, 39, 45, 50]], [29, [1, 21, 29, 40, 46, 51]], [30, [1, 21, 30, 41, 47, 53]], [31, [1, 22, 31, 42, 48, 54]], [32, [1, 23, 32, 43, 49, 55]], [33, [1, 24, 33, 45, 51, 57]], [34, [1, 24, 34, 46, 52, 58]], [35, [1, 25, 35, 47, 53, 60]], [36, [1, 26, 36, 48, 54, 60]], [37, [1, 27, 37, 49, 56, 62]], [38, [1, 28, 38, 51, 57, 63]], [39, [1, 29, 39, 52, 58, 64]], [40, [1, 30, 40, 53, 59, 66]]];
      return successTable;
    }, $EarthDawn3_getSuccessTable$14.$$arity = 0);
    return (Opal.def(self, '$rollStep', $EarthDawn3_rollStep$15 = function $$rollStep(diceType, diceCount) {
      var $$16, self = this, stepTotal = nil;

      
      self.$debug("rollStep diceType, diceCount, @string", diceType, diceCount, self.string);
      stepTotal = 0;
      if ($truthy($rb_gt(diceCount, 0))) {
      } else {
        return stepTotal
      };
      if ($truthy(self.string['$empty?']())) {
      } else {
        self.string = $rb_plus(self.string, "+")
      };
      self.string = $rb_plus(self.string, "" + (diceCount) + "d" + (diceType) + "[");
      self.$debug("rollStep @string", self.string);
      $send(diceCount, 'times', [], ($$16 = function(i){var self = $$16.$$s || this, $a, $b, $c, dice_now = nil, dice_in = nil;
        if (self.string == null) self.string = nil;

      
        
        if (i == null) {
          i = nil;
        };
        $b = self.$roll(1, diceType), $a = Opal.to_ary($b), (dice_now = ($a[0] == null ? nil : $a[0])), $b;
        if ($truthy(dice_now['$!='](1))) {
          self.isFailed = false};
        dice_in = dice_now;
        while (dice_now['$=='](diceType)) {
          
          $c = self.$roll(1, diceType), $b = Opal.to_ary($c), (dice_now = ($b[0] == null ? nil : $b[0])), $c;
          dice_in = $rb_plus(dice_in, dice_now);
        };
        stepTotal = $rb_plus(stepTotal, dice_in);
        if ($truthy(i['$!='](0))) {
          self.string = $rb_plus(self.string, ",")};
        return (self.string = $rb_plus(self.string, dice_in.$to_s()));}, $$16.$$s = self, $$16.$$arity = 1, $$16));
      self.string = $rb_plus(self.string, "]");
      return stepTotal;
    }, $EarthDawn3_rollStep$15.$$arity = 2), nil) && 'rollStep';
  })($nesting[0], $$($nesting, 'EarthDawn'), $nesting);
})(Opal);
