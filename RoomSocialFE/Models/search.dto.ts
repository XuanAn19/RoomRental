export interface SearchDTO {
  SearchName?: string;
  CategoryName?: string;
  SortBy?: string;
  SortDescending?: boolean;
  From?: number | null;
  To?: number | null;
  ArceFrom?: number;
  ArceTo?: number;
  Province?: string;
  District?: string;
  Ward?: string;
}
