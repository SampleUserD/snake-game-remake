// @won --> @player
// @direction --> player
// @pages <=> @scenes
const OnSceneCompleted = (function(won: boolean, player, direction, pages)
{
  return (function(lastBlock) : void
  {
    if (!won)
    {
      return undefined
    }

    for (let index = 1; index < player.blocks.length; index++) {
      let block = player.blocks[index];

      player.blocks.splice(index, 1);

      block.x = lastBlock.x + direction[0] * player.size * (index);
      block.y = lastBlock.y + direction[1] * player.size * (index);

      player.blocks.unshift(block);
    }

    pages[Math.abs(direction[1])] += direction[Math.abs(direction[1])];
  })
})