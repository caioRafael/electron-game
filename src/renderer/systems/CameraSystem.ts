import { System } from "../engine/System";
import { Camera } from "../rendering/Camera";

export class CameraSystem implements System {
    private camera: Camera;
    private target?: {x: number; y: number; width: number; height: number; };

    constructor(camera: Camera) {
        this.camera = camera;
    }

    onInit(): void {
        // Inicialização do sistema de câmera
    }

    onUpdate(delta: number): void {
        // Atualização da câmera
        if(!this.target) return;

        this.camera.x = this.target.x + this.target.width / 2 - this.camera.width / 2;

        this.camera.y = this.target.y + this.target.height / 2 - this.camera.height / 2;
    }

    onDestroy(): void {
        // Destruição do sistema de câmera
    }

    getCamera(): Camera {
        return this.camera;
    }

    follow(target: {x: number; y: number; width: number; height: number; }): void {
        this.target = target;
    }
}