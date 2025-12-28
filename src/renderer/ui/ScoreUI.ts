import { UIElement } from "./UIElement";

export class ScoreUI extends UIElement {
    private score: number = 0;

    update(delta: number): void {
        // Score não precisa de atualização por frame
    }

    render(): void {
        const renderer = this.getRenderer();
        if (!renderer) return;
        
        const canvas = renderer.getCanvas();
        
        // Renderiza a pontuação no canto superior direito
        renderer.drawText(`Pontos: ${this.score}`, canvas.width - 10, 10, {
            font: "24px Arial",
            color: "#ffffff",
            verticalAlign: 'top',
            horizontalAlign: 'right'
        });
    }

    /**
     * Adiciona pontos à pontuação
     */
    addPoints(points: number): void {
        this.score += points;
    }

    /**
     * Obtém a pontuação atual
     */
    getScore(): number {
        return this.score;
    }

    /**
     * Reseta a pontuação
     */
    reset(): void {
        this.score = 0;
    }
}

