import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchDTO } from '../../../../Models/search.dto';
import { RoomDTO } from '../../../../Models/room.dto';
import { SearchRoomrentalRoommateService } from '../../service/search-roomrental-roommate.service';
import { BookmarkService } from '../../service/bookmark.service';

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
  selector: 'app-search-roomrental-roommate',
  templateUrl: './search-roomrental-roommate.component.html',
  styleUrl: './search-roomrental-roommate.component.css',
})
export class SearchRoomrentalRoommateComponent {
  @Output() tabChange = new EventEmitter<string>();
  selectedTab: string = 'rent';
  searchQuery: string = '';
  searchCriteria: SearchDTO = {};
  hasResults: boolean = true;

  isDropdownOpen = {
    houseType: false,
    area: false,
    acreage: false,
    price: false,
  };

  // dropdown
  selectedHouseTypes: string = '';
  selected_city: string = '';
  selected_district: string = '';
  selected_ward: string = '';
  cities: Location[] = [];
  districts: District[] = [];
  wards: Ward[] = [];
  city_name: string = 'Tỉnh/Thành';
  district_name: string = '';
  ward_name: string = '';
  region: string = '';

  //Gía diện tích
  acreageStart: number = 0;
  acreageEnd: number = 1000;
  priceStart: number = 0;
  priceEnd: number = 50;

  // Giá trị lựa chọn radio
  selectedArea: string = '';
  selectedPrice: string = '';

  @Input() selectedFilter: { section: string; value: string } | null = null;
  roomRentList: RoomDTO[] = [];
  roommateList: RoomDTO[] = [];
  rooms: any[] = [];

  isLoading: boolean = true;

  constructor(
    private _http: HttpClient,
    private searchService: SearchRoomrentalRoommateService,
    private bookMarkService: BookmarkService
  ) {}

  ngOnInit(): void {
    this.fetchCities();
    this.loadData();
    this.bookMarkService.loadBookmarksFromServer();
  }

  loadData(): void {
    this.isLoading = true;
    if (this.selectedTab === 'rent') {
      this.getAllRentList();
    } else if (this.selectedTab === 'roommate') {
      this.getAllRoommate();
    }
  }

  onSearch(): void {
    this.isLoading = true;
    if (
      !this.searchQuery.trim() &&
      !this.selectedHouseTypes &&
      !this.selected_city &&
      !this.selected_district &&
      !this.selected_ward &&
      !this.priceStart &&
      !this.priceEnd &&
      !this.acreageStart &&
      !this.acreageEnd
    ) {
      this.loadData();
      return;
    }
    const searchCriteria: SearchDTO = {
      SearchName: this.searchQuery.trim(),
      CategoryName: this.selectedHouseTypes,
      From: this.priceStart || 0,
      To: this.priceEnd || 100000000,
      ArceFrom: this.acreageStart || 0,
      ArceTo: this.acreageEnd || 1000,
      Province: this.selected_city,
      District: this.selected_district,
      Ward: this.selected_ward,
    };

    console.log('Search Criteria:', searchCriteria);
    this.searchService.searchRooms(searchCriteria).subscribe({
      next: (response) => {
        console.log('Kết quả tìm kiếm:', response);
        this.rooms = response;
        this.hasResults = response.length > 0;

        if (this.selectedTab === 'rent') {
          this.roomRentList = [...response];
          this.filteredRentList = this.getFilteredRentList();
        } else if (this.selectedTab === 'roommate') {
          this.roommateList = [...response];
          this.filteredRommateList = this.getFilteredRoommateList();
        }
      },
      error: (err) => {
        console.error('Lỗi khi tìm kiếm:', err);
        this.rooms = [];
        this.hasResults = false;
        alert('Không tìm thấy kết quả.');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
  filteredRentList: RoomDTO[] = [];
  filteredRommateList: RoomDTO[] = [];

  getAllRentList(): void {
    this.searchService.getRentPosts().subscribe({
      next: (response) => {
        console.log('Response RentRoom:', response);
        this.roomRentList = response;
        //Lọc danh sách phòng mới và cập nhật danh sách hiển thị
        this.filteredRentList = this.getFilteredRentList();
        this.filteredRommateList = this.getFilteredRoommateList();
        // Kiểm tra dữ liệu address
        this.roomRentList.forEach((room, index) => {
          console.log(`Room ${index + 1} Address:`, room.address);
        });
      },
      error: (err) =>
        console.error('Không thể tải bài đăng tìm người ở ghép', err),
    });
  }

  getFilteredRentList(): RoomDTO[] {
    let filteredList = [...this.roomRentList];

    // Lọc theo từ khóa tìm kiếm
    if (this.searchQuery?.trim()) {
      const query = this.searchQuery.trim().toLowerCase();
      filteredList = filteredList.filter((room) => {
        const titleMatch = room.title?.toLowerCase().includes(query);
        return titleMatch;
      });
    }

    // Lọc theo loại nhà (houseType)
    if (
      this.selectedHouseTypes?.trim() &&
      this.selectedHouseTypes !== 'Tất cả nhà đất'
    ) {
      filteredList = filteredList.filter((room) => {
        return room.category.name === this.selectedHouseTypes;
      });
    }

    if (this.selected_city?.trim()) {
      filteredList = filteredList.filter((room) => {
        return (
          room.address.province?.toLowerCase() === this.city_name?.toLowerCase()
        );
      });
      console.log('Sau khi lọc theo tỉnh/thành phố:', filteredList);
    }

    if (this.selected_district?.trim()) {
      filteredList = filteredList.filter((room) => {
        return (
          room.address.district?.toLowerCase() ===
          this.district_name?.toLowerCase()
        );
      });
      console.log('Sau khi lọc theo quận/huyện:', filteredList);
    }

    if (this.selected_ward?.trim()) {
      filteredList = filteredList.filter((room) => {
        return (
          room.address.ward?.toLowerCase() === this.ward_name?.toLowerCase()
        );
      });
    }

    //Lọc theo diện tích
    filteredList = filteredList.filter((room) => {
      return (
        room.arge >= (this.acreageStart || 0) &&
        room.arge <= (this.acreageEnd || 1000)
      );
    });

    //Lọc theo mức giá
    filteredList = filteredList.filter((room) => {
      return (
        room.price >= (this.priceStart || 0) &&
        room.price <= (this.priceEnd || 100000000)
      );
    });
    return filteredList;
  }

  // *********** Roommate **********
  getAllRoommate(): void {
    this.searchService.getRoommatePosts().subscribe({
      next: (response) => {
        console.log('Response Roommate:', response);
        this.roommateList = response;
        this.roommateList.forEach((room, index) => {
          console.log(`Room ${index + 1} Address:`, room.address);
        });
      },
      error: (err) =>
        console.error('Không thể tải bài đăng tìm người ở ghép', err),
    });
  }

  getFilteredRoommateList(): RoomDTO[] {
    console.log('Trước khi lọc:', this.roommateList);
    let filteredList = [...this.roommateList];

    // Lọc theo từ khóa tìm kiếm
    if (this.searchQuery?.trim()) {
      const query = this.searchQuery.trim().toLowerCase();
      filteredList = filteredList.filter((room) => {
        const titleMatch = room.title?.toLowerCase().includes(query);
        return titleMatch;
      });
    }

    //Lọc theo diện tích
    filteredList = filteredList.filter((room) => {
      return (
        room.arge >= (this.acreageStart || 0) &&
        room.arge <= (this.acreageEnd || 1000)
      );
    });

    //Lọc theo mức giá
    filteredList = filteredList.filter((room) => {
      return (
        room.price >= (this.priceStart || 0) &&
        room.price <= (this.priceEnd || 100000000)
      );
    });

    console.log('Sau khi lọc:', filteredList);
    return filteredList;
  }

  getTotalRentPosts(): number {
    return this.getFilteredRentList().length;
  }
  getTotalRoommatePosts(): number {
    return this.getFilteredRoommateList().length;
  }

  // ************** Search Bar *******************
  //Chuyển tab 'rent' hoặc 'roommate'
  selectTab(tab: string): void {
    this.selectedTab = tab;
    this.tabChange.emit(tab);
    this.loadData();
  }

  onInputChange(): void {
    console.log('Search query:', this.searchQuery);
  }

  // Xử lý dropdown
  toggleDropdown(type: string): void {
    Object.keys(this.isDropdownOpen).forEach((key) => {
      this.isDropdownOpen[key as keyof typeof this.isDropdownOpen] =
        key === type
          ? !this.isDropdownOpen[key as keyof typeof this.isDropdownOpen]
          : false;
    });
  }

  // Hàm xử lý khi thay đổi loại nhà

  onHouseTypeChange(event: any) {
    this.selectedHouseTypes = event.target.value;
    if (this.selectedHouseTypes === 'Tất cả nhà đất') {
      this.selectedHouseTypes = '';
    }
    console.log('Selected house type:', this.selectedHouseTypes);
    //this.onSearch();
  }

  setFixedAcreageRange(start: number, end: number): void {
    this.acreageStart = start;
    this.acreageEnd = end;
  }

  setFixedPriceRange(start: number, end: number): void {
    this.priceStart = start;
    this.priceEnd = end;
  }

  fetchCities(): void {
    this._http.get<Location[]>('/data.json').subscribe({
      next: (response) => {
        this.cities = response;
      },
      error: (err) => {
        console.error('Error loading locations:', err);
      },
    });
  }

  isClick = false;
  //Xử lý thay đổi thành phố
  onCityChange(event: any): void {
    this.isClick = true;
    //this.fetchCities();
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
    console.log('City name: ', this.city_name);
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
        console.log('HUYENNNNNNNNNNNNNNNNNNNNN:', this.district_name);
        this.region = this.district_name + ' - ' + this.city_name;
        this.district_name = this.removeVietnameseTones(this.district_name);
        if (selected_district) {
          this.district_name = selected_district.Name;
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
        if (this.ward_name.startsWith('Xa ')) {
          this.ward_name = this.ward_name.replace('Xa ', '');
        } else if (this.ward_name.startsWith('Thành phố ')) {
          this.ward_name = this.ward_name.replace('Thành phố ', '');
        } else if (this.ward_name.startsWith('Thị xã ')) {
          this.ward_name = this.ward_name.replace('Thị xã ', '');
        }
        this.region =
          this.ward_name + ' - ' + this.district_name + ' - ' + this.city_name;
        this.ward_name = this.removeVietnameseTones(this.ward_name);
        if (selected_ward) {
          this.ward_name = selected_ward.Name;
        }
      }
    }
  }

  removeVietnameseTones(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/[^\w\s]/gi, '')
      .toLowerCase();
  }

  // ************** Data *******************

  // Data diện tích
  acreageOptions = [
    { label: 'Tất cả diện tích', value: 'all', range: [0, 1000] },
    { label: 'Dưới 20m²', value: 'under20', range: [0, 20] },
    { label: '20m² - 30m²', value: '20-30', range: [20, 30] },
    { label: '30m² - 50m²', value: '30-50', range: [30, 50] },
    { label: '50m² - 70m²', value: '50-70', range: [50, 70] },
    { label: '70m² - 90m²', value: '70-90', range: [70, 90] },
    { label: 'Trên 90m²', value: 'above-90', range: [90, this.acreageEnd] },
  ];

  // Data mức giá
  priceOptions = [
    { label: 'Tất cả mức giá', value: 'all', range: [0, 50] },
    { label: 'Dưới 1 triệu', value: 'under1m', range: [0, 1] },
    {
      label: '1 triệu - 2 triệu đồng',
      value: '1m-2m',
      range: [1, 2],
    },
    {
      label: '2 triệu - 3 triệu đồng',
      value: '2m-3m',
      range: [2, 3],
    },
    {
      label: '3 triệu - 5 triệu đồng',
      value: '3m-5m',
      range: [3, 5],
    },
    {
      label: '5 triệu - 7 triệu đồng',
      value: '5m-7m',
      range: [5, 7],
    },
    {
      label: 'Trên 7 triệu đồng',
      value: 'above-7m',
      range: [7, this.priceEnd],
    },
  ];

  // Right site bar
  filterSections = [
    {
      section: 'Xem theo giá',
      items: [
        { label: 'Dưới 1 triệu', value: 'below-1' },
        { label: '1 - 2 triệu', value: '1-2' },
        { label: '2 - 3 triệu', value: '2-3' },
        { label: '3 - 5 triệu', value: '3-5' },
        { label: '5 - 7 triệu', value: '5-7' },
        { label: '7 - 10 triệu', value: '7-10' },
        { label: 'Trên 15 triệu', value: 'above-15' },
      ],
    },
    {
      section: 'Xem theo diện tích',
      items: [
        { label: 'Dưới 20m²', value: 'below-20' },
        { label: 'Từ 20m² - 30m²', value: '20-30' },
        { label: 'Từ 30m² - 50m²', value: '30-50' },
        { label: 'Từ 50m² - 70m²', value: '50-70' },
        { label: 'Từ 70m² - 90m²', value: '70-90' },
        { label: 'Trên 90m²', value: 'above-90' },
      ],
    },
    {
      section: 'Danh mục cho thuê',
      items: [
        { label: 'Phòng trọ, Nhà trọ', value: 'room-rentail' },
        { label: 'Nhà nguyên căn', value: 'full-house' },
        { label: 'Căn hộ mini', value: 'apartment-mini' },
      ],
    },
  ];

  // Book mark
  isBookmarked(roomId: number): boolean {
    return this.bookMarkService.isBookmarked(roomId);
  }

  // Thay đổi trạng thái bookmark khi người dùng nhấn vào trái tim
  toggleBookmark(roomId: number): void {
    this.bookMarkService.toggleBookmark(roomId);
  }
}
