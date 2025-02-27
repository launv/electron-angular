import { dia } from 'joint-plus';

export const paperConfig: dia.Paper.Options = {
  gridSize: 10,
  drawGrid: true,
  background: {
    color: '#F8F9FA',
  },
  defaultRouter: { name: 'orthogonal' },
  defaultConnector: { name: 'straight', args: { cornerType: 'line' } },
  snapLinks: { radius: 70 },
};
