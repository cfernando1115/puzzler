using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUser : IdentityUser<int>
    {
        public List<Game> Games { get; set; } = new List<Game>();

        public List<Score> Scores { get; set; } = new List<Score>();

        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}