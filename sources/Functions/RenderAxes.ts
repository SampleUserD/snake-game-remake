export const RenderAxes = (function(
    context: CanvasRenderingContext2D, 
    lengthX: number, 
    lengthY: number, 
    borderOffsetX: number, 
    borderOffsetY: number, 
    blockConfigs,
    gameConfiguration) 
{
  return (function()
  {
    if (gameConfiguration.drawAxes) 
    { 
      const canvas: HTMLCanvasElement = context.canvas;

      context.beginPath();
      context.strokeStyle = 'black';

      for (let x = 0; x < 2 * lengthX; x++) 
      {
        if (2*borderOffsetX + x * blockConfigs.size > canvas.width) {
          break;
        }

        context.moveTo(borderOffsetX + x * blockConfigs.size, borderOffsetY);
        context.lineTo(borderOffsetX + x * blockConfigs.size, canvas.height - borderOffsetY);
      }

      for (let y = 0; y < 2 * lengthY; y++) 
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
  })
})