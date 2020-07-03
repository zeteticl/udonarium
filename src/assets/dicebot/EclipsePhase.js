/* Generated by Opal 1.0.3 */
(function(Opal) {
  function $rb_divide(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs / rhs : lhs['$/'](rhs);
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
  var self = Opal.top, $nesting = [], nil = Opal.nil, $$$ = Opal.const_get_qualified, $$ = Opal.const_get_relative, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $truthy = Opal.truthy;

  Opal.add_stubs(['$==', '$%', '$floor', '$/', '$<=', '$>=', '$-']);
  return (function($base, $super, $parent_nesting) {
    var self = $klass($base, $super, 'EclipsePhase');

    var $nesting = [self].concat($parent_nesting), $EclipsePhase_check_1D100$1;

    
    Opal.const_set($nesting[0], 'ID', "EclipsePhase");
    Opal.const_set($nesting[0], 'NAME', "\u30A8\u30AF\u30EA\u30D7\u30B9\u30FB\u30D5\u30A7\u30A4\u30BA");
    Opal.const_set($nesting[0], 'SORT_KEY', "\u3048\u304F\u308A\u3075\u3059\u3075\u3048\u3044\u3059");
    Opal.const_set($nesting[0], 'HELP_MESSAGE', "1D100<=m \u65B9\u5F0F\u306E\u5224\u5B9A\u3067\u6210\u5426\u3001\u30AF\u30EA\u30C6\u30A3\u30AB\u30EB\u30FB\u30D5\u30A1\u30F3\u30D6\u30EB\u3092\u81EA\u52D5\u5224\u5B9A");
    return (Opal.def(self, '$check_1D100', $EclipsePhase_check_1D100$1 = function $$check_1D100(total, _dice_total, cmp_op, target) {
      var self = this, diceValue = nil, dice_ten_place = nil, dice_one_place = nil, diff_threshold = nil;

      
      if (cmp_op['$==']("<=")) {
      } else {
        return ""
      };
      diceValue = total['$%'](100);
      dice_ten_place = $rb_divide(diceValue, 10).$floor();
      dice_one_place = diceValue['$%'](10);
      if (dice_ten_place['$=='](dice_one_place)) {
        
        if (diceValue['$=='](99)) {
          return " \uFF1E \u6C7A\u5B9A\u7684\u5931\u6557"};
        if (diceValue['$=='](0)) {
          return " \uFF1E 00 \uFF1E \u6C7A\u5B9A\u7684\u6210\u529F"};
        if ($truthy($rb_le(total, target))) {
          return " \uFF1E \u6C7A\u5B9A\u7684\u6210\u529F"};
        return " \uFF1E \u6C7A\u5B9A\u7684\u5931\u6557";};
      diff_threshold = 30;
      if ($truthy($rb_le(total, target))) {
        if ($truthy($rb_ge(total, diff_threshold))) {
          return " \uFF1E \u30A8\u30AF\u30BB\u30EC\u30F3\u30C8"
        } else {
          return " \uFF1E \u6210\u529F"
        }
      } else if ($truthy($rb_ge($rb_minus(total, target), diff_threshold))) {
        return " \uFF1E \u30B7\u30D3\u30A2"
      } else {
        return " \uFF1E \u5931\u6557"
      };
    }, $EclipsePhase_check_1D100$1.$$arity = 4), nil) && 'check_1D100';
  })($nesting[0], $$($nesting, 'DiceBot'), $nesting)
})(Opal);
