import { TestBed } from '@angular/core/testing';

import { ImagebuilderFileManagementService } from './imagebuilder-file-management.service';

describe('ImagebuilderFileManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImagebuilderFileManagementService = TestBed.get(ImagebuilderFileManagementService);
    expect(service).toBeTruthy();
  });
});
