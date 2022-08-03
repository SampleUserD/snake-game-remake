import { Player } from '../Types/Main.js'
import { Vector } from '../Types/Main.js'
import { Point } from '../Types/Main.js'

import { MovePlayer } from './MovePlayer.js'

// @won --> @player
// @direction --> player
// @pages <=> @scenes
export const OnSceneCompleted = (function(
  won: boolean, 
  player: Player, 
  direction: Vector, 
  tail: Point, 
  pages: Vector)
{
  return (function() : void
  {
    if (!won)
    {
      return undefined
    }

    // move player()
    MovePlayer(player, tail, direction)()

    // on next page ()
    pages[Math.abs(direction[1])] += direction[Math.abs(direction[1])];
  })
})