using API.Data;
using API.Entities;
using API.Interfaces;

namespace API.Repository
{
    public class GameRepository : Repository.Repository<Game>, IGameRepository
    {
        private readonly DataContext _context;

        public GameRepository(DataContext context)
            :base(context)
        {
            _context = context;
        }
        
    }
}