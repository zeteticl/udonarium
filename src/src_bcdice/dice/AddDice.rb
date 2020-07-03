# -*- coding: utf-8 -*-

require "utils/normalize"
require "dice/add_dice/parser"
require "dice/add_dice/randomizer"

class AddDice
  def initialize(bcdice, diceBot)
    @bcdice = bcdice
    @diceBot = diceBot
    @nick_e = @bcdice.nick_e

    @dice_list = []
  end

  ####################             加算骰子        ########################

  def rollDice(string)
    parser = Parser.new(string)

    command = parser.parse()
    if parser.error?
      return '1'
    end

    randomizer = Randomizer.new(@bcdice, @diceBot, command.cmp_op)
    total = command.lhs.eval(randomizer)

<<<<<<< HEAD
    # 骰子目による補正処理（現状ナイトメアハンターディープ専用）
    addText, revision = @diceBot.getDiceRevision(n_max, dice_max, total_n)
    debug('addText, revision', addText, revision)

    debug("@nick_e", @nick_e)
    if @diceBot.sendMode > 0
      if output =~ /[^\d\[\]]+/
        output = "#{@nick_e}: (#{string}) ＞ #{output} ＞ #{total_n}#{addText}"
=======
    output =
      if randomizer.dice_list.size <= 1 && command.lhs.is_a?(Node::DiceRoll)
        "#{@nick_e}: (#{command}) ＞ #{total}"
>>>>>>> 0dfe93a1d368ac1ad3ef24167156b31a70848848
      else
        "#{@nick_e}: (#{command}) ＞ #{command.lhs.output} ＞ #{total}"
      end
<<<<<<< HEAD
    else
      output = "#{@nick_e}: (#{string}) ＞ #{total_n}#{addText}"
    end

    total_n += revision

    if signOfInequality != "" # 成功度判定処理
      successText = @bcdice.check_suc(total_n, dice_n, signOfInequality, diffText, dice_cnt, dice_max, n1, n_max)
      debug("check_suc successText", successText)
      output += successText
    end

    # 骰子ロールによるポイント等の取得処理用（T&T悪意、ナイトメアハンター・ディープ宿命、特命転校生エクストラパワーポイントなど）
    output += @diceBot.getDiceRolledAdditionalText(n1, n_max, dice_max)

    if (dice_cnt == 0) || (dice_max == 0)
      output = '1'
    end

    debug("AddDice.rollDice() end output", output)
    return output
  end

  def rollDiceAddingUp(string, isCheckSuccess = false) # 加算骰子ロール(個別処理)
    debug("rollDiceAddingUp() begin string", string)

    dice_max = 0
    dice_total = 1
    dice_n = 0
    output = ""
    n1 = 0
    n_max = 0
    dice_cnt_total = 0
    double_check = false

    if @diceBot.sameDiceRerollCount != 0 # 振り足しありのゲームで骰子が二個以上
      if @diceBot.sameDiceRerollType <= 0 # 判定のみ振り足し
        debug('判定のみ振り足し')
        double_check = true if isCheckSuccess
      elsif  @diceBot.sameDiceRerollType <= 1 # ダメージのみ振り足し
        debug('ダメージのみ振り足し')
        double_check = true unless isCheckSuccess
      else # 両方振り足し
        double_check = true
      end
    end

    debug("double_check", double_check)
=======

    dice_list = randomizer.dice_list
    num_one = dice_list.count(1)
    num_max = dice_list.count(randomizer.sides)

    suffix, revision = @diceBot.getDiceRevision(num_max, randomizer.sides, total)
    output += suffix
    total += revision
>>>>>>> 0dfe93a1d368ac1ad3ef24167156b31a70848848

    if command.cmp_op
      dice_total = dice_list.inject(&:+)
      output += @diceBot.check_result(total, dice_total, dice_list, randomizer.sides, command.cmp_op, command.rhs)
    end

    output += @diceBot.getDiceRolledAdditionalText(num_one, num_max, randomizer.sides)

<<<<<<< HEAD
    debug("rollDiceAddingUp() end output", dice_total, dice_n, output, n1, n_max, dice_cnt_total, dice_max)
    return dice_total, dice_n, output, n1, n_max, dice_cnt_total, dice_max
  end

  def rollDiceAddingUpCommand(dice_count, dice_max, slashMark, double_check, isCheckSuccess, critical)
    result_dice_count = 0
    dice_now = 0
    n1_count = 0
    max_number = 0
    dice_str = ""
    dice_arry = []
    dice_arry.push(dice_count)
    loop_count = 0

    debug("before while dice_arry", dice_arry)

    while !dice_arry.empty?
      debug("IN while dice_arry", dice_arry)

      dice_wk = dice_arry.shift
      result_dice_count += dice_wk

      debug('dice_wk', dice_wk)
      debug('dice_max', dice_max)
      debug('(sortType & 1)', (@diceBot.sortType & 1))

      dice_dat = rollLocal(dice_wk, dice_max, (@diceBot.sortType & 1))
      debug('dice_dat', dice_dat)

      dice_new = dice_dat[0]
      dice_now += dice_new

      debug('slashMark', slashMark)
      dice_now = getSlashedDice(slashMark, dice_now)

      dice_str += "][" if dice_str != ""
      debug('dice_str', dice_str)

      dice_str += dice_dat[1]
      n1_count += dice_dat[2]
      max_number += dice_dat[3]

      # 振り足しありで骰子が二個以上
      if double_check && (dice_wk >= 2)
        addDiceArrayByAddDiceCount(dice_dat, dice_max, dice_arry, dice_wk)
      end

      @diceBot.check2dCritical(critical, dice_new, dice_arry, loop_count)
      loop_count += 1
    end

    # 骰子目文字列から骰子値を変更する場合の処理（現状クトゥルフ・テック専用）
    dice_now = @diceBot.changeDiceValueByDiceText(dice_now, dice_str, isCheckSuccess, dice_max)

    output = ""
    if @diceBot.sendMode > 1
      output += "#{dice_now}[#{dice_str}]"
    elsif @diceBot.sendMode > 0
      output += dice_now.to_s
    end

    return dice_max, dice_now, output, n1_count, max_number, result_dice_count
  end

  def addDiceArrayByAddDiceCount(dice_dat, _dice_max, dice_queue, roll_times)
    values = dice_dat[1].split(",").map(&:to_i)
    count_bucket = {}

    values.each do |val|
      count_bucket[val] ||= 0
      count_bucket[val] += 1
    end

    reroll_threshold = @diceBot.sameDiceRerollCount == 1 ? roll_times : @diceBot.sameDiceRerollCount
    count_bucket.each do |_, num|
      if num >= reroll_threshold
        dice_queue.push(num)
      end
    end
  end

  def getSlashedDice(slashMark, lhs)
    m = %r{^/(\d+)(.)?$}i.match(slashMark)
    return lhs unless m

    rhs = m[1].to_i
    mark = m[2]

    return lhs if rhs == 0

    value = lhs.to_f / rhs

    if mark == "U"
      return value.ceil
    elsif mark == "R"
      return value.round
    else
      return value.floor
    end
  end

  def rollLocal(dice_wk, dice_max, sortType)
    if dice_max == 66
      return rollD66(dice_wk)
    end

    return @bcdice.roll(dice_wk, dice_max, sortType)
  end

  def rollD66(count)
    d66List = []

    count.times do
      d66List << @bcdice.getD66Value()
    end

    total = d66List.inject { |sum, i| sum + i }
    text = d66List.join(',')
    n1Count = d66List.count(1)
    nMaxCount = d66List.count(66)

    return [total, text, n1Count, nMaxCount, 0, 0, 0]
  end

  def getOperatorText(rate, output)
    if rate < 0
      '-'
    elsif output.empty?
      ''
    else
      "+"
    end
=======
    return output
>>>>>>> 0dfe93a1d368ac1ad3ef24167156b31a70848848
  end
end
