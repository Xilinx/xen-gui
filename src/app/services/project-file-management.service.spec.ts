import { TestBed } from '@angular/core/testing';

import { ProjectFileManagementService } from './project-file-management.service';

describe('ProjectFileManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProjectFileManagementService = TestBed.get(ProjectFileManagementService);
    expect(service).toBeTruthy();
  });
});
