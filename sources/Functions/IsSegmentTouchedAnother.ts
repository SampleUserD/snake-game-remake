import { Player } from '../Types/Main.js'
import { Point } from '../Types/Main.js'

export const IsSegmentTouchedAnother = (function(player: Player, blockConfigs) 
{
  return (function(first: Point, second: Point): boolean
  {
    return (
      first.x + player.size > second.x && 
      first.y + player.size > second.y && 
      first.x < second.x + blockConfigs.size && 
      first.y < second.y + blockConfigs.size
    )
  })
})