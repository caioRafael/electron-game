export type KeyState = 'pressed' | 'released' | 'held';

export class InputState {
    private keys = new Map<string, KeyState>();

    setKey(key: string, state: KeyState): void {
        this.keys.set(key, state);
    }

    isPressed(key: string): boolean {
        return this.keys.get(key) === 'pressed';
    }

    isReleased(key: string): boolean {
        return this.keys.get(key) === 'released';
    }

    isHeld(key: string): boolean {
        return this.keys.get(key) === 'held';
    }

    clear(): void {
        this.keys.clear();
    }

    clearReleased(): void {
        const keysToRemove: string[] = [];
        for (const [key, state] of this.keys.entries()) {
            if (state === 'released') {
                keysToRemove.push(key);
            }
        }
        for (const key of keysToRemove) {
            this.keys.delete(key);
        }
    }

    clearPressed(): void {
        const keysToRemove: string[] = [];
        for (const [key, state] of this.keys.entries()) {
            if (state === 'pressed') {
                keysToRemove.push(key);
            }
        }
        for (const key of keysToRemove) {
            this.keys.delete(key);
        }
    }
}