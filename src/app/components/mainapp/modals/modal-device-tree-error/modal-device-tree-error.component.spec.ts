import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeviceTreeErrorComponent } from './modal-device-tree-error.component';

describe('ModalDeviceTreeErrorComponent', () => {
  let component: ModalDeviceTreeErrorComponent;
  let fixture: ComponentFixture<ModalDeviceTreeErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDeviceTreeErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeviceTreeErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
