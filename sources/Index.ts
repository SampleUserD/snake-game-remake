import Blocks from './Blocks/Main.js'
import Boosters from './Boosters/Main.js'
import Enemies from './Enemies/Main.js'

import Functions from './Functions/_Main.js'

import * as Types from './Types/Main.js'

const BASE_PLAYER_HEALTH: number = 500
const EXTREMELY_LOW_HEALTH: number = 250
const SCORES_TO_ACCESS_NEXT_LEVEL = 5
const DEATH_MESSAGES: string[] = [
  `You're dead`, 
  `Ambulance was calling you`, 
  `You should be alive`, 
  `Press OK!`, 
  `Repeat it, press button`, 
  `You're crawling like a boss`, 
  `MMM, delicious snake on da ground!`, 
  `There ain't valley of snake...`, 
  `You should be at next door right now...` 
]

window.onload = function() {
  const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d");
  
  canvas.width = innerHeight;
  canvas.height = innerHeight;

  canvas.style.marginLeft = `${ Math.abs(innerHeight*0.5 - canvas.width) }`;
  
  const direction: Types.Vector = [1, 0]
  const pages: Types.Vector = [0, 0]
  
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
  }

  const blockConfigs = { size: 10, background: 'transparent' }; // 15

  const lengthX = (canvas.width - canvas.width%blockConfigs.size)/blockConfigs.size;
  const lengthY = (canvas.height - canvas.height%blockConfigs.size)/blockConfigs.size;

  const borderOffsetX = (canvas.width - lengthX * blockConfigs.size)/2;
  const borderOffsetY = (canvas.height - lengthY * blockConfigs.size)/2;

  let won = false;

  let player: Types.Player = { 
    blocks: [
      { 
        x: borderOffsetX, 
        y: borderOffsetY 
      }, 
      { 
        x: borderOffsetX+blockConfigs.size, 
        y: borderOffsetY 
      }
    ],
    health: 500, 
    size: blockConfigs.size, 
    score: 0, 
    immortal: false 
  }

  let levelsCompleted = 0;

  const scenes = [];
  const gameConfiguration = { renderAxes: false };

  const startSpeedCoefficient = 30 + (player.blocks.length - 3)*2;
  let speedCoefficient = startSpeedCoefficient;

  function __initializeContext(context: CanvasRenderingContext2D): void 
  {
    const canvas: HTMLCanvasElement = context.canvas

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.font = '20px Helvetica';
    context.textBaseline = 'middle';
    context.textAlign = 'center';
  }

  function __addLevelToPosition0x0(context: CanvasRenderingContext2D)
  {
    const [ lengthX, lengthY ]: Types.Vector = CalculateBlocksLengthsThatFitsOnScreen(context)
    const size: number = GetUnifiedSize()

    for (let blockPosition = 0; blockPosition < lengthX; blockPosition++)
    {
      const scene = __getCurrentScene({ blocks: [], completed: true });

      scene.blocks.push({ 
        position: [ blockPosition, Math.round(lengthY / 4) ], 
        block: new Blocks.Light([], size) 
      })

      scene.blocks.push({ 
        position: [ blockPosition, lengthY - Math.round(lengthY / 4) - 3 ], 
        block: new Blocks.Light([], size) 
      })
    }
  }

  function GetUnifiedSize(): number 
  {
    return blockConfigs.size
  }

  function CalculateBlocksLengthsThatFitsOnScreen(context: CanvasRenderingContext2D): Types.Vector
  {
    const size: number = GetUnifiedSize()
    const width: number = context.canvas.width
    const height: number = context.canvas.height

    return [
      (width - width % size) / size,
      (height - height % size) / size
    ]
  }

  function CalculateBorders(context: CanvasRenderingContext2D): Types.Vector
  {
    const size: number = GetUnifiedSize()
    const width: number = context.canvas.width
    const height: number = context.canvas.height
    const [x, y]: Types.Vector = CalculateBlocksLengthsThatFitsOnScreen(context)

    return [
      (width - x * size) / 2,
      (height - y * size) / 2
    ]
  }

  function MapToPositionOnScreen(context: CanvasRenderingContext2D, position: Types.Vector): Types.Vector
  {
    const size: number = GetUnifiedSize()
    const [x, y]: Types.Vector = CalculateBorders(context)

    return [
      position[0] * size + x, 
      position[1] * size + y
    ]
  }

  function __isSegmentOutOfField(context: CanvasRenderingContext2D, segment: Types.Point): boolean 
  {
    const size: number = GetUnifiedSize()
    const width: number = context.canvas.width
    const height: number = context.canvas.height
    const [x, y]: Types.Vector = CalculateBorders(context)

    return (
      segment.x + size > width - x || 
      segment.x + size < 0 + x || 
      segment.y + size > height - y ||
      segment.y + size < 0 + y
    )
  }

  function __isSegmentTouchesAnother(first: Types.Point, second: Types.Point): boolean
  {
    return Functions.IsSegmentTouchedAnother(player, blockConfigs)(first, second)
  }

  function __parryPlayer(tail: Types.Point)
  {
    Functions.ParryPlayer(borderOffsetX, borderOffsetY, player, direction, canvas, tail)
  }

  function __movePlayer(player: Types.Player, direction: Types.Vector): void 
  {
    // move player()
    Functions.MovePlayer(player, direction)()
  }

  function __goToTheNextLevelIfPlayerWon()
  {
    Functions.GoToTheNextLevelIfPlayerWon(won, direction, pages)()
  }

  function __onPlayerDeath(player: Types.Player)
  {
    Functions.OnPlayerDeath(player, DEATH_MESSAGES)()
  }

  function __renderAxes(context: CanvasRenderingContext2D)
  {
    const [ lengthX, lengthY ]: Types.Vector = CalculateBlocksLengthsThatFitsOnScreen(context)
    const [ borderOffsetX, borderOffsetY ]: Types.Vector = CalculateBorders(context)

    Functions.RenderAxes(context, lengthX, lengthY, borderOffsetX, borderOffsetY, blockConfigs, gameConfiguration)()   
  }

  function __updatePlayerVictory()
  {
    won = __getCurrentScene({ completed: true }).completed;
  }

  function __killPlayerIfItTouchesItself(): void
  {
    Functions.KillPlayerIfItTouchedItself(player, direction, blockConfigs)
  }

  function __renderPlayer(context: CanvasRenderingContext2D, player: Types.Player): void 
  {
    context.fillStyle = 'red';

    player.blocks.forEach(function(block) 
    {
      context.fillRect(block.x, block.y, player.size, player.size);
    })
  }

  function __renderSceneAsItIsIncompleted(context: CanvasRenderingContext2D, scene): void 
  {
    context.fillStyle = `black`;

    __clearInputFromGarbage<any>(scene.blocks).forEach(function(block, index)
    {
      if ('block' in block == false) 
      {
        return undefined;
      }

      const _block = block.block

      _block.setCoordinates(MapToPositionOnScreen(context, _block.position))

      if (block.drawable == true) 
      {
        _block.draw(context, blockConfigs, { width: canvas.width, height: canvas.height });
      }

      if (block.actable == true) 
      {
        _block.act(player, context, blockConfigs, { width: canvas.width, height: canvas.height }, scene, index, direction);
      }
    });
  }

  function __renderSceneAsItIsCompleted(context: CanvasRenderingContext2D, scene): void 
  {
    context.fillStyle = `black`;

    __clearInputFromGarbage<any>(scene.blocks).forEach((block, index) => 
    {
      if (
        block.block instanceof Boosters.Apple ||
        block.drawable == false) 
      {
        return undefined;
      }

      const [x, y]: Types.Vector = MapToPositionOnScreen(context, block.position)
      const size: number = GetUnifiedSize()

      context.strokeStyle = 'red';
      context.strokeRect(x, y, size, size)

      context.fillStyle = 'rgba(0, 0, 0, 0.6)';
      context.fillRect(x, y, size, size)
    });
  }

  function __renderScene(context: CanvasRenderingContext2D, scene): void 
  {
    if (scene.completed == true)
    {
      __renderSceneAsItIsCompleted(context, scene)
    } else 
    {
      __renderSceneAsItIsIncompleted(context, scene)
    }
  }

  function __getCurrentScene(defaultValue: any = undefined): any 
  {
    return scenes.find(x => x.scene.every((coordinate, index: number) => coordinate == pages[index])) || defaultValue
  }

  function __isGarbage<T>(x: T): boolean
  {
    return (x === undefined || x === null)
  }

  function __clearInputFromGarbage<T>(input: T[]): T[] 
  {
    return input.filter(x => __isGarbage<T>(x) == false)
  }

  function __makePlayerImmortalIfThereIsABossBeatedOnTheLevel(player: Types.Player): void 
  {
    const blocks = __clearInputFromGarbage<any>(__getCurrentScene({ blocks: [] }).blocks)

    if (blocks.some(x => x.block instanceof Enemies.Trapper) == true) 
    {
      player.immortal = true;
      blockConfigs.background = 'transparent';
    }
  }

  function __showPlayerHealthOrItsImmortalityOnTheScreen(context: CanvasRenderingContext2D, player: Types.Player): void 
  {
    const x: number = canvas.width / 2
    const y: number = canvas.height / 2

    context.fillStyle = 'red'

    if (player.immortal == true) 
    {
      context.fillText(`You're immortal`, x, y)
    } else 
    {
      context.fillText(`Health remain: ${ player.health }`, x, y)
    }
  }

  function __outputPlayerAbsorbtionInNeededFormat(): string 
  {
    return `${ player.blocks.length - 3 }`
  }

  function __outputPlayerSpeedInNeededFormat(): string
  {
    const START_SPEED: number = 200

    return `${ (START_SPEED + blockConfigs.size - speedCoefficient) / blockConfigs.size }`
  }

  function __showPlayerStatistics(context: CanvasRenderingContext2D, player: Types.Player): void
  {
    const x: number = canvas.width / 2
    const y: number = canvas.height / 2
    const padding: number = 50

    context.fillStyle = 'green'

    context.fillText(`Speed: ${ __outputPlayerSpeedInNeededFormat() } block/second`, x, y + padding);
    context.fillText(`Absorbtion: ${ __outputPlayerAbsorbtionInNeededFormat() } damage`, x, y + 2 * padding);
  }

  function __dependenceAlphaChannelToPlayerHealth(player: Types.Player): number 
  {
    return Math.min(1 - player.health / 1000, 0.75)
  }

  function __showEffectsIfPlayerHasExtremelyLowHealth(context: CanvasRenderingContext2D, player: Types.Player): void 
  {
    if (player.health <= EXTREMELY_LOW_HEALTH) 
    {
      blockConfigs.background = `rgba(255, 0, 0, ${ __dependenceAlphaChannelToPlayerHealth(player) })`

      context.fillStyle = blockConfigs.background
      context.fillRect(borderOffsetX, borderOffsetY, canvas.width - borderOffsetX, canvas.height - borderOffsetY)
    }
  }

  function __showCurrentScenePosition(context: CanvasRenderingContext2D, scene): void 
  {
    const canvas: HTMLCanvasElement = context.canvas
    const position: [number, number] = scene.scene
    const [x, y]: Types.Vector = CalculateBorders(context)

    context.fillStyle = 'black'
    context.fillText(`(${ position[0] }:${ position[1] })`, canvas.width / 2, 10 + y)
  }

  function __renderBackground(context: CanvasRenderingContext2D): void 
  {
    context.fillStyle = 'white'

    context.fillRect(borderOffsetX, borderOffsetY, canvas.width - borderOffsetX * 2, canvas.height - borderOffsetY * 2)
  }

  function __incrementCompletedLevels(): void 
  {
    levelsCompleted = levelsCompleted + 1
  }

  function __markSceneAsCompleted(): void 
  {
    won = __getCurrentScene({ completed: false }).completed = true 

    __incrementCompletedLevels()
  }

  function __onLevelCompleted(player: Types.Player): void 
  {
    const BASE_HEALTH_GROWTH: number = 50

    // APPLES EATEN TO ACCESS NEXT LEVEL
    if (player.score >= SCORES_TO_ACCESS_NEXT_LEVEL) 
    {
      __markSceneAsCompleted()

      player.health = BASE_PLAYER_HEALTH + levelsCompleted * BASE_HEALTH_GROWTH;
      player.score = 0;
    }
  }

  function __onPlayerOutOfField(player: Types.Player): void 
  {
    const tail: Types.Point = player.blocks[player.blocks.length - 1]

    if (__isSegmentOutOfField(context, tail) == true) 
    {
      __parryPlayer(tail)
      __goToTheNextLevelIfPlayerWon()
    }
  }
  
  __initializeContext(context)
  __addLevelToPosition0x0(context)

  requestAnimationFrame(function loop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    if (player.blocks.length > 2) 
    {
      speedCoefficient = startSpeedCoefficient + (player.blocks.length - 3) * 2;
    }

    __movePlayer(player, direction)
    __killPlayerIfItTouchesItself()

    __updatePlayerVictory()

    __onPlayerDeath(player)
    __onLevelCompleted(player)    
    __onPlayerOutOfField(player)
    __makePlayerImmortalIfThereIsABossBeatedOnTheLevel(player)

    __renderBackground(context)
    __renderAxes(context);
    __renderPlayer(context, player)
    __renderScene(context, __getCurrentScene())

    __showCurrentScenePosition(context, __getCurrentScene())
    __showPlayerHealthOrItsImmortalityOnTheScreen(context, player)
    __showPlayerStatistics(context, player)
    __showEffectsIfPlayerHasExtremelyLowHealth(context, player)

    requestAnimationFrame(loop)
  });
}