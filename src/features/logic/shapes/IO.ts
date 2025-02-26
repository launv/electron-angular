import { Gate } from './Gate';

export const IO = Gate.define(
  'logic.IO',
  {
    size: { width: 60, height: 30 },
    attrs: {
      '.body': { fill: 'white', stroke: 'black', 'stroke-width': 2 },
      '.wire': { ref: '.body', 'ref-y': 0.5, stroke: 'black' },
      text: {
        fill: 'black',
        ref: '.body',
        'ref-x': 0.5,
        'ref-y': 0.5,
        'y-alignment': 'middle',
        'text-anchor': 'middle',
        'font-weight': 'bold',
        'font-variant': 'small-caps',
        'text-transform': 'capitalize',
        'font-size': '14px',
      },
    },
  },
  {
    markup:
      '<g class="rotatable"><g class="scalable"><rect class="body"/></g><path class="wire"/><circle/><text/></g>',
  }
);
