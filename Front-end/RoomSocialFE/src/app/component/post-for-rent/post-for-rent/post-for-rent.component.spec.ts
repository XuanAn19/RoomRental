import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostForRentComponent } from './post-for-rent.component';

describe('PostForRentComponent', () => {
  let component: PostForRentComponent;
  let fixture: ComponentFixture<PostForRentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostForRentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostForRentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
