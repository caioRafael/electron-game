import { InputAction } from './InputAction';

export const DefaultInputBindings: Record<InputAction, string[]> = {
    [InputAction.MOVE_UP]: ['w', 'ArrowUp'],
    [InputAction.MOVE_DOWN]: ['s', 'ArrowDown'],
    [InputAction.MOVE_LEFT]: ['a', 'ArrowLeft'],
    [InputAction.MOVE_RIGHT]: ['d', 'ArrowRight'],
    [InputAction.JUMP]: [' '],
    [InputAction.ATTACK]: ['Mouse0'],
};
