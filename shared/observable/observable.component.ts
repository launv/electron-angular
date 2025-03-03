import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-observable',
  imports: [],
  templateUrl: './observable.component.html',
  styleUrl: './observable.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObservableComponent implements OnInit, AfterViewInit, OnDestroy {
  $destroy = new Subject();

  ngOnInit(): void {
    this.onInit();
  }

  ngAfterViewInit(): void {
    this.onAfterViewInit();
  }

  onInit() {}
  onAfterViewInit() {}

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }
}
