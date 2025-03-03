import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { IPC_EVENT } from '../../../../../shared/constants/main-events';
import { IPC_RESPONSE } from '../../../../../shared/interfaces/ipc-response';
import { FolderReaderStore } from '../../folder-reader.store';
import { SystemTableStore } from './system-table.store';

import { CommonModule, Location } from '@angular/common';
import { delay, indexOf, random } from 'lodash';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { STORAGE_KEY } from '../../../../../shared/constants/storage-key';
import { URL_STRING } from '../../../../../shared/constants/url-string';
import { ObservableComponent } from '../../../../../shared/observable/observable.component';
import { takeUntil } from 'rxjs';
import { environment } from 'environments/environment';

declare const window: any; // Ensure Electron is available

@Component({
  standalone: true,
  selector: 'app-system-table',
  imports: [
    ButtonModule,
    PanelModule,
    ButtonModule,
    DividerModule,
    InputTextModule,
    CommonModule,
  ],
  templateUrl: './system-table.component.html',
  styleUrl: './system-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FolderReaderStore, SystemTableStore],
})
export class SystemTableComponent extends ObservableComponent {
  readonly store = inject(FolderReaderStore);

  readonly componentStore = inject(SystemTableStore);

  buttonDir = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    super();

    activatedRoute.params.pipe(takeUntil(this.$destroy)).subscribe((res) => {
      const { dir } = res;
      this.buttonDir = dir ?? '';
      this.componentStore.reset();
      this.createSystemList();
    });

    effect(() => {
      const selectedSystem = this.componentStore.selectedSystem();

      if (selectedSystem) {
        window
          .require('electron')
          .ipcRenderer.send(
            IPC_EVENT.READ_FOLDER,
            `${environment.dir}/${this.buttonDir}/${selectedSystem}`
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
      }
    });
  }

  private createSystemList = () => {
    for (let index = 1; index < random(5); index++) {
      window
        .require('electron')
        .ipcRenderer.send(
          IPC_EVENT.CREATE_FOLDER,
          `${environment.dir}/${this.buttonDir}/System ${index}`
        );
    }

    this.scanSystemList();
  };

  private scanSystemList = () => {
    window
      .require('electron')
      .ipcRenderer.send(
        IPC_EVENT.READ_FOLDER,
        `${environment.dir}/${this.buttonDir}`
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
  selectSystem = (systemDir: string) => {
    this.createSymptomList(systemDir);
    delay(() => this.componentStore.setSelectedSystem(systemDir), 500);
  };

  private createSymptomList = (systemDir: string) => {
    for (let index = 1; index < random(5); index++) {
      window
        .require('electron')
        .ipcRenderer.send(
          IPC_EVENT.CREATE_FOLDER,
          `${environment.dir}/${this.buttonDir}/${systemDir}/Symptom ${index}`
        );
    }
  };

  /**
   *
   * @param buttonDir
   */
  switchTo = (buttonDir: string) => {
    this.router.navigate([URL_STRING.FOLDER_READER, buttonDir], {
      replaceUrl: true,
    });
  };

  /**
   *
   * @param symptomPath
   */
  selectSymptom = (symptomPath: string) => {
    this.router.navigate([
      URL_STRING.FOLDER_READER,
      this.buttonDir,
      this.componentStore.selectedSystem(),
      symptomPath,
    ]);
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
