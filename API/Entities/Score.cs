namespace API.Entities
{
    public class Score
    {
        public int Total { get; set; }

        public Game Game { get; set; }
        public int GameId { get; set; }

        public AppUser User { get; set; }

        public int UserId { get; set; }
    }
}