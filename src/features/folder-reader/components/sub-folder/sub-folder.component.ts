import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import {
  ActivatedRoute,
  DefaultUrlSerializer,
  Router,
  UrlSerializer,
  UrlTree,
} from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { IPC_EVENT } from '../../../../../shared/constants/main-events';
import { IPC_RESPONSE } from '../../../../../shared/interfaces/ipc-response';
import { FolderReaderStore } from './../../folder-reader.store';
import { SubFolderStore } from './sub-folder.store';

import { Location } from '@angular/common';
import { indexOf, join } from 'lodash';
import { InputTextModule } from 'primeng/inputtext';
import { STORAGE_KEY } from '../../../../../shared/constants/storage-key';
import { URL_STRING } from '../../../../../shared/constants/url-string';
import { DividerModule } from 'primeng/divider';

declare const window: any; // Ensure Electron is available

@Component({
  standalone: true,
  selector: 'app-sub-folder',
  imports: [
    ButtonModule,
    PanelModule,
    ButtonModule,
    DividerModule,
    InputTextModule,
  ],
  templateUrl: './sub-folder.component.html',
  styleUrl: './sub-folder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FolderReaderStore, SubFolderStore],
})
export class SubFolderComponent implements AfterViewInit, UrlSerializer {
  readonly store = inject(FolderReaderStore);

  readonly componentStore = inject(SubFolderStore);

  private defaultUrlSerializer: DefaultUrlSerializer =
    new DefaultUrlSerializer();

  buttonDir = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.buttonDir = activatedRoute.snapshot.paramMap.get('dir') ?? '';
  }

  parse(url: string): UrlTree {
    return this.defaultUrlSerializer.parse(url);
  }

  serialize(tree: UrlTree): string {
    return this.defaultUrlSerializer.serialize(tree).replace(/%20/g, '-');
  }

  ngAfterViewInit(): void {
    this.readFolders();
    console.log(this.store.folders());
  }

  private readFolders = () => {
    window
      .require('electron')
      .ipcRenderer.send(
        IPC_EVENT.READ_FOLDER,
        `${this.store.dir()}/${this.buttonDir}`
      );

    window
      .require('electron')
      .ipcRenderer.once(
        IPC_EVENT.READ_FOLDER_RESPONSE,
        (_: any, response: IPC_RESPONSE) => {
          const { success, data, error } = response;

          if (success && data) {
            this.componentStore.setSystems(data);
          } else {
            alert('Error reading folder: ' + error);
            this.location.back();
          }
        }
      );
  };

  /**
   * root/buttonDir/{systemDir}
   * @param systemDir
   */
  onOpen = (systemDir: string) => {
    window
      .require('electron')
      .ipcRenderer.send(
        IPC_EVENT.READ_FOLDER,
        `${this.store.dir()}/${this.buttonDir}/${systemDir}`
      );

    window
      .require('electron')
      .ipcRenderer.once(
        IPC_EVENT.READ_FOLDER_RESPONSE,
        (_: any, response: IPC_RESPONSE) => {
          const { success, data, error } = response;

          if (success && data) {
            this.componentStore.setSymptom(data);
          } else alert('Error reading folder: ' + error);
        }
      );
  };

  goTo = (buttonDir: string) => {
    // TODO: replace url and reload
    this.router.navigate([URL_STRING.FOLDER_READER, buttonDir], {
      replaceUrl: true,
    });
  };

  get previousButton(): string | null {
    const folders = this.folderFromStorage;
    const current = indexOf(folders, this.buttonDir);

    if (current < 0 || current < 1) return null;

    return folders[current - 1];
  }

  get nextButton(): string | null {
    const folders = this.folderFromStorage;
    const current = indexOf(folders, this.buttonDir);

    if (current < 0 || current > folders.length - 1) return null;

    return folders[current + 1];
  }

  get folderFromStorage(): string[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEY.FOLDER) ?? '') ?? [];
  }
}
