import { Entity } from "./Entity";
import { CanvasRenderer } from "../rendering/CanvasRenderer";
import { PhysicsBody } from "../physics/PhysicsBody";

export class Wall extends Entity implements Partial<PhysicsBody> {
    solid: boolean = true;
    private renderer: CanvasRenderer;

    constructor(renderer: CanvasRenderer, x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
        this.renderer = renderer;
    }

    update(delta: number): void {
        // Parede não precisa de atualização
    }

    render(): void {
        // Desenha a parede na posição atual usando width e height da Entity
        this.renderer.fillRect(this.x, this.y, this.width, this.height, '#888888');
    }
}