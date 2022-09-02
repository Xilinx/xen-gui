import { TestBed } from '@angular/core/testing';

import { VcpusManagementService } from './vcpus-management.service';

describe('VcpusManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VcpusManagementService = TestBed.get(VcpusManagementService);
    expect(service).toBeTruthy();
  });
});
