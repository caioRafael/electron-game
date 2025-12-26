import { Scene } from "../engine/Scene";
import { InputSystem } from "../systems/InputSystem";
import { Level01Scene } from "./Level01Scene";

export class MainMenuScene extends Scene {
    private enterWasPressed = true; // para evitar que o enter seja pressionado novamente
    constructor(){
        super();
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
        const inputSystem = this.game?.getSystems(InputSystem);
        const input = inputSystem?.getState();

        if(!input) return

        const isPressed = input.isPressed('Enter');

        if(isPressed && !this.enterWasPressed) {
            console.log('Enter pressed');
            this.game?.setScene(
                new Level01Scene()
            )
        }

        this.enterWasPressed = isPressed;

    }

    /**
     * Renderização gráfica
     */
    render(): void {
        const renderer = this.getRenderer();
        if (!renderer) return;
        renderer.clear('#1e1e1e'); // Limpa com cor de fundo
        this.drawTitle();
        this.drawOptions();
      }
    
      private drawTitle(): void {
        const renderer = this.getRenderer();
        if (!renderer) return;
        const canvas = renderer.getCanvas();
        const text = 'Meu Jogo';
        const font = '48px Arial';
        const textWidth = renderer.measureText(text, font).width;
        const centerX = canvas.width / 2;
        const x = centerX - textWidth / 2;
        renderer.drawText(text, x, 150, {
          font: font,
          color: '#ffffff',
        });
      }
      private drawOptions(): void {
        const renderer = this.getRenderer();
        if (!renderer) return;
        
        const canvas = renderer.getCanvas();
        const text = 'Pressione ENTER para iniciar';
        const font = '20px Arial';
        const centerX = canvas.width / 2;
        const y = 300;
        
        renderer.save();
        // Ajusta alinhamento para centralizar pelo eixo x
        renderer.setTextAlign('center');
        renderer.drawText(text, centerX, y, {
          font: font,
          color: '#ffffff',
          verticalAlign: 'middle',
          horizontalAlign: 'center'
        });
        renderer.restore();
      }
}