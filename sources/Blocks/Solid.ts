export class SolidBlock {
  coordinates: number[] = []
  size: number = 1
  
  constructor(coordinates, size = 1) {
    this.coordinates = coordinates;
    this.size = size;
  }

  setCoordinates(coordinates) {
    this.coordinates = coordinates;
  }

  draw(context, configs, screen = []) {
    context.fillRect(this.coordinates[0], this.coordinates[1], this.size, this.size);
  }
  
  act(player, context, configs, screen = [], scene, index, direction)  {
    const head = player.blocks[0];

    if (
      head.x >= this.coordinates[0] && 
      head.y >= this.coordinates[1] && 
      head.x <= this.size + this.coordinates[0] && 
      head.y <= this.size + this.coordinates[1]) {
      if (player.immortal) {
        return undefined;
      }
      
      // костыль, заменить на event'ы player'а
      if (player.health % (player.health/player.blocks.length) == 0 && Math.floor(player.health / (player.health/player.blocks.length)) >= 1) {
        player.health -= 1;			

        if (player.blocks.length > 2) {
          player.blocks.splice(player.blocks.length - 2, 1);
        }
      }

      if (Math.random() >= 1 - 0.02) {
        return undefined;
      }

      if (Math.random() >= 1 - 0.25) {
        player.health -= this.size;
      }

      if (player.blocks.length - 3 < 0) {
        player.health -= this.size;
      } else {
        if (Math.random() >= 1 - 0.05) {
          player.health -= 2*(this.size - (player.blocks.length - 3));
        }
      }
      
      if (this.size - (player.blocks.length - 3) >= 1) {
        player.health -= this.size - (player.blocks.length - 3);
      } else {
        player.health -= 1;
      }
    }
  }
}