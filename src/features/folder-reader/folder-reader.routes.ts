import { Routes } from '@angular/router';
import { MainFolderComponent } from './components/main-folder/main-folder.component';
import { SystemTableComponent } from './components/system-table/system-table.component';
import { SymptomTableComponent } from './components/symptom-table/symptom-table.component';

export default [
  { path: '', component: MainFolderComponent },
  {
    path: ':dir',
    children: [
      { path: '', component: SystemTableComponent },
      { path: ':system/:symptom', component: SymptomTableComponent },
    ],
  },
] as Routes;
