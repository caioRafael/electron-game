import { InputState } from './InputState';
import { InputAction } from './InputAction';

export class ActionInput {
    constructor(
        private input: InputState,
        private bindings: Record<InputAction, string[]>
    ) {}

    isPressed(action: InputAction): boolean {
        return this.bindings[action].some(key =>
            this.input.isPressed(key)
        );
    }

    isHeld(action: InputAction): boolean {
        return this.bindings[action].some(key =>
            this.input.isHeld(key)
        );
    }

    isReleased(action: InputAction): boolean {
        return this.bindings[action].some(key =>
            this.input.isReleased(key)
        );
    }
}
