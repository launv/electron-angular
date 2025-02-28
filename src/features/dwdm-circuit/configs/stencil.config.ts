import { ui } from 'joint-plus';

export const stencilConfig: ui.Stencil.Options = {
  scaleClones: true,
  layout: true,
  dropAnimation: true,
  width: 220,
  height: 500,
  groups: {
    myShapesGroup1: { index: 1, label: ' Simple', closed: true },
    myShapesGroup2: { index: 2, label: ' Advanced' },
  },
  groupsToggleButtons: true,
  search: {
    '*': ['type', 'attrs/label/text'],
  },
  paper: {} as any,
};
