import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadDeviceTreeComponent } from './read-device-tree.component';

describe('ReadDeviceTreeComponent', () => {
  let component: ReadDeviceTreeComponent;
  let fixture: ComponentFixture<ReadDeviceTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadDeviceTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadDeviceTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
