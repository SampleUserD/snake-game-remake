export class LightBlock {
  coordinates: number[] = []
  size: number = 1

  constructor(coordinates, size = 1) {
    this.coordinates = coordinates;
    this.size = size;

    // this.bullets = [[null, null]];
  }

  setCoordinates(coordinates) {
    this.coordinates = coordinates;
  }

  draw(context, configs, screen = []) {
    context.fillStyle = 'rgba(0, 0, 0, 0.75)';
    context.fillRect(this.coordinates[0], this.coordinates[1], this.size, this.size);
  }

  
  act(player, context, configs, screen = [], scene, index)  {
    const head = player.blocks[0];

    if (head.x + player.size >= this.coordinates[0] && head.y + player.size >= this.coordinates[1] && head.x <= this.size + this.coordinates[0] && head.y <= this.size + this.coordinates[1]) {
      scene.blocks[index] = null;
    }
  }
}