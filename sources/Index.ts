import Blocks from './Blocks/Main.js'
import Boosters from './Boosters/Main.js'
import Enemies from './Enemies/Main.js'

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

class MovementStates 
{
  public static readonly Left: Types.Vector = [-1, 0]
  public static readonly Right: Types.Vector = [1, 0]
  public static readonly Up: Types.Vector = [0, -1]
  public static readonly Down: Types.Vector = [0, 1]
  public static readonly Stop: Types.Vector = [0, 0]
}

window.onload = function() 
{
  const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d");
  
  const direction: Types.Vector = [1, 0]
  const pages: Types.Vector = [0, 0]
  
  window.onkeydown = function(event: KeyboardEvent) 
  {
    let code = event.code.toLowerCase().replace('key', new String().toString());
    
    if (code == 'a' && MatchesCurrentMovementState(MovementStates.Right) == false) 
    {
      SetMovementState(MovementStates.Left)
    }
    
    if (code == 'd' && MatchesCurrentMovementState(MovementStates.Left) == false) 
    {
      SetMovementState(MovementStates.Right)
    }
    
    if (code == 'w' && MatchesCurrentMovementState(MovementStates.Down) == false) 
    {
      SetMovementState(MovementStates.Up)
    }
    
    if (code == 's' && MatchesCurrentMovementState(MovementStates.Up) == false) 
    {
      SetMovementState(MovementStates.Down)
    }

    if (code == 'space') 
    {
      SetMovementState(MovementStates.Stop)
    }
  }

  const blockConfigs = { size: 10, background: 'transparent' } // 15
  const gameConfiguration = { renderAxes: false }
 
  let won = false
  let levelsCompleted = 0

  const player: Types.Player = { 
    blocks: [],

    health: BASE_PLAYER_HEALTH, 
    size: GetUnifiedSize(), 
    score: 0, 
    
    immortal: false 
  }

  const scenes = [];
  const startSpeedCoefficient = 30 + (player.blocks.length - 3)*2;
  
  let speedCoefficient = startSpeedCoefficient;

  // ---------------------- Initialization ---------------------- 

  function InitializeContext(context: CanvasRenderingContext2D): void 
  {
    const canvas: HTMLCanvasElement = context.canvas
    
    canvas.width = innerHeight
    canvas.height = innerHeight
  
    canvas.style.marginLeft = `${ Math.abs(innerHeight*0.5 - canvas.width) }`

    context.clearRect(0, 0, canvas.width, canvas.height)

    context.font = '20px Helvetica'
    context.textBaseline = 'middle'
    context.textAlign = 'center'
  }

  function AddLevelToPosition0x0(context: CanvasRenderingContext2D)
  {
    const [ lengthX, lengthY ]: Types.Vector = CalculateBlocksLengthsThatFitsOnScreen(context)
    const size: number = GetUnifiedSize()

    const scene = GetCurrentScene({ scene: [0, 0], blocks: [], completed: false });

    for (let blockPosition = 0; blockPosition < lengthX; blockPosition++)
    {
      scene.blocks.push({ 
        position: [ blockPosition, Math.round(lengthY / 4) ], 
        block: new Blocks.Light([], size) 
      })

      scene.blocks.push({ 
        position: [ blockPosition, lengthY - Math.round(lengthY / 4) - 3 ], 
        block: new Blocks.Light([], size) 
      })
    }

    scenes.push(scene)
  }

  function ConfiguratePlayer(player: Types.Player, context: CanvasRenderingContext2D): void 
  {
    const [x, y]: Types.Vector = CalculateBorders(context)
    const size: number = GetUnifiedSize()

    player.blocks.push({ x: x + 0 * size, y: y })
    player.blocks.push({ x: x + 1 * size, y: y })
    player.blocks.push({ x: x + 2 * size, y: y })
  }

  // ---------------------- Initialization ----------------------

  // ------------------------ Global state changers ------------------------

  function SetMovementState(_direction: Types.Vector): void 
  {
    direction[0] = _direction[0]
    direction[1] = _direction[1]
  }

  function IncrementCompletedLevels(): void 
  {
    levelsCompleted = levelsCompleted + 1
  }

  function MarkSceneAsCompleted(): void 
  {
    UpdatePlayerVictory()
    IncrementCompletedLevels()
  }

  function ChangeBackgroundTo(context: CanvasRenderingContext2D, backgroundColor: string): void 
  {
    const width: number = context.canvas.width
    const height: number = context.canvas.height
    const [x, y]: Types.Vector = CalculateBorders(context)

    blockConfigs.background = backgroundColor

    context.fillStyle = backgroundColor
    context.fillRect(x, y, width - x, height - y)
  }
  
  function UpdatePlayerVictory()
  {
    won = IsCurrentSceneCompleted();
  }

  // ------------------------ Global state changers ------------------------

  // ------------------------- Global state readers ------------------------

  function GetUnifiedSize(): number 
  {
    return blockConfigs.size
  }

  function GetCurrentScenePosition(): [number, number]
  {
    return Array.from(pages) as [number, number]
  }

  function GetLevelsCompletedCount(): number 
  {
    return levelsCompleted as number
  }
  
  function GetCurrentScene(defaultValue: any = undefined): any 
  {
    return ClearInputFromGarbage<any>(scenes).find(x => x.scene.every((coordinate, index: number) => coordinate == pages[index])) || defaultValue
  }

  function IsCurrentSceneCompleted(): boolean
  {
    const scene = GetCurrentScene({ completed: true })

    return scene.completed
  }

  function MatchesCurrentMovementState(state: Types.Vector): boolean
  {
    return state.every((x: number, i: number) => direction[i] == x)
  }

  // ------------------------- Global state readers ------------------------

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

  function IsSegmentOutOfField(context: CanvasRenderingContext2D, segment: Types.Point): boolean 
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

  function IsSegmentTouchesAnother(first: Types.Point, second: Types.Point): boolean
  {
    const size: number = GetUnifiedSize()

    return (
      first.x + size > second.x && 
      first.y + size > second.y && 
      first.x < second.x + size && 
      first.y < second.y + size
    )
  }

  function ParryPlayer(player: Types.Player, direction: Types.Vector, context: CanvasRenderingContext2D)
  {
    const head: Types.Point = player.blocks[0]
    const tail: Types.Point = player.blocks[player.blocks.length - 1]
   
    const width: number = context.canvas.width
    const height: number = context.canvas.height
    const [x, y]: Types.Vector = CalculateBorders(context)

    if (tail.x > width - x)
    {
      tail.x = 0 + x
    } 
    else if (tail.x < 0 + x)
    {
      tail.x = width - x
    } 
    else if (tail.y > height - y)
    {
      tail.y = 0 + y
    } 
    else if (tail.y < 0 + y)
    {
      tail.y = height - y
    }
  }

  function MovePlayer(player: Types.Player, direction: Types.Vector): void 
  {
    // move player()
    const tail: Types.Point = player.blocks.splice(player.blocks.length - 1, 1)[0]
    const head: Types.Point = player.blocks[0]
    const size: number = GetUnifiedSize()

    tail.x = head.x + direction[0] * size
    tail.y = head.y + direction[1] * size

    player.blocks.unshift(tail)
  }

  function GoToTheNextLevelIfPlayerWon()
  {
    if (IsCurrentSceneCompleted() == false)
    {
      return undefined
    }

    // on next page ()
    pages[0] += direction[0]
    pages[1] += direction[1]
  }

  function OnPlayerDeath(player: Types.Player)
  {
    if (player.health <= 0) 
    {
      alert(DEATH_MESSAGES[Math.floor(Math.random() * DEATH_MESSAGES.length)]);
      window.location.reload();

      return undefined;
    }
  }

  function RenderAxes(context: CanvasRenderingContext2D)
  {
    const lengths: Types.Vector = CalculateBlocksLengthsThatFitsOnScreen(context)
    const offsets: Types.Vector = CalculateBorders(context)
    
    const width: number = context.canvas.width
    const height: number = context.canvas.height
    const size: number = GetUnifiedSize()

    context.beginPath()
    context.strokeStyle = 'black'

    for (let x = 0; x < lengths[0]; x++) 
    {
      context.moveTo(offsets[0] + x * size, offsets[1])
      context.lineTo(offsets[0] + x * size, height - offsets[1])
    }

    for (let y = 0; y < lengths[1]; y++) 
    {
      context.moveTo(offsets[0], offsets[1] + y * size)
      context.lineTo(width - offsets[0], offsets[1] + y * size)
    }

    context.stroke()
    context.beginPath()
  }

  function KillPlayer(player: Types.Player): void 
  {
    player.health = -1
  }

  function KillPlayerIfItTouchesItself(player: Types.Player): void
  {
    const head: Types.Point = player.blocks[0]
    const isStoped: boolean = MatchesCurrentMovementState(MovementStates.Stop)
    const isImmortal: boolean = player.immortal

    if (isStoped == true || isImmortal == true)
    {
      return undefined
    }

    for (let index = 1; index < player.blocks.length; index++)
    {
      const segment: Types.Point = player.blocks[index];

      if (IsSegmentTouchesAnother(head, segment) == true)
      {
        KillPlayer(player)
      }
    }
  }

  function RenderPlayer(context: CanvasRenderingContext2D, player: Types.Player): void 
  {
    context.fillStyle = 'red';

    player.blocks.forEach(function(block) 
    {
      context.fillRect(block.x, block.y, player.size, player.size);
    })
  }

  function RenderSceneAsItIsIncompleted(context: CanvasRenderingContext2D, scene): void 
  {
    context.fillStyle = `black`;

    ClearInputFromGarbage<any>(scene.blocks).forEach(function(block, index)
    {
      if ('block' in block == false) 
      {
        return undefined;
      }

      const _block = block.block

      _block.setCoordinates(MapToPositionOnScreen(context, block.position))

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

  function RenderSceneAsItIsCompleted(context: CanvasRenderingContext2D, scene): void 
  {
    context.fillStyle = `black`;

    ClearInputFromGarbage<any>(scene.blocks).forEach((block, index) => 
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

  function RenderScene(context: CanvasRenderingContext2D, scene): void 
  {
    if (scene.completed == true)
    {
      RenderSceneAsItIsCompleted(context, scene)
    } else 
    {
      RenderSceneAsItIsIncompleted(context, scene)
    }
  }

  function IsGarbage<T>(x: T): boolean
  {
    return (x === undefined || x === null)
  }

  function ClearInputFromGarbage<T>(input: T[]): T[] 
  {
    return input.filter(x => IsGarbage<T>(x) == false)
  }

  function MakePlayerImmortalIfThereIsABossBeatedOnTheLevel(player: Types.Player): void 
  {
    const blocks = ClearInputFromGarbage<any>(GetCurrentScene({ blocks: [] }).blocks)

    if (blocks.some(x => x.block instanceof Enemies.Trapper) == true && IsCurrentSceneCompleted() == true) 
    {
      player.immortal = true
      ChangeBackgroundTo(context, 'transparent')
    }
  }

  function ShowPlayerHealthOrItsImmortalityOnTheScreen(context: CanvasRenderingContext2D, player: Types.Player): void 
  {
    const x: number = context.canvas.width / 2
    const y: number = context.canvas.height / 2

    context.fillStyle = 'red'

    if (player.immortal == true) 
    {
      context.fillText(`You're immortal`, x, y)
    } else 
    {
      context.fillText(`Health remain: ${ player.health }`, x, y)
    }
  }

  function OutputPlayerAbsorbtionInNeededFormat(): string 
  {
    return `${ player.blocks.length - 3 }`
  }

  function OutputPlayerSpeedInNeededFormat(): string
  {
    const START_SPEED: number = 200

    return `${ (START_SPEED + blockConfigs.size - speedCoefficient) / blockConfigs.size }`
  }

  function ShowPlayerStatistics(context: CanvasRenderingContext2D, player: Types.Player): void
  {
    const x: number = context.canvas.width / 2
    const y: number = context.canvas.height / 2
    const padding: number = 50

    context.fillStyle = 'green'

    context.fillText(`Speed: ${ OutputPlayerSpeedInNeededFormat() } block/second`, x, y + padding);
    context.fillText(`Absorbtion: ${ OutputPlayerAbsorbtionInNeededFormat() } damage`, x, y + 2 * padding);
  }

  function DependenceAlphaChannelToPlayerHealth(player: Types.Player): number 
  {
    return Math.min(1 - player.health / 1000, 0.75)
  }

  function ShowEffectsIfPlayerHasExtremelyLowHealth(context: CanvasRenderingContext2D, player: Types.Player): void 
  {
    if (player.health <= EXTREMELY_LOW_HEALTH) 
    {
      ChangeBackgroundTo(context, `rgba(255, 0, 0, ${ DependenceAlphaChannelToPlayerHealth(player) })`)
    }
  }

  function ShowCurrentScenePosition(context: CanvasRenderingContext2D, scene): void 
  {
    const canvas: HTMLCanvasElement = context.canvas
    const position: [number, number] = scene.scene
    const [x, y]: Types.Vector = CalculateBorders(context)

    context.fillStyle = 'black'
    context.fillText(`(${ position[0] }:${ position[1] })`, canvas.width / 2, 10 + y)
  }

  function RenderBackground(context: CanvasRenderingContext2D): void 
  {
    const width: number = context.canvas.width
    const height: number = context.canvas.height
    const [x, y]: Types.Vector = CalculateBorders(context)

    context.fillStyle = 'white'

    context.fillRect(x, y, width - x * 2, height - y * 2)
  }

  function OnLevelCompleted(player: Types.Player): void 
  {
    const BASE_HEALTH_GROWTH: number = 50

    // APPLES EATEN TO ACCESS NEXT LEVEL
    if (player.score >= SCORES_TO_ACCESS_NEXT_LEVEL) 
    {
      MarkSceneAsCompleted()

      player.health = BASE_PLAYER_HEALTH + GetLevelsCompletedCount() * BASE_HEALTH_GROWTH;
      player.score = 0;
    }
  }

  function OnPlayerOutOfField(player: Types.Player): void 
  {
    const tail: Types.Point = player.blocks[player.blocks.length - 1]

    if (IsSegmentOutOfField(context, tail) == true) 
    {
      ParryPlayer(player, direction, context)
      GoToTheNextLevelIfPlayerWon()
    }
  }
  
  InitializeContext(context)
  AddLevelToPosition0x0(context)
  ConfiguratePlayer(player, context)

  requestAnimationFrame(function loop() 
  {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    if (player.blocks.length > 2) 
    {
      speedCoefficient = startSpeedCoefficient + (player.blocks.length - 3) * 2;
    }

    MovePlayer(player, direction)
    KillPlayerIfItTouchesItself(player)

    UpdatePlayerVictory()

    OnPlayerDeath(player)
    OnLevelCompleted(player)    
    OnPlayerOutOfField(player)
    MakePlayerImmortalIfThereIsABossBeatedOnTheLevel(player)

    RenderBackground(context)
    RenderAxes(context);
    RenderPlayer(context, player)
    RenderScene(context, GetCurrentScene())

    ShowCurrentScenePosition(context, GetCurrentScene())
    ShowPlayerHealthOrItsImmortalityOnTheScreen(context, player)
    ShowPlayerStatistics(context, player)
    ShowEffectsIfPlayerHasExtremelyLowHealth(context, player)

    requestAnimationFrame(loop)
  })
}