import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { IPC_EVENT } from '../../../shared/constants/main-events';
import { IPC_RESPONSE } from '../../../shared/interfaces/ipc-response';
import { environment } from 'environments/environment';

declare const window: any; // Ensure Electron is available

interface City {
  name: string;
  code: string;
}

@Component({
  standalone: true,
  selector: 'app-form',
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    Checkbox,
    InputTextModule,
    Select,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {
  filePath = environment.dir + '/test.txt'; // Change as needed
  formGroup: FormGroup | undefined;
  cities: City[] = [];

  constructor() {
    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' },
    ];
    this.formGroup = new FormGroup({
      text: new FormControl<string | null>(null, Validators.required),
      city: new FormControl<string | null>(null),
      selectedCity: new FormControl<City | null>(null),
    });

    this.readFile();
  }

  writeFile() {
    const content = JSON.stringify(this.formGroup?.value);
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

          if (success && data) {
            const formValue = JSON.parse(data);
            this.formGroup?.setValue(formValue);
          } else alert('Error reading file: ' + error);
        }
      );
  }
}
