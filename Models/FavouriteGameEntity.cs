using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace hajusrakendused.Models;

public class FavoriteGameEntity
{
    public long Id { get; set; }
    [MaxLength(64)]
    public required string Title { get; set; }
    [MaxLength(128)]
    public required string Description { get; set; }
    [MaxLength(256)]
    public required string Image { get; set; }
    [MaxLength(512)]
    public required string GenreJson { get; set; }
    [MaxLength(64)]
    public required string Developer { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public IdentityUser User { get; set; } = null!;
}