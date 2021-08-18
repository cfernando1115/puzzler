using System.Collections.Generic;

namespace API.DTOs
{
    public class UserGamesDto
    {
        public IEnumerable<GameDto> NewGames { get; set; }

        public IEnumerable<GameDto> PlayedGames { get; set; }

    }
}