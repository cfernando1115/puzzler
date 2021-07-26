using System.Collections.Generic;
using API.Entities;

namespace API.DTOs
{
    public class UserGamesDto
    {
        public IEnumerable<Game> NewGames { get; set; }

        public IEnumerable<Game> PlayedGames { get; set; }

    }
}