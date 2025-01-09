import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../service/auth/auth.service';

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

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.css',
})
export class EditPostComponent {
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
  imageSrcs: string[] = [];
  id_address = 0;
  listCategory: { id: number; name: string }[] = [];
  selectedCategory = 0;
  isClick = false;

  postId: number = 0;
  room = {
    id_user: '',
    id_category: 0,
    category: {
      name: '',
    },
    id_adress: 0,
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
    quantity_room: 0,
    images: [''],
  };

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private route: ActivatedRoute,
    private _auth: AuthService
  ) {}

  ngOnInit(): void {
    this.getCatetory();
    this.fetchCities();
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.postId = +idParam; // Dùng toán tử '+' để ép kiểu về number
        this._auth.Call_API_RoomByID(this.postId).subscribe({
          next: (response) => {
            this.room = response.data;
            this.id_address = this.room.id_adress;
            console.log('ID Address: ', this.id_address);
            console.log('ROOM: ', this.room);
            this.region =
              this.room.address.number_house +
              ' - ' +
              this.room.address.street_name +
              ' - ' +
              this.room.address.ward +
              ' - ' +
              this.room.address.district +
              ' - ' +
              this.room.address.province;
            this.imageSrcs = this.room.images;
            console.log('Images: ', this.imageSrcs);
          },
          error: (err) => {
            console.error('Lỗi khi lấy thông tin phòng:', err);
          },
        });
      }
    });
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
    this._http.get<Location[]>('data.json').subscribe((data) => {
      this.cities = data;
    });
  }

  getCatetory() {
    this._auth.Call_API_GetCategory().subscribe({
      next: (response) => {
        if (response) {
          this.listCategory = response.map(
            (category: { id: number; name: string }) => category
          );
          this.listCategory = this.listCategory.slice(0, -1);
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

  onCityChange(event: any): void {
    this.isClick = true;
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

      // if (this.city_name.startsWith('Tỉnh ')) {
      //   this.city_name = this.city_name.replace('Tỉnh ', '');
      // } else if (this.city_name.startsWith('Thành phố ')) {
      //   this.city_name = this.city_name.replace('Thành phố ', '');
      // }
      this.street = '';
      this.number_house = '';
      this.region = this.city_name;
      this.room.address.province = this.city_name;
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
        // if (this.district_name.startsWith('Huyện ')) {
        //   this.district_name = this.district_name.replace('Huyện ', '');
        // } else if (this.district_name.startsWith('Thành phố ')) {
        //   this.district_name = this.district_name.replace('Thành phố ', '');
        // } else if (this.district_name.startsWith('Thị xã ')) {
        //   this.district_name = this.district_name.replace('Thị xã ', '');
        // }
        this.room.address.district = this.district_name;
        this.street = '';
        this.number_house = '';
        this.region = this.district_name + ' - ' + this.city_name;
        // this.district_name = this.removeVietnameseTones(this.district_name);
        if (selected_district) {
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
        // if (this.ward_name.startsWith('Phường ')) {
        //   this.ward_name = this.ward_name.replace('Phường ', '');
        // } else if (this.ward_name.startsWith('Xã ')) {
        //   this.ward_name = this.ward_name.replace('Xã ', '');
        // }
        this.room.address.ward = this.ward_name;
        this.street = '';
        this.number_house = '';
        this.region =
          this.ward_name + ' - ' + this.district_name + ' - ' + this.city_name;
        // this.district_name = this.removeVietnameseTones(this.district_name);
      }
    }
  }

  updateFullAddress(): void {
    this.region =
      this.room.address.number_house +
      ' ' +
      this.room.address.street_name +
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
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();

        reader.onload = () => {
          this.imageSrcs.push(reader.result as string);
        };

        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(index: number): void {
    this.imageSrcs.splice(index, 1);
  }

  onSubmitUpdate() {
    const formData = {
      id_user: this.room.id_user,
      id_category: this.room.id_category,
      address: {
        id: this.id_address,
        number_house: this.room.address.number_house,
        street_name: this.room.address.street_name,
        ward: this.room.address.ward,
        district: this.room.address.district,
        province: this.room.address.province,
      },
      title: this.room.title,
      description: this.room.description,
      arge: this.room.arge,
      price: this.room.price,
      quanity_room: this.room.quantity_room,
      images: this.room.images,
    };
    console.log('FormData: ', formData);

    this._auth.Call_API_UpdateRoom(this.postId, formData).subscribe(
      (response) => {
        if (response.status === 'Success') {
          this._router.navigate(['list-post']);
          // Thực hiện các hành động khác sau khi cập nhật thành công (VD: điều hướng hoặc thông báo)
        } else {
          console.error('Cập nhật thất bại:', response.message);
          // Hiển thị thông báo lỗi hoặc xử lý lỗi
        }
      },
      (error) => {
        console.error('Lỗi kết nối API:', error);
        // Xử lý lỗi kết nối hoặc thông báo cho người dùng
      }
    );
  }
}
