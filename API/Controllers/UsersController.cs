using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
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
        public async Task<ActionResult<IEnumerable<PlayerDto>>> GetUsers()
        {
            var users = await _unitOfWork.Users.GetAll(includesList: new List<string>(){"Scores", "Games"});

            var playerDtos = new List<PlayerDto>();

            foreach(var user in users)
            {
                playerDtos.Add(new PlayerDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Scores = user.Scores.Select(s => new ScoreDto { Total = s.Total, UserId = s.UserId, GameId = s.GameId, UserName = s.UserName, GameName = s.GameName }).ToList(),
                    Games = user.Games.Select(g => new GameDto
                    {
                        Id = g.Id,
                        Name = g.Name,
                        Answer = g.Answer,
                        GameTypeId = g.GameTypeId
                    }).ToList()
                });
            }
            return playerDtos;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PlayerDto>> GetUser(int id)
        {
            var user = await _unitOfWork.Users.GetOne(expression: (x)=> x.Id.Equals(id), includesList: new List<string>(){"Scores", "Games"});

            return new PlayerDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Scores = user.Scores.Select(s => new ScoreDto { Total = s.Total, UserId = s.UserId, GameId = s.GameId, UserName = s.UserName, GameName = s.GameName }).ToList(),
                Games = user.Games.Select(g => new GameDto
                {
                    Id = g.Id,
                    Name = g.Name,
                    Answer = g.Answer,
                    GameTypeId = g.GameTypeId
                }).ToList()
            };
        }
    }
}