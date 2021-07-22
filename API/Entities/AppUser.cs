using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUser : IdentityUser<int>
    {
        //public int Id { get; set; }

        //public string UserName { get; set; }

        public List<Game> Games { get; set; }

        public List<Score> Scores { get; set; }

        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}