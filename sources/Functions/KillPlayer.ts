import { Player } from '../Types/Main.js'

export const KillPlayer = (function(player: Player) 
{
  return (function() 
  {
    player.health = -1
  })
})