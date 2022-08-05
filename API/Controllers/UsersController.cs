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
    public class UsersController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;

        private readonly IPhotoService _photoService;

        public UsersController(IUnitOfWork unitOfWork, IPhotoService photoService)
        {
            _unitOfWork = unitOfWork;
            _photoService = photoService;
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

        [HttpGet("{id}", Name = "GetUser")]
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

        
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var player = await _unitOfWork.Users.GetOne(expression: (x) => x.Id.Equals(User.GetUserId()), includesList: new List<string>(){ "Photo" });

            if(player.Photo != null)
            {
                await _photoService.DeletePhotoAsync(player.Photo.PublicId);
            }

            var result = await _photoService.AddPhotoAsync(file);

            if(result.Error != null)
            {
                return BadRequest(result.Error.Message);
            }

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            player.Photo = photo;

            if(await _unitOfWork.Complete())
            {
                var photoDto = new PhotoDto
                {
                    Id = photo.Id,
                    Url = photo.Url
                };
                return CreatedAtRoute("GetUser", new { id = player.Id }, photoDto);
            }

            return StatusCode(500, "Internal server error. Please try again.");
        }

        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _unitOfWork.Users.GetOne(expression: (x) => x.Id.Equals(User.GetUserId()), includesList: new List<string>(){ "Photo" });

            if(user.Photo.Id != photoId)
            {
                return NotFound("Photo not associated with user");
            }

            if(user.Photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(user.Photo.PublicId);

                if(result.Error != null)
                {
                    return StatusCode(500, "Internal server error. Please try again.");
                }
            }

            user.Photo = null;

            if(await _unitOfWork.Complete())
            {
                return Ok(new { message = "Photo deleted" });
            }

            return StatusCode(500, "Internal server error. Please try again.");
        }
    }
}