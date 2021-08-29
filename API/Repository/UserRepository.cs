using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Repository
{
    public class UserRepository : Repository.Repository<AppUser>, IUserRepository
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context)
            :base(context)
        {
            _context = context;
        }

        public async Task<UserGamesDto> GetUserGames(int userId)
        {
            IQueryable<Game> games = _context.Games
                .Include(g => g.Scores.Where(s => s.UserId == userId));

            return new UserGamesDto
            {
                NewGames = await games
                    .Where(g => !g.Users.Any(u => u.Id == userId))
                    .AsSingleQuery()
                    .Select(g => new GameDto
                    {
                        Id = g.Id,
                        Name = g.Name,
                        Answer = g.Answer,
                        GameTypeId = g.GameTypeId,
                        GameTypeName = g.GameTypeName,
                        Status = g.Status,
                        Scores = g.Scores.Select(s => new ScoreDto { 
                            Total = s.Total,
                            UserId = s.UserId,
                            GameId = s.GameId,
                            UserName = s.UserName,
                            GameName = s.GameName 
                        }).ToList()
                    })
                    .ToListAsync(),
                PlayedGames = await games
                    .Where(g => g.Users.Any(u => u.Id == userId))
                    .AsSingleQuery()
                    .Select(g => new GameDto
                    {
                        Id = g.Id,
                        Name = g.Name,
                        Answer = g.Answer,
                        GameTypeId = g.GameTypeId,
                        GameTypeName = g.GameTypeName,
                        Status = g.Status,
                        Scores = g.Scores.Select(s => new ScoreDto { 
                            Total = s.Total,
                            UserId = s.UserId,
                            GameId = s.GameId,
                            UserName = s.UserName,
                            GameName = s.GameName 
                        }).ToList()
                    })
                    .ToListAsync()
            };
        }

        public async Task<IEnumerable<PlayerDto>> GetPlayers()
        {
            return await _context.Users
                .Include(u => u.Scores)
                .Where(user => !user.UserRoles.Any(r => r.Role.Name == "Admin"))
                .AsSingleQuery()
                .Select(p => new PlayerDto
                {
                    Id = p.Id,
                    UserName = p.UserName,
                    Scores = p.Scores.Select(s => new ScoreDto 
                    { 
                        Total = s.Total, 
                        UserId = s.UserId, 
                        GameId = s.GameId, 
                        UserName = s.UserName, 
                        GameName = s.GameName 
                    }).ToList()
                })
                .ToListAsync();
        }
    }
}