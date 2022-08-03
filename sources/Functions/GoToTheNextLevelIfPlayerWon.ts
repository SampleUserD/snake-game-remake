import { Player } from '../Types/Main.js'
import { Vector } from '../Types/Main.js'
import { Point } from '../Types/Main.js'

import { MovePlayer } from './MovePlayer.js'

// @won --> @player
// @direction --> player
// @pages <=> @scenes
export const GoToTheNextLevelIfPlayerWon = (function(
  won: boolean,
  direction: Vector, 
  pages: Vector)
{
  return (function() : void
  {
    if (!won)
    {
      return undefined
    }

    // on next page ()
    pages[Math.abs(direction[1])] += direction[Math.abs(direction[1])];
  })
})