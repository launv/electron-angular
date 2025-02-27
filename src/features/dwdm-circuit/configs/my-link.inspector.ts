import { ui } from 'joint-plus';

export const myLink: ui.Inspector.Options = {
  inputs: {
    labels: {
      type: 'list',
      label: 'Labels',
      item: {
        type: 'object',
        properties: {
          attrs: {
            text: {
              text: {
                type: 'content-editable',
                label: 'Text',
                defaultValue: 'label',
              },
            },
          },
          position: {
            type: 'select-box',
            options: [
              { value: 30, content: 'Source' },
              { value: 0.5, content: 'Middle' },
              { value: -30, content: 'Target' },
            ],
            defaultValue: 0.5,
            label: 'Position',
          },
        },
      },
    },
  },
};
