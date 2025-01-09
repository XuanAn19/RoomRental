import { TestBed } from '@angular/core/testing';

import { SearchRoomrentalRoommateService } from './search-roomrental-roommate.service';

describe('SearchRoomrentalRoommateService', () => {
  let service: SearchRoomrentalRoommateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchRoomrentalRoommateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
