import { Player } from '../Types/Main.js'
import { Vector } from '../Types/Main.js'
import { Point } from '../Types/Main.js'

import { KillPlayer } from './KillPlayer.js'
import { IsSegmentTouchedAnother } from './IsSegmentTouchedAnother.js'

export const KillPlayerIfItTouchedItself = (function(player: Player, direction: Vector, blockConfigs) 
{
  return (function __killPlayer(): void
  {
    const head: Point = player.blocks[0]
    const isStoped: boolean = direction.every(x => x === 0)
    const isImmortal: boolean = player.immortal

    if (isStoped == true || isImmortal == true)
    {
      return undefined
    }

    for (let index = 1; index < player.blocks.length; index++)
    {
      const segment: Point = player.blocks[index];

      if (IsSegmentTouchedAnother(player, blockConfigs)(head, segment) == true)
      {
        KillPlayer(player)()
      }
    }
  })
})