import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DwdmCircuitComponent } from './dwdm-circuit.component';

describe('DwdmCircuitComponent', () => {
  let component: DwdmCircuitComponent;
  let fixture: ComponentFixture<DwdmCircuitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DwdmCircuitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DwdmCircuitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
