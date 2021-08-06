namespace API.Entities
{
    public class Score
    {
        public int Id { get; set; }
        public int Total { get; set; }

        public Game Game { get; set; }
        
        public int GameId { get; set; }

        public string GameName { get; set; }

        public AppUser User { get; set; }

        public string UserName { get; set; }

        public int UserId { get; set; }
    }
}