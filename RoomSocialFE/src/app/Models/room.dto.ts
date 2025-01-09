// export interface RoomDTO {
//   id: number;
//   id_user: string;
//   id_adress: number;
//   address: {
//     number_house: number;
//     street_name: string;
//     ward: string;
//     district: string;
//     province: string;
//   };
//   id_category: number; // ID danh mục
//   category?: string;   // Danh mục dưới dạng chuỗi
//   title: string;
//   description: string;
//   arge: number;
//   price: number;
//   quantity_room: number;
//   images: string[];
//   created_day: string;
//   status: boolean;
// }

// Define RoomDTO structure
export interface RoomDTO {
  id: number;
  id_user: number;
  id_address: number;
  id_category: number;
  title: string;
  description: string;
  arge: number;
  price: number;
  quantity_room: number;
  images: string[];
  create_day: string;
  status: boolean;
  user: {
    Id: string;
    UserName: string;
    Email: string;
  };
  address: {
    id: number;
    number_house: string;
    street_name: string;
    ward: string;
    district: string;
    province: string;
  };
  category: {
    id: number;
    name: string;
  };
}
