import { UIElement } from "./UIElement";

export class PauseMenu extends UIElement {
    private visible: boolean = false;

    update(delta: number): void {
        // Menu de pausa não precisa de atualização lógica
    }

    render(): void {
        if (!this.visible) return;

        const renderer = this.getRenderer();
        if (!renderer) return;

        const canvas = renderer.getCanvas();
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Fundo semi-transparente escuro
        renderer.save();
        renderer.fillRect(0, 0, canvas.width, canvas.height, 'rgba(0, 0, 0, 0.7)');
        renderer.restore();

        // Título "PAUSADO"
        renderer.save();
        renderer.setTextAlign('center');
        renderer.drawText('PAUSADO', centerX, centerY - 60, {
            font: '48px Arial',
            color: '#ffffff',
            verticalAlign: 'middle',
            horizontalAlign: 'center'
        });
        renderer.restore();

        // Instruções
        renderer.save();
        renderer.setTextAlign('center');
        renderer.drawText('Pressione ESC para continuar', centerX, centerY + 20, {
            font: '20px Arial',
            color: '#cccccc',
            verticalAlign: 'middle',
            horizontalAlign: 'center'
        });
        renderer.restore();
    }

    show(): void {
        this.visible = true;
    }

    hide(): void {
        this.visible = false;
    }

    isVisible(): boolean {
        return this.visible;
    }

    toggle(): void {
        this.visible = !this.visible;
    }
}

