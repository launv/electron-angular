import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import * as joint from 'jointjs';
import {
  Input,
  Output,
  Gate,
  Repeater,
  Not,
  And,
  Nand,
  Or,
  Nor,
  Xor,
  Xnor,
  Wire,
} from './shapes';

@Component({
  standalone: true,
  selector: 'app-logic',
  imports: [],
  templateUrl: './logic.component.html',
  styleUrl: './logic.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogicComponent implements AfterViewInit {
  @ViewChild('diagramContainer', { static: false })
  diagramContainer!: ElementRef;
  shapes = {
    ...joint.shapes,
    logic: {
      Input,
      Output,
      Gate,
      Repeater,
      Not,
      And,
      Nand,
      Or,
      Nor,
      Xor,
      Xnor,
      Wire,
    },
  };

  private graph: joint.dia.Graph;
  private paper: joint.dia.Paper;
  private current: number = 0;
  constructor() {}

  ngAfterViewInit() {
    this.initPaperNGraph();
    this.addSource();
    this.current = this.initializeSignal();
    this.signalListener();
  }

  private initPaperNGraph = () => {
    this.graph = new joint.dia.Graph({}, { cellNamespace: this.shapes });

    this.paper = new joint.dia.Paper({
      el: this.diagramContainer.nativeElement,
      model: this.graph,
      width: 1000,
      height: 600,
      background: { color: '#F5F5F5' },
      gridSize: 10,
      snapLinks: true,
      linkPinning: false,
      cellViewNamespace: this.shapes,
      linkView: joint.dia.LinkView,
      defaultLink: new this.shapes.logic.Wire(),
      drawGrid: {
        name: 'dot',
        args: [{ color: 'red', thickness: 1 }],
      },
    });

    // zoom the viewport by 50%
    this.paper.scale(1.5, 1.5);
  };

  private addSource = () => {
    // diagram setup
    const gates = {
      repeater: new this.shapes.logic.Repeater({ position: { x: 410, y: 25 } }),
      or: new this.shapes.logic.Or({ position: { x: 550, y: 50 } }),
      and: new this.shapes.logic.And({ position: { x: 550, y: 150 } }),
      not: new this.shapes.logic.Not({ position: { x: 90, y: 140 } }),
      nand: new this.shapes.logic.Nand({ position: { x: 550, y: 250 } }),
      nor: new this.shapes.logic.Nor({ position: { x: 270, y: 190 } }),
      xor: new this.shapes.logic.Xor({ position: { x: 550, y: 200 } }),
      xnor: new this.shapes.logic.Xnor({ position: { x: 550, y: 100 } }),
      input: new this.shapes.logic.Input({ position: { x: 5, y: 45 } }),
      output: new this.shapes.logic.Output({ position: { x: 440, y: 290 } }),
    };

    const wires = [
      {
        source: { id: gates.input.id, port: 'out' },
        target: { id: gates.not.id, port: 'in' },
      },
      {
        source: { id: gates.not.id, port: 'out' },
        target: { id: gates.nor.id, port: 'in1' },
      },
      {
        source: { id: gates.nor.id, port: 'out' },
        target: { id: gates.repeater.id, port: 'in' },
      },
      {
        source: { id: gates.nor.id, port: 'out' },
        target: { id: gates.output.id, port: 'in' },
      },
      {
        source: { id: gates.repeater.id, port: 'out' },
        target: { id: gates.nor.id, port: 'in2' },
        vertices: [{ x: 215, y: 100 }],
      },
    ];

    // add gates and wires to the graph
    this.graph.addCells(joint.util.toArray(gates));
    joint.util.forIn(wires, (attributes) => {
      // const cellView: CellView = paper.findViewByModel(attributes.source);
      // graph.addCell(paper.getDefaultLink(cellView).set(attributes));
      const link = new this.shapes.standard.Link();
      link.source(attributes.source);
      link.target(attributes.target);
      link.vertices(attributes.vertices);
      link.addTo(this.graph);
      link.router('orthogonal');
      link.connector('straight', { cornerType: 'line' });
    });
  };

  private initializeSignal = (): number => {
    const signal = Math.random();
    // > 0 wire with a positive signal is alive
    // < 0 wire with a negative signal means, there is no signal
    // 0 none of the above - reset value

    // cancel all signals stores in wires

    joint.util.invoke(this.graph.getLinks(), 'set', { signal: 0 } as any);

    // remove all 'live' classes
    joint
      .V(this.paper.viewport)
      .find('.live')
      .forEach((element) => {
        element.removeClass('live');
      });

    this.graph.getElements().forEach((element) => {
      // broadcast a new signal from every input in the graph
      if (element instanceof this.shapes.logic.Input) {
        this.broadcastSignal(element, signal);
      }
    });

    return signal;
  };

  private broadcastSignal = (gate: any, signal: number) => {
    // broadcast signal to all output ports
    setTimeout(() => {
      joint.util.invoke(
        this.graph.getConnectedLinks(gate, {
          outbound: true,
        }),
        'set',
        { signal } as any
      );
    }, 0);
  };

  private toggleLive = (model: any, signal: number) => {
    // add 'live' class to the element if there is a positive signal
    model.findView(this.paper)?.vel.toggleClass('live', signal > 0);
  };

  private signalListener = () => {
    // Every logic gate needs to know how to handle a situation, when a signal comes to their ports.
    this.shapes.logic.Gate.prototype.onSignal = (signal: any, handler: any) => {
      handler(signal);
    };
    // The repeater delays a signal handling by 400ms
    this.shapes.logic.Repeater.prototype.onSignal = (
      signal: any,
      handler: any
    ) => {
      setTimeout(() => handler(signal), 400);
    };
    // Output element just marks itself as alive.
    this.shapes.logic.Output.prototype.onSignal = (signal: number) => {
      this.toggleLive(this, signal);
    };

    (this.graph as any).on(
      'change:source change:target',
      (model: any, end: any) => {
        console.log('change:source change:target', model);

        let e = 'target' in model.changed ? 'target' : 'source';

        if (
          (model.previous(e).id && !model.get(e).id) ||
          (!model.previous(e).id && model.get(e).id)
        ) {
          // if source/target has been connected to a port or disconnected from a port reinitialize signals
          this.current = this.initializeSignal();
        }
      }
    );

    (this.graph as any).on('change:signal', (wire: any, signal: any) => {
      this.toggleLive(wire, signal);

      let magnitude = Math.abs(signal);

      // if a new signal has been generated stop transmitting the old one
      if (magnitude !== this.current) return;

      let gate = wire.getTargetElement();
      if (gate) {
        gate.onSignal(signal, () => {
          // get an array of signals on all input ports
          let inboundLinks = this.graph.getConnectedLinks(gate, {
            inbound: true,
          });
          let linksByPorts = joint.util.groupBy(inboundLinks, (wire) => {
            return wire.get('target').port;
          });
          let inputs = joint.util.toArray(linksByPorts).map((wires) => {
            return (
              Math.max.apply(
                this,
                joint.util.invoke(wires, 'set', { signal } as any)
              ) > 0
            );
          });

          // calculate the output signal
          let output =
            magnitude * (gate.operation.apply(gate, inputs) ? 1 : -1);

          this.broadcastSignal(gate, output);
        });
      }
    });
  };
}
