import { System } from "../engine/System";
import { Entity } from "../entities/Entity";
import { CanvasRenderer } from "../rendering/CanvasRenderer";
import { UIElement } from "../ui/UIElement";
import { Camera } from "../rendering/Camera";

export class RenderSystem implements System {
    // private entities: Entity[] = [];
    private world: Entity[] = [];
    private ui: UIElement[] = []
    private backgroundColor: string = '#1e1e1e';
    private camera: Camera;
    private renderer?: CanvasRenderer;
    constructor(renderer: CanvasRenderer, camera: Camera) {
        this.renderer = renderer;
        this.camera = camera;
    }

    /**
     * Obtém o CanvasRenderer usado para renderização
     */
    getRenderer(): CanvasRenderer | undefined {
        return this.renderer;
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
        this.world = [];
        this.ui = [];
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
    registerWorld(entity: Entity): void {
        if (!this.world.includes(entity)) {
            // Injeta o RenderSystem na entidade para acesso ao renderer
            entity.setRenderSystem(this);
            this.world.push(entity);
        }
    }

    /**
     * Remove uma entidade do sistema de renderização
     */
    unregisterWorld(entity: Entity): void {
        const index = this.world.indexOf(entity);
        if (index > -1) {
            this.world.splice(index, 1);
        }
    }

    registerUI(element: UIElement): void {
        if (this.ui.includes(element)) return;
        // Injeta o RenderSystem no elemento de UI para acesso ao renderer
        element.setRenderSystem(this);
        this.ui.push(element);
    }

    unregisterUI(element: UIElement): void {
        this.ui = this.ui.filter(e => e !== element)
    }

    /**
     * Limpa todas as entidades registradas
     */
    clearWorld(): void {
        this.world = [];
    }

    clearUI(): void {
        this.ui = [];
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

        //WOLRD
        this.renderer.save();
        this.renderer.translate(-this.camera.x, -this.camera.y);

        // Renderiza todas as entidades na ordem de registro
        for (const entity of this.world) {
            entity.render();
        }
        
        this.renderer.restore();

        //UI
        for (const element of this.ui) {
            element.render();
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
        for (const entity of this.world) {
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