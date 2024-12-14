import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnfriendComponent } from './unfriend.component';

describe('UnfriendComponent', () => {
  let component: UnfriendComponent;
  let fixture: ComponentFixture<UnfriendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnfriendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnfriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
