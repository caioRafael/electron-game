import { Entity } from "./Entity";
import { PhysicsBody } from "../physics/PhysicsBody";

export class Wall extends Entity implements Partial<PhysicsBody> {
    solid: boolean = true;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
    }

    update(delta: number): void {
        // Parede não precisa de atualização
    }

    render(): void {
        const renderer = this.getRenderer();
        if (!renderer) return;
        
        // Desenha a parede na posição atual usando width e height da Entity
        renderer.fillRect(this.x, this.y, this.width, this.height, '#888888');
    }
}