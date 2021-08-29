using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Interfaces
{
    public interface IUserRepository : IRepository<AppUser>
    {
        Task<UserGamesDto> GetUserGames(int userId);

        Task<IEnumerable<PlayerDto>> GetPlayers();
    }
}