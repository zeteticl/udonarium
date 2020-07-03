/* Generated by Opal 1.0.3 */
(function(Opal) {
  function $rb_ge(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs >= rhs : lhs['$>='](rhs);
  }
  function $rb_times(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs * rhs : lhs['$*'](rhs);
  }
  var self = Opal.top, $nesting = [], nil = Opal.nil, $$$ = Opal.const_get_qualified, $$ = Opal.const_get_relative, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $send = Opal.send, $truthy = Opal.truthy;

  Opal.add_stubs(['$!=', '$==', '$>=', '$debug', '$*']);
  return (function($base, $super, $parent_nesting) {
    var self = $klass($base, $super, 'TokumeiTenkousei');

    var $nesting = [self].concat($parent_nesting), $TokumeiTenkousei_initialize$1, $TokumeiTenkousei_check_nD6$2, $TokumeiTenkousei_getDiceRolledAdditionalText$3;

    
    Opal.const_set($nesting[0], 'ID', "TokumeiTenkousei");
    Opal.const_set($nesting[0], 'NAME', "\u7279\u547D\u8EE2\u653B\u751F");
    Opal.const_set($nesting[0], 'SORT_KEY', "\u3068\u304F\u3081\u3044\u3066\u3093\u3053\u3046\u305B\u3044");
    Opal.const_set($nesting[0], 'HELP_MESSAGE', "\u300C1\u306E\u51FA\u76EE\u3067EPP\u7372\u5F97\u300D\u3001\u5224\u5B9A\u6642\u306E\u300C\u6210\u529F\u300D\u300C\u5931\u6557\u300D\u300C\u30BE\u30ED\u76EE\u3067\u81EA\u52D5\u632F\u308A\u8DB3\u3057\u300D\u3092\u5224\u5B9A\u3002\n");
    
    Opal.def(self, '$initialize', $TokumeiTenkousei_initialize$1 = function $$initialize() {
      var $iter = $TokumeiTenkousei_initialize$1.$$p, $yield = $iter || nil, self = this, $zuper = nil, $zuper_i = nil, $zuper_ii = nil;

      if ($iter) $TokumeiTenkousei_initialize$1.$$p = null;
      // Prepare super implicit arguments
      for($zuper_i = 0, $zuper_ii = arguments.length, $zuper = new Array($zuper_ii); $zuper_i < $zuper_ii; $zuper_i++) {
        $zuper[$zuper_i] = arguments[$zuper_i];
      }
      
      $send(self, Opal.find_super_dispatcher(self, 'initialize', $TokumeiTenkousei_initialize$1, false), $zuper, $iter);
      self.sendMode = 2;
      self.sortType = 1;
      self.sameDiceRerollCount = 1;
      return (self.sameDiceRerollType = 2);
    }, $TokumeiTenkousei_initialize$1.$$arity = 0);
    
    Opal.def(self, '$check_nD6', $TokumeiTenkousei_check_nD6$2 = function $$check_nD6(total, _dice_total, _dice_list, cmp_op, target) {
      var $a, self = this;

      
      if ($truthy(($truthy($a = cmp_op['$!='](">=")) ? target['$==']("?") : $a))) {
        return ""};
      if ($truthy($rb_ge(total, target))) {
        return " \uFF1E \u6210\u529F"
      } else {
        return " \uFF1E \u5931\u6557"
      };
    }, $TokumeiTenkousei_check_nD6$2.$$arity = 5);
    return (Opal.def(self, '$getDiceRolledAdditionalText', $TokumeiTenkousei_getDiceRolledAdditionalText$3 = function $$getDiceRolledAdditionalText(n1, _n_max, dice_max) {
      var $a, self = this, point = nil;

      
      self.$debug("getExtraPowerPointTextForTokumeiTenkousei n1, dice_max", n1, dice_max);
      if ($truthy(($truthy($a = n1['$!='](0)) ? dice_max['$=='](6) : $a))) {
        
        point = $rb_times(n1, 5);
        return "" + " \uFF1E " + (point) + "EPP\u7372\u5F97";};
      return "";
    }, $TokumeiTenkousei_getDiceRolledAdditionalText$3.$$arity = 3), nil) && 'getDiceRolledAdditionalText';
  })($nesting[0], $$($nesting, 'DiceBot'), $nesting)
})(Opal);
