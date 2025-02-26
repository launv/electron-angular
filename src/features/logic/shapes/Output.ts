import { IO } from './IO';

export const Output = IO.define('logic.Output', {
  attrs: {
    '.wire': { 'ref-x': 0, d: 'M 0 0 L -23 0' },
    circle: {
      ref: '.body',
      'ref-x': -30,
      'ref-y': 0.5,
      magnet: 'passive',
      class: 'input',
      port: 'in',
    },
    text: { text: 'output' },
  },
});
