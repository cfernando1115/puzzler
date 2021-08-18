using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUser : IdentityUser<int>
    {
        public IList<Game> Games { get; set; } = new List<Game>();

        public IList<Score> Scores { get; set; } = new List<Score>();

        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}