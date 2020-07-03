/* Generated by Opal 1.0.3 */
Opal.modules["utils/ArithmeticEvaluator"] = function(Opal) {
  function $rb_plus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
  }
  function $rb_minus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
  }
  function $rb_times(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs * rhs : lhs['$*'](rhs);
  }
  function $rb_divide(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs / rhs : lhs['$/'](rhs);
  }
  var self = Opal.top, $nesting = [], nil = Opal.nil, $$$ = Opal.const_get_qualified, $$ = Opal.const_get_relative, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $truthy = Opal.truthy, $send = Opal.send;

  Opal.add_stubs(['$tokenize', '$expr', '$private', '$split', '$gsub', '$mul', '$loop', '$consume', '$+', '$-', '$unary', '$*', '$div', '$zero?', '$===', '$ceil', '$/', '$to_f', '$round', '$floor', '$-@', '$term', '$expect', '$expect_number', '$!=', '$[]', '$integer?', '$to_i', '$!', '$nil?', '$match']);
  return (function($base, $super, $parent_nesting) {
    var self = $klass($base, $super, 'ArithmeticEvaluator');

    var $nesting = [self].concat($parent_nesting), $ArithmeticEvaluator_eval$1, $ArithmeticEvaluator_tokenize$2, $ArithmeticEvaluator_add$4, $ArithmeticEvaluator_mul$6, $ArithmeticEvaluator_div$8, $ArithmeticEvaluator_unary$9, $ArithmeticEvaluator_term$10, $ArithmeticEvaluator_consume$11, $ArithmeticEvaluator_expect$12, $ArithmeticEvaluator_expect_number$13, $ArithmeticEvaluator_integer$ques$14;

    self.$$prototype.error = self.$$prototype.round_type = self.$$prototype.tokens = self.$$prototype.idx = nil;
    
    
    Opal.def(self, '$eval', $ArithmeticEvaluator_eval$1 = function(expr, round_type) {
      var self = this, ret = nil;

      
      
      if (round_type == null) {
        round_type = "omit";
      };
      self.tokens = self.$tokenize(expr);
      self.idx = 0;
      self.error = false;
      self.round_type = round_type;
      ret = self.$expr();
      if ($truthy(self.error)) {
        return 0
      } else {
        return ret
      };
    }, $ArithmeticEvaluator_eval$1.$$arity = -2);
    self.$private();
    
    Opal.def(self, '$tokenize', $ArithmeticEvaluator_tokenize$2 = function $$tokenize(expr) {
      var $$3, self = this;

      return $send(expr, 'gsub', [/[\(\)\+\-\*\/]/], ($$3 = function(e){var self = $$3.$$s || this;

      
        
        if (e == null) {
          e = nil;
        };
        return "" + " " + (e) + " ";}, $$3.$$s = self, $$3.$$arity = 1, $$3)).$split(" ")
    }, $ArithmeticEvaluator_tokenize$2.$$arity = 1);
    
    Opal.def(self, '$add', $ArithmeticEvaluator_add$4 = function $$add() {
      var $$5, self = this, ret = nil;

      
      ret = self.$mul();
      (function(){var $brk = Opal.new_brk(); try {return $send(self, 'loop', [], ($$5 = function(){var self = $$5.$$s || this;

      if ($truthy(self.$consume("+"))) {
          return (ret = $rb_plus(ret, self.$mul()))
        } else if ($truthy(self.$consume("-"))) {
          return (ret = $rb_minus(ret, self.$mul()))
        } else {
          
          Opal.brk(nil, $brk)
        }}, $$5.$$s = self, $$5.$$brk = $brk, $$5.$$arity = 0, $$5))
      } catch (err) { if (err === $brk) { return err.$v } else { throw err } }})();
      return ret;
    }, $ArithmeticEvaluator_add$4.$$arity = 0);
    Opal.alias(self, "expr", "add");
    
    Opal.def(self, '$mul', $ArithmeticEvaluator_mul$6 = function $$mul() {
      var $$7, self = this, ret = nil;

      
      ret = self.$unary();
      (function(){var $brk = Opal.new_brk(); try {return $send(self, 'loop', [], ($$7 = function(){var self = $$7.$$s || this;

      if ($truthy(self.$consume("*"))) {
          return (ret = $rb_times(ret, self.$unary()))
        } else if ($truthy(self.$consume("/"))) {
          return (ret = self.$div(ret, self.$unary()))
        } else {
          
          Opal.brk(nil, $brk)
        }}, $$7.$$s = self, $$7.$$brk = $brk, $$7.$$arity = 0, $$7))
      } catch (err) { if (err === $brk) { return err.$v } else { throw err } }})();
      return ret;
    }, $ArithmeticEvaluator_mul$6.$$arity = 0);
    
    Opal.def(self, '$div', $ArithmeticEvaluator_div$8 = function $$div(left, right) {
      var self = this, $case = nil;

      
      if ($truthy(right['$zero?']())) {
        
        self.error = true;
        return 0;};
      return (function() {$case = self.round_type;
      if ("roundUp"['$===']($case)) {return $rb_divide(left.$to_f(), right).$ceil()}
      else if ("roundOff"['$===']($case)) {return $rb_divide(left.$to_f(), right).$round()}
      else {return $rb_divide(left, right).$floor()}})();
    }, $ArithmeticEvaluator_div$8.$$arity = 2);
    
    Opal.def(self, '$unary', $ArithmeticEvaluator_unary$9 = function $$unary() {
      var self = this;

      if ($truthy(self.$consume("+"))) {
        return self.$unary()
      } else if ($truthy(self.$consume("-"))) {
        return self.$unary()['$-@']()
      } else {
        return self.$term()
      }
    }, $ArithmeticEvaluator_unary$9.$$arity = 0);
    
    Opal.def(self, '$term', $ArithmeticEvaluator_term$10 = function $$term() {
      var self = this, ret = nil;

      if ($truthy(self.$consume("("))) {
        
        ret = self.$expr();
        self.$expect(")");
        return ret;
      } else {
        return self.$expect_number()
      }
    }, $ArithmeticEvaluator_term$10.$$arity = 0);
    
    Opal.def(self, '$consume', $ArithmeticEvaluator_consume$11 = function $$consume(str) {
      var self = this;

      
      if ($truthy(self.tokens['$[]'](self.idx)['$!='](str))) {
        return false};
      self.idx = $rb_plus(self.idx, 1);
      return true;
    }, $ArithmeticEvaluator_consume$11.$$arity = 1);
    
    Opal.def(self, '$expect', $ArithmeticEvaluator_expect$12 = function $$expect(str) {
      var self = this;

      
      if ($truthy(self.tokens['$[]'](self.idx)['$!='](str))) {
        self.error = true};
      return (self.idx = $rb_plus(self.idx, 1));
    }, $ArithmeticEvaluator_expect$12.$$arity = 1);
    
    Opal.def(self, '$expect_number', $ArithmeticEvaluator_expect_number$13 = function $$expect_number() {
      var self = this, ret = nil;

      
      if ($truthy(self['$integer?'](self.tokens['$[]'](self.idx)))) {
      } else {
        
        self.error = true;
        self.idx = $rb_plus(self.idx, 1);
        return 0;
      };
      ret = self.tokens['$[]'](self.idx).$to_i();
      self.idx = $rb_plus(self.idx, 1);
      return ret;
    }, $ArithmeticEvaluator_expect_number$13.$$arity = 0);
    return (Opal.def(self, '$integer?', $ArithmeticEvaluator_integer$ques$14 = function(str) {
      var self = this;

      return /^\d+$/.$match(str)['$nil?']()['$!']()
    }, $ArithmeticEvaluator_integer$ques$14.$$arity = 1), nil) && 'integer?';
  })($nesting[0], null, $nesting)
};

/* Generated by Opal 1.0.3 */
(function(Opal) {
  function $rb_gt(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs > rhs : lhs['$>'](rhs);
  }
  function $rb_plus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
  }
  function $rb_divide(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs / rhs : lhs['$/'](rhs);
  }
  function $rb_times(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs * rhs : lhs['$*'](rhs);
  }
  function $rb_lt(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs < rhs : lhs['$<'](rhs);
  }
  function $rb_le(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs <= rhs : lhs['$<='](rhs);
  }
  function $rb_ge(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs >= rhs : lhs['$>='](rhs);
  }
  function $rb_minus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
  }
  var self = Opal.top, $nesting = [], nil = Opal.nil, $$$ = Opal.const_get_qualified, $$ = Opal.const_get_relative, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $send = Opal.send, $truthy = Opal.truthy;

  Opal.add_stubs(['$require', '$setPrefixes', '$===', '$getCheckResult', '$getRegistResult', '$getCombineRoll', '$match', '$to_i', '$[]', '$eval', '$new', '$>', '$+', '$roll', '$getCheckResultText', '$floor', '$/', '$*', '$<', '$<=', '$>=', '$-', '$include?', '$debug', '$==']);
  
  self.$require("utils/ArithmeticEvaluator");
  return (function($base, $super, $parent_nesting) {
    var self = $klass($base, $super, 'Cthulhu');

    var $nesting = [self].concat($parent_nesting), $Cthulhu_initialize$1, $Cthulhu_rollDiceCommand$2, $Cthulhu_getCheckResult$3, $Cthulhu_getCheckResultText$4, $Cthulhu_getRegistResult$5, $Cthulhu_getCombineRoll$6;

    self.$$prototype.special_percentage = self.$$prototype.critical_percentage = self.$$prototype.fumble_percentage = nil;
    
    Opal.const_set($nesting[0], 'ID', "Cthulhu");
    Opal.const_set($nesting[0], 'NAME', "\u30AF\u30C8\u30A5\u30EB\u30D5");
    Opal.const_set($nesting[0], 'SORT_KEY', "\u304F\u3068\u3046\u308B\u3075");
    Opal.const_set($nesting[0], 'HELP_MESSAGE', "" + "c=\u30AF\u30EA\u30C6\u30A3\u30AB\u30EB\u5024 \uFF0F f=\u30D5\u30A1\u30F3\u30D6\u30EB\u5024 \uFF0F s=\u30B9\u30DA\u30B7\u30E3\u30EB\n" + "\n" + "1d100<=n    c\u30FBf\u30FBs\u3059\u3079\u3066\u30AA\u30D5\uFF08\u5358\u7D14\u306A\u6570\u5024\u6BD4\u8F03\u5224\u5B9A\u306E\u307F\u884C\u3044\u307E\u3059\uFF09\n" + "\n" + "\u30FBcfs\u5224\u5B9A\u4ED8\u304D\u5224\u5B9A\u30B3\u30DE\u30F3\u30C9\n" + "\n" + "CC\t 1d100\u30ED\u30FC\u30EB\u3092\u884C\u3046 c=1\u3001f=100\n" + "CCB  \u540C\u4E0A\u3001c=5\u3001f=96\n" + "\n" + "\u4F8B\uFF1ACC<=80  \uFF08\u6280\u80FD\u502480\u3067\u884C\u70BA\u5224\u5B9A\u30021%\u30EB\u30FC\u30EB\u3067cf\u9069\u7528\uFF09\n" + "\u4F8B\uFF1ACCB<=55 \uFF08\u6280\u80FD\u502455\u3067\u884C\u70BA\u5224\u5B9A\u30025%\u30EB\u30FC\u30EB\u3067cf\u9069\u7528\uFF09\n" + "\n" + "\u30FB\u7D44\u307F\u5408\u308F\u305B\u30ED\u30FC\u30EB\u306B\u3064\u3044\u3066\n" + "\n" + "CBR(x,y)\tc=1\u3001f=100\n" + "CBRB(x,y)\tc=5\u3001f=96\n" + "\n" + "\u30FB\u62B5\u6297\u8868\u30ED\u30FC\u30EB\u306B\u3064\u3044\u3066\n" + "RES(x-y)\tc=1\u3001f=100\n" + "RESB(x-y)\tc=5\u3001f=96\n" + "\n" + "\u203B\u6545\u969C\u30CA\u30F3\u30D0\u30FC\u5224\u5B9A\n" + "\n" + "\u30FBCC(x) c=1\u3001f=100\n" + "x=\u6545\u969C\u30CA\u30F3\u30D0\u30FC\u3002\u51FA\u76EEx\u4EE5\u4E0A\u304C\u51FA\u305F\u4E0A\u3067\u3001\u30D5\u30A1\u30F3\u30D6\u30EB\u304C\u540C\u6642\u306B\u767A\u751F\u3057\u305F\u5834\u5408\u3001\u5171\u306B\u51FA\u529B\u3059\u308B\uFF08\u30C6\u30AD\u30B9\u30C8\u300C\u30D5\u30A1\u30F3\u30D6\u30EB\uFF06\u6545\u969C\u300D\uFF09\n" + "\u30D5\u30A1\u30F3\u30D6\u30EB\u3067\u306A\u3044\u5834\u5408\u3001\u6210\u529F\u30FB\u5931\u6557\u306B\u95A2\u308F\u3089\u305A\u30C6\u30AD\u30B9\u30C8\u300C\u6545\u969C\u300D\u306E\u307F\u3092\u51FA\u529B\u3059\u308B\uFF08\u6210\u529F\u30FB\u5931\u6557\u3092\u51FA\u529B\u305B\u305A\u3001\u4E0A\u66F8\u304D\u3057\u305F\u3082\u306E\u3092\u51FA\u529B\u3059\u308B\u5F62\uFF09\n" + "\n" + "\u30FBCCB(x) c=5\u3001f=96\n" + "\u540C\u4E0A\n" + "\n");
    self.$setPrefixes(["CC(B)?\\(\\d+\\)", "CC(B)?.*", "RES(B)?.*", "CBR(B)?\\(\\d+,\\d+\\)"]);
    
    Opal.def(self, '$initialize', $Cthulhu_initialize$1 = function $$initialize() {
      var $iter = $Cthulhu_initialize$1.$$p, $yield = $iter || nil, self = this, $zuper = nil, $zuper_i = nil, $zuper_ii = nil;

      if ($iter) $Cthulhu_initialize$1.$$p = null;
      // Prepare super implicit arguments
      for($zuper_i = 0, $zuper_ii = arguments.length, $zuper = new Array($zuper_ii); $zuper_i < $zuper_ii; $zuper_i++) {
        $zuper[$zuper_i] = arguments[$zuper_i];
      }
      
      $send(self, Opal.find_super_dispatcher(self, 'initialize', $Cthulhu_initialize$1, false), $zuper, $iter);
      self.special_percentage = 20;
      self.critical_percentage = 1;
      return (self.fumble_percentage = 1);
    }, $Cthulhu_initialize$1.$$arity = 0);
    
    Opal.def(self, '$rollDiceCommand', $Cthulhu_rollDiceCommand$2 = function $$rollDiceCommand(command) {
      var self = this, $case = nil;

      
      $case = command;
      if (/CCB/i['$===']($case)) {
      self.critical_percentage = 5;
      self.fumble_percentage = 5;
      return self.$getCheckResult(command);}
      else if (/CC/i['$===']($case)) {
      self.critical_percentage = 1;
      self.fumble_percentage = 1;
      return self.$getCheckResult(command);}
      else if (/RESB/i['$===']($case)) {
      self.critical_percentage = 5;
      self.fumble_percentage = 5;
      return self.$getRegistResult(command);}
      else if (/CBRB/i['$===']($case)) {
      self.critical_percentage = 5;
      self.fumble_percentage = 5;
      return self.$getCombineRoll(command);}
      else if (/RES/i['$===']($case)) {
      self.critical_percentage = 1;
      self.fumble_percentage = 1;
      return self.$getRegistResult(command);}
      else if (/CBR/i['$===']($case)) {
      self.critical_percentage = 1;
      self.fumble_percentage = 1;
      return self.$getCombineRoll(command);};
      return nil;
    }, $Cthulhu_rollDiceCommand$2.$$arity = 1);
    
    Opal.def(self, '$getCheckResult', $Cthulhu_getCheckResult$3 = function $$getCheckResult(command) {
      var $a, $b, self = this, broken_num = nil, diff = nil, m = nil, output = nil, total_n = nil;

      
      broken_num = 0;
      diff = 0;
      if ($truthy((m = /CCB?(\d+)?<=([+-\/*\d]+)/i.$match(command)))) {
        
        broken_num = m['$[]'](1).$to_i();
        diff = $$($nesting, 'ArithmeticEvaluator').$new().$eval(m['$[]'](2));};
      output = "";
      if ($truthy($rb_gt(diff, 0))) {
        
        output = "" + "(1D100<=" + (diff) + ")";
        if ($truthy($rb_gt(broken_num, 0))) {
          output = $rb_plus(output, "" + " \u6545\u969C\u30CA\u30F3\u30D0\u30FC[" + (broken_num) + "]")};
        $b = self.$roll(1, 100), $a = Opal.to_ary($b), (total_n = ($a[0] == null ? nil : $a[0])), $b;
        output = $rb_plus(output, "" + " \uFF1E " + (total_n));
        output = $rb_plus(output, "" + " \uFF1E " + (self.$getCheckResultText(total_n, diff, broken_num)));
      } else {
        
        $b = self.$roll(1, 100), $a = Opal.to_ary($b), (total_n = ($a[0] == null ? nil : $a[0])), $b;
        output = "" + "(1D100) \uFF1E " + (total_n);
      };
      return output;
    }, $Cthulhu_getCheckResult$3.$$arity = 1);
    
    Opal.def(self, '$getCheckResultText', $Cthulhu_getCheckResultText$4 = function $$getCheckResultText(total_n, diff, broken_num) {
      var $a, self = this, result = nil, diff_special = nil, fumble = nil;

      
      
      if (broken_num == null) {
        broken_num = 0;
      };
      result = "";
      diff_special = 0;
      fumble = false;
      if ($truthy($rb_gt(self.special_percentage, 0))) {
        
        diff_special = $rb_divide($rb_times(diff, self.special_percentage), 100).$floor();
        if ($truthy($rb_lt(diff_special, 1))) {
          diff_special = 1};};
      if ($truthy(($truthy($a = $rb_le(total_n, diff)) ? $rb_lt(total_n, 100) : $a))) {
        
        result = "\u6210\u529F";
        if ($truthy($rb_gt(diff_special, 0))) {
          if ($truthy($rb_le(total_n, self.critical_percentage))) {
            if ($truthy($rb_le(total_n, diff_special))) {
              result = "\u6C7A\u5B9A\u7684\u6210\u529F/\u30B9\u30DA\u30B7\u30E3\u30EB"
            } else {
              result = "\u6C7A\u5B9A\u7684\u6210\u529F"
            }
          } else if ($truthy($rb_le(total_n, diff_special))) {
            result = "\u30B9\u30DA\u30B7\u30E3\u30EB"}};
      } else {
        
        result = "\u5931\u6557";
        if ($truthy($rb_gt(diff_special, 0))) {
          if ($truthy(($truthy($a = $rb_ge(total_n, $rb_minus(101, self.fumble_percentage))) ? $rb_lt(diff, 100) : $a))) {
            
            result = "\u81F4\u547D\u7684\u5931\u6557";
            fumble = true;}};
      };
      if ($truthy($rb_gt(broken_num, 0))) {
        if ($truthy($rb_ge(total_n, broken_num))) {
          if ($truthy(fumble)) {
            result = $rb_plus(result, "/\u6545\u969C")
          } else {
            result = "\u6545\u969C"
          }}};
      return result;
    }, $Cthulhu_getCheckResultText$4.$$arity = -3);
    
    Opal.def(self, '$getRegistResult', $Cthulhu_getRegistResult$5 = function $$getRegistResult(command) {
      var $a, $b, self = this, m = nil, value = nil, target = nil, total_n = nil, result = nil;

      
      m = /RES(B)?([-\d]+)/i.$match(command);
      if ($truthy(m)) {
      } else {
        return "1"
      };
      value = m['$[]'](2).$to_i();
      target = $rb_plus($rb_times(value, 5), 50);
      if ($truthy($rb_lt(target, 5))) {
        return "" + "(1d100<=" + (target) + ") \uFF1E \u81EA\u52D5\u5931\u6557"};
      if ($truthy($rb_gt(target, 95))) {
        return "" + "(1d100<=" + (target) + ") \uFF1E \u81EA\u52D5\u6210\u529F"};
      $b = self.$roll(1, 100), $a = Opal.to_ary($b), (total_n = ($a[0] == null ? nil : $a[0])), $b;
      result = self.$getCheckResultText(total_n, target);
      return "" + "(1d100<=" + (target) + ") \uFF1E " + (total_n) + " \uFF1E " + (result);
    }, $Cthulhu_getRegistResult$5.$$arity = 1);
    return (Opal.def(self, '$getCombineRoll', $Cthulhu_getCombineRoll$6 = function $$getCombineRoll(command) {
      var $a, $b, self = this, m = nil, diff_1 = nil, diff_2 = nil, total = nil, result_1 = nil, result_2 = nil, successList = nil, succesCount = nil, rank = nil;

      
      m = /CBR(B)?\((\d+),(\d+)\)/i.$match(command);
      if ($truthy(m)) {
      } else {
        return "1"
      };
      diff_1 = m['$[]'](2).$to_i();
      diff_2 = m['$[]'](3).$to_i();
      $b = self.$roll(1, 100), $a = Opal.to_ary($b), (total = ($a[0] == null ? nil : $a[0])), $b;
      result_1 = self.$getCheckResultText(total, diff_1);
      result_2 = self.$getCheckResultText(total, diff_2);
      successList = ["\u6C7A\u5B9A\u7684\u6210\u529F/\u30B9\u30DA\u30B7\u30E3\u30EB", "\u6C7A\u5B9A\u7684\u6210\u529F", "\u30B9\u30DA\u30B7\u30E3\u30EB", "\u6210\u529F"];
      succesCount = 0;
      if ($truthy(successList['$include?'](result_1))) {
        succesCount = $rb_plus(succesCount, 1)};
      if ($truthy(successList['$include?'](result_2))) {
        succesCount = $rb_plus(succesCount, 1)};
      self.$debug("succesCount", succesCount);
      rank = (function() {if ($truthy($rb_ge(succesCount, 2))) {
        return "\u6210\u529F"
      } else if (succesCount['$=='](1)) {
        return "\u90E8\u5206\u7684\u6210\u529F"
      } else {
        return "\u5931\u6557"
      }; return nil; })();
      return "" + "(1d100<=" + (diff_1) + "," + (diff_2) + ") \uFF1E " + (total) + "[" + (result_1) + "," + (result_2) + "] \uFF1E " + (rank);
    }, $Cthulhu_getCombineRoll$6.$$arity = 1), nil) && 'getCombineRoll';
  })($nesting[0], $$($nesting, 'DiceBot'), $nesting);
})(Opal);
