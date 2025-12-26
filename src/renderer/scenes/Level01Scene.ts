import { Scene } from "../engine/Scene";
import { CanvasRenderer } from "../rendering/CanvasRenderer";
import { InputSystem } from "../systems/InputSystem";
import { PhysicsSystem } from "../systems/PhysicsSystem";
import { RenderSystem } from "../systems/RenderSystem";
import { Player } from "../entities/Player";
import { Wall } from "../entities/Wall";
import { ActionInput } from "../input/ActionInput";


export class Level01Scene extends Scene {
    private player: Player;
    private wall: Wall;

    constructor(renderer: CanvasRenderer){
        super();
        this.renderer = renderer;
        this.player = new Player(renderer);
        // Cria uma parede no mapa (exemplo: parede horizontal no topo)
        this.wall = new Wall(renderer, 500, 300, 200, 20);
    }

    /**
     * Chamado quando a cena entra em execução
     */
    onEnter(): void {
        console.log('Level01Scene: onEnter');
        // Inicializa o player no centro da tela
        if (this.renderer) {
            const canvas = this.renderer.getCanvas();
            this.player.x = canvas.width / 2 - this.player.width / 2;
            this.player.y = canvas.height / 2 - this.player.height / 2;
        }

        // Registra as entidades no sistema de física
        const physicsSystem = this.game?.getSystems(PhysicsSystem);
        if (physicsSystem) {
            physicsSystem.registerEntity(this.player);
            physicsSystem.registerEntity(this.wall);
        }

        // Registra as entidades no sistema de renderização
        const renderSystem = this.game?.getSystems(RenderSystem);
        if (renderSystem) {
            // Registra na ordem: primeiro as que ficam atrás (parede), depois as da frente (player)
            renderSystem.registerEntity(this.wall);
            renderSystem.registerEntity(this.player);
        }
    }

    /**
     * Chamado quando a cena é removida
     */
    onExit(): void {
        console.log('Level01Scene: onExit');
        
        // Remove as entidades do sistema de física
        const physicsSystem = this.game?.getSystems(PhysicsSystem);
        if (physicsSystem) {
            physicsSystem.unregisterEntity(this.player);
            physicsSystem.unregisterEntity(this.wall);
        }

        // Remove as entidades do sistema de renderização
        const renderSystem = this.game?.getSystems(RenderSystem);
        if (renderSystem) {
            renderSystem.unregisterEntity(this.player);
            renderSystem.unregisterEntity(this.wall);
        }
    }

    /**
     * Atualização lógica (inputs, animações, timers)
     */
    update(delta: number): void {
        // Lógica de atualização do nível
        const inputSystem = this.game?.getSystems(InputSystem);
        const actions = inputSystem?.getActions();

        if(!actions) return;

        // Atualiza o input do player e então atualiza o player
        this.player.actions = actions;
        this.player.update(delta);
        
        // Atualiza a parede (mesmo que não faça nada por enquanto)
        this.wall.update(delta);
    }

    /**
     * Renderização gráfica
     */
    render(): void {
        // Usa o RenderSystem para renderizar todas as entidades
        const renderSystem = this.game?.getSystems(RenderSystem);
        if (renderSystem) {
            renderSystem.render();
        } else {
            // Fallback: renderização manual se o RenderSystem não estiver disponível
            if (!this.renderer) return;
            this.renderer.clear('#1e1e1e');
            this.wall.render();
            this.player.render();
        }
    }
}

