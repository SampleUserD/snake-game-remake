import { Player } from '../Types/Main.js'
import { Vector } from '../Types/Main.js'
import { Point } from '../Types/Main.js'

export const MovePlayer = (function(player: Player, direction: Vector, size: number) 
{
  return (function() 
  {
    const tail: Point = player.blocks.splice(player.blocks.length - 1, 1)[0]
    const head: Point = player.blocks[0]

    tail.x = head.x + direction[0] * size
    tail.y = head.y + direction[1] * size

    player.blocks.unshift(tail)
  })
})