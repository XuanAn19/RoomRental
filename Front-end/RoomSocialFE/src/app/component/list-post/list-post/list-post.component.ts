
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from 'express';
import { AuthService } from '../../../service/auth/auth.service';
import { TokenStoreService } from '../../../service/token-store/token-store.service';

interface InfPost {
  id: number;
  id_user: string;
  id_category: number;
  id_address: number;
  title: string;
  description: string;
  arge: number;
  price: number;
  quanity_room: number;
  images: string[];
  created_day: string;
  status: boolean;
  user: any;
  address: any;
  category: any;
}

@Component({
  selector: 'app-list-post',
  templateUrl: './list-post.component.html',
  styleUrl: './list-post.component.css',
})
export class ListPostComponent {
  selectedFilter: string = 'all';
  selectedFilterCategory: string = 'all';
  fullName: string = '';
  img_avt: string = '';
  code: string = '';

  listPost = [];

  countVisible = 0;
  countHidden = 0;
  totalPost = 0;
  posts: InfPost[] = [];
  filteredPosts = this.posts;

  constructor(
    // private _http: HttpClient,
    // private _router: Router,
    private _auth: AuthService
  ) {}

  ngOnInit(): void {
    this.getInfo();
    this.getListPost();
  }

  getInfo() {
    this._auth.Call_API_GetMyInformation().subscribe((response) => {
      if (response.status === 'Success') {
        if (response.data && response.data.fullName) {
          this.fullName = response.data.fullName;
          this.img_avt = response.data.image;
          // console.log('Data: ', response.data);
          // console.log('Họ và tên:', this.fullName);
        } else {
          console.error('Dữ liệu không đầy đủ:', response.data);
        }
      } else {
        console.error('API trả về lỗi:', response);
      }
    });
  }

  getListPost() {
    this._auth.Call_API_ListRoom().subscribe((response) => {
      if (response.status === 'Success') {
        if (response.data && response) {
          this.posts = response.data;
          this.filteredPosts = response.data;
          console.log('ListPost', this.posts);
          this.countVisible = this.posts.filter(
            (post) => post.status === true
          ).length;

          this.countHidden = this.posts.filter(
            (post) => post.status === false
          ).length;

          this.totalPost = this.posts.length;

          console.log('NEEE: ', this.posts);
          console.log('Hien: ', this.countVisible);
          console.log('An: ', this.countHidden);
          console.log('All: ', this.totalPost);
        } else {
          console.error('Dữ liệu không đầy đủ:', response.data);
        }
      } else {
        console.error('API trả về lỗi:', response);
      }
    });
  }

  setFilter(filter: string) {
    this.code = '';
    this.selectedFilter = filter;
    if (this.selectedFilterCategory == 'rent')
      this.selectedFilterCategory = 'Cho thuê';
    else if (this.selectedFilterCategory == 'find')
      this.selectedFilterCategory = 'Ở ghép';

    if (filter === 'showing') {
      if (this.selectedFilterCategory != 'all') {
        this.filteredPosts = this.posts.filter(
          (post) =>
            post.status === true &&
            post.category === this.selectedFilterCategory
        );
      } else {
        this.filteredPosts = this.posts.filter((post) => post.status === true);
      }
    } else if (filter === 'hidden') {
      if (this.selectedFilterCategory != 'all') {
        this.filteredPosts = this.posts.filter(
          (post) =>
            post.status === false &&
            post.category === this.selectedFilterCategory
        );
      } else {
        this.filteredPosts = this.posts.filter((post) => post.status === false);
      }
    } else {
      if (this.selectedFilterCategory != 'all')
        this.filteredPosts = this.posts.filter(
          (post) => post.category === this.selectedFilterCategory
        );
      else this.filteredPosts = this.posts;
    }
  }

  setFilterCategory(event: Event) {
    this.code = '';
    const selectedValue = (event.target as HTMLSelectElement).value;
    console.log('Selected Filter:', selectedValue);
    this.selectedFilterCategory = selectedValue;
    if (!this.posts) {
      console.warn('Posts data is not available!');
      this.filteredPosts = [];
      return;
    }
    if (selectedValue === 'find') {
      if (this.selectedFilter != 'all') {
        if (this.selectedFilter == 'showing') {
          this.filteredPosts = this.posts.filter(
            (post) => post.category === 'Ở ghép' && post.status === true
          );
        } else {
          this.filteredPosts = this.posts.filter(
            (post) => post.category === 'Ở ghép' && post.status === false
          );
        }
      } else {
        this.filteredPosts = this.posts.filter(
          (post) => post.category === 'Ở ghép'
        );
      }
    } else if (selectedValue === 'rent') {
      if (this.selectedFilter != 'all') {
        if (this.selectedFilter == 'showing') {
          this.filteredPosts = this.posts.filter(
            (post) => post.category === 'Cho thuê' && post.status === true
          );
        } else {
          this.filteredPosts = this.posts.filter(
            (post) => post.category === 'Cho thuê' && post.status === false
          );
        }
      } else {
        this.filteredPosts = this.posts.filter(
          (post) => post.category === 'Cho thuê'
        );
      }
    } else {
      if (this.selectedFilter != 'all') {
        if (this.selectedFilter == 'showing') {
          this.filteredPosts = this.posts.filter(
            (post) => post.status === true
          );
        } else {
          this.filteredPosts = this.posts.filter(
            (post) => post.status === true
          );
        }
      }
      if (this.selectedFilter == 'all') {
        this.filteredPosts = this.posts;
      }
    }
  }

  filterCode() {
    if (this.code != '')
      this.filteredPosts = this.posts.filter(
        (post) => post.id && post.id.toString().includes(this.code)
      );
    else this.filteredPosts = this.posts;
  }

  isCount() {
    this.countVisible = this.posts.filter(
      (post) => post.status === true
    ).length;

    this.countHidden = this.posts.filter(
      (post) => post.status === false
    ).length;

    this.totalPost = this.posts.length;
    console.log('NEEE: ', this.filteredPosts);
    console.log('Hien: ', this.countVisible);
    console.log('An: ', this.countHidden);
    console.log('All: ', this.totalPost);
  }

  hidePost(code: any) {
    if (confirm('Bạn có muốn ẩn bài đăng này?')) {
      this._auth.Call_API_HideRoom(code).subscribe({
        next: (response) => {
          alert('Success!');
        },
        error: (error) => {
          alert('Có lỗi xảy ra!');
        },
      });
    }
    window.location.reload();
  }

  logout() {
    this._auth.Call_API_Logout().subscribe({
      next: (response) => {
        console.log('Đăng xuất thành công', response);
      },
      error: (err) => {
        console.error('Lỗi khi đăng xuất', err);
      },
    });
  }
}
