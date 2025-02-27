// app.js

const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");

const url = require("url");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // webSecurity: false, // ⚠️ Not recommended for production
      nodeIntegration: true, // Allows access to Node.js APIs
      contextIsolation: false, // Allows IPC communication
      enableRemoteModule: true,
    },
    autoHideMenuBar: true,
    maximizable: true,
    minimizable: true,
  });
  mainWindow.maximize();

  mainWindow.loadURL("http://localhost:4200");

  // mainWindow.loadURL(
  //   url.format({
  //     pathname: path.join(
  //       __dirname,
  //       `dist/electron-angular/browser/index.html`
  //     ),
  //     protocol: "file:",
  //     slashes: true,
  //   })
  // );

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createWindow();
});

// Handle file writing request from Angular
ipcMain.on("write-file", (event, { filePath, content }) => {
  fs.writeFile(filePath, content, (err) => {
    if (err) event.reply("write-file-response", { success: false, error: err });
    else event.reply("write-file-response", { success: true });
  });
});

// Handle file reading request from Angular
ipcMain.on("read-file", (event, filePath) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) event.reply("read-file-response", { success: false, error: err });
    else event.reply("read-file-response", { success: true, data });
  });
});
