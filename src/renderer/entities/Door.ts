import { PhysicsBody } from "../physics/PhysicsBody";
import { Entity } from "./Entity";
import { ColliderType } from "../physics/ColliderType";

export class Door extends Entity implements Partial<PhysicsBody> {
    colliderType: ColliderType = ColliderType.TRIGGER;

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
        renderer.fillRect(this.x, this.y, this.width, this.height, '#8B4513'); // Porta marrom
    }

    onTrigger?(other: Partial<PhysicsBody>): void {
        console.log('Player colidiu com a porta');
    }
}