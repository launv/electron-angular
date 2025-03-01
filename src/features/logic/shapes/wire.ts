import * as joint from 'jointjs';

export const Wire = joint.dia.Link.define(
  'logic.Wire',
  {
    attrs: {
      '.connection': { 'stroke-width': 2 },
      '.marker-vertex': { r: 7 },
    },

    router: { name: 'orthogonal' },
    connector: { name: 'rounded', args: { radius: 10 } },
  },
  {
    useCSSSelectors: true,
    arrowheadMarkup: [
      '<g class="marker-arrowhead-group marker-arrowhead-group-<%= end %>">',
      '<circle class="marker-arrowhead" end="<%= end %>" r="7"/>',
      '</g>',
    ].join(''),

    vertexMarkup: [
      '<g class="marker-vertex-group" transform="translate(<%= x %>, <%= y %>)">',
      '<circle class="marker-vertex" idx="<%= idx %>" r="10" />',
      '<g class="marker-vertex-remove-group">',
      '<path class="marker-vertex-remove-area" idx="<%= idx %>" d="M16,5.333c-7.732,0-14,4.701-14,10.5c0,1.982,0.741,3.833,2.016,5.414L2,25.667l5.613-1.441c2.339,1.317,5.237,2.107,8.387,2.107c7.732,0,14-4.701,14-10.5C30,10.034,23.732,5.333,16,5.333z" transform="translate(5, -33)"/>',
      '<path class="marker-vertex-remove" idx="<%= idx %>" transform="scale(.8) translate(9.5, -37)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z">',
      '<title>Remove vertex.</title>',
      '</path>',
      '</g>',
      '</g>',
    ].join(''),
  }
);
