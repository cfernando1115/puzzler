namespace API.DTOs
{
    public class ScoreDto
    {
        public int Id { get; set; }
        public int Total { get; set; }

        public int UserId { get; set; }

        public int GameId { get; set; }
    }
}