using System.Collections.Generic;

namespace API.DTOs
{
    public class NewGameDto
    {
        public string Name { get; set; }

        public string Answer { get; set; }

        public GameTypeDto GameType { get; set; }

        public int GameTypeId { get; set; }

        public IList<ScoreDto> Scores { get; set; } = new List<ScoreDto>();
    }

    public class GameDto: NewGameDto
    {
        public int Id { get; set; }
    }
}