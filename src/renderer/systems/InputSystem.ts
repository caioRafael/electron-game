import { System } from "../engine/System";
import { InputState } from "../input/InputState";

export class InputSystem implements System {
    private state = new InputState();


    onInit(): void {
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    onUpdate(delta: number): void {
        this.state.clear();
    }

    onDestroy(): void {
        window.removeEventListener('keydown', this.onKeyDown.bind(this));
        window.removeEventListener('keyup', this.onKeyUp.bind(this));
    }

    private onKeyDown(event: KeyboardEvent): void {
        console.log('Key pressed:', event.key, 'Code:', event.code);
        this.state.setKey(event.key, 'pressed');
    }

    private onKeyUp(event: KeyboardEvent): void {
        this.state.setKey(event.key, 'released');
    }

    getState(): InputState {
        return this.state;
    }
}