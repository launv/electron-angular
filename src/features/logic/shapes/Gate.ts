import * as joint from 'jointjs';

export const Gate = joint.dia.Element.define(
  'logic.Gate',
  {
    size: { width: 80, height: 40 },
    attrs: {
      '.': { magnet: false },
      '.body': { width: 100, height: 50 },
      circle: {
        r: 7,
        stroke: 'black',
        fill: 'transparent',
        'stroke-width': 2,
      },
    },
  },
  {
    useCSSSelectors: true,
    operation: function () {
      return true;
    },
  }
);
