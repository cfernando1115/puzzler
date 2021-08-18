using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using API.Data;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repository
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly DataContext _context;
        private readonly DbSet<T> _dbSet;

        public Repository(DataContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public async Task DeleteOne(int entryId)
        {
            var entry = await _dbSet.FindAsync(entryId);

            _dbSet.Remove(entry);
        }

        public void DeleteRange(IEnumerable<T> entries)
        {
            _dbSet.RemoveRange(entries);
        }

        public async Task<IList<T>> GetAll(Expression<Func<T, bool>> expression = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null, List<string> includesList = null)
        {
            IQueryable<T> query = _dbSet;

            if(expression != null)
            {
                query = query.Where(expression);
            }

            if(includesList != null)
            {
                foreach(var property in includesList)
                {
                    query = query.Include(property);
                }
            }

            if(orderBy != null)
            {
                query = orderBy(query);
            }

            return await query.ToListAsync();
        }

        public async Task<T> GetOne(Expression<Func<T, bool>> expression = null, List<string> includesList = null)
        {
            IQueryable<T> query = _dbSet;

            if(includesList != null)
            {
                foreach(var property in includesList)
                {
                    query = query.Include(property);
                }
            }

            return await query.FirstOrDefaultAsync(expression);
        }

        public async Task InsertOne(T entry)
        {
           await _dbSet.AddAsync(entry);
        }

        public async Task InsertRange(IEnumerable<T> entries)
        {
            await _dbSet.AddRangeAsync(entries);
        }
    }
}