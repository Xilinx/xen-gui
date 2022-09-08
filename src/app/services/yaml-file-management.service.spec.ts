import { TestBed } from '@angular/core/testing';

import { YamlFileManagementService } from './yaml-file-management.service';

describe('YamlFileManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: YamlFileManagementService = TestBed.get(YamlFileManagementService);
    expect(service).toBeTruthy();
  });
});
