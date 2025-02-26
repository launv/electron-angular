import { Gate } from './Gate';

export const Gate11 = Gate.define(
  'logic.Gate11',
  {
    attrs: {
      '.input': {
        ref: '.body',
        'ref-x': -2,
        'ref-y': 0.5,
        magnet: 'passive',
        port: 'in',
      },
      '.output': {
        ref: '.body',
        'ref-dx': 2,
        'ref-y': 0.5,
        magnet: true,
        port: 'out',
      },
    },
  },
  {
    markup:
      '<g class="rotatable"><g class="scalable"><image class="body"/></g><circle class="input"/><circle class="output"/></g>',
  }
);
