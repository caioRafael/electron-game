export class CanvasRenderer {
    private ctx: CanvasRenderingContext2D;
    protected canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const context = canvas.getContext('2d');
        if(!context) throw new Error('Failed to get canvas context');
        this.ctx = context;
    }

    getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    clear(color?: string): void {
        if (color) {
            this.ctx.fillStyle = color;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    render(): void {
        // Implement in subclass
    }
    
    drawText(text: string, x: number, y: number, options: {font?: string, color?: string}): void {
      if(options.font) this.ctx.font = options.font;
      if(options.color) this.ctx.fillStyle = options.color;

      this.ctx.fillText(text, x, y);
    }

    measureText(text: string, font?: string): TextMetrics {
      if (font) {
        this.ctx.font = font;
      }
      return this.ctx.measureText(text);
    }

    save(): void {
      this.ctx.save();
    }

    restore(): void {
      this.ctx.restore();
    }

    setTextAlign(align: CanvasTextAlign): void {
      this.ctx.textAlign = align;
    }
}