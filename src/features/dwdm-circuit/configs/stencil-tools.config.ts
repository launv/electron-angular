const myShapesGroup1 = [
  { type: 'standard.Rectangle' },
  { type: 'standard.Ellipse' },
];
const myShapesGroup2 = [
  {
    type: 'standard.Rectangle',
    size: { width: 70, height: 50 },
    attrs: {
      body: {
        stroke: '#C94A46',
        rx: 2,
        ry: 2,
      },
    },
  },
  {
    type: 'standard.Ellipse',
    size: { width: 70, height: 50 },
    attrs: {
      body: {
        stroke: '#C94A46',
      },
    },
  },
  {
    type: 'standard.Polygon',
    size: { width: 70, height: 50 },
    attrs: {
      body: {
        stroke: '#C94A46',
        points: 'calc(w/2),0 calc(w),calc(h/2) calc(w/2),calc(h) 0,calc(h/2)',
      },
    },
  },
  {
    type: 'standard.Cylinder',
    size: { width: 70, height: 50 },
    attrs: {
      body: {
        stroke: '#C94A46',
      },
      top: {
        fill: '#C94A46',
        stroke: '#C94A46',
      },
    },
  },
];

export const stencilToolsConfig = { myShapesGroup1, myShapesGroup2 };
