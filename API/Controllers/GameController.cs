using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class GameController : BaseApiController
    {
        private readonly DataContext _context;

        public GameController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Game>>> GetGames()
        {
            return await _context.Games
                .Include(g => g.Scores)
                .Include(g => g.GameType)
                .ToListAsync();
        }

        [HttpGet("user-games")]
        public async Task<ActionResult<UserGamesDto>> GetUserGames()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            IQueryable<Game> games = _context.Games
                .Include(g => g.Scores)
                .Include(g => g.GameType);

            return new UserGamesDto
            {
                NewGames = await games
                    .Where(g => !g.Scores.Any(s => s.UserId == userId))
                    .ToListAsync(),
                PlayedGames = await games
                    .Where(g => g.Scores.Any(s => s.UserId == userId))
                    .ToListAsync()
            };
        }

        [HttpPost("add-game")]
        public async Task<ActionResult<Game>> AddGame(GameDto gameDto)
        {
            var game = new Game
            {
                Name = gameDto.Name,
                GameTypeId = gameDto.GameTypeId,
                Answer = gameDto.Answer,
                Scores = new List<Score>(),
                GameType = await _context.GameTypes.FindAsync(gameDto.GameTypeId)
            };

            _context.Games.Add(game);

            if(await _context.SaveChangesAsync() > 0)
            {
                return game;
            }

            return BadRequest("Failed to save game");
        }

        [HttpGet("game-types")]
        public async Task<ActionResult<IEnumerable<GameType>>> GetGameTypes()
        {
            return await _context.GameTypes.ToListAsync();
        }

    }
}