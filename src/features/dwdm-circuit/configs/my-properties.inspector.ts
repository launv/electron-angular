import { ui } from 'joint-plus';

export const myProperties: ui.Inspector.Options = {
  // open the inspector when the user interacts with an element
  inputs: {
    attrs: {
      body: {
        fill: {
          type: 'color-palette',
          options: [
            { content: '#FFFFFF' },
            { content: '#FF0000' },
            { content: '#00FF00' },
            { content: '#0000FF' },
            { content: '#000000' },
          ],
          label: 'Fill color',
          group: 'presentation',
          index: 1,
        },
        stroke: {
          type: 'color-palette',
          options: [
            { content: '#FFFFFF' },
            { content: '#FF0000' },
            { content: '#00FF00' },
            { content: '#0000FF' },
            { content: '#000000' },
          ],
          label: 'Outline color',
          group: 'presentation',
          index: 2,
        },
        strokeWidth: {
          type: 'range',
          min: 0,
          max: 50,
          unit: 'px',
          label: 'Outline thickness',
          group: 'presentation',
          index: 3,
        },
      },
      label: {
        text: {
          type: 'textarea',
          label: 'Text',
          group: 'text',
          index: 1,
        },
        fontSize: {
          type: 'range',
          min: 5,
          max: 30,
          label: 'Font size',
          group: 'text',
          index: 2,
        },
        fontFamily: {
          type: 'select',
          options: ['Arial', 'Times New Roman', 'Courier New'],
          label: 'Font family',
          group: 'text',
          index: 3,
        },
      },
    },
  },
  groups: {
    presentation: {
      label: 'Presentation',
      index: 1,
    },
    text: {
      label: 'Text',
      index: 2,
    },
  },
};
