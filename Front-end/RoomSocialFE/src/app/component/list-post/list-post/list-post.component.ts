import { Component } from '@angular/core';

@Component({
  selector: 'app-list-post',
  templateUrl: './list-post.component.html',
  styleUrl: './list-post.component.css',
})
export class ListPostComponent {
  selectedFilter: string = 'all';
  posts = [
    {
      id: 1,
      category: 'Ở ghép',
      title: 'Quỹ căn cho thuê từ 1PN - 4PN giá rẻ chỉ 2PN giá chỉ 13 tr/tháng',
      address: 'Cầu Giấy, Hà Nội',
      price: 10000000,
      acreage: 40,
      code: 383848,
      date: '03/03/2002',
      status: 'Đang hiển thị',
      img: 'img-1.jpg',
    },
    {
      id: 2,
      category: 'Cho thuê',
      title: 'Quỹ căn cho thuê từ 1PN - 4PN giá rẻ chỉ 2PN giá chỉ 13 tr/tháng',
      address: 'Cầu Giấy, Hà Nội',
      price: 10000000,
      acreage: 40,
      code: 383848,
      date: '03/03/2002',
      status: 'Đã ẩn',
      img: 'img-2.jpg',
    },
  ];

  setFilter(filter: string) {
    console.log('Selected Filter:', filter);
    this.selectedFilter = filter;
  }
}
