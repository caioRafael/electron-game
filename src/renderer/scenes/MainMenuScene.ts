import { Scene } from "../engine/Scene";
import { CanvasRenderer } from "../rendering/CanvasRenderer";
import { InputSystem } from "../systems/InputSystem";
import { Game } from "../engine/Game";

export class MainMenuScene implements Scene {
    game?: Game;
    private renderer: CanvasRenderer;
    constructor(renderer: CanvasRenderer){
        this.renderer = renderer;
    }


    /**
     * Chamado quando a cena entra em execução
     */
    onEnter(): void {
        console.log('MainMenuScene: onEnter');
    }

    /**
     * Chamado quando a cena é removida
     */
    onExit(): void {
        console.log('MainMenuScene: onExit');
    }

    /**
     * Atualização lógica (inputs, animações, timers)
     */
    update(delta: number): void {
        const input = this.game?.getSystems(InputSystem)?.getState();

        if(input?.isPressed('Enter')) {
            console.log('Enter pressed');
        }
    }

    /**
     * Renderização gráfica
     */
    render(): void {
        this.renderer.clear('#1e1e1e'); // Limpa com cor de fundo
        this.drawTitle();
        this.drawOptions();
      }
    
      private drawTitle(): void {
        const canvas = this.renderer.getCanvas();
        const text = 'Meu Jogo';
        const font = '48px Arial';
        const textWidth = this.renderer.measureText(text, font).width;
        const centerX = canvas.width / 2;
        const x = centerX - textWidth / 2;
        this.renderer.drawText(text, x, 150, {
          font: font,
          color: '#ffffff',
        });
      }
      private drawOptions(): void {
        const canvas = this.renderer.getCanvas();
        const text = 'Pressione ENTER para iniciar';
        const font = '20px Arial';
        const centerX = canvas.width / 2;
        this.renderer.save();
        // Ajusta alinhamento para centralizar pelo eixo x
        this.renderer.setTextAlign('center');
        this.renderer.drawText(text, centerX, 300, {
          font: font,
          color: '#ffffff',
        });
        this.renderer.restore();
      }
}