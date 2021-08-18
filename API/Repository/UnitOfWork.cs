using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Interfaces;

namespace API.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext _context;

        private IUserRepository _users;

        private IScoreRepository _scores;

        private IRepository<Game> _games;

        private IRepository<GameType> _gameTypes;

        public UnitOfWork(DataContext context)
        {
            _context = context;
        }

        public IUserRepository Users => _users ??= new UserRepository(_context);

        public IRepository<Game> Games => _games ??= new Repository<Game>(_context);

        public IRepository<GameType> GameTypes => _gameTypes ??= new Repository<GameType>(_context);

        public IScoreRepository Scores => _scores ??= new ScoreRepository(_context);

        public async Task<bool> Complete()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public bool HasChanges()
        {
            return _context.ChangeTracker.HasChanges();
        }
    }
}