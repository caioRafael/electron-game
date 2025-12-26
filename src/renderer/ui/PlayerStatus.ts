import { Player } from "../entities/Player";
import { UIElement } from "./UIElement";

export class PlayerStatus extends UIElement {
    private player: Player;

    constructor(player: Player) {
        super();
        this.player = player;
    }

    update(delta: number): void {
        // PlayerStatus não precisa de atualização
    }
    
    render(): void {
        const renderer = this.getRenderer();
        if (!renderer) return;
        // Calcula a velocidade média (media dos módulos de vx e vy)
        const speed = this.player.vx + this.player.vy;
        renderer.drawText(`Velocidade média: ${speed.toFixed(2)}`, renderer.getCanvas().width - 10, 10, {
            font: "16px Arial", 
            color: "#00ff00",
            verticalAlign: 'top',
            horizontalAlign: 'right'
        });
    }
}