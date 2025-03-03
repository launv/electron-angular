import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SymptomTableComponent } from './symptom-table.component';

describe('SymptomTableComponent', () => {
  let component: SymptomTableComponent;
  let fixture: ComponentFixture<SymptomTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SymptomTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SymptomTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
