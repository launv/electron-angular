import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import * as joint from 'jointjs'; // Use this for the free version

@Component({
  standalone: true,
  selector: 'app-dwdm-circuit',
  imports: [],
  templateUrl: './dwdm-circuit.component.html',
  styleUrl: './dwdm-circuit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DwdmCircuitComponent implements AfterViewInit {
  @ViewChild('diagramContainer', { static: false })
  diagramContainer!: ElementRef;

  ngAfterViewInit() {
    const graph = new joint.dia.Graph();

    const paper = new joint.dia.Paper({
      el: this.diagramContainer.nativeElement,
      model: graph,
      width: 800,
      height: 600,
      gridSize: 10,
    });

    const rect = new joint.shapes.standard.Rectangle();
    rect.position(100, 100);
    rect.resize(100, 40);
    rect.attr({
      body: { fill: 'blue' },
      label: { text: 'Hello JointJS', fill: 'white' },
    });

    rect.addTo(graph);
  }
}
