import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth/auth.service';
import { TokenStoreService } from '../../../service/token-store/token-store.service';
import { MyInterceptorService } from '../../../service/my-interceptor/my-interceptor.service';
import axios from 'axios';
import { response } from 'express';

interface Location {
  Id: string;
  Name: string;
  Districts?: District[];
}

interface District {
  Id: string;
  Name: string;
  Wards?: Ward[];
}

interface Ward {
  Id: string;
  Name: string;
}


export interface Category {
  id: number;
  name: string;
}

interface Address {
  number_house: number;
  street_name: string;
  ward: string;
  district: string;
  province: string;
}


@Component({
  selector: 'app-post-for-rent',
  templateUrl: './post-for-rent.component.html',
  styleUrl: './post-for-rent.component.css',
})
export class PostForRentComponent {
  inf_post = {
    id_user: '',
    id_category: 0,
    address: {
      number_house: '',
      street_name: '',
      ward: '',
      district: '',
      province: '',
    },
    title: '',
    description: '',
    arge: 0,
    price: 0,
    quanity_room: 0,
    images: [''],
  };

  cities: Location[] = [];
  districts: District[] = [];
  wards: Ward[] = [];
  street: string = '';
  number_house = '';
  selected_city: string = '';
  selected_district: string = '';
  selected_ward: string = '';
  city_name: string = '';
  district_name: string = '';
  ward_name: string = '';
  region: string = '';

  fullName: string = '';
  name_contact: string = '';
  phone_contact: string = '';
  img_avt: string = '';

  title: string = '';
  description: string = '';
  arge = 0;
  price = 0;
  quantity: number = 1;
  listCategory: { id: number; name: string }[] = [];
  selectedCategory = 0;

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _auth: AuthService,
    private _token: TokenStoreService
  ) {}

  ngOnInit(): void {
    this.fetchCities();
    this.getInfo();
    this.getCatetory();
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity() {
    this.quantity++;
  }

  getInfo() {
    console.log('Token Post For Rent: ', this._token.getToken());
    this._auth.Call_API_GetMyInformation().subscribe((response) => {
      if (response.status === 'Success') {
        if (response.data && response.data.fullName) {
          this.fullName = response.data.fullName;
          this.name_contact = response.data.fullName;
          this.phone_contact = response.data.phoneNumber;
          this.inf_post.id_user = response.data.id;
          this.img_avt = response.data.image;
          console.log('Data: ', response.data);
          // console.log('Họ và tên:', this.fullName);
        } else {
          console.error('Dữ liệu không đầy đủ:', response.data);
        }
      } else {
        console.error('API trả về lỗi:', response);
      }
    });
  }

  getCatetory() {
    this._auth.Call_API_GetCategory().subscribe({
      next: (response) => {
        if (response) {
          this.listCategory = response.map(
            (category: { id: number; name: string }) => category
          );
          console.log('Danh mục:', this.listCategory);
        } else {
          console.warn('Dữ liệu trả về rỗng.');
        }
      },
      error: (err) => {
        console.error('Lỗi khi gọi API:', err);
      },
    });
    // this.selectedCategory = this.listCategory[0].id;
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.target.value;
  }

  activeButton: string = 'rent';
  isType = true;
  click_Status_Post(button: string) {
    this.activeButton = button;
    console.log('activeButton:', this.activeButton);
    if (this.activeButton == 'find-roommate') {
      this.isType = false;
    } else {
      this.isType = true;
    }
  }

  fetchCities(): void {
    this._http.get<Location[]>('public/data.json').subscribe((data) => {

      this.cities = data;
    });
  }

  onCityChange(event: any): void {
    this.fetchCities();
    this.selected_city = event.target.value;
    this.selected_district = '';
    this.districts = [];
    this.wards = [];
    if (this.selected_city) {
      const selected_city = this.cities.find(
        (city) => city.Id === this.selected_city
      );
      this.city_name = selected_city?.Name ?? '';

      if (this.city_name.startsWith('Tỉnh ')) {
        this.city_name = this.city_name.replace('Tỉnh ', '');
      } else if (this.city_name.startsWith('Thành phố ')) {
        this.city_name = this.city_name.replace('Thành phố ', '');
      }

      this.street = '';
      this.number_house = '';

      this.region = this.city_name;
      this.city_name = this.removeVietnameseTones(this.city_name);
      if (selected_city) {
        this.city_name = selected_city.Name;
        this.districts = selected_city.Districts || [];
      }
    }
  }

  onDistrictChange(event: any): void {
    this.selected_district = event.target.value;
    this.selected_ward = '';
    this.wards = [];
    if (this.selected_district) {
      const selected_city = this.cities.find(
        (city) => city.Id === this.selected_city
      );
      if (selected_city) {
        const selected_district = selected_city.Districts?.find(
          (district) => district.Id === this.selected_district
        );
        this.district_name = selected_district?.Name ?? '';
        if (this.district_name.startsWith('Huyện ')) {
          this.district_name = this.district_name.replace('Huyện ', '');
        } else if (this.district_name.startsWith('Thành phố ')) {
          this.district_name = this.district_name.replace('Thành phố ', '');
        } else if (this.district_name.startsWith('Thị xã ')) {
          this.district_name = this.district_name.replace('Thị xã ', '');
        }

        this.street = '';
        this.number_house = '';

        this.region = this.district_name + ' - ' + this.city_name;
        this.district_name = this.removeVietnameseTones(this.district_name);
        if (selected_district) {
          // this.district_name = selected_district.Name;
          this.wards = selected_district.Wards || [];
        }
      }
    }
  }

  onWardChange(event: any): void {
    this.selected_ward = event.target.value;
    if (this.selected_ward) {
      const selected_district = this.districts.find(
        (district) => district.Id === this.selected_district
      );
      if (selected_district) {
        const selected_ward = selected_district.Wards?.find(
          (ward) => ward.Id === this.selected_ward
        );
        this.ward_name = selected_ward?.Name ?? '';
        if (this.ward_name.startsWith('Phường ')) {
          this.ward_name = this.ward_name.replace('Phường ', '');
        } else if (this.ward_name.startsWith('Xã ')) {
          this.ward_name = this.ward_name.replace('Xã ', '');
        }

        this.street = '';
        this.number_house = '';
        this.region =
          this.district_name +
          ' - ' +
          this.district_name +
          ' - ' +
          this.city_name;
        this.district_name = this.removeVietnameseTones(this.district_name);
      }
    }
  }

  updateFullAddress(): void {
    this.region =
      this.number_house +
      ' ' +
      this.street +
      ' - ' +
      this.ward_name +
      ' - ' +
      this.district_name +
      ' - ' +
      this.city_name;
  }

  removeVietnameseTones(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  imageSrc: string | ArrayBuffer | null = null;
  imageSrcs: string[] = []; // Mảng lưu trữ các hình ảnh đã tải lên

  // Hàm xử lý khi người dùng chọn tệp
  onFilesSelected(event: any): void {
    const files: FileList = event.target.files; // Ép kiểu rõ ràng thành FileList
    if (files.length > 0) {
      Array.from(files).forEach((file: File) => {
        // Ép kiểu từng phần tử thành File
        const reader = new FileReader();

        // Khi tệp được đọc thành công, thêm vào mảng imageSrcs
        reader.onload = () => {
          this.imageSrcs.push(reader.result as string); // Thêm hình ảnh vào mảng
        };

        // Đọc tệp như một URL dữ liệu (data URL)
        reader.readAsDataURL(file);
      });
    }
  }

  // Hàm để xóa ảnh khỏi mảng imageSrcs
  removeImage(index: number): void {
    this.imageSrcs.splice(index, 1); // Xóa ảnh tại chỉ mục đã cho
  }

  async submitPost() {
    const CLOUD_NAME = 'dtxm8ymr6';
    const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const FOLDER_NAME = 'ViDu';
    const PRESET_NAME = 'demo-upload';
    const urls: any[] = [];

    console.log('img:', this.imageSrcs);
    const formData = new FormData(); //key: value
    formData.append('upload_preset', PRESET_NAME);
    formData.append('folder', FOLDER_NAME);

    for (const file of this.imageSrcs) {
      const formData = new FormData();
      formData.append('upload_preset', PRESET_NAME);
      formData.append('folder', FOLDER_NAME);
      formData.append('file', file);

      try {
        const response = await axios.post(api, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        urls.push(response.data.secure_url);
        console.log('Upload successful:', response.data.secure_url);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
    console.log('selectedCategory:', this.selectedCategory);
    console.log('number_house:', this.number_house);
    console.log('street:', this.street);
    console.log('ward_name:', this.ward_name);
    console.log('district_name:', this.district_name);
    console.log('city_name:', this.city_name);
    console.log('title:', this.title, 'length:', this.title.length);
    console.log(
      'description:',
      this.description,
      'length:',
      this.description.length
    );
    console.log('arge:', this.arge);
    console.log('price:', this.price);
    console.log('quantity:', this.quantity);
    console.log('urls:', urls, 'length:', urls.length);

    if (
      this.selectedCategory &&
      this.number_house &&
      this.street &&
      this.ward_name &&
      this.district_name &&
      this.city_name &&
      this.title.length >= 30 &&
      this.title.length <= 99 &&
      this.description.length >= 30 &&
      this.description.length <= 3000 &&
      this.arge &&
      this.price &&
      this.quantity &&
      urls.length >= 4
    ) {
      this.inf_post.id_category = this.selectedCategory;
      this.inf_post.address.number_house = this.number_house;
      this.inf_post.address.street_name = this.street;
      this.inf_post.address.ward = this.ward_name;
      this.inf_post.address.district = this.district_name;
      this.inf_post.address.province = this.city_name;
      this.inf_post.title = this.title;
      this.inf_post.description = this.description;
      this.inf_post.arge = this.arge;
      this.inf_post.price = this.price;
      this.inf_post.quanity_room = this.quantity;
      this.inf_post.images = urls;

      console.log('POST: ', this.inf_post);
      this._auth.Call_API_PostRoom(this.inf_post).subscribe(
        (response: any) => {
          alert('Đăng ký thành công');
          console.log('POST: ', this.inf_post);
        },
        (error: any) => {
          console.error('Đăng ký lỗi', error);
        }
      );
    } else {
      alert('Please field');
    }
  }
}
