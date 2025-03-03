import { CommonModule, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { TableModule } from 'primeng/table';
import { takeUntil } from 'rxjs';
import { IPC_EVENT } from '../../../../../shared/constants/main-events';
import { IPC_RESPONSE } from '../../../../../shared/interfaces/ipc-response';
import { ObservableComponent } from '../../../../../shared/observable/observable.component';
import { SymptomStore } from './symptom.store';
import { ButtonModule } from 'primeng/button';
declare const window: any; // Ensure Electron is available

@Component({
  standalone: true,
  selector: 'app-symptom-table',
  imports: [TableModule, CommonModule, ButtonModule],
  templateUrl: './symptom-table.component.html',
  styleUrl: './symptom-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SymptomStore],
})
export class SymptomTableComponent extends ObservableComponent {
  readonly componentStore = inject(SymptomStore);

  symptomName: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    super();

    activatedRoute.params.pipe(takeUntil(this.$destroy)).subscribe((res) => {
      const { dir, system, symptom } = res;
      this.symptomName = symptom;
      const routeTree = [environment.dir, dir, system, symptom, 'data.json'];
      const filePath = routeTree.join('/');
      // this.readFile(filePath);
      this.writeFile(filePath);
    });
  }

  /**
   *
   */

  writeFile = (filePath: string) => {
    const data = [
      {
        code: '1',
        name: 'Auto 1',
        category: 'Cat 1',
        quantity: 1,
      },
      {
        code: '2',
        name: 'Auto 2',
        category: 'Cat 2',
        quantity: 2,
      },
    ];

    window.require('electron').ipcRenderer.send(IPC_EVENT.WRITE_FILE, {
      filePath,
      content: JSON.stringify(data),
    });

    window
      .require('electron')
      .ipcRenderer.once(
        IPC_EVENT.WRITE_FILE_RESPONSE,
        (_: any, response: IPC_RESPONSE) => {
          const { success, error } = response;

          if (success) this.readFile(filePath);
          else alert('Error writing file: ' + error);
        }
      );
  };
  /**
   *
   * @param filePath
   */
  readFile = (filePath: string) => {
    window.require('electron').ipcRenderer.send(IPC_EVENT.READ_FILE, filePath);

    window
      .require('electron')
      .ipcRenderer.once(
        IPC_EVENT.READ_FILE_RESPONSE,
        (_: any, response: IPC_RESPONSE) => {
          const { success, data, error } = response;

          if (success && data) {
            const products = JSON.parse(data);
            this.componentStore.setProducts(products);
          } else alert('Error reading file: ' + error);
        }
      );
  };

  /**
   *
   * @returns
   */
  back = () => this.location.back();
}
