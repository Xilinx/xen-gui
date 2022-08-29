import { TestBed } from '@angular/core/testing';

import { XenDeviceTreeUtilsService } from './xen-device-tree-utils.service';

describe('XenDeviceTreeUtilsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: XenDeviceTreeUtilsService = TestBed.get(XenDeviceTreeUtilsService);
    expect(service).toBeTruthy();
  });
});
