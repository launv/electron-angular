import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { dia, shapes, ui, format, util, setTheme } from 'joint-plus';
import { myProperties } from './configs/my-properties.inspector';
import { myLink } from './configs/my-link.inspector';
import { paperConfig } from './configs/paper.config';
import { stencilConfig } from './configs/stencil.config';
import { toolbarConfig } from './configs/toolbar.config';
import { stencilToolsConfig } from './configs/stencil-tools.config';

@Component({
  standalone: true,
  selector: 'app-dwdm-circuit',
  imports: [],
  templateUrl: './dwdm-circuit.component.html',
  styleUrl: './dwdm-circuit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DwdmCircuitComponent implements OnInit, AfterViewInit {
  @ViewChild('stencil') stencilEl: ElementRef;

  @ViewChild('paper') paperEl: ElementRef;

  @ViewChild('toolbar') toolbarEl: ElementRef;

  @ViewChild('inspector') inspectorEl: ElementRef;

  @ViewChild('navigator') navigatorEl: ElementRef;

  private graph: dia.Graph;

  private paper: dia.Paper;

  private paperScroller: ui.PaperScroller;

  // private scroller: ui.PaperScroller;

  private stencil: ui.Stencil;

  private toolbar: ui.Toolbar;

  private navigator: ui.Navigator;

  ngOnInit(): void {
    this.initLayout();
  }

  ngAfterViewInit() {
    this.renderUI();

    this.stencil.load(stencilToolsConfig);

    this.createElements();

    this.changeListeners();

    setTheme('modern');
  }

  /**
   * define
   * - paper,
   * - paperScroller,
   * - stencil,
   * - toolbar
   */
  private initLayout = () => {
    this.graph = new dia.Graph({}, { cellNamespace: shapes });

    this.paper = new dia.Paper({
      model: this.graph,
      cellViewNamespace: shapes,
      ...paperConfig,
    });

    this.paperScroller = new ui.PaperScroller({
      paper: this.paper,
      autoResizePaper: true,
      cursor: 'grab',
      scrollWhileDragging: true,
    });

    this.stencil = new ui.Stencil({
      ...stencilConfig,
      paper: this.paper,
    });

    // create toolbar
    this.toolbar = new ui.Toolbar({
      ...toolbarConfig,
      references: {
        paperScroller: this.paperScroller,
      },
    });

    // Navigator plugin initialization
    this.navigator = new ui.Navigator({
      paperScroller: this.paperScroller,
      width: 300,
      height: 200,
      padding: 10,
      zoomOptions: { max: 2, min: 0.2 },
    });
  };

  /**
   * render UI
   */
  private renderUI = () => {
    const {
      paper,
      paperEl,
      paperScroller,
      stencil,
      stencilEl,
      toolbar,
      toolbarEl,
      navigator,
      navigatorEl,
    } = this;

    paper.render();
    paperEl.nativeElement.appendChild(paperScroller.el);

    stencil.render();
    stencilEl.nativeElement.appendChild(stencil.el);

    toolbar.render();
    toolbarEl.nativeElement.appendChild(toolbar.el);

    navigator.render();
    navigatorEl.nativeElement.appendChild(navigator.el);
  };

  private createElements = () => {
    // create elements
    const rect1 = new shapes.standard.Rectangle({
      position: { x: 25, y: 25 },
      attrs: {
        body: { stroke: '#C94A46', rx: 2, ry: 2 },
        label: { text: 'Hello', fill: '#353535' },
      },
    });
    rect1.resize(180, 50);
    rect1.addTo(this.graph);

    const rect2 = new shapes.standard.Rectangle({
      position: { x: 95, y: 225 },
      attrs: {
        body: { stroke: '#C94A46', rx: 2, ry: 2 },
        label: { text: 'World!', fill: '#353535' },
      },
    });
    rect2.resize(180, 50);
    rect2.addTo(this.graph);

    // create link
    const link = new shapes.standard.Link();
    link.source(rect1);
    link.target(rect2);
    link.addTo(this.graph);

    link.appendLabel({
      attrs: {
        text: {
          text: 'to the',
        },
      },
    });
    link.router('orthogonal');
    link.connector('straight', { cornerType: 'line' });

    // create stencil
    const stencil = new ui.Stencil({
      paper: this.paper,
      width: 170,
      layout: true,
      dropAnimation: true,
    });
    stencil.render();
  };

  private openHalo = (cellView: dia.CellView) =>
    new ui.Halo({ cellView }).render();

  // create inspector
  private openInspector = (cell: dia.Cell) => {
    this.closeInspector(); // close inspector if currently open

    const option: ui.Inspector.Options = cell.isElement()
      ? { cell, ...myProperties }
      : { cell, ...myLink };
    ui.Inspector.create('#inspector', option);
  };

  private closeInspector = () => ui.Inspector.close();

  private changeListeners = () => {
    const { paper, graph, paperScroller, toolbar } = this;

    paper.on('cell:pointerup', (cellView) => {
      this.openHalo(cellView);
      this.openInspector(cellView.model);
    });

    paper.on('paper:pinch', (_evt, ox, oy, scale) => {
      const zoom = paperScroller.zoom();
      paperScroller.zoom(zoom * scale, {
        min: 0.2,
        max: 5,
        ox,
        oy,
        absolute: true,
      });
    });

    paper.on('blank:pointerdown', (evt) => {
      // Start panning the paper on mousedown
      paperScroller.startPanning(evt);
      // close inspector if currently open
      this.closeInspector();
    });

    toolbar.on('json:pointerclick', () => {
      const str = JSON.stringify(graph.toJSON());
      const bytes = new TextEncoder().encode(str);
      const blob = new Blob([bytes], {
        type: 'application/json;charset=utf-8',
      });
      util.downloadBlob(blob, 'joint-plus.json');
    });

    toolbar.on('svg:pointerclick', () => {
      format.toSVG(
        paper,
        (svg) => {
          util.downloadDataUri(
            `data:image/svg+xml,${encodeURIComponent(svg)}`,
            'joint-plus.svg'
          );
        },
        { useComputedStyles: false }
      );
    });
  };
}
