# -*- coding: utf-8 -*-
# frozen_string_literal: true

require 'diceBot/DiceBot'
require 'utils/modifier_formatter'
require 'utils/ArithmeticEvaluator'

# クトゥルフテックのダイスボット
class CthulhuTech < DiceBot
  setPrefixes(['\d+D10.*'])

  # ゲームシステムの識別子
  ID = 'CthulhuTech'

  # ゲームシステム名
  NAME = 'クトゥルフテック'

  # ゲームシステム名の読みがな
  SORT_KEY = 'くとうるふてつく'

  # ダイスボットの使い方
  HELP_MESSAGE = <<INFO_MESSAGE_TEXT
・行為判定（test）：nD10+m>=d
　n個のダイスを使用して、修正値m、難易度dで行為判定（test）を行います。
　修正値mは省略可能、複数指定可能（例：+2-4）です。
　成功、失敗、クリティカル、ファンブルを自動判定します。
　例）2D10>=12　4D10+2>=28　5D10+2-4>=32

<<<<<<< HEAD
  def getHelpMessage
    return <<INFO_MESSAGE_TEXT
テストの骰子計算を実装。
成功、失敗、クリティカル、ファンブルの自動判定。
コンバットテスト(防御側有利なので「>=」ではなく「>」で入力)の時はダメージ骰子も表示。
=======
・対抗判定（contest）：nD10+m>d
　行為判定と同様ですが、防御側有利のため「>=」ではなく「>」を入力します。
　ダメージダイスも表示します。
>>>>>>> 0dfe93a1d368ac1ad3ef24167156b31a70848848
INFO_MESSAGE_TEXT

  # 行為判定のノード
  class Test
    include ModifierFormatter

    # 判定で用いる比較演算子
    #
    # 対抗判定で変えられるように定数で定義する。
    COMPARE_OP = :>=

    # ノードを初期化する
    # @param [Integer] num ダイス数
    # @param [Integer] modifier 修正値
    # @param [Integer] difficulty 難易度
    def initialize(num, modifier, difficulty)
      @num = num
      @modifier = modifier
      @difficulty = difficulty
    end

    # 判定を行う
    # @param [DiceBot] bot ダイスボット
    # @return [String] 判定結果
    def execute(bot)
      dice_values = Array.new(@num) { bot.roll(1, 10)[0] }

      # ファンブル：出目の半分（小数点以下切り上げ）以上が1の場合
      fumble = dice_values.count(1) >= ((dice_values.length + 1) / 2).floor # TKfix Rubyでは常に整数が返るが、JSだと実数になる可能性がある

      sorted_dice_values = dice_values.sort
      roll_result = calculate_roll_result(sorted_dice_values)
      test_value = roll_result + @modifier

      diff = test_value - @difficulty

      # diff と @difficulty との比較の演算子が変わるので、send で対応
      # 例：COMPARE_OP が :>= ならば、diff >= 0 と同じ
      success = !fumble && diff.send(self.class::COMPARE_OP, 0)

      critical = diff >= 10

      output_parts = [
        "(#{expression()})",
        test_value_expression(sorted_dice_values, roll_result),
        test_value,
        result_str(success, fumble, critical, diff)
      ]

      return output_parts.join(' ＞ ')
    end

    private

    # 数式表現を返す
    # @return [String]
    def expression
      modifier_str = format_modifier(@modifier)
      return "#{@num}D10#{modifier_str}#{self.class::COMPARE_OP}#{@difficulty}"
    end

    # 判定値の数式表現を返す
    # @param [Array<Integer>] dice_values 出目の配列
    # @param [Integer] roll_result ダイスロール結果の値
    # @return [String]
    def test_value_expression(dice_values, roll_result)
      dice_str = dice_values.join(',')
      modifier_str = format_modifier(@modifier)

      return "#{roll_result}[#{dice_str}]#{modifier_str}"
    end

    # 判定結果の文字列を返す
    # @param [Boolean] success 成功したか
    # @param [Boolean] fumble ファンブルだったか
    # @param [Boolean] critical クリティカルだったか
    # @param [Integer] _diff 判定値と難易度の差
    # @return [String]
    def result_str(success, fumble, critical, _diff)
      return 'ファンブル' if fumble
      return 'クリティカル' if critical

      return success ? '成功' : '失敗'
    end

    # ダイスロール結果を計算する
    #
    # 以下のうち最大のものを返す。
    #
    # * 出目の最大値
    # * ゾロ目の和の最大値
    # * ストレート（昇順で連続する3個以上の値）の和の最大値
    #
    # @param [Array<Integer>] sorted_dice_values 昇順でソートされた出目の配列
    # @return [Integer]
    def calculate_roll_result(sorted_dice_values)
      highest_single_roll = sorted_dice_values.last

      candidates = [
        highest_single_roll,
        sum_of_highest_set_of_multiples(sorted_dice_values),
        sum_of_largest_straight(sorted_dice_values)
      ]

      return candidates.max
    end

    # ゾロ目の和の最大値を求める
    # @param [Array<Integer>] dice_values 出目の配列
    # @return [Integer]
    def sum_of_highest_set_of_multiples(dice_values)
      dice_values.
        # TODO: Ruby 2.2以降では group_by(&:itself) が使える
        group_by { |i| i }.
        # TODO: Ruby 2.4以降では value_group.sum が使える
        map { |_, value_group| value_group.reduce(0, &:+) }.
        max
    end

<<<<<<< HEAD
  def getDamageDice(total_n, diff)
    debug('getDamageDice total_n, diff', total_n, diff)
    damageDiceCount = ((total_n - diff) / 5.0).ceil
    debug('damageDiceCount', damageDiceCount)
    damageDice = "(#{damageDiceCount}d10)" # ダメージ骰子の表示
=======
    # ストレートの和の最大値を求める
    #
    # ストレートとは、昇順で3個以上連続した値のこと。
    #
    # @param [Array<Integer>] sorted_dice_values 昇順にソートされた出目の配列
    # @return [Integer] ストレートの和の最大値
    # @return [0] ストレートが存在しなかった場合
    def sum_of_largest_straight(sorted_dice_values)
      # 出目が3個未満ならば、ストレートは存在しない
      return 0 if sorted_dice_values.length < 3
>>>>>>> 0dfe93a1d368ac1ad3ef24167156b31a70848848

      # ストレートの和の最大値
      max_sum = 0

<<<<<<< HEAD
  # 骰子目文字列から骰子値を変更する場合の処理
  # クトゥルフ・テックの判定用骰子計算
  def changeDiceValueByDiceText(dice_now, dice_str, isCheckSuccess, dice_max)
    debug("changeDiceValueByDiceText dice_now, dice_str, isCheckSuccess, dice_max", dice_now, dice_str, isCheckSuccess, dice_max)
    if isCheckSuccess && (dice_max == 10)
      debug('cthulhutech_check(dice_str) called')
      debug('dice_str, dice_now', dice_str, dice_now)
      dice_now = cthulhutech_check(dice_str)
    end
    debug('dice_str, dice_now', dice_str, dice_now)
=======
      # 連続した値の数
      n_consecutive_values = 0
      # 連続した値の和
      sum = 0
      # 直前の値
      # 初期値を負の値にして、最初の値と連続にならないようにする
      last = -1

      sorted_dice_values.uniq.each do |value|
        # 値が連続でなければ、状態を初期化する（現在の値を連続1個目とする）
        if value - last > 1
          n_consecutive_values = 1
          sum = value
          last = value

          next
        end

        # 連続した値なので溜める
        n_consecutive_values += 1
        sum += value
        last = value

        # ストレートならば、和の最大値を更新する
        if n_consecutive_values >= 3 && sum > max_sum
          max_sum = sum
        end
      end
>>>>>>> 0dfe93a1d368ac1ad3ef24167156b31a70848848

      return max_sum
    end
  end

<<<<<<< HEAD
  ####################           CthulhuTech         ########################
  # CthulhuTechの判定用骰子計算
  def cthulhutech_check(dice_str)
    dice_aRR = dice_str.split(/,/).collect { |i| i.to_i }
=======
  # 対抗判定のノード
  class Contest < Test
    # 判定で用いる比較演算子
    COMPARE_OP = :>
>>>>>>> 0dfe93a1d368ac1ad3ef24167156b31a70848848

    # 判定結果の文字列を返す
    #
    # 成功した場合（クリティカルを含む）、ダメージロールのコマンドを末尾に
    # 追加する。
    #
    # @param [Boolean] success 成功したか
    # @param [Integer] diff 判定値と難易度の差
    # @return [String]
    def result_str(success, _fumble, _critical, diff)
      formatted = super

      if success
        damage_roll_num = (diff / 5.0).ceil
        damage_roll = "#{damage_roll_num}D10"

<<<<<<< HEAD
      if dice_n > max_num # 1.個別の骰子の最大値
        max_num = dice_n
=======
        "#{formatted}（ダメージ：#{damage_roll}）"
      else
        formatted
>>>>>>> 0dfe93a1d368ac1ad3ef24167156b31a70848848
      end
    end
  end

<<<<<<< HEAD
    if dice_aRR.length >= 2 # 骰子が2個以上ロールされている
      10.times do |i|
        if dice_num[i] > 1 # 2.同じ出目の合計値
          dice_now = dice_num[i] * (i + 1)
          max_num = dice_now if dice_now > max_num
        end
      end

      if dice_aRR.length >= 3 # 骰子が3個以上ロールされている
        10.times do |i|
          break if  dice_num[i + 2].nil?
=======
  # ダイスボットを初期化する
  def initialize
    super

    # 加算ロールで出目をソートする
    @sortType = 1
  end
>>>>>>> 0dfe93a1d368ac1ad3ef24167156b31a70848848

  # ダイスボット固有コマンドの処理を行う
  # @param [String] command コマンド
  # @return [String] ダイスボット固有コマンドの結果
  # @return [nil] 無効なコマンドだった場合
  def rollDiceCommand(command)
    node = parse(command)
    return nil unless node

    return node.execute(self)
  end

  private

  # 判定コマンドの正規表現
  TEST_RE = /\A(\d+)D10((?:[-+]\d+)+)?(>=?)(\d+)\z/.freeze

  # 構文解析する
  # @param [String] command コマンド
  # @return [Test, Contest] 判定のノード
  # @return [nil] 無効なコマンドだった場合
  def parse(command)
    m = TEST_RE.match(command)
    return nil unless m

    num = m[1].to_i
    modifier = m[2] ? ArithmeticEvaluator.new.eval(m[2]) : 0
    node_class = m[3] == '>' ? Contest : Test
    difficulty = m[4].to_i

    return node_class.new(num, modifier, difficulty)
  end
end
