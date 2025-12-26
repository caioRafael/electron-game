import { Scene } from "../engine/Scene";
import { InputSystem } from "../systems/InputSystem";
import { PhysicsSystem } from "../systems/PhysicsSystem";
import { RenderSystem } from "../systems/RenderSystem";
import { Player } from "../entities/Player";
import { Wall } from "../entities/Wall";
import { DebugFPS } from "../ui/DebugFPS";
import { PlayerStatus } from "../ui/PlayerStatus";
import { CameraSystem } from "../systems/CameraSystem";


export class Level01Scene extends Scene {
    private player: Player;
    private wallTop: Wall;
    private wallBottom: Wall;
    private wallLeft: Wall;
    private wallRight: Wall;
    private debugFPS: DebugFPS;
    private playerStatus: PlayerStatus;

    constructor(){
        super();
        // Parâmetros da caixa
        const boxLeft = 100;
        const boxTop = 100;
        const boxWidth = 600;
        const boxHeight = 400;
        const wallThickness = 20;

        // Centro do box (usando center do player)
        const playerSize = 50; // default do Player conforme Player.ts
        // Coloque o player no centro da caixa
        const playerX = boxLeft + (boxWidth - playerSize) / 2;
        const playerY = boxTop + (boxHeight - playerSize) / 2;
        this.player = new Player(playerX, playerY);

        // Parede superior
        this.wallTop = new Wall(boxLeft, boxTop, boxWidth, wallThickness);
        // Parede inferior
        this.wallBottom = new Wall(boxLeft, boxTop + boxHeight - wallThickness, boxWidth, wallThickness);
        // Parede esquerda
        this.wallLeft = new Wall(boxLeft, boxTop + wallThickness, wallThickness, boxHeight - 2 * wallThickness);
        // Parede direita
        this.wallRight = new Wall(boxLeft + boxWidth - wallThickness, boxTop + wallThickness, wallThickness, boxHeight - 2 * wallThickness);

        this.debugFPS = new DebugFPS();
        this.playerStatus = new PlayerStatus(this.player);
    }

    /**
     * Chamado quando a cena entra em execução
     */
    onEnter(): void {
        console.log('Level01Scene: onEnter');
        
        const cameraSystem = this.game?.getSystems(CameraSystem);
        cameraSystem?.follow(this.player);

        // Registra as entidades no sistema de física
        const physicsSystem = this.game?.getSystems(PhysicsSystem);
        if (physicsSystem) {
            physicsSystem.registerEntity(this.player);
            physicsSystem.registerEntity(this.wallTop);
            physicsSystem.registerEntity(this.wallBottom);
            physicsSystem.registerEntity(this.wallLeft);
            physicsSystem.registerEntity(this.wallRight);
        }

        // Registra as entidades no sistema de renderização
        const renderSystem = this.game?.getSystems(RenderSystem);
        if (renderSystem) {
            // Registra na ordem: primeiro as que ficam atrás (paredes), depois as da frente (player)
            renderSystem.registerWorld(this.wallTop);
            renderSystem.registerWorld(this.wallBottom);
            renderSystem.registerWorld(this.wallLeft);
            renderSystem.registerWorld(this.wallRight);
            renderSystem.registerWorld(this.player);
            renderSystem.registerUI(this.debugFPS);
            renderSystem.registerUI(this.playerStatus);
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
            physicsSystem.unregisterEntity(this.wallTop);
            physicsSystem.unregisterEntity(this.wallBottom);
            physicsSystem.unregisterEntity(this.wallLeft);
            physicsSystem.unregisterEntity(this.wallRight);
        }

        // Remove as entidades do sistema de renderização
        const renderSystem = this.game?.getSystems(RenderSystem);
        if (renderSystem) {
            renderSystem.unregisterWorld(this.player);
            renderSystem.unregisterWorld(this.wallTop);
            renderSystem.unregisterWorld(this.wallBottom);
            renderSystem.unregisterWorld(this.wallLeft);
            renderSystem.unregisterWorld(this.wallRight);
            renderSystem.unregisterUI(this.debugFPS);
            renderSystem.unregisterUI(this.playerStatus);
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
        
        // Atualiza as paredes (caso precise no futuro)
        this.wallTop.update(delta);
        this.wallBottom.update(delta);
        this.wallLeft.update(delta);
        this.wallRight.update(delta);

        // Atualiza elementos de UI
        this.debugFPS.update(delta);
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
            const renderer = this.getRenderer();
            if (!renderer) return;
            renderer.clear('#1e1e1e');
            this.wallTop.render();
            this.wallBottom.render();
            this.wallLeft.render();
            this.wallRight.render();
            this.player.render();
            this.debugFPS.render();
            this.playerStatus.render();
        }
    }
}
