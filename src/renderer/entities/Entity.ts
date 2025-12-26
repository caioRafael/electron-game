import { CanvasRenderer } from "../rendering/CanvasRenderer";
import { RenderSystem } from "../systems/RenderSystem";

export abstract class Entity {
    x: number;
    y: number;
    width: number;
    height: number;
    private renderSystem?: RenderSystem;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /**
     * Define o RenderSystem para acesso ao renderer
     * Chamado automaticamente quando a entidade é registrada no RenderSystem
     */
    setRenderSystem(renderSystem: RenderSystem): void {
        this.renderSystem = renderSystem;
    }

    /**
     * Obtém o CanvasRenderer através do RenderSystem
     */
    protected getRenderer(): CanvasRenderer | undefined {
        return this.renderSystem?.getRenderer();
    }

    //metodos de uodate e render temporários
    abstract update(delta: number): void;
    abstract render(): void;
}