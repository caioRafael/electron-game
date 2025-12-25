import { app, BrowserWindow } from 'electron';
import path from 'path';
import * as fs from 'fs';

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  
  // Abre DevTools em desenvolvimento para debug
//   if (!app.isPackaged) {
//     mainWindow.webContents.openDevTools();
//   }
  
  // Sempre usa o HTML de dist, já que o código precisa ser compilado
  // Em desenvolvimento: __dirname aponta para dist/main
  // Em produção: __dirname também aponta para dist/main
  const htmlPath = path.join(__dirname, '..', 'renderer', 'index.html');
  mainWindow.loadFile(htmlPath);
  
  // Hot reload em desenvolvimento
  if (!app.isPackaged) {
    const rendererPath = path.join(__dirname, '..', 'renderer');
    
    // Monitora mudanças nos arquivos renderer
    fs.watch(rendererPath, { recursive: true }, (eventType, filename) => {
      if (filename && (filename.endsWith('.js') || filename.endsWith('.html'))) {
        console.log(`Arquivo alterado: ${filename}, recarregando...`);
        mainWindow?.webContents.reload();
      }
    });
  }
};

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
