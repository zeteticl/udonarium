/* Generated by Opal 0.11.4 */
(function(Opal) {
  var self = Opal.top, $nesting = [], nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $truthy = Opal.truthy, $send = Opal.send, $hash2 = Opal.hash2;

  Opal.add_stubs(['$freeze', '$===', '$!', '$include?', '$debug', '$new', '$const_get', '$to_s', '$downcase', '$map', '$to_proc', '$[]', '$raise', '$first', '$each']);
  return (function($base, $super, $parent_nesting) {
    function $DiceBotLoader(){};
    var self = $DiceBotLoader = $klass($base, $super, 'DiceBotLoader', $DiceBotLoader);

    var def = self.$$proto, $nesting = [self].concat($parent_nesting), TMP_DiceBotLoader_validGameType$q_1, TMP_DiceBotLoader_loadUnknownGame_2, TMP_DiceBotLoader_collectDiceBots_3, TMP_DiceBotLoader_initialize_4, TMP_DiceBotLoader_match$q_5, TMP_DiceBotLoader_loadDiceBot_7;

    def.filenames = def.gameTitlePattern = def.diceBotClass = nil;
    
    Opal.const_set($nesting[0], 'BOT_NAME_PATTERN', /^[A-Z]\w*$/.$freeze());
    Opal.const_set($nesting[0], 'BOT_NAMES_TO_IGNORE', ["DiceBot", "DiceBotLoader", "DiceBotLoaderList"].$freeze());
    Opal.defs(self, '$validGameType?', TMP_DiceBotLoader_validGameType$q_1 = function(gameType) {
      var $a, self = this;

      return ($truthy($a = Opal.const_get_relative($nesting, 'BOT_NAME_PATTERN')['$==='](gameType)) ? Opal.const_get_relative($nesting, 'BOT_NAMES_TO_IGNORE')['$include?'](gameType)['$!']() : $a)
    }, TMP_DiceBotLoader_validGameType$q_1.$$arity = 1);
    Opal.defs(self, '$loadUnknownGame', TMP_DiceBotLoader_loadUnknownGame_2 = function $$loadUnknownGame(gameType) {
      var self = this, e = nil;

      
      self.$debug("DiceBotLoader.loadUnknownGame gameType", gameType);
      
      try {
        return Opal.const_get_relative($nesting, 'Object').$const_get(gameType).$new()
      } catch ($err) {
        if (Opal.rescue($err, [Opal.const_get_relative($nesting, 'LoadError'), Opal.const_get_relative($nesting, 'StandardError')])) {e = $err;
          try {
            
            self.$debug("DiceBotLoader.loadUnknownGame: 骰子ボットの読み込みに失敗しました", e.$to_s());
            return nil;
          } finally { Opal.pop_exception() }
        } else { throw $err; }
      };;
    }, TMP_DiceBotLoader_loadUnknownGame_2.$$arity = 1);
    Opal.defs(self, '$collectDiceBots', TMP_DiceBotLoader_collectDiceBots_3 = function $$collectDiceBots() {
      var self = this;

      return nil
    }, TMP_DiceBotLoader_collectDiceBots_3.$$arity = 0);
    
    Opal.defn(self, '$initialize', TMP_DiceBotLoader_initialize_4 = function $$initialize(gameTitlePattern, options) {
      var $a, self = this, $case = nil, defaultFilenames = nil;

      if (options == null) {
        options = $hash2([], {});
      }
      
      $case = gameTitlePattern;
      if (Opal.const_get_relative($nesting, 'String')['$===']($case)) {self.gameTitlePattern = [gameTitlePattern.$downcase()]}
      else if (Opal.const_get_relative($nesting, 'Array')['$===']($case)) {self.gameTitlePattern = $send(gameTitlePattern, 'map', [], "downcase".$to_proc())}
      else if (Opal.const_get_relative($nesting, 'Regexp')['$===']($case)) {
      if ($truthy(options['$[]']("filenames"))) {
        } else {
        self.$raise(Opal.const_get_relative($nesting, 'ArgumentError'), "options[:filenames] is required when gameTitlePattern is a Regexp")
      };
      self.gameTitlePattern = gameTitlePattern;}
      else {self.$raise(Opal.const_get_relative($nesting, 'TypeError'), "gameTitlePattern must be a String or an Array<String> or a Regexp")};
      defaultFilenames = (function() {$case = gameTitlePattern;
      if (Opal.const_get_relative($nesting, 'String')['$===']($case)) {return [gameTitlePattern]}
      else if (Opal.const_get_relative($nesting, 'Array')['$===']($case)) {return [gameTitlePattern.$first()]}
      else if (Opal.const_get_relative($nesting, 'Regexp')['$===']($case)) {return []}
      else { return nil }})();
      self.filenames = ($truthy($a = options['$[]']("filenames")) ? $a : defaultFilenames);
      return (self.diceBotClass = ($truthy($a = options['$[]']("class")) ? $a : self.filenames.$first()));
    }, TMP_DiceBotLoader_initialize_4.$$arity = -2);
    
    Opal.defn(self, '$match?', TMP_DiceBotLoader_match$q_5 = function(gameTitle) {
      var self = this, $case = nil;

      return (function() {$case = self.gameTitlePattern;
      if (Opal.const_get_relative($nesting, 'Array')['$===']($case)) {return self.gameTitlePattern['$include?'](gameTitle.$downcase())}
      else if (Opal.const_get_relative($nesting, 'Regexp')['$===']($case)) {return self.gameTitlePattern['$==='](gameTitle)}
      else { return nil }})()
    }, TMP_DiceBotLoader_match$q_5.$$arity = 1);
    return (Opal.defn(self, '$loadDiceBot', TMP_DiceBotLoader_loadDiceBot_7 = function $$loadDiceBot() {
      var TMP_6, self = this;

      
      $send(self.filenames, 'each', [], (TMP_6 = function(filename){var self = TMP_6.$$s || this;
if (filename == null) filename = nil;
      return nil}, TMP_6.$$s = self, TMP_6.$$arity = 1, TMP_6));
      return Opal.const_get_relative($nesting, 'Object').$const_get(self.diceBotClass).$new();
    }, TMP_DiceBotLoader_loadDiceBot_7.$$arity = 0), nil) && 'loadDiceBot';
  })($nesting[0], null, $nesting)
})(Opal);

/* Generated by Opal 0.11.4 */
(function(Opal) {
  var self = Opal.top, $nesting = [], nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice;

  Opal.add_stubs(['$exit']);
  return Opal.const_get_relative($nesting, 'Kernel').$exit()
})(Opal);
