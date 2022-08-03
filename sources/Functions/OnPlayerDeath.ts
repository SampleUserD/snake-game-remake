import { Player } from '../Types/Main.js'

export const OnPlayerDeath = (function(player: Player, deathMessages: string[]) 
{
  return (function()
  {
    if (player.health <= 0) 
    {
      alert(deathMessages[Math.floor(Math.random() * deathMessages.length)]);
      window.location.reload();

      return undefined;
    }
  })
})