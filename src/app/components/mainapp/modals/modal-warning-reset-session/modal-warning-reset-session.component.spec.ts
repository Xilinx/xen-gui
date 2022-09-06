import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWarningResetSessionComponent } from './modal-warning-reset-session.component';

describe('ModalWarningResetSessionComponent', () => {
  let component: ModalWarningResetSessionComponent;
  let fixture: ComponentFixture<ModalWarningResetSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalWarningResetSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalWarningResetSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
