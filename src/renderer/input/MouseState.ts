export type MouseButton = 0 | 1 | 2; //left, middle, right

interface ClickPosition {
    x: number;
    y: number;
}

export class MouseState{
    x = 0
    y = 0

    private buttons = new Map<MouseButton, boolean>();
    private clickedButtons = new Map<MouseButton, ClickPosition>();

    setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    setButton(button: MouseButton, pressed: boolean): void{
        this.buttons.set(button, pressed);
        
        // Se o botão foi pressionado, marca como clicado e armazena a posição
        if (pressed) {
            this.clickedButtons.set(button, { x: this.x, y: this.y });
        }
    }

    isPressed(button: MouseButton): boolean {
        return this.buttons.get(button) === true;
    }

    /**
     * Verifica se um botão foi clicado neste frame
     * O clique persiste até ser lido ou limpo
     */
    wasClicked(button: MouseButton): boolean {
        return this.clickedButtons.has(button);
    }

    /**
     * Obtém a posição onde um botão foi clicado
     */
    getClickPosition(button: MouseButton): ClickPosition | undefined {
        return this.clickedButtons.get(button);
    }

    /**
     * Limpa o estado de clique de um botão específico
     */
    clearClick(button: MouseButton): void {
        this.clickedButtons.delete(button);
    }

    /**
     * Limpa todos os estados de clique
     */
    clearAllClicks(): void {
        this.clickedButtons.clear();
    }
}