using System.Collections.Generic;
using API.Entities;

namespace API.DTOs
{
    public class GameDetailDto
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string Answer { get; set; }

        public GameType GameType { get; set; }

        public List<Score> Scores { get; set; }
    }
}