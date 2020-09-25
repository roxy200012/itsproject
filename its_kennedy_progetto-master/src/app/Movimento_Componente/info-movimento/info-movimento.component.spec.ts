import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoMovimentoComponent } from './info-movimento.component';

describe('InfoMovimentoComponent', () => {
  let component: InfoMovimentoComponent;
  let fixture: ComponentFixture<InfoMovimentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoMovimentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoMovimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
