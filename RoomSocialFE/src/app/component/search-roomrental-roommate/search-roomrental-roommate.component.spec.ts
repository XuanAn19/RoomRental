import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRoomrentalRoommateComponent } from './search-roomrental-roommate.component';

describe('SearchRoomrentalRoommateComponent', () => {
  let component: SearchRoomrentalRoommateComponent;
  let fixture: ComponentFixture<SearchRoomrentalRoommateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchRoomrentalRoommateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchRoomrentalRoommateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
