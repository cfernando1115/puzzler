using API.Data;
using API.Entities;
using API.Interfaces;

namespace API.Repository
{
    public class ScoreRepository : Repository<Score>, IScoreRepository
    {
        private readonly DataContext _context;

        public ScoreRepository(DataContext context)
            :base(context)
        {
            _context = context;
        }
    }
}