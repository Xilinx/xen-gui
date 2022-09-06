import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeleteDomainComponent } from './modal-delete-domain.component';

describe('ModalDeleteDomainComponent', () => {
  let component: ModalDeleteDomainComponent;
  let fixture: ComponentFixture<ModalDeleteDomainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDeleteDomainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeleteDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
