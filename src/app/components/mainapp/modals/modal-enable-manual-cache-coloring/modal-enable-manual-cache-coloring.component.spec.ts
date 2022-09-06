import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEnableManualCacheColoringComponent } from './modal-enable-manual-cache-coloring.component';

describe('ModalEnableManualCacheColoringComponent', () => {
  let component: ModalEnableManualCacheColoringComponent;
  let fixture: ComponentFixture<ModalEnableManualCacheColoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEnableManualCacheColoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEnableManualCacheColoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
