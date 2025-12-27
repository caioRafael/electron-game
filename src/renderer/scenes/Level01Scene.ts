import { Scene } from "../engine/Scene";
import { InputSystem } from "../systems/InputSystem";
import { PhysicsSystem } from "../systems/PhysicsSystem";
import { RenderSystem } from "../systems/RenderSystem";
import { Player } from "../entities/Player";
import { DebugFPS } from "../ui/DebugFPS";
import { PlayerStatus } from "../ui/PlayerStatus";
import { CameraSystem } from "../systems/CameraSystem";
import { TileMap } from "../map/TileMap";
import { createLevel01Map } from "../map/maps/level01";
import { PauseMenu } from "../ui/PauseMenu";


export class Level01Scene extends Scene {
    private player: Player;
    private debugFPS: DebugFPS;
    private playerStatus: PlayerStatus;
    private pauseMenu: PauseMenu;
    private tileMap?: TileMap;
    private escWasPressed: boolean = false;

    constructor(){
        super();
        
        // Cria o tile map
        this.tileMap = createLevel01Map();
        
        // Posiciona o player no centro do mapa
        const playerSize = 50; // default do Player conforme Player.ts
        const mapWidth = this.tileMap.width * this.tileMap.tileSize;
        const mapHeight = this.tileMap.height * this.tileMap.tileSize;
        const playerX = (mapWidth - playerSize) / 2;
        const playerY = (mapHeight - playerSize) / 2;
        this.player = new Player(playerX, playerY);

        this.debugFPS = new DebugFPS();
        this.playerStatus = new PlayerStatus(this.player);
        this.pauseMenu = new PauseMenu();
    }

    /**
     * Chamado quando a cena entra em execução
     */
    onEnter(): void {
        console.log('Level01Scene: onEnter');
        
        // Define o estado do jogo para PLAYING quando entra na cena de gameplay
        this.game?.startPlaying();
        
        const cameraSystem = this.game?.getSystems(CameraSystem);
        cameraSystem?.follow(this.player);

        // Registra as entidades no sistema de física
        const physicsSystem = this.game?.getSystems(PhysicsSystem);
        if (physicsSystem) {
            physicsSystem.registerEntity(this.player);
            
            // Configura o tile map no sistema de física para colisões
            if (this.tileMap) {
                physicsSystem.setTileMap(this.tileMap);
            }
        }

        // Registra as entidades no sistema de renderização
        const renderSystem = this.game?.getSystems(RenderSystem);
        if (renderSystem) {
            renderSystem.registerWorld(this.player);
            renderSystem.registerUI(this.debugFPS);
            renderSystem.registerUI(this.playerStatus);
            renderSystem.registerUI(this.pauseMenu);
            
            // Configura o tile map no sistema de renderização
            if (this.tileMap) {
                renderSystem.setTileMap(this.tileMap);
            }
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
        }

        // Remove as entidades do sistema de renderização
        const renderSystem = this.game?.getSystems(RenderSystem);
        if (renderSystem) {
            renderSystem.unregisterWorld(this.player);
            renderSystem.unregisterUI(this.debugFPS);
            renderSystem.unregisterUI(this.playerStatus);
            renderSystem.unregisterUI(this.pauseMenu);
        }
    }

    /**
     * Atualização lógica (inputs, animações, timers)
     */
    update(delta: number): void {
        const inputSystem = this.game?.getSystems(InputSystem);
        const input = inputSystem?.getState();

        // Verifica se ESC foi pressionado para pausar/retomar
        if (input) {
            const escPressed = input.isPressed('Escape');
            
            if (escPressed && !this.escWasPressed) {
                if (this.isPlaying()) {
                    // Pausa o jogo
                    this.game?.pause();
                    this.pauseMenu.show();
                } else if (this.isPaused()) {
                    // Retoma o jogo
                    this.game?.resume();
                    this.pauseMenu.hide();
                }
            }
            
            this.escWasPressed = escPressed;
        }

        // Não atualiza lógica quando pausado
        if (this.isPaused()) {
            // Atualiza apenas elementos de UI quando pausado
            this.debugFPS.update(delta);
            this.pauseMenu.update(delta);
            return;
        }

        // Lógica de atualização do nível
        const actions = inputSystem?.getActions();

        if(!actions) return;

        // Atualiza o input do player e então atualiza o player
        // Apenas quando em gameplay (PLAYING)
        if (this.isPlaying()) {
            this.player.actions = actions;
            this.player.update(delta);
        }

        // Atualiza elementos de UI (sempre, mesmo quando pausado)
        this.debugFPS.update(delta);
        this.pauseMenu.update(delta);
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
            this.player.render();
            this.debugFPS.render();
            this.playerStatus.render();
        }
    }
}
