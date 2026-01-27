using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_mobile.Models
{
    public class User : IdentityUser
    {

        [MaxLength(50)]
        public string Name { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Column(TypeName = "datetime")]
        public DateTime ModifiedDate { get; set; } = DateTime.Now;

        [Column(TypeName = "datetime")]
        public DateTime LastLogin { get; set; } = DateTime.Now;

        public string Status { get; set; }
        public string? Role { get; set; }
        public ICollection<UserFavorite> Favorites { get; set; } = [];
        public ICollection<UserWatchLater> WatchLater { get; set; } = [];

    }
}