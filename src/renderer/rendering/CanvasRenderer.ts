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
    
    drawText(text: string, x: number, y: number, options: {font?: string, color?: string, verticalAlign?: 'top' | 'middle' | 'bottom', horizontalAlign?: 'left' | 'center' | 'right'}): void {
      // Salva o estado atual do contexto
      this.ctx.save();

      if(options.font) this.ctx.font = options.font;
      if(options.color) this.ctx.fillStyle = options.color;

      // Configura alinhamento horizontal
      if(options.horizontalAlign) {
        this.ctx.textAlign = options.horizontalAlign;
      } else {
        this.ctx.textAlign = 'left';
      }

      // Configura alinhamento vertical usando textBaseline
      if(options.verticalAlign) {
        switch(options.verticalAlign) {
          case 'top':
            // Usa 'top' para que Y seja o topo do texto
            this.ctx.textBaseline = 'top';
            break;
          case 'middle':
            // Usa 'middle' para que Y seja o centro do texto
            this.ctx.textBaseline = 'middle';
            break;
          case 'bottom':
            // Usa 'alphabetic' (padrão) para que Y seja a linha de base
            this.ctx.textBaseline = 'alphabetic';
            break;
        }
      } else {
        this.ctx.textBaseline = 'alphabetic';
      }

      this.ctx.fillText(text, x, y);
      
      // Restaura o estado anterior
      this.ctx.restore();
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

    translate(x: number, y: number): void {
      this.ctx.translate(x, y);
    }

    setTextAlign(align: CanvasTextAlign): void {
      this.ctx.textAlign = align;
    }

    fillRect(x: number, y: number, width: number, height: number, color?: string): void {
      if (color) {
        this.ctx.fillStyle = color;
      }
      this.ctx.fillRect(x, y, width, height);
    }
}