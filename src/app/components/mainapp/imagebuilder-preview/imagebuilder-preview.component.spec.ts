import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagebuilderPreviewComponent } from './imagebuilder-preview.component';

describe('ImagebuilderPreviewComponent', () => {
  let component: ImagebuilderPreviewComponent;
  let fixture: ComponentFixture<ImagebuilderPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagebuilderPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagebuilderPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
