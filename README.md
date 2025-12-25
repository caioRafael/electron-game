# Game Engine - Projeto de Jogo Electron + TypeScript

Um motor de jogo 2D desenvolvido com Electron, TypeScript e Canvas API, implementando uma arquitetura baseada em sistemas, cenas e componentes.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Arquitetura](#arquitetura)
- [Instalação](#instalação)
- [Uso](#uso)
- [Desenvolvimento](#desenvolvimento)
- [Componentes Principais](#componentes-principais)

## 🎯 Visão Geral

Este projeto implementa um motor de jogo 2D com as seguintes características:

- **Arquitetura baseada em sistemas**: Sistema modular onde componentes independentes gerenciam aspectos específicos do jogo
- **Sistema de cenas**: Gerenciamento de diferentes estados do jogo (menu, gameplay, etc.)
- **Game Loop**: Loop de atualização baseado em `requestAnimationFrame` com cálculo de delta time
- **Sistema de input**: Captura e processamento de eventos de teclado
- **Renderização Canvas**: Renderização 2D usando Canvas API
- **Hot Reload**: Recarregamento automático durante o desenvolvimento

## 🛠 Tecnologias

- **Electron** (^39.2.7) - Framework para aplicações desktop multiplataforma
- **TypeScript** (^5.3.3) - Superset do JavaScript com tipagem estática
- **esbuild** (^0.19.0) - Bundler rápido para o código renderer
- **chokidar-cli** (^3.0.0) - Monitoramento de arquivos para hot reload
- **concurrently** (^9.2.1) - Execução paralela de scripts

## 📁 Estrutura do Projeto

```
game/
├── src/
│   ├── main/                    # Processo principal do Electron
│   │   └── index.ts             # Configuração da janela Electron
│   │
│   └── renderer/                 # Processo renderer (código do jogo)
│       ├── main.ts              # Ponto de entrada do renderer
│       ├── app.ts               # Classe principal da aplicação
│       ├── index.html           # HTML da aplicação
│       │
│       ├── engine/              # Motor do jogo
│       │   ├── Game.ts          # Classe principal do jogo
│       │   ├── Loop.ts          # Game loop com requestAnimationFrame
│       │   ├── Scene.ts         # Interface para cenas
│       │   └── System.ts        # Interface para sistemas
│       │
│       ├── systems/              # Sistemas do jogo
│       │   └── InputSystem.ts   # Sistema de input (teclado)
│       │
│       ├── input/                # Gerenciamento de input
│       │   └── InputState.ts    # Estado das teclas pressionadas
│       │
│       ├── rendering/            # Renderização
│       │   └── CanvasRenderer.ts # Renderizador Canvas 2D
│       │
│       └── scenes/               # Cenas do jogo
│           └── MainMenuScene.ts # Cena do menu principal
│
├── dist/                         # Código compilado (gerado)
├── package.json
├── tsconfig.json                 # Configuração TypeScript principal
└── tsconfig.main.json            # Configuração TypeScript para main process
```

## 🏗 Arquitetura

### Visão Geral

O projeto segue uma arquitetura em camadas com separação clara de responsabilidades:

```
┌─────────────────────────────────────┐
│         Electron Main Process       │
│    (Gerenciamento da janela)        │
└─────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│      Electron Renderer Process      │
│                                     │
│  ┌──────────────────────────────┐  │
│  │          App                  │  │
│  │  (Inicialização e setup)      │  │
│  └──────────┬───────────────────┘  │
│             │                       │
│  ┌──────────▼───────────────────┐  │
│  │          Game                 │  │
│  │  (Gerenciador principal)      │  │
│  └──────┬───────────────┬───────┘  │
│         │               │           │
│  ┌──────▼──────┐  ┌────▼────────┐ │
│  │   Loop      │  │   Systems   │ │
│  │ (Game Loop)  │  │  (Input,    │ │
│  │             │  │   etc.)     │ │
│  └──────┬──────┘  └────┬────────┘ │
│         │              │           │
│  ┌──────▼──────────────▼───────┐  │
│  │         Scene                │  │
│  │  (Estado atual do jogo)      │  │
│  └──────┬───────────────────────┘  │
│         │                           │
│  ┌──────▼───────────────────────┐  │
│  │    CanvasRenderer             │  │
│  │    (Renderização 2D)          │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Componentes Principais

#### 1. **Game Loop (`Loop.ts`)**

Gerencia o ciclo principal do jogo usando `requestAnimationFrame`:

- Calcula o delta time (tempo entre frames)
- Chama o callback de atualização a cada frame
- Sincroniza com a taxa de atualização do navegador

**Fluxo:**
```
start() → loop() → requestAnimationFrame → loop() → ...
```

#### 2. **Game (`Game.ts`)**

Classe central que coordena todos os componentes:

- **Gerenciamento de estado**: STOPPED, RUNNING, PAUSED
- **Sistemas**: Registra e gerencia sistemas do jogo
- **Cenas**: Controla a cena atual e transições
- **Ciclo de atualização**: Orquestra update() e render()

**Fluxo de atualização:**
```
1. Scene.update(delta)    → Lógica da cena (input, física, etc.)
2. Scene.render()          → Renderização
3. Systems.onUpdate(delta)  → Limpeza de estados (ex: input.clear())
```

#### 3. **Sistema de Cenas (`Scene.ts`)**

Interface para diferentes estados do jogo:

- **onEnter()**: Chamado quando a cena é ativada
- **onExit()**: Chamado quando a cena é desativada
- **update(delta)**: Atualização lógica a cada frame
- **render()**: Renderização visual

**Exemplo de uso:**
```typescript
class MainMenuScene implements Scene {
    onEnter() { /* Setup inicial */ }
    update(delta) { /* Lógica do menu */ }
    render() { /* Desenhar menu */ }
    onExit() { /* Cleanup */ }
}
```

#### 4. **Sistema de Sistemas (`System.ts`)**

Interface para componentes modulares:

- **onInit()**: Inicialização (opcional)
- **onUpdate(delta)**: Atualização a cada frame
- **onDestroy()**: Cleanup (opcional)

**Sistemas disponíveis:**
- `InputSystem`: Captura eventos de teclado

#### 5. **Sistema de Input**

**InputSystem (`InputSystem.ts`)**:
- Registra listeners de teclado
- Atualiza o estado das teclas
- Limpa o estado após cada frame

**InputState (`InputState.ts`)**:
- Armazena o estado das teclas (pressed, released, held)
- Métodos para verificar estado: `isPressed()`, `isReleased()`, `isHeld()`

**Uso:**
```typescript
const input = this.game?.getSystems(InputSystem)?.getState();
if (input?.isPressed('Enter')) {
    // Ação
}
```

#### 6. **Canvas Renderer (`CanvasRenderer.ts`)**

Abstração sobre Canvas API para renderização 2D:

- **Métodos de desenho**: `drawText()`, `clear()`
- **Utilitários**: `measureText()`, `save()`, `restore()`, `setTextAlign()`
- Encapsula o contexto do canvas (privado)

### Fluxo de Execução

1. **Inicialização** (`main.ts`):
   ```
   DOMContentLoaded → Criar CanvasRenderer → Criar App → Iniciar cena inicial
   ```

2. **Game Loop**:
   ```
   Loop.start() → requestAnimationFrame → update(delta) → render() → ...
   ```

3. **Atualização de Frame**:
   ```
   Scene.update() → Scene.render() → Systems.onUpdate()
   ```

4. **Troca de Cena**:
   ```
   Scene.onExit() → Nova Scene → Scene.game = this → Scene.onEnter()
   ```

## 🚀 Instalação

```bash
# Instalar dependências
npm install
```

## 💻 Uso

### Desenvolvimento (com hot reload)

```bash
npm run dev
```

Este comando:
- Compila o código TypeScript
- Monitora mudanças em arquivos `.ts` e `.html`
- Recarrega automaticamente quando arquivos são salvos
- Inicia o Electron

### Build de Produção

```bash
npm run build
npm start
```

### Scripts Disponíveis

- `npm run build` - Compila todo o projeto
- `npm run build:main` - Compila apenas o processo main
- `npm run build:renderer` - Compila apenas o processo renderer
- `npm run copy:html` - Copia arquivos HTML para dist
- `npm run watch:html` - Monitora e copia HTML automaticamente
- `npm start` - Build e executa em produção
- `npm run dev` - Modo desenvolvimento com hot reload

## 🔧 Desenvolvimento

### Criando uma Nova Cena

1. Crie um arquivo em `src/renderer/scenes/`:

```typescript
import { Scene } from "../engine/Scene";
import { CanvasRenderer } from "../rendering/CanvasRenderer";

export class MyScene implements Scene {
    game?: import("../engine/Game").Game;
    private renderer: CanvasRenderer;
    
    constructor(renderer: CanvasRenderer) {
        this.renderer = renderer;
    }
    
    onEnter(): void {
        console.log("Cena iniciada");
    }
    
    update(delta: number): void {
        // Lógica da cena
    }
    
    render(): void {
        this.renderer.clear('#000000');
        // Renderização
    }
    
    onExit(): void {
        console.log("Cena finalizada");
    }
}
```

2. Use a cena no `main.ts`:

```typescript
app.start(new MyScene(renderer));
```

### Criando um Novo Sistema

1. Crie um arquivo em `src/renderer/systems/`:

```typescript
import { System } from "../engine/System";

export class MySystem implements System {
    onInit(): void {
        // Inicialização
    }
    
    onUpdate(delta: number): void {
        // Atualização a cada frame
    }
    
    onDestroy(): void {
        // Cleanup
    }
}
```

2. Registre no `app.ts`:

```typescript
this.game.addSystem(new MySystem());
```

### Acessando Sistemas de uma Cena

```typescript
const inputSystem = this.game?.getSystems(InputSystem);
const state = inputSystem?.getState();
```

## 📚 Componentes Principais

### Game (`engine/Game.ts`)

**Responsabilidades:**
- Gerenciar estado do jogo (STOPPED, RUNNING, PAUSED)
- Coordenar sistemas e cenas
- Controlar o ciclo de atualização

**Métodos principais:**
- `start(scene)`: Inicia o jogo com uma cena inicial
- `setScene(scene)`: Troca de cena
- `pause()` / `resume()`: Controle de pausa
- `stop()`: Finaliza o jogo
- `getSystems<T>(type)`: Obtém um sistema específico

### Loop (`engine/Loop.ts`)

**Responsabilidades:**
- Gerenciar o game loop usando `requestAnimationFrame`
- Calcular delta time entre frames
- Garantir atualização contínua

**Métodos:**
- `start(callback)`: Inicia o loop
- `stop()`: Para o loop

### CanvasRenderer (`rendering/CanvasRenderer.ts`)

**Responsabilidades:**
- Abstrair operações de renderização Canvas
- Gerenciar o contexto do canvas
- Fornecer métodos de desenho

**Métodos principais:**
- `clear(color?)`: Limpa o canvas
- `drawText(text, x, y, options)`: Desenha texto
- `measureText(text, font?)`: Mede dimensões do texto
- `save()` / `restore()`: Salva/restaura estado do contexto
- `setTextAlign(align)`: Define alinhamento do texto

### InputSystem (`systems/InputSystem.ts`)

**Responsabilidades:**
- Capturar eventos de teclado
- Manter estado das teclas
- Limpar estado após cada frame

**Métodos:**
- `getState()`: Retorna o estado atual do input

### InputState (`input/InputState.ts`)

**Responsabilidades:**
- Armazenar estado das teclas
- Fornecer métodos de verificação

**Métodos:**
- `isPressed(key)`: Verifica se tecla foi pressionada neste frame
- `isReleased(key)`: Verifica se tecla foi solta neste frame
- `isHeld(key)`: Verifica se tecla está sendo mantida

## 🎮 Estado Atual do Projeto

### ✅ Implementado

- ✅ Arquitetura base de sistemas e cenas
- ✅ Game loop com delta time
- ✅ Sistema de input (teclado)
- ✅ Renderização Canvas 2D básica
- ✅ Cena de menu principal
- ✅ Hot reload em desenvolvimento
- ✅ Build separado para main e renderer processes

### 🚧 Em Desenvolvimento / Planejado

- ⏳ Sistema de física
- ⏳ Sistema de áudio
- ⏳ Sistema de assets/sprites
- ⏳ Mais cenas de jogo
- ⏳ Sistema de entidades/componentes (ECS)

## 📝 Notas Técnicas

### Separação Main/Renderer

O projeto usa dois processos do Electron:
- **Main Process** (`src/main/`): Gerencia a janela e processos do sistema
- **Renderer Process** (`src/renderer/`): Contém o código do jogo

### Build System

- **Main**: Compilado com `tsc` (TypeScript Compiler)
- **Renderer**: Compilado com `esbuild` (bundle ESM para browser)
- **HTML**: Copiado manualmente para `dist/renderer/`

### Hot Reload

O sistema de hot reload funciona através de:
1. `tsc -w`: Recompila TypeScript automaticamente
2. `esbuild --watch`: Recompila renderer automaticamente
3. `chokidar`: Monitora e copia HTML
4. `fs.watch` no Electron: Detecta mudanças e recarrega a janela

## 🤝 Contribuindo

Este é um projeto em desenvolvimento. Sinta-se à vontade para:
- Adicionar novas funcionalidades
- Melhorar a documentação
- Reportar bugs
- Sugerir melhorias

## 📄 Licença

ISC
