import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IPC_EVENT } from '../../shared/constants/main-events';
import { IPC_RESPONSE } from '../../shared/interfaces/ipc-response';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [ButtonModule],
})
export class AppComponent {
  title = 'Kaio';
  filePath = 'C:/Users/70020253/Documents/test.txt'; // Change as needed

  writeFile() {
    const content = 'Hello from Angular + Electron!';
    window.require('electron').ipcRenderer.send(IPC_EVENT.WRITE_FILE, {
      filePath: this.filePath,
      content,
    });

    window
      .require('electron')
      .ipcRenderer.once(
        IPC_EVENT.WRITE_FILE_RESPONSE,
        (_: any, response: IPC_RESPONSE) => {
          const { success, error } = response;

          if (success) alert('File written successfully!');
          else alert('Error writing file: ' + error);
        }
      );
  }

  readFile() {
    window
      .require('electron')
      .ipcRenderer.send(IPC_EVENT.READ_FILE, this.filePath);

    window
      .require('electron')
      .ipcRenderer.once(
        IPC_EVENT.READ_FILE_RESPONSE,
        (_: any, response: IPC_RESPONSE) => {
          const { success, data, error } = response;

          if (success) alert('File content: ' + data);
          else alert('Error reading file: ' + error);
        }
      );
  }
}
