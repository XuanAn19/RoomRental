import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAddFriendComponent } from './request-add-friend.component';

describe('RequestAddFriendComponent', () => {
  let component: RequestAddFriendComponent;
  let fixture: ComponentFixture<RequestAddFriendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestAddFriendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestAddFriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
