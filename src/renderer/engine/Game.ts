// Montar a cena
// Montar controles do jogo: start, pause, stop
// adicionar sistemas



import { System } from "./System";
import { Loop } from "./Loop";
import { Scene } from "./Scene";

export enum GameStatus {
    STOPPED = 'STOPPED',
    RUNNING = 'RUNNING',
    PAUSED = 'PAUSED'
  }


export class Game {
    private systems: System[] = [];
    private loop: Loop;
    private status: GameStatus = GameStatus.STOPPED;
    private currentScene: Scene | null = null;

    constructor(loop: Loop){
        this.loop = loop;
    }

    addSystem(system: System): void {
        this.systems.push(system);
    }


    start(initialScene: Scene){
        console.log('Game started');
        if(this.status !== GameStatus.STOPPED) return;

        this.status = GameStatus.RUNNING;
        initialScene.game = this;
        
        // Inicializa todos os sistemas
        for(const system of this.systems){
            system.onInit?.();
        }
        
        this.setScene(initialScene)      

        this.loop.start(this.update.bind(this));  
    }

    //Loop principal do jogo
    private update(delta: number): void {
        if(this.status !== GameStatus.RUNNING) return;

        // Atualiza a cena primeiro para que possa ler o input antes de ser limpo
        this.currentScene?.update(delta);
        this.currentScene?.render();
        
        // Limpa o estado dos sistemas após a cena processar
        for(const system of this.systems){
            system.onUpdate(delta);
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
        if(this.status !== GameStatus.RUNNING) return;
        this.status = GameStatus.PAUSED;
    }

    resume(): void{
        if(this.status !== GameStatus.PAUSED) return;
        this.status = GameStatus.RUNNING;
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