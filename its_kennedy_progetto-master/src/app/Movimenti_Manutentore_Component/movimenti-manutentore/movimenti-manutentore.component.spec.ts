import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimentiManutentoreComponent } from './movimenti-manutentore.component';

describe('MovimentiManutentoreComponent', () => {
  let component: MovimentiManutentoreComponent;
  let fixture: ComponentFixture<MovimentiManutentoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovimentiManutentoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovimentiManutentoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
