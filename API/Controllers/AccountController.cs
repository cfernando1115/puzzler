using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;

        private readonly ITokenService _tokenService;

        private readonly UserManager<AppUser> _userManager;

        private readonly SignInManager<AppUser> _signInManager;

        public AccountController(DataContext context, ITokenService tokenService, UserManager<AppUser> userManager, SignInManager<AppUser> signInManager)
        {
            _context = context;
            _tokenService = tokenService;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if(await UserExists(registerDto.UserName))
            {
                return BadRequest("Username is taken");
            }

            var user = new AppUser
            {
                UserName = (registerDto.UserName)
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);


            if(!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            var roleResult = await _userManager.AddToRoleAsync(user, "Member");

            if(!roleResult.Succeeded)
            {
                return BadRequest(roleResult.Errors);
            }

            return Ok(new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Token = await _tokenService.CreateToken(user)
            });
        }

        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users
                .Include(u => u.Photo)
                .SingleOrDefaultAsync(u => u.UserName == loginDto.UserName);

            if(user == null)
            {
                return Unauthorized("Invalid username");
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if(!result.Succeeded)
            {
                return Unauthorized();
            }

            return new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Photo = user.Photo != null 
                    ? new PhotoDto 
                    {
                        Id = user.Photo.Id,
                        Url = user.Photo.Url
                    }
                    : null,
                Token = await _tokenService.CreateToken(user)
            };
        }

        [Authorize(Policy = "RequireAdmin")]
        [HttpPost("register-admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<AdminDto>> RegisterAdmin(AdminRegisterDto adminRegisterDto){
            string message;

            if (await UserExists(adminRegisterDto.UserName))
            {
                message = "Admin username is taken.";
                return BadRequest(new { message });
            }

            var admin = new AppUser
            {
                UserName = adminRegisterDto.UserName.ToLower()
            };

            var result = await _userManager.CreateAsync(admin, adminRegisterDto.Password);
            await _userManager.AddToRoleAsync(admin, "Admin");

            if (!result.Succeeded)
            {
                return StatusCode(500);
            }

            message = "Admin successfully added.";
            AdminDto data = new AdminDto
            {
                Id = admin.Id,
                UserName = admin.UserName
            };

            return Ok(new { message, data });
        }

        [Authorize(Policy = "RequireAdmin")]
        [HttpPut("change-password")]
        public async Task<ActionResult> ChangePassword([FromBody]PasswordChangeDto passwordChangeDto)
        {
            string message;

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == passwordChangeDto.Id);

            if(user != null) 
            {
                var result = await _userManager.ChangePasswordAsync(user, passwordChangeDto.CurrentPassword, passwordChangeDto.NewPassword);
                if (!result.Succeeded)
                {
                    return StatusCode(500);
                }

                message = "Password successfully updated.";

                return Ok(new { message });
            }

            message = "Failed to update password";
            return BadRequest(new { message });
        }

        private async Task<bool> UserExists(string username)
        {
            return await _userManager.Users.AnyAsync(u => u.UserName.ToLower() == username.ToLower());
        }
    }
}