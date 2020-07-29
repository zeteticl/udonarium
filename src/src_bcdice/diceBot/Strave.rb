# -*- coding: utf-8 -*-

class Strave < DiceBot
  setPrefixes([
    'MP\d+', '\d+ST\d+(x|\*)\d+',
    'AFF', 'IDT', 'AFV', 'IDV'
  ])

  def initialize
    super
    @sortType = 1 # 骰子のソート有
  end

  def gameName
    '碧空のストレイヴ'
  end

  def gameType
    "Strave"
  end

  def getHelpMessage
    return <<MESSAGETEXT
・モラトリアムフェイズ用判定：MPm
・命中判定：nSTm*p

「n」で骰子数を指定。
「m」で目標値を指定。省略は出来ません。
「p」で攻撃力を指定。「*」は「x」でも可。

【書式例】
・MP6 → 目標値6のモラトリアムフェイズ用判定。
・5ST6*10 → 5d10で目標値6、攻撃力10の命中判定。

【各種表】
・所属表：AFF　　VN版：AFV
・アイデンティティ表：IDT　　VN版：IDV

※アイデンティティ表はエラッタ適用済です。
MESSAGETEXT
  end

  def rollDiceCommand(command)
    output =
      case command.upcase

      # MPコマンド：モラトリアムフェイズ用判定
      when /MP(\d+)$/i
        diceCount = 2
        target = Regexp.last_match(1).to_i
        checkRoll(diceCount, target, nil)

      # STコマンド：命中判定
      when /(\d+)ST(\d+)(x|\*)(\d+)$/i
        diceCount = Regexp.last_match(1).to_i
        target = Regexp.last_match(2).to_i
        damage = (Regexp.last_match(4) || 0).to_i
        checkRoll(diceCount, target, damage)

      # 各種表
      when 'AFF'
        get_affiliation_table
      when 'IDT'
        get_identity_table
      when 'AFV'
        get_affiliation_table2
      when 'IDV'
        get_identity_table2

      end

    return output
  end

  def checkRoll(diceCount, target, damage)
    target = 1 if target < 1
    target = 10 if target > 10

    _dice, diceText = roll(diceCount, 10, @sortType)
    diceArray = diceText.split(/,/).collect { |i| i.to_i }

    successCount = diceArray.find_all { |i| (i <= target) }.size

    isDamage = !damage.nil?

    if isDamage
      totalDamage = successCount * damage
      result = "(#{diceCount}D10\<\=#{target}) ＞ #{diceText} ＞ Hits：#{successCount}*#{damage} ＞ #{totalDamage}ダメージ"
    else
      result = "(#{diceCount}D10\<\=#{target}) ＞ #{diceText}"
      if  successCount > 0
        result += " ＞ 【成功】"
      else
        result += " ＞ 【失敗】"
      end
    end

    return result
  end

  def get_affiliation_table
    name = '所属表：基本'
    table = [
      [1, 'アリウス管理委員会：あなたはアリウス管理委員会に所属している。'],
      [2, 'オーヴァーブルー：あなたはオーヴァーブルーに所属している。'],
      [3, 'ウォルゲイト：あなたはウォルゲイトに所属している。'],
      [4, '暁部隊：あなたはかつて、反逆者・暁弥琴と同じ部隊に所属していた。'],
      [5, '天文部：あなたは天文部に所属している。'],
      [6, '吹奏楽部：あなたは吹奏楽部に所属している。'],
      [7, '剣道部：あなたは剣道部に所属している。'],
      [8, 'ボクシング部：あなたはボクシング部に所属している。'],
      [9, '陸上部：あなたは陸上部に所属している。'],
      [10, '茶道部：あなたは茶道部に所属している。'],
      [11, 'パソコン部：あなたはパソコン部に所属している。'],
      [12, '新聞部：あなたは新聞部に所属している。'],
      [13, '弓道部：あなたは弓道部に所属している。'],
      [14, '美術部：あなたは美術部に所属している。'],
      [15, 'ミリタリー研究会：あなたはミリタリー研究会に所属している。'],
      [16, '歴史研究会：あなたは歴史研究会に所属している。'],
      [17, 'ロボット研究会：あなたはロボット研究会に所属している。'],
      [18, '図書委員会：あなたは図書委員会に所属している。'],
      [19, '任意：あなたの任意の所属を設定せよ。'],
      [20, '任意：あなたの任意の所属を設定せよ。']
    ]
    return get_strave_1d100_table_result(name, table)
  end

  def get_identity_table
    name = 'アイデンティティ表：基本'
    table = [
      [1, '戦い：戦いこそが、あなたをあなたたらしめている。'],
      [2, '守護：あなたには守るべきものがある。'],
      [3, '復讐：あなたは復讐を誓っている。何かに、あるいは誰かに。'],
      [4, '名声：その身に浴びる脚光を、何よりも誉としている。'],
      [5, '恋愛：あなたはその身を焦がす恋に生きている。'],
      [6, '家族：あなたにとって、家族はかけがえの無いものだ。'],
      [7, '友人：あなたは友のために戦っている。'],
      [8, '部隊：共に戦う部隊の仲間が、あなたに力をくれる。'],
      [9, 'ストレイヴ：あなたは自身のストレイヴを誇りに思っている。'],
      [10, 'スフィアブレイク：あなたはスフィアブレイクを熱烈に目指している。'],
      [11, 'お金：あなたはお金を求めている。報酬こそが自分の価値だ。'],
      [12, '夢：あなたには夢がある。自分を突き動かす夢が。'],
      [13, '忠誠：あなたは忠誠を誓っている。何かに、あるいは誰かに。'],
      [14, '共生：あなたは、ヴァイエルと人類との共生を望んでいる。'],
      [15, '居場所：自身の居場所こそが、あなたに力をくれる。'],
      [16, '強制：あなたは不本意ながら今の立場にいる。'],
      [17, '碧空：見上げた青空が、あなたを変えた。'],
      [18, '任意：あなたの任意のアイデンティティを設定せよ。'],
      [19, '任意：あなたの任意のアイデンティティを設定せよ。'],
      [20, '任意：あなたの任意のアイデンティティを設定せよ。']
    ]
    return get_strave_1d100_table_result(name, table)
  end

  def get_affiliation_table2
    name = '所属表：ヴァリアンスネイヴァー'
    table = [
      [1, 'シュヴァレ・トワール：あなたはシュヴァレ・トワールに所属している。'],
      [2, 'ディープシンカー：あなたはディープシンカーに所属している。'],
      [3, 'ヴェルクシュタット：あなたはヴェルクシュタットに所属している。'],
      [4, 'アウスヴァル：あなたはアウスヴァルに所属している。'],
      [5, '美術科：あなたは美術科に所属している。'],
      [6, '哲学科：あなたは哲学科に所属している。'],
      [7, '数学科：あなたは数学科に所属している。'],
      [8, '地理学科：あなたは地理学科に所属している。'],
      [9, '工学科：あなたは工学科に所属している。'],
      [10, '体育学科：あなたは体育学科に所属している。'],
      [11, '農学科：あなたは農学科に所属している。'],
      [12, '歴史学科：あなたは歴史学科に所属している。'],
      [13, '医学科：あなたは医学科に所属している。'],
      [14, '情報学科：あなたは情報学科に所属している。'],
      [15, '音楽科：あなたは音楽科に所属している。'],
      [16, '心理学科：あなたは心理学科に所属している。'],
      [17, '文学科：あなたは文学科に所属している。'],
      [18, '任意：あなたの任意の所属を設定すること。'],
      [19, '任意：あなたの任意の所属を設定すること。'],
      [20, '任意：あなたの任意の所属を設定すること。']
    ]
    return get_strave_1d100_table_result(name, table)
  end

  def get_identity_table2
    name = 'アイデンティティ表：ヴァリアンスネイヴァー'
    table = [
      [1, '戦い：戦いへの衝動が、あなたをあなたたらしめている。'],
      [2, '守護：守るべきものの存在が、あなたをあなたたらしめている。'],
      [3, '復讐：復讐の誓いこそが、あなたをあなたたらしめている。'],
      [4, '名声：与えられた名誉こそが、あなたをあなたたらしめている。'],
      [5, '恋愛：愛する者への想いが、あなたをあなたたらしめている。'],
      [6, '家族：かけがえのない家族が、あなたをあなたたらしめている。'],
      [7, '友人：友の存在が、あなたをあなたたらしめている。'],
      [8, '部隊：部隊の戦友こそが、あなたをあなたたらしめている。'],
      [9, 'ストレイヴ：ストレイヴの存在が、あなたの心を保っている。'],
      [10, '宇宙：やがて来る旅立ちの日まで、あなたはあなたであろうとしている。'],
      [11, 'お金：与えられる報酬のため、あなたはあなたであろうとしている。'],
      [12, '夢：あなたには、己の心に誓った夢がある。'],
      [13, '忠誠：その心でもって、誓った忠義がある。'],
      [14, '共生：あなたは、ヴァイエルと人類との共生を望んでいる。'],
      [15, '居場所：自身の居場所への思いが、あなたをあなたたらしめている。'],
      [16, 'ヴァイエル：あなたと同じでありながら、あなたと異なる存在。彼らへの思いが、あなたをあなたたらしめている。'],
      [17, 'エコール：自身の生きる場所への思いが、あなたをあなたたらしめている。'],
      [18, '任意：あなたの任意のアイデンティティを設定せよ。'],
      [19, '任意：あなたの任意のアイデンティティを設定せよ。'],
      [20, '任意：あなたの任意のアイデンティティを設定せよ。']
    ]
    return get_strave_1d100_table_result(name, table)
  end

  def get_strave_1d100_table_result(name, table)
    dice, = roll(1, 100)
    dice2 = ((dice.to_i - 1) / 5).floor + 1
    result = get_table_by_number(dice2, table)
    return get_strave_table_result(name, dice, result)
  end

  def get_strave_table_result(name, dice, result)
    return "#{name}(#{dice}) ＞ #{result}"
  end
end
