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

interface Category {
  id: number;
  name: string;
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
  idUser: string = '';
  code: string = '';

  listCategory: Category[] = [];
  selectedCategory = 0;
  listPost = [];
  status: boolean = true;
  filter: string='all';

  countVisible = 0;
  countHidden = 0;
  totalPost = 0;
  posts: InfPost[] = [];
  filteredPosts = this.posts;

  constructor(private _auth: AuthService) {}

  ngOnInit(): void {
    this.getInfo();
  }

  getInfo() {
    this._auth.Call_API_GetMyInformation().subscribe((response) => {
      if (response.status === 'Success') {
        if (response.data && response.data.fullName) {
          this.fullName = response.data.fullName;
          this.img_avt = response.data.image;
          this.idUser = response.data.id;

          console.log('ID user1: ', this.idUser);
          this.getListPost();
          this.getListCategory();
        } else {
          console.error('Dữ liệu không đầy đủ:', response.data);
        }
      } else {
        console.error('API trả về lỗi:', response);
      }
    });
  }

  getListCategory(){
    this._auth.Call_API_GetCategory().subscribe((response) => {
      if (response) {
        this.listCategory = response;
        this.listCategory = this.listCategory.slice(0, -1);
        console.log("Category: ",response);
      } else {
        console.error('API trả về lỗi:', response);
      }
    });
  }

  searchCategory(event: any) {
    this.selectedFilter = 'all';
    if(this.code == ''){
      if(this.selectedCategory!=0){
        this.getCategory(event);
      }
      else{
        this.getListPost();
      }
    }
    else{
      if(this.selectedCategory!=0){
        this.getKeyNameWithCategory();
      }
      else{
        this.filterCode();
      }
    }
  }

  getListPost() {
    this._auth.Call_API_ListRoomByIdUser(this.idUser).subscribe((response) => {
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

  getStatus(filter: string){
    if(filter == 'all'){
      this.getListPost();
    }
    else{
      if(filter == 'showing'){
        this.status = true;
      }
      else if(filter == 'hidden'){
        this.status = false;
      }
      this._auth.Call_API_RoomByStatusWithUser(this.idUser,this.status).subscribe((response) => {
        if (response) {
          this.posts = response.data;
          this.filteredPosts = response.data;
          console.log("RoomCategory: ",response.data);
        } else {
          console.error('API trả về lỗi:', response);
        }
      });
    }
    this.selectedFilter = filter;
  }

  searchStatus(filter: string) {
    if(this.code != ''){
      if(this.selectedCategory!=0){
        if(filter == 'showing'){
          this.status = true;
        }
        else if(filter == 'hidden'){
          this.status = false;
        }
        this._auth.Call_API_RoomByKeyNameWithCategoryWithUserWithStatus(this.idUser,this.code, this.selectedCategory,this.status).subscribe((response) => {
          if (response) {
            this.posts = response.data;
            this.filteredPosts = response.data;
            console.log("RoomCategory: ",response.data);
            if(filter == 'all'){
              this.countVisible = this.posts.filter(
                (post) => post.status === true
              ).length;

              this.countHidden = this.posts.filter(
                (post) => post.status === false
              ).length;

              this.totalPost = this.posts.length;
            }
          } else {
            console.error('API trả về lỗi:', response);
          }
        });
      }
      else{
        if(filter == 'all'){
          this.getCode();
        }
        else{
          if(filter == 'showing'){
            this.status = true;
          }
          else if(filter == 'hidden'){
            this.status = false;
          }
          this._auth.Call_API_RoomByKeyNameWithStatusWithUser(this.idUser,this.code,this.status).subscribe((response) => {
            if (response) {
              this.posts = response.data;
              this.filteredPosts = response.data;
              console.log("RoomCategory: ",response.data);
              if(filter == 'all'){
                this.countVisible = this.posts.filter(
                  (post) => post.status === true
                ).length;

                this.countHidden = this.posts.filter(
                  (post) => post.status === false
                ).length;

                this.totalPost = this.posts.length;
              }
            } else {
              console.error('API trả về lỗi:', response);
            }
          });
        }
      }
    }
    else{
      if(this.selectedCategory!=0){
        if(filter == 'all'){
          this.filterCode();
        }
        else{
          if(filter == 'showing'){
            this.status = true;
          }
          else if(filter == 'hidden'){
            this.status = false;
          }
          if(this.code == '')
          this._auth.Call_API_RoomByKeyNameWithCategoryWithUserWithStatus(this.idUser, encodeURIComponent(' '), this.selectedCategory,this.status).subscribe((response) => {
            if (response) {
              this.posts = response.data;
              this.filteredPosts = response.data;
              console.log("RoomCategory: ",response.data);
              if(filter == 'all'){
                this.countVisible = this.posts.filter(
                  (post) => post.status === true
                ).length;

                this.countHidden = this.posts.filter(
                  (post) => post.status === false
                ).length;

                this.totalPost = this.posts.length;
              }
            } else {
              console.error('API trả về lỗi:', response);
            }
          });
        }
      }
      else{
        this.getStatus(filter);
      }
    }
    this.selectedFilter = filter;
  }

  getCategory(event: any){
    this.selectedCategory = event.target.value;
    console.log("Select: ",this.selectedCategory);
    this._auth.Call_API_RoomByCategoryWithUser(this.idUser,this.selectedCategory).subscribe((response) => {
      if (response) {
        this.posts = response.data;
        this.filteredPosts = response.data;
        console.log("RoomCategory: ",response.data);
        this.countVisible = this.posts.filter(
          (post) => post.status === true
        ).length;

        this.countHidden = this.posts.filter(
          (post) => post.status === false
        ).length;

        this.totalPost = this.posts.length;
      } else {
        console.error('API trả về lỗi:', response);
      }
    });
  }

  getCode(){
    this._auth
      .Call_API_RoomByKeyName(this.idUser, this.code)
      .subscribe((response) => {
        if (response.status === 'Success') {
          if (response.data && response) {
            this.posts = response.data;
            this.filteredPosts = response.data;

            this.countVisible = this.posts.filter(
              (post) => post.status === true
            ).length;

            this.countHidden = this.posts.filter(
              (post) => post.status === false
            ).length;

            this.totalPost = this.posts.length;
          } else {
            console.error('Dữ liệu không đầy đủ:', response.data);
          }
        } else {
          console.error('API trả về lỗi:', response);
        }
      });
  }

  getKeyNameWithCategory(){
    this._auth
        .Call_API_RoomByKeyNameWithCategoryWithUser(this.idUser, this.code, this.selectedCategory)
        .subscribe((response) => {
          if (response.status === 'Success') {
            if (response.data && response) {
              this.posts = response.data;
              this.filteredPosts = response.data;

              this.countVisible = this.posts.filter(
                (post) => post.status === true
              ).length;

              this.countHidden = this.posts.filter(
                (post) => post.status === false
              ).length;

              this.totalPost = this.posts.length;
            } else {
              console.error('Dữ liệu không đầy đủ:', response.data);
            }
          } else {
            console.error('API trả về lỗi:', response);
          }
        });
  }

  filterCode() {
    this.selectedFilter = 'all';
    if (this.code != ''){
      if(this.selectedCategory!=0) {
        this.getKeyNameWithCategory();
      }
      else{
        this.getCode();
      }
    }
    else{
      if(this.selectedCategory!=0){
        this._auth.Call_API_RoomByCategoryWithUser(this.idUser,this.selectedCategory).subscribe((response) => {
          if (response) {
            this.posts = response.data;
            this.filteredPosts = response.data;
            console.log("RoomCategory: ",response.data);
            this.countVisible = this.posts.filter(
              (post) => post.status === true
            ).length;

            this.countHidden = this.posts.filter(
              (post) => post.status === false
            ).length;

            this.totalPost = this.posts.length;
          } else {
            console.error('API trả về lỗi:', response);
          }
        });
      }
      else{
        this.getListPost();
      }
    }
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
      window.location.reload();
    }
  }
}
