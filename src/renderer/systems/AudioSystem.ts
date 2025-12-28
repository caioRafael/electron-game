import { Game, GameStatus } from "../engine/Game";
import { System } from "../engine/System";

export class AudioSystem implements System {
    private context: AudioContext;
    private buffers = new Map<string, AudioBuffer>();

    private musicSource?: AudioBufferSourceNode;
    private masterGain: GainNode;
    private musicGain: GainNode;
    private sfxGain: GainNode;
    private currentMusicName?: string;
    private musicPaused: boolean = false;
    
    game?: Game | undefined;

    constructor(){
        this.context = new AudioContext();
        this.masterGain = this.context.createGain();
        this.musicGain = this.context.createGain();
        this.sfxGain = this.context.createGain();

        this.masterGain.connect(this.context.destination);
        this.musicGain.connect(this.masterGain);
        this.sfxGain.connect(this.masterGain);
    }

    onInit?(): void {}

    onUpdate(delta: number): void {}
    
    onDestroy?(): void {
        this.context.close();
    }

    async load(name: string, url: string): Promise<void> {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
        this.buffers.set(name, audioBuffer);
    }

    async loadMusic(name: string, url: string): Promise<void> {
        const buffer = await this.load(name, url);
    }

    playSFX(name: string): void {
        const buffer = this.buffers.get(name);
        if(!buffer) return;

        const source = this.context.createBufferSource();
        source.buffer = buffer;
        source.connect(this.sfxGain);
        source.start();
    }

    playMusic(name: string): void {
        this.stopMusic();

        const buffer = this.buffers.get(name);
        if(!buffer) return;

        const source = this.context.createBufferSource();
        source.buffer = buffer;
        source.connect(this.musicGain);
        source.loop = true;
        source.start();
        this.musicSource = source;
        this.currentMusicName = name;
        this.musicPaused = false;
    }

    stopMusic(): void {
        this.musicSource?.stop();
        this.musicSource = undefined;
        this.currentMusicName = undefined;
        this.musicPaused = false;
    }

    pauseMusic(): void {
        if (this.musicSource && !this.musicPaused) {
            this.musicSource.stop();
            this.musicSource = undefined;
            this.musicPaused = true;
        }
    }

    resumeMusic(): void {
        if (this.musicPaused && this.currentMusicName) {
            const buffer = this.buffers.get(this.currentMusicName);
            if (buffer) {
                const source = this.context.createBufferSource();
                source.buffer = buffer;
                source.connect(this.musicGain);
                source.loop = true;
                source.start();
                this.musicSource = source;
                this.musicPaused = false;
            }
        }
    }

    setMasterVolume(volume: number): void {
        this.masterGain.gain.value = volume;
    }

    setMusicVolume(volume: number): void {
        this.musicGain.gain.value = volume;
    }

    setSFXVolume(volume: number): void {
        this.sfxGain.gain.value = volume;
    }

    onGameStatusChanged(status: GameStatus): void {
        if(status === GameStatus.PLAYING) {
            this.playMusic('music');
        } else {
            this.stopMusic();
        }
    }
}