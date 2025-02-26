import { IO } from './IO';

export const Input = IO.define('logic.Input', {
  attrs: {
    '.wire': { 'ref-dx': 0, d: 'M 0 0 L 23 0' },
    circle: {
      ref: '.body',
      'ref-dx': 30,
      'ref-y': 0.5,
      magnet: true,
      class: 'output',
      port: 'out',
    },
    text: { text: 'input' },
  },
});
