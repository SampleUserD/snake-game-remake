import { Block } from '../Blocks/Base.js'

export class Sniper {
  coordinates: number[] = []
  velocity: number = 1
  bullet: Block | null = null 
  playerDirection: (number | null)[] = []
  previousBulletStates: number[][] = []
  
  constructor(coordinates, velocity = 1) {
    this.coordinates = coordinates;
    this.velocity = velocity;

    this.bullet = new Block([]);
    this.playerDirection = [null, null];

    this.previousBulletStates = [[0, 0]];

    // this.bullets = [[null, null]];
  }

  setCoordinates(coordinates) {
    this.coordinates = coordinates;
  }

  draw(context, configs, screen = { width: 0, height: 0 }) {
    context.fillStyle = 'black';
    context.fillRect(this.coordinates[0], this.coordinates[1], configs.size, configs.size);
    context.fillRect(this.coordinates[0] + configs.size, this.coordinates[1], configs.size/4, configs.size);
    context.fillRect(this.coordinates[0] - configs.size/4, this.coordinates[1], configs.size/4, configs.size);
    context.fillRect(this.coordinates[0], this.coordinates[1] + configs.size, configs.size, configs.size/4);
    context.fillRect(this.coordinates[0], this.coordinates[1] - configs.size/4, configs.size, configs.size/4);
  }

  act(player, context, configs, screen = { width: 0, height: 0 })  {
    if(this.playerDirection.every(direction => direction == null)) {
      this.playerDirection[0] = player.blocks[0].x;
      this.playerDirection[1] = player.blocks[1].y;
    }

    if (this.bullet.coordinates.every(coordinate => coordinate === 0)) {
      this.bullet.setCoordinates(this.coordinates);
      this.bullet.size = (configs.size);
    }

    // this.bullet.size += 1;

    this.previousBulletStates[0] = Object.assign([], this.bullet.coordinates);

    const hypot = Math.sqrt((this.playerDirection[0] - this.coordinates[0])**2 + (this.playerDirection[1] - this.coordinates[1])**2);

    this.bullet.coordinates[0] += this.velocity*((this.playerDirection[0] - this.coordinates[0])/hypot);
    this.bullet.coordinates[1] += this.velocity*((this.playerDirection[1] - this.coordinates[1])/hypot);
    // this.bulletDirection[1] += 0.1;
    
    // console.log(this.bulletDirection)

    if (this.bullet.coordinates[0] <= 0 || this.bullet.coordinates[0] >= screen.width) {
      this.bullet.coordinates[0] = 0;
      this.playerDirection[0] =  null;

      // this.bullet.size = configs.size;
    }

    if (this.bullet.coordinates[1] <= 0 ||this.bullet.coordinates[1] >= screen.height) {
      this.bullet.coordinates[1] = 0;
      this.playerDirection[1] = null;

      // this.bullet.size = configs.size;
    }

    if (this.previousBulletStates[0].some((coordinate, index) => coordinate === this.bullet.coordinates[index])) {
      this.bullet.setCoordinates([ this.coordinates[0], this.coordinates[1] ]);
      this.playerDirection[0] =  null;
      this.playerDirection[1] =  null;
    }

    context.fillStyle = 'black';
    this.bullet.act(player, context, configs, screen, {}, 0, []);
    this.bullet.draw(context, configs, screen);
  }
}