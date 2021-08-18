using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    public class Score
    {
        public int Total { get; set; }

        public Game Game { get; set; }
        
        [ForeignKey(nameof(Game))]
        public int GameId { get; set; }

        public string GameName { get; set; }

        public AppUser User { get; set; }
        
        [ForeignKey(nameof(AppUser))]
        public int UserId { get; set; }

        public string UserName { get; set; }
    }
}