import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtichetteComponentComponent } from './etichette-component.component';

describe('EtichetteComponentComponent', () => {
  let component: EtichetteComponentComponent;
  let fixture: ComponentFixture<EtichetteComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtichetteComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtichetteComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
