import { TestBed } from '@angular/core/testing';

import { ColorsManagementService } from './colors-management.service';

describe('ColorsManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ColorsManagementService = TestBed.get(ColorsManagementService);
    expect(service).toBeTruthy();
  });
});
