import { TestBed } from '@angular/core/testing';

import { MyngrouteService } from './myngroute.service';

describe('MyngrouteService', () => {
  let service: MyngrouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyngrouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
