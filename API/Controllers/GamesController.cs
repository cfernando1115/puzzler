using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class GamesController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;

        public GamesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [Authorize(Policy = "RequireAdmin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GameDto>>> GetGames()
        {
            var games = await _unitOfWork.Games.GetAll(includesList: new List<string>() { "GameType" });

            var gameDtos = new List<GameDto>();

            foreach(var game in games)
            {
                gameDtos.Add(new GameDto
                {
                    Id = game.Id,
                    Name = game.Name,
                    Answer = game.Answer,
                    GameTypeId = game.GameTypeId,
                    GameType = new GameTypeDto { Id = game.GameType.Id, Name = game.GameType.Name }
                });
            }

            return gameDtos;
        }

        [Authorize(Policy = "RequireAdmin")]
        [HttpGet("{gameId}")]
        public async Task<ActionResult<GameDto>> GetGame(int gameId)
        {
            var game = await _unitOfWork.Games.GetOne(expression: (x) => x.Id.Equals(gameId), includesList: new List<string>() { "GameType", "Scores" });

            return new GameDto
            {
                Id = game.Id,
                Name = game.Name,
                Answer = game.Answer,
                GameType = new GameTypeDto { Id = game.GameType.Id, Name = game.GameType.Name },
                Scores = game.Scores.Select(s => new ScoreDto
                {
                    Total = s.Total,
                    UserId = s.UserId,
                    GameId = s.GameId,
                    UserName = s.UserName,
                    GameName = s.GameName
                }).ToList()
            };
        }

        [HttpGet("user-games")]
        public async Task<ActionResult<UserGamesDto>> GetUserGames()
        {
            var userId = User.GetUserId();

            return await _unitOfWork.Users.GetUserGames(userId);
        }

        [Authorize(Policy = "RequireAdmin")]
        [HttpPost("add-game")]
        public async Task<ActionResult<Game>> AddGame(NewGameDto gameDto)
        {
            var game = new Game
            {
                Name = gameDto.Name,
                GameTypeId = gameDto.GameTypeId,
                Answer = gameDto.Answer,
                Scores = new List<Score>(),
                GameType = await _unitOfWork.GameTypes.GetOne(expression: (x) => x.Id.Equals(gameDto.GameTypeId))
            };

            await _unitOfWork.Games.InsertOne(game);

            if(await _unitOfWork.Complete())
            {
                return game;
            }

            return BadRequest("Failed to save game");
        }

        [HttpPost("add-user-game/{gameId}")]
        public async Task<ActionResult<ScoreDto>> AddGameToUser(int gameId)
        {
            var user = await _unitOfWork.Users.GetOne(expression: (x) => x.Id.Equals(User.GetUserId()));
            var game = await _unitOfWork.Games.GetOne(expression: (x) => x.Id.Equals(gameId));

            if(game != null)
            {
                var score = new Score
                {
                    User = user,
                    Game = game,
                    GameName = game.Name,
                    UserName = user.UserName
                };

                game.Scores.Add(score);
                user.Games.Add(game);

                if(await _unitOfWork.Complete())
                {
                    return new ScoreDto
                    {
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
            var score = await _unitOfWork.Scores.GetOne(expression: (x) => x.UserId.Equals(updatedScore.UserId) && x.GameId.Equals(updatedScore.GameId));

            if(score != null) 
            {
                score.Total = updatedScore.Total;

                if(await _unitOfWork.Complete())

                return Ok();
            }

            return BadRequest("Failed to update score");
        }

        [HttpDelete("{gameId}")]
        public async Task<ActionResult> DeleteGame(int gameId)
        {
            await _unitOfWork.Games.DeleteOne(gameId);

            if(await _unitOfWork.Complete())
            {
                return Ok();
            }

            return BadRequest("Failed to delete game");
        }
    }
}