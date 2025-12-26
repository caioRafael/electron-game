import { UIElement } from "./UIElement";

export class DebugFPS extends UIElement {
  private fps = 0;
  private acc = 0;
  private frames = 0;

  update(delta: number): void {
    this.acc += delta;
    this.frames++;

    if (this.acc >= 1) {
      this.fps = this.frames;
      this.frames = 0;
      this.acc = 0;
    }
  }

  render(): void {
    const renderer = this.getRenderer();
    if (!renderer) return;
    // Usa verticalAlign: 'top' para posicionar o texto a partir do topo, evitando corte
    renderer.drawText(`FPS: ${this.fps}`, 10, 10, {
      font: "16px Arial", 
      color: "#00ff00",
      verticalAlign: 'top',
      horizontalAlign: 'left'
    });
  }
}
