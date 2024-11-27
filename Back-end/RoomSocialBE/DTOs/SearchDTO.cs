namespace RoomSocialBE.DTOs
{
    public class SearchDTO
    {
        public string? SearchName { get; set; }
        public string? CategoryName { get; set; }
        public string SortBy { get; set; } = "create_date";
        public bool SortDescending { get; set; } = true;
        public int? From { get; set; }
        public int? To { get; set; }
        public double? ArceFrom { get; set; }
        public double? ArceTo { get; set; }
        public string? Address { get; set; }
    }
}
