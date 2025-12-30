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
import { AudioSystem } from "../systems/AudioSystem";
// import { Food } from "../entities/Food";
import { ScoreUI } from "../ui/ScoreUI";
import { PhysicsBody } from "../physics/PhysicsBody";
import { Tileset } from "../map/Tileset";


export class Level01Scene extends Scene {
    private player: Player;
    private debugFPS: DebugFPS;
    private playerStatus: PlayerStatus;
    private pauseMenu: PauseMenu;
    private scoreUI: ScoreUI;
    // private food: Food;
    private tileMap?: TileMap;
    private tileset?: Tileset;
    private escWasPressed: boolean = false;
    private triggerHandler?: (event: {trigger: PhysicsBody, other: PhysicsBody}) => void;

    constructor(){
        super();
        
        // Cria o tile map
        this.tileMap = createLevel01Map();
        console.log("tileMap", this.tileMap.visualLayer.data);

        // Cria o tileset para renderização das texturas
        this.tileset = new Tileset('./assets/map/tilemap_packed-2.png', 32);
        console.log("tileset", this.tileset);
        const allTiles = Array.from(this.tileset.tiles.values());
        console.log("allTiles", allTiles);
        
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
        this.scoreUI = new ScoreUI();
        
        // Cria a comida em uma posição inicial aleatória
        // const foodX = Math.random() * (mapWidth - 30);
        // const foodY = Math.random() * (mapHeight - 30);
        // this.food = new Food(foodX, foodY);
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
            // physicsSystem.registerEntity(this.food);
            
            // Configura o tile map no sistema de física para colisões
            if (this.tileMap) {
                physicsSystem.setTileMap(this.tileMap);
            }
        }

        // Registra as entidades no sistema de renderização
        const renderSystem = this.game?.getSystems(RenderSystem);
        if (renderSystem) {
            renderSystem.registerWorld(this.player);
            // renderSystem.registerWorld(this.food);
            renderSystem.registerUI(this.debugFPS);
            renderSystem.registerUI(this.playerStatus);
            renderSystem.registerUI(this.pauseMenu);
            renderSystem.registerUI(this.scoreUI);
            
            // Configura o tile map e tileset no sistema de renderização
            if (this.tileMap) {
                renderSystem.setTileMap(this.tileMap);
            }
            if (this.tileset) {
                renderSystem.setTileset(this.tileset);
            }
        }

        // Carrega e toca a música de fundo (não-bloqueante)
        // const audioSystem = this.game?.getSystems(AudioSystem);
        // if (audioSystem) {
        //     // Carrega a música talisma.mp3 e toca quando estiver pronta
        //     audioSystem.loadMusic('talisma', './assets/musics/talisma.mp3')
        //         .then(() => {
        //             // Toca a música em loop quando o carregamento for concluído
        //             audioSystem.playMusic('talisma');
        //         })
        //         .catch((error) => {
        //             console.error('Erro ao carregar música talisma.mp3:', error);
        //         });
            
        //     // Carrega o efeito sonoro da comida
        //     audioSystem.load('raleu-doido', './assets/sounds/raleu-doido.ogg')
        //         .catch((error) => {
        //             console.error('Erro ao carregar som raleu-doido.ogg:', error);
        //         });
        // }

        // Escuta eventos de trigger para detectar quando o player coleta a comida
        this.triggerHandler = (event) => this.onTriggerEnter(event);
        this.game?.eventBus.on('trigger:enter', this.triggerHandler);
    }

    /**
     * Chamado quando a cena é removida
     */
    onExit(): void {
        console.log('Level01Scene: onExit');
        
        // Remove o listener de eventos
        if (this.triggerHandler) {
            this.game?.eventBus.off('trigger:enter', this.triggerHandler);
        }
        
        // Para a música de fundo
        const audioSystem = this.game?.getSystems(AudioSystem);
        if (audioSystem) {
            audioSystem.stopMusic();
        }
        
        // Remove as entidades do sistema de física
        const physicsSystem = this.game?.getSystems(PhysicsSystem);
        if (physicsSystem) {
            physicsSystem.unregisterEntity(this.player);
            // physicsSystem.unregisterEntity(this.food);
        }

        // Remove as entidades do sistema de renderização
        const renderSystem = this.game?.getSystems(RenderSystem);
        if (renderSystem) {
            renderSystem.unregisterWorld(this.player);
            // renderSystem.unregisterWorld(this.food);
            renderSystem.unregisterUI(this.debugFPS);
            renderSystem.unregisterUI(this.playerStatus);
            renderSystem.unregisterUI(this.pauseMenu);
            renderSystem.unregisterUI(this.scoreUI);
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
                    // Pausa a música
                    const audioSystem = this.game?.getSystems(AudioSystem);
                    audioSystem?.pauseMusic();
                } else if (this.isPaused()) {
                    // Retoma o jogo
                    this.game?.resume();
                    this.pauseMenu.hide();
                    // Retoma a música
                    const audioSystem = this.game?.getSystems(AudioSystem);
                    audioSystem?.resumeMusic();
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
        this.scoreUI.update(delta);
    }

    /**
     * Handler para eventos de trigger (quando player coleta comida)
     */
    private onTriggerEnter(event: {trigger: PhysicsBody, other: PhysicsBody}): void {
        // Verifica se foi a comida que foi coletada pelo player
        // if (event.trigger === this.food && event.other === this.player) {
            // Toca o efeito sonoro
            const audioSystem = this.game?.getSystems(AudioSystem);
            // audioSystem?.playSFX('raleu-doido');
            
            // Adiciona pontos
            this.scoreUI.addPoints(1);
            
            // Reposiciona a comida em um lugar aleatório dentro do mapa
            // this.repositionFood();
        // }
    }

    /**
     * Reposiciona a comida em uma posição aleatória dentro do mapa
     */
    private repositionFood(): void {
        if (!this.tileMap) return;
        
        const mapWidth = this.tileMap.width * this.tileMap.tileSize;
        const mapHeight = this.tileMap.height * this.tileMap.tileSize;
        const foodSize = 30;
        
        // Gera uma posição aleatória, evitando as bordas sólidas
        // Deixa uma margem de segurança para não colocar em tiles sólidos
        const margin = this.tileMap.tileSize;
        const minX = margin;
        const maxX = mapWidth - margin - foodSize;
        const minY = margin;
        const maxY = mapHeight - margin - foodSize;
        
        const newX = minX + Math.random() * (maxX - minX);
        const newY = minY + Math.random() * (maxY - minY);
        
        // this.food.x = newX;
        // this.food.y = newY;
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
