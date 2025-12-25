/**
 * Classe Loop é responsável por gerenciar o loop principal do jogo (game loop),
 * controlando o ciclo de atualização do estado do jogo a uma frequência regular, 
 * tipicamente sincronizada com o frames por segundo do navegador via requestAnimationFrame.
 */
export class Loop {
    // Indica se o loop está rodando ou não.
    private running: boolean = false;
    // Armazena o timestamp do último frame para calcular o delta.
    private lastTime: number = 0;
    // Callback fornecido que será chamado a cada frame, recebendo o delta (tempo desde o último frame).
    private updateCallback: ((delta: number) => void) | null = null;

    constructor() {}

    /**
     * Inicia o loop.
     * @param updateCallback Função que será chamada a cada frame para atualizar o estado do jogo.
     */
    start(updateCallback: (delta: number) => void) {
        // Se já estiver rodando, não inicia novamente.
        if (this.running) return;
        this.running = true;
        this.updateCallback = updateCallback;
        // Salva o tempo atual para cálculo do delta no próximo frame.
        this.lastTime = performance.now();
        // Inicia o loop chamando o método loop.
        this.loop();
    }

    /**
     * Método privado chamado em cada frame.
     * Calcula o delta, chama o callback de atualização e agenda o próximo frame.
     */
    private loop = () => {
        if (!this.running) return; // Se não estiver rodando, interrompe.
        const now = performance.now();
        // Calcula o tempo que passou desde o último frame (em segundos).
        const delta = (now - this.lastTime) / 1000;
        this.lastTime = now;

        // Chama a função de atualização se ela existir.
        if (this.updateCallback) {
            this.updateCallback(delta);
        }

        // Agenda o próximo frame.
        requestAnimationFrame(this.loop);
    }

    /**
     * Para o loop.
     */
    stop() {
        this.running = false;
        this.updateCallback = null;
    }
}
