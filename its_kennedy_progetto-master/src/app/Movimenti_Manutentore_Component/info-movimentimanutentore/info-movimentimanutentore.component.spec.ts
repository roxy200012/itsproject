import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoMovimentimanutentoreComponent } from './info-movimentimanutentore.component';

describe('InfoMovimentimanutentoreComponent', () => {
  let component: InfoMovimentimanutentoreComponent;
  let fixture: ComponentFixture<InfoMovimentimanutentoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoMovimentimanutentoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoMovimentimanutentoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
