import { TestBed } from '@angular/core/testing';

import { FeaturedUsersService } from './featured-users.service';

describe('FeaturedUsersService', () => {
  let service: FeaturedUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeaturedUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
