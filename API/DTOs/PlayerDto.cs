using System.Collections.Generic;

namespace API.DTOs
{
    public class PlayerDto
    {
        public int Id { get; set; }

        public string UserName { get; set; }

        public IList<GameDto> Games { get; set; }

        public IList<ScoreDto> Scores { get; set; }
    }
}