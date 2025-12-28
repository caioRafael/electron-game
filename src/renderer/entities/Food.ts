import { PhysicsBody } from "../physics/PhysicsBody";
import { Entity } from "./Entity";
import { ColliderType } from "../physics/ColliderType";

export class Food extends Entity implements Partial<PhysicsBody> {
    colliderType: ColliderType = ColliderType.TRIGGER;

    constructor(x: number, y: number) {
        super(x, y, 30, 30); // Comida de 30x30 pixels
    }

    update(delta: number): void {
        // Comida não precisa de atualização
    }

    render(): void {
        const renderer = this.getRenderer();
        if (!renderer) return;
        
        // Desenha a comida como um círculo amarelo (maçã)
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const radius = this.width / 2;
        
        // Usa o contexto do renderer para desenhar círculo
        const ctx = renderer.getContext();
        if (ctx) {
            ctx.save();
            
            // Desenha o círculo principal (dourado/amarelo)
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Adiciona um pequeno detalhe verde no topo (caule)
            ctx.fillStyle = '#228B22';
            ctx.fillRect(centerX - 2, centerY - radius - 3, 4, 6);
            
            ctx.restore();
        }
    }
}

