/* Generated by Opal 1.0.3 */
(function(Opal) {
  function $rb_le(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs <= rhs : lhs['$<='](rhs);
  }
  function $rb_ge(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs >= rhs : lhs['$>='](rhs);
  }
  function $rb_plus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
  }
  function $rb_minus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
  }
  function $rb_lt(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs < rhs : lhs['$<'](rhs);
  }
  var self = Opal.top, $nesting = [], nil = Opal.nil, $$$ = Opal.const_get_qualified, $$ = Opal.const_get_relative, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $send = Opal.send, $truthy = Opal.truthy, $hash2 = Opal.hash2;

  Opal.add_stubs(['$==', '$<=', '$>=', '$+', '$getRandumMonster', '$upcase', '$===', '$last_match', '$to_i', '$getMonster', '$getTableCommandResult', '$getColorTable', '$get_table_by_1d6', '$getMonsterTables', '$-', '$get_table_by_2d6', '$[]', '$<', '$index', '$debug', '$nil?', '$freeze', '$setPrefixes', '$keys']);
  return (function($base, $super, $parent_nesting) {
    var self = $klass($base, $super, 'CardRanker');

    var $nesting = [self].concat($parent_nesting), $CardRanker_initialize$1, $CardRanker_check_2D6$2, $CardRanker_rollDiceCommand$3, $CardRanker_getRandumMonster$4, $CardRanker_getColorTable$5, $CardRanker_getMonsterTables$6, $CardRanker_getMonster$7;

    
    Opal.const_set($nesting[0], 'ID', "CardRanker");
    Opal.const_set($nesting[0], 'NAME', "カードランカー");
    Opal.const_set($nesting[0], 'SORT_KEY', "かあとらんかあ");
    Opal.const_set($nesting[0], 'HELP_MESSAGE', "" + "ランダムでモンスターカードを選ぶ (RM)\n" + "特定のモンスターカードを選ぶ (CMxy　x：色、y：番号）\n" + "　白：W、青：U、緑：V、金：G、赤：R、黒：B\n" + "　例）CMW1→白の2：白竜　CMG12→金の12：土精霊\n" + "場所表 (ST)\n" + "街中場所表 (CST)\n" + "郊外場所表 (OST)\n" + "学園場所表 (GST)\n" + "運命表 (DT)\n" + "大会運命表 (TDT)\n" + "学園運命表 (GDT)\n" + "崩壊運命表 (CDT)\n");
    
    Opal.def(self, '$initialize', $CardRanker_initialize$1 = function $$initialize() {
      var $iter = $CardRanker_initialize$1.$$p, $yield = $iter || nil, self = this, $zuper = nil, $zuper_i = nil, $zuper_ii = nil;

      if ($iter) $CardRanker_initialize$1.$$p = null;
      // Prepare super implicit arguments
      for($zuper_i = 0, $zuper_ii = arguments.length, $zuper = new Array($zuper_ii); $zuper_i < $zuper_ii; $zuper_i++) {
        $zuper[$zuper_i] = arguments[$zuper_i];
      }
      
      $send(self, Opal.find_super_dispatcher(self, 'initialize', $CardRanker_initialize$1, false), $zuper, $iter);
      self.sendMode = 2;
      self.sortType = 1;
      return (self.d66Type = 2);
    }, $CardRanker_initialize$1.$$arity = 0);
    
    Opal.def(self, '$check_2D6', $CardRanker_check_2D6$2 = function $$check_2D6(total, dice_total, _dice_list, cmp_op, target) {
      var self = this;

      
      if (target['$==']("?")) {
        return ""};
      if (cmp_op['$=='](">=")) {
      } else {
        return ""
      };
      if ($truthy($rb_le(dice_total, 2))) {
        return " ＞ ファンブル"
      } else if ($truthy($rb_ge(dice_total, 12))) {
        return $rb_plus(" ＞ スペシャル ＞ ", self.$getRandumMonster())
      } else if ($truthy($rb_ge(total, target))) {
        return " ＞ 成功"
      } else {
        return " ＞ 失敗"
      };
    }, $CardRanker_check_2D6$2.$$arity = 5);
    
    Opal.def(self, '$rollDiceCommand', $CardRanker_rollDiceCommand$3 = function $$rollDiceCommand(command) {
      var self = this, $case = nil, color = nil, index = nil;

      
      command = command.$upcase();
      return (function() {$case = command;
      if (/^RM$/i['$===']($case)) {return self.$getRandumMonster()}
      else if (/^CM(\w)(\d+)$/i['$===']($case)) {
      color = $$($nesting, 'Regexp').$last_match(1).$upcase();
      index = $$($nesting, 'Regexp').$last_match(2).$to_i();
      return self.$getMonster(color, index);}
      else {return self.$getTableCommandResult(command, $$($nesting, 'TABLES'))}})();
    }, $CardRanker_rollDiceCommand$3.$$arity = 1);
    
    Opal.def(self, '$getRandumMonster', $CardRanker_getRandumMonster$4 = function $$getRandumMonster() {
      var $a, $b, self = this, type = nil, colorTable = nil, color = nil, colorIndex = nil, monsters = nil, monsterName = nil, monsterIndex = nil, output = nil;

      
      type = "ランダム怪獸選択";
      colorTable = self.$getColorTable();
      $b = self.$get_table_by_1d6(colorTable), $a = Opal.to_ary($b), (color = ($a[0] == null ? nil : $a[0])), (colorIndex = ($a[1] == null ? nil : $a[1])), $b;
      monsters = self.$getMonsterTables($rb_minus(colorIndex, 1));
      $b = self.$get_table_by_2d6(monsters), $a = Opal.to_ary($b), (monsterName = ($a[0] == null ? nil : $a[0])), (monsterIndex = ($a[1] == null ? nil : $a[1])), $b;
      output = "" + (type) + "(" + (colorIndex) + "," + (monsterIndex) + ") ＞ " + (color) + "の" + (monsterIndex) + "：" + (monsterName);
      return output;
    }, $CardRanker_getRandumMonster$4.$$arity = 0);
    
    Opal.def(self, '$getColorTable', $CardRanker_getColorTable$5 = function $$getColorTable() {
      var self = this;

      return ["白", "青", "緑", "金", "赤", "黒"]
    }, $CardRanker_getColorTable$5.$$arity = 0);
    
    Opal.def(self, '$getMonsterTables', $CardRanker_getMonsterTables$6 = function $$getMonsterTables(colorIndex) {
      var self = this, tables = nil;

      
      tables = [["白竜", "僧侶", "格闘家", "斧使い", "剣士", "槍士", "歩兵", "弓兵", "砲兵", "天使", "軍神"], ["水竜", "魚", "魚人", "イカ", "蟹", "探偵", "海賊", "魔術師", "使い魔", "雲", "水精霊"], ["緑竜", "ワーム", "鳥人", "鳥", "獣", "獣人", "エルフ", "妖精", "昆虫", "植物", "森精霊"], ["金竜", "宝石", "岩石", "鋼", "錬金術師", "魔法生物", "ドワーフ", "機械", "運命", "女神", "土精霊"], ["火竜", "竜人", "恐竜", "戦車", "蛮族", "小鬼", "大鬼", "巨人", "雷", "炎", "火精霊"], ["黒竜", "闇騎士", "怪物", "忍者", "妖怪", "蝙蝠", "吸血鬼", "不死者", "幽霊", "悪魔", "邪神"]];
      return tables['$[]'](colorIndex);
    }, $CardRanker_getMonsterTables$6.$$arity = 1);
    
    Opal.def(self, '$getMonster', $CardRanker_getMonster$7 = function $$getMonster(color, monsterIndex) {
      var self = this, type = nil, colorWords = nil, colorIndex = nil, colorTable = nil, monsters = nil, monsterName = nil, output = nil;

      
      if ($truthy($rb_lt(monsterIndex, 2))) {
        return nil};
      type = "怪獸選択";
      colorWords = ["W", "U", "V", "G", "R", "B"];
      colorIndex = colorWords.$index(color);
      self.$debug("colorIndex");
      if ($truthy(colorIndex['$nil?']())) {
        return nil};
      colorTable = self.$getColorTable();
      color = colorTable['$[]'](colorIndex);
      monsters = self.$getMonsterTables(colorIndex);
      self.$debug("monsters", monsters);
      self.$debug("monsterIndex", monsterIndex);
      monsterName = monsters['$[]']($rb_minus(monsterIndex, 2));
      if ($truthy(monsterName['$nil?']())) {
        return nil};
      output = "" + (type) + " ＞ " + (color) + "の" + (monsterIndex) + "：" + (monsterName);
      return output;
    }, $CardRanker_getMonster$7.$$arity = 2);
    Opal.const_set($nesting[0], 'TABLES', $hash2(["BFT", "CDT", "CST", "DT", "GDT", "OST", "GST", "ST", "TDT", "WT"], {"BFT": $hash2(["name", "type", "table"], {"name": "バトルフィールド表", "type": "1D6", "table": "" + "ハイ・アンティ/戦闘フェイズの終了時、勝者は通常習得できるモンスターカード一つに加えて、もう一つ敗者からモンスターカードを選んで手に入れることができる。//通常よりも多くのカードを賭けの対象にするルール。\n" + "バーニング/ラウンドの終了時、すべてのキャラクターは【LP】現在値を3点失う。//マグマの近くや極寒の地など体力を削られるような過酷な環境で行われるルール。\n" + "ノーマル/特に影響なし。//通常のルール。\n" + "ハード/すべてのキャラクターの判定にプラス1の修正を加える。また、ラウンド終了時にすべてのキャラクターはモンスターカードを一つ選んで破壊状態（ルールブックP187参照）にしなければならない。//風の強い場所や水中など、カードを扱いにくい環境でのルール。\n" + "スピード/モンスターカードのリスクが1高いものとして扱われる。また、判定に失敗した場合、速度から振り落とされて1D6のダメージを受ける。//バイクやローラーボードなどを使って行われる高速カードバトルルール。\n" + "デスルール/戦闘フェイズでも死亡判定が発声する。また、戦闘不能になったキャラクターは即座に死亡判定を行う。ただし、攻撃を行った側がデスルールを使用しないことを選択すれば、死亡判定は発生しない。//モンスターによって実際のダメージを与える、死の危険性があるルール。\n"}), "CDT": $hash2(["name", "type", "table"], {"name": "崩壊運命表", "type": "1D6", "table": "" + "レジェンドカードがあなたを崩壊する大地に呼び寄せた。暴虐な振る舞いをするダークランカーを倒すことをレジェンドカードは望んでいる。\n" + "あなたはひょんなことから人を助けた。すると、あなたはいつの間にか救世主と呼ばれる存在になっていた、救世主であるあなたに人々は懇願する。ダークランカーを倒してくれと。\n" + "あなたの住むところはダークランカーの力が及ばない楽園であった。しかし、楽園はダークランカー一味の襲撃にあい、あなただけが生き残ってしまった。楽園を出たあなたは戦いを決意する。\n" + "世の中は変わった。だが、愛する人（もしくは愛する物や家族）は健在だ。あなたは愛する人を護るためにも、ダークランカーを倒すべく動き始めた。\n" + "あなたはこの世界が好きだ。それはどんな理由でもよい。しかし、ダークランカーが持つダークカードはこの世界を壊す。ならば、倒してこの世界を守らねばならない。\n" + "崩壊していく大地。泣き叫ぶ人々の声。あなたはこの状況を作ったのが、あなたの身内であると知る。ダークカードの手から身内を救うためにも、あなたはカードを手にとった。\n"}), "CST": $hash2(["name", "type", "table"], {"name": "街中場所表", "type": "1D6", "table": "" + "カードショップ/ソウルカードを遊ぶ者たちが集まる場所。プレイスペースもあれば、カードの販売もしている。\n" + "ビル街/ビルが立ち並ぶ街。ビジネスマンが忙しなく動き、チェーン店が多く見られる。\n" + "駅前/人が集まる駅前。電車から降りてくる人は多く、今日も人と人がすれ違う。\n" + "食事処/レストランから大衆食堂、喫茶店やバーなど、食事は人の活力であり、カードランカーにも元気は必要だ。\n" + "道路/長く広い道路。車と人が通過していく場所だが、時おりトラブルを抱えたカードランカー同士が戦っている。\n" + "プール/都会にあるプール。都会の生活に疲れた人々が集まる場所。時おり、ソウルカードの戦いも見られる。\n"}), "DT": $hash2(["name", "type", "table"], {"name": "運命表", "type": "1D6", "table": "" + "あなたが欲しているカードはダークランカーが持っているかもしれないという情報を掴んだ。ダークランカーを倒し、アンティルールでカードを手に入れなければならない。\n" + "ダークランカーとなった人物とあなたはカード仲間であったが、ある日見たその人物はダークカードの力にとり憑かれて豹変していた。あなたは仲間をカードによって救うため、戦いを決意した。\n" + "ダークランカーはあなたの仲間や身内、大切なモノを傷つけた（壊した）。あなたの大切なものを傷つけたダークランカー、許しはしない。\n" + "あなたの持つレジェンドカードが、ダークランカーもしくは他のレジェンドカードが出現することを察知した。レジェンドカードに導かれるまま、キミはダークランカー（レジェンドカード）を探し始めた。\n" + "カードランカーの組織やソウルカードの安定を願う人からそのダークランカーを倒すように依頼を受けた、あなたはその仕事を受ける価値があると思った。そう思った理由は報酬でもいいし、あなたの流儀でもよい。\n" + "ダークランカーとあなたは偶然にも出会ってしまった。ダークランカーは危険な存在だ。見てしまった以上、放っておくわけにはいかない。\n"}), "GDT": $hash2(["name", "type", "table"], {"name": "学園運命表", "type": "1D6", "table": "" + "あなたが過ごしているクラスや寮、部活が潰されそうになった。その裏にはダークランカーの影響があるらしい。\n" + "学園の偉い人から、カードランカーであるあなたに調査依頼が入った。どうやらダークランカーが学園に干渉しているとのこと。\n" + "学園内のカードが奪われた。ダークランカーの影響だろう。大切にされていたカードを取り戻すために、あなたは立ち上がった。\n" + "学内に邪悪な影響を受けたカードが入り込んでいた。おそらく、ダークランカーの仕業に違いない。\n" + "ダークランカーによって被害を受けた生徒があなたに相談してきた。あなたはその生徒のためにもダークランカーの調査に乗り出した。\n" + "ダークランカーの影響を受け、授業や部活動はまともにできなくなってしまった。あなたは元の学校生活を再開させるためにも、調査を始めた。\n"}), "OST": $hash2(["name", "type", "table"], {"name": "郊外場所表", "type": "1D6", "table": "" + "カードショップ/ソウルカードを遊ぶ者たちが集まる場所。少し治安と客層が悪いが、賞金稼ぎも集まる。\n" + "荒野/動植物も少なく、ピリピリとした雰囲気のある場所。\n" + "遺跡/古代の遺跡。レジェンドカードやモンスターカードはこうした場所に発生したり、隠されていたりすることが多い。\n" + "平原/どこまでも続く平原。動物も温厚であり、生い茂る草花が柔らかな印象を与える場所だ。\n" + "山岳/険しい道が続く山。カードの精霊たちが生息していることもあるが、カード山賊団には気をつけねばならない。\n" + "海川/海や川。山と同じくカードの精霊たちが住んでいる場所だ。安らげる場所でもあり、休憩している人がソウルカードをしている。\n"}), "GST": $hash2(["name", "type", "table"], {"name": "学園場所表", "type": "1D6", "table": "" + "購買/学生にとっては学園内で唯一買い物ができる場所。パンの他に、カードパックが売っている。\n" + "グラウンド／体育館/運動するのに適した広い空間だが、同時にソウルカードをやるのにもうってつけの場所である。\n" + "屋上/校舎の屋上は一部の生徒には人気のスポットだ。今日も強い風が彼らを迎えている。\n" + "教室/日が昇っている間は、学生たちの声で賑やかな場所。夕暮れからは少し物哀しく、寂しい。\n" + "校舎裏/学校の中でも珍しく人目につかない場所。不良たちがソウルカードをやっている姿が見られる。\n" + "部活棟/部活をやる者のために用意された場所。しかし、サボってソウルカードをやっているところも。\n"}), "ST": $hash2(["name", "type", "table"], {"name": "場所表", "type": "1D6", "table": "" + "カード系/ショップや大会の会場など、ソウルカードに関係がある場所。カードランカーたちも集まってくる。\n" + "自然/公園や山など、自然の息吹が感じられる場所。耳を澄ませばカードの声も聞こえるかもしれない。\n" + "神秘/古代の施設や、神社・教会などの神秘的な場所。レジェンドカードが隠されているかもしれない。\n" + "安息/自宅など、安らげる空間。そこはあなたが安らげる場所であり、思い出の地なのかもしれない。\n" + "街中/人々が住む街中。何気なく落ちているカードの中には、価値があるものもあるかも。\n" + "水辺/プールや海岸など、水が近くに存在する場所。ひとまず、ここでひと息つけそうだ。\n"}), "TDT": $hash2(["name", "type", "table"], {"name": "大会運命表", "type": "1D6", "table": "" + "あなたは友人と共に大会に出場した。しかし、友人はダークランカーによって倒されてしまった。\n" + "あなたは大会の商品を狙い、大会に出場した。だが、ダークランカーもそれを狙っているらしい。\n" + "あなたは大会の運営者から、大会に関わっているダークランカーの撃破を依頼された。\n" + "あなたはカードの導くままに、大会に関わってくるダークランカーの出現を察知した。\n" + "あなたは大会の一選手として戦っていた。だが、謎の刺客によって襲われた。きっとダークランカーの仕業に違いない。\n" + "あなたは大会に出場し、優勝候補と言われているカードランカーだ。だが、そんなキミをダークランカーは襲った。\n"}), "WT": $hash2(["name", "type", "table"], {"name": "変調表", "type": "1D6", "table": "" + "猛毒/ラウンド終了時に【LP】の現在値を3点失う。また【LP】の現在値を回復できない。\n" + "炎上/ラウンド終了時に、モンスターカードを一つ選び破壊状態にしなければならない。既に破壊状態になっているものは選べない。\n" + "妨害/攻撃判定にマイナス2の修正を受ける。\n" + "捕縛/ブロック判定にマイナス2の修正を受ける。\n" + "召喚制限/「タイプ：補助」のモンスターカードを使用できない。\n" + "暗闇/「タイプ：支援」のモンスターカードを使用できない。\n"})}).$freeze());
    return self.$setPrefixes($rb_plus(["RM", "CM.*"], $$($nesting, 'TABLES').$keys()));
  })($nesting[0], $$($nesting, 'DiceBot'), $nesting)
})(Opal);
