import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private _http: HttpClient, private _router: Router) {}

  ngOnInit(): void {
    this.fetchCities();
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
}
