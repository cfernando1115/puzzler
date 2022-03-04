using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<GameDto>>> GetGames()
        {
            var games = await _unitOfWork.Games.GetAll();

            var gameDtos = new List<GameDto>();

            foreach (var game in games)
            {
                gameDtos.Add(new GameDto
                {
                    Id = game.Id,
                    Name = game.Name,
                    Answer = game.Answer,
                    Status = game.Status,
                    GameTypeId = game.GameTypeId,
                    GameTypeName = game.GameTypeName
                });
            }

            return Ok(gameDtos);
        }

        //[Authorize(Policy = "RequireAdmin")]
        [HttpGet("{gameId}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<GameDto>> GetGame(int gameId)
        {
            var game = await _unitOfWork.Games.GetOne(expression: (x) => x.Id.Equals(gameId), includesList: new List<string>() { "Scores" });

            if(game == null)
            {
                return BadRequest("Game not found");
            }

            var gameDto = new GameDto
            {
                Id = game.Id,
                Name = game.Name,
                Answer = game.Answer,
                Status = game.Status,
                GameTypeId = game.GameTypeId,
                GameTypeName = game.GameTypeName,
                Scores = game.Scores.Select(s => new ScoreDto
                    {
                        Total = s.Total,
                        UserId = s.UserId,
                        GameId = s.GameId,
                        UserName = s.UserName,
                        GameName = s.GameName
                    }).ToList()
            };

            return Ok(gameDto);
        }

        [HttpGet("user-games")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<UserGamesDto>> GetUserGames()
        {
            var userId = User.GetUserId();

            return Ok(await _unitOfWork.Users.GetUserGames(userId));
        }

        [Authorize(Policy = "RequireAdmin")]
        [HttpPost("add-game")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<GameDto>> AddGame(NewGameDto gameDto)
        {
            var game = new Game
            {
                Name = gameDto.Name,
                GameTypeId = gameDto.GameTypeId,
                Answer = gameDto.Answer,
                LettersGrid = gameDto.LettersGrid,
                Words = gameDto.Words,
                Scores = new List<Score>(),
                GameTypeName = gameDto.GameTypeName
            };

            await _unitOfWork.Games.InsertOne(game);

            if (await _unitOfWork.Complete())
            {
                return Ok(new GameDto
                {
                    Id = game.Id,
                    Name = game.Name,
                    Answer = game.Answer,
                    GameTypeId = game.GameTypeId,
                    GameTypeName = game.GameTypeName,
                    Status = game.Status,
                    Scores = game.Scores.Select(s => new ScoreDto
                    {
                        Total = s.Total,
                        UserId = s.UserId,
                        GameId = s.GameId,
                        UserName = s.UserName,
                        GameName = s.GameName
                    }).ToList()
                });
            }

            return StatusCode(500, "Internal server error. Please try again.");
        }

        [HttpPost("add-user-game/{gameId}")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ScoreDto>> AddGameToUser(int gameId)
        {
            var user = await _unitOfWork.Users.GetOne(expression: (x) => x.Id.Equals(User.GetUserId()));
            var game = await _unitOfWork.Games.GetOne(expression: (x) => x.Id.Equals(gameId));

            if(game == null)
            {
                return BadRequest("Game not found");
            }

            var score = new Score
            {
                User = user,
                Game = game,
                GameName = game.Name,
                UserName = user.UserName
            };

            game.Scores.Add(score);
            user.Games.Add(game);

            if (await _unitOfWork.Complete())
            {
                return Ok(new ScoreDto
                {
                    GameId = score.GameId,
                    UserId = score.UserId,
                    Total = 0
                });
            }

            return StatusCode(500, "Internal server error. Please try again.");
        }

        [HttpPut("update-score")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> UpdateGameScore([FromBody] Score updatedScore)
        {
            var score = await _unitOfWork.Scores.GetOne(expression: (x) => x.UserId.Equals(updatedScore.UserId) && x.GameId.Equals(updatedScore.GameId));

            if (score != null)
            {
                score.Total = updatedScore.Total;

                if (await _unitOfWork.Complete())
                {
                    return Ok(new { message = "Scoring complete" });
                }
            }

            return StatusCode(500, "Internal server error. Please try again.");
        }

        [Authorize(Policy = "RequireAdmin")]
        [HttpDelete("{gameId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteGame(int gameId)
        {
            var game = await _unitOfWork.Games.GetOne(expression: (x) => x.Id == gameId);

            if(game == null)
            {
                return BadRequest("Game not found");
            }

            await _unitOfWork.Games.DeleteOne(gameId);

            if (await _unitOfWork.Complete())
            {
                return Ok(new {message = "Game deleted"});
            }

            return StatusCode(500, "Internal server error. Please try again.");
        }

        [Authorize(Policy = "RequireAdmin")]
        [HttpPut("change-status/{gameId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> ChangeStatus(int gameId)
        {
            var game = await _unitOfWork.Games.GetOne((x) => x.Id.Equals(gameId));

            if(game == null)
            {
                return BadRequest("Game does not exist");
            }

            game.Status = game.Status == "active" 
                ? "archived" 
                : "active";
            
            if(await _unitOfWork.Complete())
            {
                return Ok(new {message = "Status updated"});
            }
            
            return StatusCode(500, "Internal server error. Please try again.");
        }
    }
}