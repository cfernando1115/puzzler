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
    public class AdminsController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;

        private readonly IPhotoService _photoService;

        public AdminsController(IUnitOfWork unitOfWork, IPhotoService photoService)
        {
            _unitOfWork = unitOfWork;
            _photoService = photoService;
        }

        [Authorize(Policy = "RequireAdmin")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAdmins()
        {
            var admins = await _unitOfWork.Users.GetAll(expression: (x) => x.UserRoles.Any(r => r.Role.Name == "Admin"));
            var adminDtos = new List<AdminDto>();

            foreach(var admin in admins)
            {
                adminDtos.Add(new AdminDto
                {
                    Id = admin.Id,
                    UserName = admin.UserName,
                });
            }
            return Ok(adminDtos);
        }

        [Authorize(Policy = "RequireAdmin")]
        [HttpDelete("delete/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> DeleteAdmin(int id)
        {
            string message;
            var admin = await _unitOfWork.Users.GetOne(expression: (x) => x.Id == id);

            if(admin == null)
            {
                message = "Admin does not exist in database.";
                return BadRequest(new { message });
            }

            await _unitOfWork.Users.DeleteOne(id);
            
            if(await _unitOfWork.Complete())
            {
                message = "Admin successfully deleted.";
                return Ok(new { message });
            }

            return StatusCode(500, "Internal server error. Please try again.");
        }
    }
}