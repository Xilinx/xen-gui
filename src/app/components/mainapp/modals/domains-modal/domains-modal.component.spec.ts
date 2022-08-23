import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainsModalComponent } from './domains-modal.component';

describe('DomainsModalComponent', () => {
  let component: DomainsModalComponent;
  let fixture: ComponentFixture<DomainsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
