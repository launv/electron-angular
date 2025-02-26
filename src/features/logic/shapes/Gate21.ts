import { Gate } from './Gate';

export const Gate21 = Gate.define(
  'logic.Gate21',
  {
    attrs: {
      '.input1': {
        ref: '.body',
        'ref-x': -2,
        'ref-y': 0.3,
        magnet: 'passive',
        port: 'in1',
      },
      '.input2': {
        ref: '.body',
        'ref-x': -2,
        'ref-y': 0.7,
        magnet: 'passive',
        port: 'in2',
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
      '<g class="rotatable"><g class="scalable"><image class="body"/></g><circle class="input input1"/><circle  class="input input2"/><circle class="output"/></g>',
  }
);
