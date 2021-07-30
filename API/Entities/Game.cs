using System.Collections.Generic;

namespace API.Entities
{
    public class Game
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Answer { get; set; }

        public GameType GameType { get; set; }

        public int GameTypeId { get; set; }

        public List<Score> Scores { get; set; } = new List<Score>();

        public List<AppUser> Users { get; set; } = new List<AppUser>();
    }
}