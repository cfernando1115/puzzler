using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class GameTypesController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;

        public GameTypesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GameTypeDto>>> GetGameTypes()
        {
            var gameTypes = await _unitOfWork.GameTypes.GetAll();

            var gameTypeDtos = new List<GameTypeDto>();

            foreach(var gameType in gameTypes)
            {
                gameTypeDtos.Add(new GameTypeDto
                {
                    Id = gameType.Id,
                    Name = gameType.Name
                });
            }

            return gameTypeDtos;
        }
    }
}