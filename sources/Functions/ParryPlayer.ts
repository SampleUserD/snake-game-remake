import { Player } from '../Types/Main.js'
import { Vector } from '../Types/Main.js'
import { Point } from '../Types/Main.js'

export const ParryPlayer = (function(borderOffsetX: number, 
                                    borderOffsetY: number,
                                    player: Player, 
                                    direction: Vector, 
                                    canvas: HTMLCanvasElement,
                                    tail: Point) 
{
  return (function()
  {
    tail.x = player.blocks[0].x + direction[0] * player.size;
    tail.y = player.blocks[0].y + direction[1] * player.size;

    player.blocks.unshift(tail);

    if (tail.x > canvas.width - borderOffsetX)
    {
      tail.x = 0 + borderOffsetX;
    } 
    else if (tail.x < 0 + borderOffsetX)
    {
      tail.x = canvas.width - borderOffsetX;
    } 
    else if (tail.y > canvas.height - borderOffsetY)
    {
      tail.y = 0 + borderOffsetY;
    } 
    else if (tail.y < 0 + borderOffsetY)
    {
      tail.y = canvas.height - borderOffsetY;
    }
  })
})