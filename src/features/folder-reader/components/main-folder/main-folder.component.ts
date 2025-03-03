import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { random } from 'lodash';
import { ButtonModule } from 'primeng/button';
import { IPC_EVENT } from '../../../../../shared/constants/main-events';
import { STORAGE_KEY } from '../../../../../shared/constants/storage-key';
import { URL_STRING } from '../../../../../shared/constants/url-string';
import { IPC_RESPONSE } from '../../../../../shared/interfaces/ipc-response';
import { ElectronApiService } from '../../../../../shared/services/electron-api.service';
import { FolderReaderStore } from '../../folder-reader.store';

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

  constructor(readonly router: Router, private electron: ElectronApiService) {
    this.createFolders();

    effect(() => {
      const folders = this.store.fileredFolders();
      if (folders)
        localStorage.setItem(STORAGE_KEY.FOLDER, JSON.stringify(folders));
    });
  }

  private createFolders = () => {
    for (let index = 1; index < random(5); index++) {
      this.electron.send(
        IPC_EVENT.CREATE_FOLDER,
        `${environment.root}/Folder ${index}`
      );
    }

    this.readFolders();
  };

  private readFolders = () => {
    this.electron.send(IPC_EVENT.READ_FOLDER, environment.root);

    this.electron
      .once(IPC_EVENT.READ_FOLDER_RESPONSE)
      .then((response: IPC_RESPONSE) => {
        const { success, data, error } = response;

        if (success && data) {
          this.store.setFolders(data);
        } else alert('Error reading folder: ' + error);
      });
  };

  onRoute = (dir: string) => {
    this.router.navigate([URL_STRING.FOLDER_READER, dir]);
  };
}
