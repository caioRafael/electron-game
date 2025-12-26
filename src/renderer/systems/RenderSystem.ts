import { System } from "../engine/System";
import { Entity } from "../entities/Entity";
import { CanvasRenderer } from "../rendering/CanvasRenderer";

export class RenderSystem implements System {
    private entities: Entity[] = [];
    private backgroundColor: string = '#1e1e1e';
    private renderer?: CanvasRenderer;

    constructor(renderer?: CanvasRenderer) {
        this.renderer = renderer;
    }

    onInit(): void {
        // Inicialização do sistema de renderização
    }

    onUpdate(delta: number): void {
        // O sistema de renderização não precisa fazer nada no onUpdate
        // A renderização é feita através do método render() chamado pela cena
    }

    onDestroy(): void {
        // Limpa o registro de entidades
        this.entities = [];
    }

    /**
     * Define o CanvasRenderer usado para renderização
     */
    setRenderer(renderer: CanvasRenderer): void {
        this.renderer = renderer;
    }

    /**
     * Define a cor de fundo do canvas
     */
    setBackgroundColor(color: string): void {
        this.backgroundColor = color;
    }

    /**
     * Registra uma entidade para renderização
     */
    registerEntity(entity: Entity): void {
        if (!this.entities.includes(entity)) {
            this.entities.push(entity);
        }
    }

    /**
     * Remove uma entidade do sistema de renderização
     */
    unregisterEntity(entity: Entity): void {
        const index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
        }
    }

    /**
     * Limpa todas as entidades registradas
     */
    clearEntities(): void {
        this.entities = [];
    }

    /**
     * Renderiza todas as entidades registradas
     * Limpa o canvas e renderiza cada entidade na ordem de registro
     */
    render(): void {
        if (!this.renderer) {
            console.warn('RenderSystem: CanvasRenderer não definido');
            return;
        }

        // Limpa o canvas com a cor de fundo
        this.renderer.clear(this.backgroundColor);

        // Renderiza todas as entidades na ordem de registro
        for (const entity of this.entities) {
            entity.render();
        }
    }

    /**
     * Renderiza apenas as entidades sem limpar o canvas
     * Útil para renderização em camadas
     */
    renderEntities(): void {
        if (!this.renderer) {
            console.warn('RenderSystem: CanvasRenderer não definido');
            return;
        }

        // Renderiza todas as entidades na ordem de registro
        for (const entity of this.entities) {
            entity.render();
        }
    }

    /**
     * Limpa apenas o canvas sem renderizar entidades
     */
    clear(): void {
        if (!this.renderer) {
            console.warn('RenderSystem: CanvasRenderer não definido');
            return;
        }

        this.renderer.clear(this.backgroundColor);
    }
}