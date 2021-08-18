using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Interfaces
{
    public interface IUserRepository : IRepository<AppUser>
    {
        Task<ActionResult<UserGamesDto>> GetUserGames(int userId);
    }
}