using System.Collections.Generic;

namespace API.Entities
{
    public class Game
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public List<Score> Scores { get; set; }
    }
}