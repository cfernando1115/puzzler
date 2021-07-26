using System.Collections.Generic;
using API.Entities;

namespace API.DTOs
{
    public class GameDto
    {
        public string Name { get; set; }

        public string Answer { get; set; }

        public GameType GameType { get; set; }

        public int GameTypeId { get; set; }

        public List<Score> Scores { get; set; }
    }
}