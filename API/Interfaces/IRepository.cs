using System;
using System.Linq;
using System.Linq.Expressions;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IRepository<T> where T: class
    {
        Task<IList<T>> GetAll(
            Expression<Func<T, bool>> expression = null,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
            List<string> includesList = null
        );

        Task<T> GetOne(
            Expression<Func<T, bool>> expression = null,
            List<string> includesList = null
        );

        Task InsertOne(T entry);

        Task InsertRange(IEnumerable<T> entries);

        //void Update(T entry);

        Task DeleteOne(int entryId);

        void DeleteRange(IEnumerable<T> entries);
    }
}