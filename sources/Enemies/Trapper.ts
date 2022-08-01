import { Sniper } from './Sniper.js'
import { Apple } from '../Boosters/Apple.js'

export class Trapper {
  coordinates: number[] = []
  size: number = 1
  summoned: boolean = false

  constructor(coordinates, size = 1) {
    this.coordinates = coordinates;
    this.size = size;

    this.summoned = false;
  }

  setCoordinates(coordinates) {
    this.coordinates = coordinates;
  }

  draw(context, configs, screen = []) {
    context.fillStyle = 'rgba(0, 0, 0, 0.75)';
    context.fillRect(this.coordinates[0], this.coordinates[1], this.size, this.size);

    context.fillStyle = 'rgba(255, 0, 0, 0.75)';
    context.strokeStyle = 'rgba(255, 0, 0, 0.75)';

    context.strokeRect(this.coordinates[0], this.coordinates[1], this.size, this.size);

    context.fillRect(this.coordinates[0] + configs.size, this.coordinates[1] - configs.size, this.size, this.size);
    context.fillRect(this.coordinates[0] + configs.size, this.coordinates[1], this.size, this.size);
    context.fillRect(this.coordinates[0] + configs.size, this.coordinates[1] + configs.size, this.size, this.size);

    context.fillRect(this.coordinates[0], this.coordinates[1] + configs.size, this.size, this.size);
    context.fillRect(this.coordinates[0] + configs.size, this.coordinates[1] + configs.size, this.size, this.size);
    context.fillRect(this.coordinates[0] - configs.size, this.coordinates[1] + configs.size, this.size, this.size);
  }

  
  act(player, context, configs, screen = { width: 0, height: 0 }, scene, index)  {
    const head = player.blocks[0];

    if (!(player.blocks.length >= 6)) {
      return undefined;
    }

    if (!this.summoned && head.x + player.size >= this.coordinates[0] && head.y + player.size >= this.coordinates[1] && head.x <= this.size + this.coordinates[0] && head.y <= this.size + this.coordinates[1]) {
      player.health -= player.health/4 + this.size;
      let startTime = Date.now();

      scene.blocks[index].drawable = false;
      const currentBlock = scene.blocks[index];

      const maximalCount = (screen.width - screen.width%configs.size)/configs.size;

      scene.blocks.splice(index -1, 0, { position:  [this.coordinates[0]/configs.size + Math.round(maximalCount/4), this.coordinates[1]/configs.size + Math.round(maximalCount/4)], block: new Apple([], configs.size) });

      const createInvicibleSnipers = ((counter) => {
        if (counter > maximalCount) {
          return undefined;
        }

        const block = Object.assign({}, currentBlock);
        
        let invicibleSniper = new Sniper([], configs.size/2);
        // invicibleSniper.act(player, context, configs, screen);

        block.block = invicibleSniper;
        block.position = [counter, counter];

        scene.blocks.splice(index + counter, 0, block);

        if (counter < maximalCount) {
          createInvicibleSnipers(counter + 1);
        }
      });

      setTimeout(() => {
        for (let index = 0; index < 3; index++) {
          createInvicibleSnipers(0);
        }
      }, 500);

      this.summoned = true;
      configs.background = 'rgba(100, 225, 0, 0.5)';
    }
  }
}