using backend_mobile.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public class UserFavorite
{
    [Key]
    public int Id { get; set; }

    public string UserId { get; set; }

    [JsonIgnore]
    public User User { get; set; }

    public string MovieId { get; set; }
}
