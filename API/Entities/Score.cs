namespace API.Entities
{
    public class Score
    {
        public int Id { get; set; }
        public int Total { get; set; }

        public int GameId { get; set; }

        public int UserId { get; set; }
    }
}