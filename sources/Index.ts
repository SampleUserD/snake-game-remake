import Blocks from './Blocks/Main.js'
import Boosters from './Boosters/Main.js'
import Enemies from './Enemies/Main.js'

window.onload = function() {
  const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d");
  
  canvas.width = innerHeight;
  canvas.height = innerHeight;

  canvas.style.marginLeft = `${ Math.abs(innerHeight*0.5 - canvas.width) }`;
  
  let direction = [1, 0];

  const pages = [0, 0];
  
  window.onkeydown = function(event) {
    let code = event.code.toLowerCase();
    
    if (code == 'keya' && direction[0] != 1) {
      direction[0] = -1;
      direction[1] = 0;
    }
    
    if (code == 'keyd' && direction[0] != -1) {
      direction[0] = 1;
      direction[1] = 0;
    }
    
    if (code == 'keyw' && direction[1] != 1) {
      direction[1] = -1;
      direction[0] = 0;
    }
    
    if (code == 'keys' && direction[1] != -1) {
      direction[1] = 1;
      direction[0] = 0;
    }

    if (code == 'space') {
      direction[0] = 0;
      direction[1] = 0;
    }
  };
  

  const blockConfigs = { size: 10, background: 'transparent' }; // 15

  const lengthX = (canvas.width - canvas.width%blockConfigs.size)/blockConfigs.size;
  const lengthY = (canvas.height - canvas.height%blockConfigs.size)/blockConfigs.size;

  const borderOffsetX = (canvas.width - lengthX * blockConfigs.size)/2;
  const borderOffsetY = (canvas.height - lengthY * blockConfigs.size)/2;

  let won = false;

  let player = { blocks: [{ x: borderOffsetX, y: borderOffsetY }, { x: borderOffsetX+blockConfigs.size, y: borderOffsetY }], health: 500, size: blockConfigs.size, score: 0, immortal: false };
  let levelsCompleted = 0;

  const scenes = [];
  const gameConfiguration = { drawAxes: false };


  function __init()
  {
    for (let blockPosition = 0; blockPosition < lengthX; blockPosition++)
    {
      const scene = scenes.find(scene => scene.scene[0] == 0 && scene.scene[1] == 0) || { blocks: [], completed: true };

      scene.blocks.push({ 
        position: [
          blockPosition, 
          Math.round(lengthY / 4)
        ], 
        block: new Blocks.Light([], blockConfigs.size) 
      })

      scene.blocks.push({ 
        position: [
          blockPosition, 
          lengthY - Math.round(lengthY / 4) - 3
        ], 
        block: new Blocks.Light([], blockConfigs.size) 
      })
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = '20px Helvetica';
    context.textBaseline = 'middle';
    context.textAlign = 'center';
  }

  function __playerMove(lastBlock)
  {
    lastBlock.x = player.blocks[0].x + direction[0] * player.size;
    lastBlock.y = player.blocks[0].y + direction[1] * player.size;

    player.blocks.unshift(lastBlock);

    startTime = Date.now();

    if (lastBlock.x > canvas.width - borderOffsetX)
    {
      lastBlock.x = 0 + borderOffsetX;
    } 
    else if (lastBlock.x < 0 + borderOffsetX)
    {
      lastBlock.x = canvas.width - borderOffsetX;
    } 
    else if (lastBlock.y > canvas.height - borderOffsetY)
    {
      lastBlock.y = 0 + borderOffsetY;
    } 
    else if (lastBlock.y < 0 + borderOffsetY)
    {
      lastBlock.y = canvas.height - borderOffsetY;
    }
  }

  function __onSceneCompleted(lastBlock)
  {
    if (won)
    {
      for (let index = 1; index < player.blocks.length; index++)
      {
        let block = player.blocks[index];

        player.blocks.splice(index, 1);

        block.x = lastBlock.x + direction[0] * player.size * (index);
        block.y = lastBlock.y + direction[1] * player.size * (index);

        player.blocks.unshift(block);
      }

      pages[Math.abs(direction[1])] += direction[Math.abs(direction[1])];
    }
  }

  function __onPlayerDeath()
  {
    if (player.health <= 0) 
    {
      alert(deathMessages[Math.floor(Math.random() * deathMessages.length)]);
      window.location.reload();

      return undefined;
    }
  }
  function __scoreWin()
  {
    won = (scenes.find(scene => scene.scene.every((page, index) => page == pages[index])) || { completed: false }).completed;

    if (!scenes.find(scene => scene.scene.every((page, index) => page == pages[index]))) {
      won = true;
    }
  }
  function __renderAxes()
  {
    if (gameConfiguration.drawAxes) 
    {
      context.beginPath();
      context.strokeStyle = 'black';

      for (let x = 0; x < 2*lengthX; x++) 
      {
        if (2*borderOffsetX + x * blockConfigs.size > canvas.width) {
          break;
        }

        context.moveTo(borderOffsetX + x * blockConfigs.size, borderOffsetY);
        context.lineTo(borderOffsetX + x * blockConfigs.size, canvas.height - borderOffsetY);
      }

      for (let y = 0; y < 2*lengthY; y++) 
      {
        if (2*borderOffsetY + y * blockConfigs.size > canvas.height) {
          break;
        }

        context.moveTo(borderOffsetX, borderOffsetY + y * blockConfigs.size);
        context.lineTo(canvas.width - borderOffsetX, borderOffsetY + y * blockConfigs.size);
      }

      context.stroke();
      context.beginPath();
    }					
  }
  function __killPlayer()
  {
    for (let index = 1; index < player.blocks.length; index++)
    {
      const block = player.blocks[index];

      if (direction[0] === 0 && direction[1] === 0 || player.immortal)
      {
        break;
      }

      if (player.blocks[0].x + player.size > block.x && player.blocks[0].y + player.size > block.y && player.blocks[0].x < block.x + blockConfigs.size && player.blocks[0].y < block.y + blockConfigs.size)
      {
        player.health = -1;
      }
    }
  }

  let startTime = Date.now();
  let timingBeforeEnterAnotherRoom = startTime;

  const deathMessages = [ `You're dead`, `Ambulance was calling you`, `You should be alive`, `Press OK!`, `Repeat it, press button`, `You're crawling like a boss`, `MMM, delicious snake on da ground!`, `There ain't valley of snake...`, `You should be at next door right now...` ];
  
  const startSpeedCoefficient = 30 + (player.blocks.length - 3)*2;
  let speedCoefficient = startSpeedCoefficient;

  __init();

  requestAnimationFrame(function loop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    if (Date.now() - startTime >= speedCoefficient) {
      const lastBlock = player.blocks.splice(player.blocks.length - 1, 1)[0];
      
      if (
        lastBlock.x + player.size > canvas.width - borderOffsetX || 
        lastBlock.x + player.size < 0 + borderOffsetX || 
        lastBlock.y + player.size > canvas.height - borderOffsetY ||
        lastBlock.y + player.size < 0 + borderOffsetY
      ) {
        __playerMove(lastBlock);
        __onSceneCompleted(lastBlock);
      }

      if (player.blocks.length > 2) {
        speedCoefficient = startSpeedCoefficient + (player.blocks.length - 3)*2;
      }

      __killPlayer();
    }

    context.fillStyle = `rgba(${ Math.abs(pages[0]*17)%255 },${  Math.abs(pages[1]*17)%255 },${  Math.abs(pages[0] + pages[1])*17%255 },0.85)`;
    context.fillRect(0, 0, canvas.width, canvas.height);

    __scoreWin();
    __onPlayerDeath();

    context.fillStyle = 'white';

    context.fillRect(borderOffsetX, borderOffsetY, canvas.width - borderOffsetX*2, canvas.height - borderOffsetY*2);

    context.fillStyle = `black`;
    context.fillText(`(${ pages[0] }:${ pages[1] })`, canvas.width/2, 10 + borderOffsetY);

    context.fillStyle = `red`;

    if (!player.immortal) {
      context.fillText(`Health remain: ${ player.health }`, canvas.width / 2, canvas.height / 2);
    } else {
      context.fillText(`You're immortal`, canvas.width / 2, canvas.height / 2);
    }

    context.fillStyle = `green`;
    context.fillText(`Speed: ${ (200 + blockConfigs.size - speedCoefficient)/blockConfigs.size } block/second`, canvas.width / 2, canvas.height / 2 + 50);

    context.fillText(`Absorbtion: ${ player.blocks.length - 3 } damage`, canvas.width / 2, canvas.height / 2 + 50*2);

    context.fillStyle = `black`;

    scenes.forEach(scene => {
      if (pages[0] === scene.scene[0] && pages[1] === scene.scene[1]) {
        if (!scene.completed) {
          scene.blocks.forEach((block, index) => {
            if (block === null) {
              return undefined;
            }

            block.block.setCoordinates([block.position[0]*blockConfigs.size + borderOffsetX, block.position[1]*blockConfigs.size + borderOffsetY]);

            if (!('drawable' in block) || block.drawable) {
              block.block.draw(context, blockConfigs, { width: canvas.width, height: canvas.height });
            }

            if (!('actable' in block) || block.actable) {
              block.block.act(player, context, blockConfigs, { width: canvas.width, height: canvas.height }, scene, index, direction);
            }
          });
        } else {
          scene.blocks.forEach((block, index) => {
            if (block === null || block.block instanceof Boosters.Apple || !(block.drawable || !('drawable' in block))) {
              return undefined;
            }

            context.strokeStyle = 'red';
            context.strokeRect(block.position[0]*blockConfigs.size + borderOffsetX, block.position[1]*blockConfigs.size + borderOffsetY, blockConfigs.size, blockConfigs.size);
            
            context.fillStyle = 'rgba(0, 0, 0, 0.6)';
            context.fillRect(block.position[0]*blockConfigs.size + borderOffsetX, block.position[1]*blockConfigs.size + borderOffsetY, blockConfigs.size, blockConfigs.size);
          });
        }
      }
    });

    if ((scenes.find(scene => scene.blocks.some(block => block !== null && block.block instanceof Enemies.Trapper)) || { completed: false }).completed == true) {
      player.immortal = true;
      blockConfigs.background = 'transparent';
    }

    if (player.score >= 5) {
      scenes.find(scene => scene.scene.every((page, index) => page === pages[index])).completed = true;
      
      won = true;
      levelsCompleted += 1;

      player.health = 500 + levelsCompleted*50;
      player.score = 0;
    }

    if (player.health <= 250) {
      blockConfigs.background = `rgba(255, 0, 0, ${ (1 - (player.health)/1000) >= 0.75 ? 0.75 : (1 - (player.health)/1000) })`;
    }

    context.fillStyle = blockConfigs.background;
    context.fillRect(borderOffsetX, borderOffsetY, canvas.width - borderOffsetX, canvas.height - borderOffsetY);

    __renderAxes();

    context.fillStyle = 'red';
    
    player.blocks.forEach(function(block) 
    {
      context.fillRect(block.x, block.y, player.size, player.size);
    });
    
    requestAnimationFrame(loop);
  });
}