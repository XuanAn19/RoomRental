export interface RoomDTO {
  id: number;
  id_user: string;
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
    full_name: string;
    Email: string;
    phoneNumber: string;
    image: string;
  };
  address: {
    id: number;
    number_house: number;
    street_name: string;
    ward: string;
    district: string;
    province: string;
  };
  category: {
    id: number;
    name: string;
  };
  isFavorite?: boolean;
}
