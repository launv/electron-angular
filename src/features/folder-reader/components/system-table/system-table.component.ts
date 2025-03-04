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
import { environment } from 'environments/environment';
import { indexOf, random } from 'lodash';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { takeUntil } from 'rxjs';
import { STORAGE_KEY } from '../../../../../shared/constants/storage-key';
import { URL_STRING } from '../../../../../shared/constants/url-string';
import { ObservableComponent } from '../../../../../shared/observable/observable.component';
import { ElectronApiService } from '../../../../../shared/services/electron-api.service';

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
    private location: Location,
    private electron: ElectronApiService
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
        electron.send(
          IPC_EVENT.READ_FOLDER,
          `${environment.root}/${this.buttonDir}/${selectedSystem}`
        );

        electron
          .once(IPC_EVENT.READ_FOLDER_RESPONSE)
          .then((response: IPC_RESPONSE) => {
            const { success, data, error } = response;

            if (success && data) {
              this.componentStore.setSymptom(data);
            } else alert('Error reading folder: ' + error);
          });
      }
    });
  }

  private createSystemList = () => {
    for (let index = 1; index < random(5); index++) {
      this.electron.send(
        IPC_EVENT.CREATE_FOLDER,
        `${environment.root}/${this.buttonDir}/System ${index}`
      );
    }

    this.scanSystemList();
  };

  private scanSystemList = () => {
    this.electron.send(
      IPC_EVENT.READ_FOLDER,
      `${environment.root}/${this.buttonDir}`
    );

    this.electron
      .once(IPC_EVENT.READ_FOLDER_RESPONSE)
      .then((response: IPC_RESPONSE) => {
        const { success, data, error } = response;

        if (success && data) {
          this.componentStore.setSystems(data);
        } else {
          alert('Error reading folder: ' + error);
          this.location.back();
        }
      });
  };

  /**
   * root/buttonDir/{systemDir}
   * @param systemDir
   */
  selectSystem = (systemDir: string) => {
    this.createSymptomList(systemDir);
    this.componentStore.setSelectedSystem(systemDir);
  };

  private createSymptomList = (systemDir: string) => {
    for (let index = 1; index < random(5); index++) {
      this.electron.send(
        IPC_EVENT.CREATE_FOLDER,
        `${environment.root}/${this.buttonDir}/${systemDir}/Symptom ${index}`
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
