﻿using System.ComponentModel.DataAnnotations;

namespace RoomSocialBE.Models
{
    public class Category
    {
        [Key]
            public int id { get; set; }
            public string name { get; set; }

            // Liên kết
            public ICollection<Room>? Rooms { get; set; }
    }
}
