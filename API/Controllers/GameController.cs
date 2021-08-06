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

        [Authorize(Policy = "RequireAdmin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Game>>> GetGames()
        {
            return await _context.Games
                .Include(g => g.GameType)
                .ToListAsync();
        }

        [Authorize(Policy = "RequireAdmin")]
        [HttpGet("{gameId}")]
        public async Task<ActionResult<GameDetailDto>> GetGame(int gameId)
        {
            var game = await _context.Games
                .Where(g => g.Id == gameId)
                .Include(g => g.GameType)
                .Include(g => g.Scores)
                .SingleOrDefaultAsync();

            return new GameDetailDto
            {
                Id = game.Id,
                Name = game.Name,
                Answer = game.Answer,
                GameType = game.GameType,
                Scores = game.Scores
            };
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

        [Authorize(Policy = "RequireAdmin")]
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
                    User = user,
                    Game = game,
                    UserName = user.UserName
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
        public async Task<ActionResult> UpdateGameScore([FromBody] Score updatedScore)
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

        [HttpDelete("{gameId}")]
        public async Task<ActionResult> DeleteGame(int gameId)
        {
            var game = await _context.Games.FindAsync(gameId);

            if(game == null)
            {
                return BadRequest("Game does not exist");
            }

            _context.Games.Remove(game);

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}