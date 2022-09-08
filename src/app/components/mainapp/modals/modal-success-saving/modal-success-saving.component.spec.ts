import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSuccessSavingComponent } from './modal-success-saving.component';

describe('ModalSuccessSavingComponent', () => {
  let component: ModalSuccessSavingComponent;
  let fixture: ComponentFixture<ModalSuccessSavingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSuccessSavingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSuccessSavingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
