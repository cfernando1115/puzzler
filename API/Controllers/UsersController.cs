using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class UsersController: BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;

        public UsersController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [Authorize(Policy = "RequireAdmin")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<PlayerDto>>> GetUsers()
        {
            var users = await _unitOfWork.Users.GetAll(includesList: new List<string>(){ "Scores" });

            var playerDtos = new List<PlayerDto>();

            foreach(var user in users)
            {
                playerDtos.Add(new PlayerDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Scores = user.Scores.Select(s => new ScoreDto 
                    { 
                        Total = s.Total, 
                        UserId = s.UserId, 
                        GameId = s.GameId, 
                        UserName = s.UserName, 
                        GameName = s.GameName 
                    }).ToList()
                });
            }
            return Ok(playerDtos);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Produces("application/json")]
        public async Task<ActionResult<PlayerDto>> GetUser(int id)
        {
            var user = await _unitOfWork.Users.GetOne(expression: (x)=> x.Id.Equals(id), includesList: new List<string>(){ "Scores" });

            if(user == null)
            {
                return BadRequest("User does not exist");
            }

            return new PlayerDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Scores = user.Scores
                    .Select(s => new ScoreDto 
                    { 
                        Total = s.Total, 
                        UserId = s.UserId, 
                        GameId = s.GameId, 
                        UserName = s.UserName, 
                        GameName = s.GameName 
                    }).ToList()
            };
        }

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [HttpDelete("{playerId}")]
        public async Task<ActionResult> DeleteUser(int playerId)
        {
            var player = await _unitOfWork.Users.GetOne(expression: (x) => x.Id == playerId);

            if(player == null)
            {
                return BadRequest("Player not found");
            }

            await _unitOfWork.Users.DeleteOne(playerId);

            if (await _unitOfWork.Complete())
            {
                return Ok(new {message = "Player deleted"});
            }

            return StatusCode(500, "Internal server error. Please try again.");
        }
    }
}