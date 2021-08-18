using System.Threading.Tasks;
using API.Entities;

namespace API.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository Users { get; }

        IScoreRepository Scores { get; }

        IRepository<Game> Games { get; }

        IRepository<GameType> GameTypes { get; }

        Task<bool> Complete();

        bool HasChanges();
    }
}