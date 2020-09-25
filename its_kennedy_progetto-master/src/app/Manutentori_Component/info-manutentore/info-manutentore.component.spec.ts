import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoManutentoreComponent } from './info-manutentore.component';

describe('InfoManutentoreComponent', () => {
  let component: InfoManutentoreComponent;
  let fixture: ComponentFixture<InfoManutentoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoManutentoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoManutentoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
