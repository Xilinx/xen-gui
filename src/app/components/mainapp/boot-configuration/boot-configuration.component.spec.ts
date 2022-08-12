import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BootConfigurationComponent } from './boot-configuration.component';

describe('BootConfigurationComponent', () => {
  let component: BootConfigurationComponent;
  let fixture: ComponentFixture<BootConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BootConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BootConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
