import { Player } from '../Types/Main.js'
import { Vector } from '../Types/Main.js'
import { Point } from '../Types/Main.js'

export const MovePlayer = (function(player: Player, direction: Vector) 
{
  return (function() 
  {
    const tail: Point = player.blocks.splice(player.blocks.length - 1, 1)[0]

    for (let index = 1; index < player.blocks.length; index++) 
    {
      let block = player.blocks[index];

      player.blocks.splice(index, 1);

      block.x = tail.x + direction[0] * player.size * (index);
      block.y = tail.y + direction[1] * player.size * (index);

      player.blocks.unshift(block);
    }
  })
})