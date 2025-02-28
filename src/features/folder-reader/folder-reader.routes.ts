import { Routes } from '@angular/router';
import { MainFolderComponent } from './components/main-folder/main-folder.component';
import { SubFolderComponent } from './components/sub-folder/sub-folder.component';

export default [
  { path: '', component: MainFolderComponent },
  { path: ':dir', component: SubFolderComponent },
] as Routes;
