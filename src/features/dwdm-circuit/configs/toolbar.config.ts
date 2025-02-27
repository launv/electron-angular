import { ui } from 'joint-plus';

export const toolbarConfig: ui.Toolbar.Options = {
  tools: [
    {
      type: 'button',
      name: 'json',
      text: 'Export JSON',
    },
    {
      type: 'button',
      name: 'svg',
      text: 'Export SVG',
    },
    'separator',
    'zoomToFit',
    'zoomSlider',
  ],
  autoToggle: true,
};
