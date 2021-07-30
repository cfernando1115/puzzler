using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
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
            var userId = User.GetUserId();

            IQueryable<Game> games = _context.Games
                .Include(g => g.GameType)
                .Include(g => g.Scores.Where(s => s.UserId == userId));

            return new UserGamesDto
            {
                NewGames = await games
                    .Where(g => !g.Users.Any(u => u.Id == userId))
                    .ToListAsync(),
                PlayedGames = await games
                    .Where(g => g.Users.Any(u => u.Id == userId))
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

        [HttpPost("add-user-game/{gameId}")]
        public async Task<ActionResult<ScoreDto>> AddGameToUser(int gameId)
        {
            var user = await _context.Users.FindAsync(User.GetUserId());
            var game = await _context.Games.SingleOrDefaultAsync(g => g.Id == gameId);

            if(game != null)
            {
                var score = new Score
                {
                    UserId = user.Id,
                    GameId = game.Id
                };

                game.Scores.Add(score);
                user.Games.Add(game);

                if(await _context.SaveChangesAsync() > 0)
                {
                    return new ScoreDto
                    {
                        Id = score.Id,
                        GameId = score.GameId,
                        UserId = score.UserId,
                        Total = 0
                    };
                }
            }

            return BadRequest("Game not found");
        }

        [HttpPut("update-score")]
        public async Task<ActionResult> updateGameScore([FromBody] Score updatedScore)
        {
            var score = _context.Scores.Find(updatedScore.Id);
            
            if(score != null) 
            {
                score.Total = updatedScore.Total;

                await _context.SaveChangesAsync();

                return Ok();
            }

            return BadRequest("Failed to update score");
        }
    }
}