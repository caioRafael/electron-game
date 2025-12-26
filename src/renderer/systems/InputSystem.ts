import { System } from "../engine/System";
import { ActionInput } from "../input/ActionInput";
import { DefaultInputBindings } from "../input/DefaultInputBindings";
import { InputState } from "../input/InputState";
import { MouseButton, MouseState } from "../input/MouseState";

export class InputSystem implements System {
    private actionInput!: ActionInput;
    private state = new InputState();
    private mouseState = new MouseState();
    private pressedKeys = new Set<string>();

    onInit(): void {
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));

        this.actionInput = new ActionInput(this.state, DefaultInputBindings);
    }

    onUpdate(delta: number): void {
        // Marca todas as teclas pressionadas como 'held' se não são novas ('pressed')
        for (const key of this.pressedKeys) {
            if (!this.state.isPressed(key)) {
                this.state.setKey(key, 'held');
            }
        }
        
        // Limpa apenas os estados 'released' e 'pressed' (mantém 'held')
        this.state.clearReleased();
        this.state.clearPressed();
        
        this.mouseState.clearAllClicks();
    }

    onDestroy(): void {
        window.removeEventListener('keydown', this.onKeyDown.bind(this));
        window.removeEventListener('keyup', this.onKeyUp.bind(this));
        window.removeEventListener('mousemove', this.onMouseMove.bind(this));
        window.removeEventListener('mousedown', this.onMouseDown.bind(this));
        window.removeEventListener('mouseup', this.onMouseUp.bind(this));
    }

    private onKeyDown(event: KeyboardEvent): void {
        if (!this.pressedKeys.has(event.key)) {
            console.log('Key pressed:', event.key, 'Code:', event.code);
            this.pressedKeys.add(event.key);
            this.state.setKey(event.key, 'pressed');
        }
    }

    private onKeyUp(event: KeyboardEvent): void {
        this.pressedKeys.delete(event.key);
        this.state.setKey(event.key, 'released');
    }

    private onMouseMove(event: MouseEvent): void {
        const rect = (event.target as HTMLElement).getBoundingClientRect()

        this.mouseState.setPosition(
            event.clientX - rect.left,
            event.clientY - rect.top);
    }

    private onMouseDown(event: MouseEvent): void {
        this.mouseState.setButton(event.button as MouseButton, true);
    }

    private onMouseUp(event: MouseEvent): void {
        this.mouseState.setButton(event.button as MouseButton, false);
    }

    getState(): InputState {
        return this.state;
    }

    getMouseState(): MouseState {
        return this.mouseState;
    }

    getActions(): ActionInput {
        return this.actionInput;
    }
}