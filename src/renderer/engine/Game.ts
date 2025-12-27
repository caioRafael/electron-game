// Montar a cena
// Montar controles do jogo: start, pause, stop
// adicionar sistemas



import { System } from "./System";
import { Loop } from "./Loop";
import { Scene } from "./Scene";
import { EventBus } from "./EventBus";

export enum GameStatus {
    STOPPED = 'STOPPED',
    MENU = 'MENU',
    PLAYING = 'PLAYING',
    PAUSED = 'PAUSED',
    GAME_OVER = 'GAME_OVER',
  }


export class Game {
    private systems: System[] = [];
    private loop: Loop;
    private status: GameStatus = GameStatus.STOPPED;
    private currentScene: Scene | null = null;
    public readonly eventBus = new EventBus();

    constructor(loop: Loop){
        this.loop = loop;
    }

    addSystem(system: System): void {
        system.game = this;
        this.systems.push(system);
    }

    getStatus(): GameStatus {
        return this.status;
    }
    setStatus(status: GameStatus): void {
        if(this.status === status) return;

        const previousStatus = this.status;
        this.status = status;
        this.eventBus.emit('game:status:changed', { previous: previousStatus, current: status });
        
        if(status === GameStatus.GAME_OVER) {
            this.stop();
        }
    }

    start(initialScene: Scene){
        console.log('Game started');
        if(this.status !== GameStatus.STOPPED) return;

        initialScene.game = this;
        
        // Inicializa todos os sistemas
        for(const system of this.systems){
            system.onInit?.();
        }
        
        this.setScene(initialScene);
        
        // O status será definido pela cena no onEnter()
        // Se não for definido, mantém STOPPED (mas isso não deve acontecer)

        this.loop.start(this.update.bind(this));  
    }

    //Loop principal do jogo
    private update(delta: number): void {
        // Sempre renderiza, mesmo quando pausado (para manter UI visível)
        this.currentScene?.render();
        
        // Para quando está parado ou game over
        if(this.status === GameStatus.STOPPED || this.status === GameStatus.GAME_OVER) {
            return;
        }

        // Cena sempre recebe update para processar inputs (ex: ESC para pausar/retomar)
        // Mesmo quando pausado, a cena precisa processar inputs
        this.currentScene?.update(delta);
        
        // InputSystem sempre precisa atualizar para limpar estados de teclas pressionadas
        // Isso permite que inputs funcionem mesmo quando pausado
        // Outros sistemas são atualizados apenas quando PLAYING
        for(const system of this.systems){
            // InputSystem sempre atualiza para processar inputs
            const isInputSystem = system.constructor.name === 'InputSystem';
            if(isInputSystem || this.status === GameStatus.PLAYING) {
                system.onUpdate(delta);
            }
        }
    }

    // Troca de cenário
    setScene(scene: Scene): void {
        this.currentScene?.onExit();
        this.currentScene = scene;
        this.currentScene.game = this;
        this.currentScene.onEnter();
    }

    pause(): void{
        if(this.status !== GameStatus.PLAYING) return;
        this.setStatus(GameStatus.PAUSED);
    }

    resume(): void{
        if(this.status !== GameStatus.PAUSED) return;
        this.setStatus(GameStatus.PLAYING);
    }
    
    /**
     * Transiciona para o estado de gameplay (PLAYING)
     */
    startPlaying(): void {
        this.setStatus(GameStatus.PLAYING);
    }
    
    /**
     * Transiciona para o estado de menu (MENU)
     */
    showMenu(): void {
        this.setStatus(GameStatus.MENU);
    }

    getSystems<T extends System>(type: new (...args: any[]) => T): T | undefined {
        return this.systems.find(system => system instanceof type) as T | undefined;
    }
    // Finaliza o jogo
    stop(): void{
        this.loop.stop();
        
        for(const system of this.systems){
            system.onDestroy?.();
        }
        this.currentScene?.onExit();
        this.currentScene = null;
        this.status = GameStatus.STOPPED;
    }
    
}