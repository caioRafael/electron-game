type EventListener<T> = (event: T) => void;

export class EventBus {
    private listeners = new Map<string, Set<EventListener<any>>>();

    on<T>(event: string, listener: EventListener<T>): void {
        if(!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(listener);
    }

    off<T>(event: string, listener: EventListener<T>): void {
        const listeners = this.listeners.get(event);
        if (listeners) {
            listeners.delete(listener);
            if (listeners.size === 0) {
                this.listeners.delete(event);
            }
        }
    }

    emit<T>(event: string, data: T): void {
        const listeners = this.listeners.get(event);
        if (listeners) {
            listeners.forEach(listener => listener(data));
        }
    }

    clear(): void {
        this.listeners.clear();
    }
}