using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    public class Game
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Answer { get; set; }

        public string Status { get; set; } = "active";

        public GameType GameType { get; set; }

        [ForeignKey(nameof(GameType))]
        public int GameTypeId { get; set; }

        public IList<Score> Scores { get; set; } = new List<Score>();

        public IList<AppUser> Users { get; set; } = new List<AppUser>();
    }
}