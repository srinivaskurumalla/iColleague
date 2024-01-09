import { TestBed } from '@angular/core/testing';

import { DirectLineService } from './direct-line.service';

describe('DirectLineService', () => {
  let service: DirectLineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DirectLineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
