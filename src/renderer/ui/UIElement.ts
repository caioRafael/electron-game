import { CanvasRenderer } from "../rendering/CanvasRenderer";
import { RenderSystem } from "../systems/RenderSystem";

export abstract class UIElement {
  private renderSystem?: RenderSystem;

  /**
   * Define o RenderSystem para acesso ao renderer
   * Chamado automaticamente quando o elemento é registrado no RenderSystem
   */
  setRenderSystem(renderSystem: RenderSystem | undefined): void {
    this.renderSystem = renderSystem;
  }

  /**
   * Obtém o CanvasRenderer através do RenderSystem
   */
  protected getRenderer(): CanvasRenderer | undefined {
    return this.renderSystem?.getRenderer();
  }

  abstract update(delta: number): void;
  abstract render(): void;
}
