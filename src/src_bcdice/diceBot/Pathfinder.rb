# -*- coding: utf-8 -*-
# frozen_string_literal: true

require 'diceBot/DungeonsAndDragons'

class Pathfinder < DungeonsAndDragons
  # ゲームシステムの識別子
  ID = 'Pathfinder'

  # ゲームシステム名
  NAME = 'Pathfinder'

  # ゲームシステム名の読みがな
  SORT_KEY = 'はすふあいんたあ'

<<<<<<< HEAD
  def getHelpMessage
    return <<MESSAGETEXT
※この骰子ボットは部屋のシステム名表示用となります。
MESSAGETEXT
  end
=======
  # ダイスボットの使い方
  HELP_MESSAGE = "※このダイスボットは部屋のシステム名表示用となります。\n"
>>>>>>> 0dfe93a1d368ac1ad3ef24167156b31a70848848
end
