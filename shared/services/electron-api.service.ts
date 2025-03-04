import { Injectable } from '@angular/core';
import { IPC_RESPONSE } from '../interfaces/ipc-response';
declare const window: any; // Ensure Electron is available

@Injectable({
  providedIn: 'root',
})
export class ElectronApiService {
  constructor() {}

  send = (event: string, data: any) => {
    window.require('electron').ipcRenderer.send(event, data);
  };

  once = (event: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      window
        .require('electron')
        .ipcRenderer.once(event, (_: any, response: IPC_RESPONSE) =>
          resolve(response)
        );
    });
  };
}
