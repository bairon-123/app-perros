import { TestBed } from '@angular/core/testing';

import { ApiStorageService } from './api-storage.service';

describe('ApiStorageService', () => {
  let service: ApiStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
