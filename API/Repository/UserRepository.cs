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

        public async Task<ActionResult<UserGamesDto>> GetUserGames(int userId)
        {
            IQueryable<Game> games = _context.Games
                .Include(g => g.GameType)
                .Include(g => g.Scores.Where(s => s.UserId == userId));

            return new UserGamesDto
            {
                NewGames = await games
                    .Where(g => !g.Users.Any(u => u.Id == userId))
                    .Select(g => new GameDto
                    {
                        Id = g.Id,
                        Name = g.Name,
                        Answer = g.Answer,
                        GameTypeId = g.GameTypeId,
                        GameType = new GameTypeDto{Id = g.GameType.Id, Name = g.GameType.Name},
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
                    .Select(g => new GameDto
                    {
                        Id = g.Id,
                        Name = g.Name,
                        Answer = g.Answer,
                        GameTypeId = g.GameTypeId,
                        GameType = new GameTypeDto{Id = g.GameType.Id, Name = g.GameType.Name},
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
    }
}