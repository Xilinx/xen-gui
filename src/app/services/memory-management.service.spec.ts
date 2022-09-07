import { TestBed } from '@angular/core/testing';

import { MemoryManagementService } from './memory-management.service';

describe('MemoryManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MemoryManagementService = TestBed.get(MemoryManagementService);
    expect(service).toBeTruthy();
  });
});
