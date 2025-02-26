import { Routes } from '@angular/router';

export const URL_STRING = {
  HOME: '',
  FORM: 'form',
  DWDM: 'dwdm',
};

export const routes: Routes = [
  {
    path: URL_STRING.FORM,
    loadComponent: () =>
      import('../features/form/form.component').then((c) => c.FormComponent),
  },
  {
    path: URL_STRING.DWDM,
    loadComponent: () =>
      import('../features/dwdm-circuit/dwdm-circuit.component').then(
        (c) => c.DwdmCircuitComponent
      ),
  },
  {
    path: URL_STRING.HOME,
    redirectTo: `/${URL_STRING.DWDM}`,
    pathMatch: 'full',
  },
];
