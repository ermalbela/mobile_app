using backend_mobile.Models;
using System.ComponentModel.DataAnnotations;

public class UserWatchLater
{
    [Key]
    public int Id { get; set; }

    public string UserId { get; set; }
    public User User { get; set; }

    public string MovieId { get; set; }
}
