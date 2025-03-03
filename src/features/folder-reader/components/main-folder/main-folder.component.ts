import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IPC_EVENT } from '../../../../../shared/constants/main-events';
import { URL_STRING } from '../../../../../shared/constants/url-string';
import { IPC_RESPONSE } from '../../../../../shared/interfaces/ipc-response';
import { FolderReaderStore } from '../../folder-reader.store';
import { STORAGE_KEY } from '../../../../../shared/constants/storage-key';
declare const window: any; // Ensure Electron is available

@Component({
  standalone: true,
  selector: 'app-main-folder',
  imports: [ButtonModule],
  templateUrl: './main-folder.component.html',
  styleUrl: './main-folder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FolderReaderStore],
})
export class MainFolderComponent {
  readonly store = inject(FolderReaderStore);

  constructor(readonly router: Router) {
    this.readFolders();

    effect(() => {
      const folders = this.store.fileredFolders();
      if (folders)
        localStorage.setItem(STORAGE_KEY.FOLDER, JSON.stringify(folders));
    });
  }

  private readFolders = () => {
    window
      .require('electron')
      .ipcRenderer.send(IPC_EVENT.READ_FOLDER, this.store.dir());

    window
      .require('electron')
      .ipcRenderer.once(
        IPC_EVENT.READ_FOLDER_RESPONSE,
        (_: any, response: IPC_RESPONSE) => {
          const { success, data, error } = response;

          if (success && data) {
            this.store.setFolders(data);
          } else alert('Error reading folder: ' + error);
        }
      );
  };

  onRoute = (dir: string) => {
    this.router.navigate([URL_STRING.FOLDER_READER, dir]);
  };
}
