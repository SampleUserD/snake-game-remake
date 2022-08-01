import { Block } from '../Blocks/Base.js'

export class Apple {
  originCoordinates: (number | undefined)[] = []
  block: Block | null = null

  constructor(coordinates, size = 1) {
    this.block = new Block(coordinates || [], size);
    this.originCoordinates = [];
  }

  setCoordinates(coordinates) {
    if (this.originCoordinates.every(coordinate => coordinate === undefined)) {
      this.block.setCoordinates(coordinates);
      this.originCoordinates = [coordinates[0], coordinates[1]];
    }

    if (coordinates.every((coordinate, index) => coordinate !== this.originCoordinates[index])) {
      this.block.setCoordinates(coordinates);
    }
  }

  draw(context, configs, screen = { width: 0, height: 0 }) {
    context.fillStyle = 'green';
    this.block.draw(context, configs, screen);
  }

  
  act(player, context, configs, screen = { width: 0, height: 0 }, scene, index)  {
    const head = player.blocks[0];

    if (head.x + player.size >= this.block.coordinates[0] && head.y + player.size >= this.block.coordinates[1] && head.x <= this.block.size + this.block.coordinates[0] && head.y <= this.block.size + this.block.coordinates[1]) {
      const generateRandomPosition = () => {
        let appleX = Math.random()*screen.width;
        let appleY = Math.random()*screen.height;

        appleX = (screen.width%configs.size)/2 + appleX - appleX%configs.size;
        appleY = (screen.height%configs.size)/2 + appleY - appleY%configs.size;

        if (appleX >= screen.width - (screen.width%configs.size)/2 || appleY >= screen.height - (screen.width%configs.size)/2 || appleX <= (screen.width%configs.size)/2 || appleY <= (screen.width%configs.size)/2) {
          return generateRandomPosition();
        }
        
        if (!scene.blocks.find(block => block !== null && block.position[0] == (appleX - appleX%configs.size)/configs.size && block.position[1] == (appleY - appleY%configs.size)/configs.size)) {
          this.setCoordinates([ appleX, appleY ]);
        } else {
          return generateRandomPosition();
        }

        player.score += 1;

        if (player.health <= 500 - player.size) {
          player.health += player.size;
        }
      };

      player.blocks.push({ x: player.blocks[0].x, y: player.blocks[1].y });
      generateRandomPosition();
    }
  }
}