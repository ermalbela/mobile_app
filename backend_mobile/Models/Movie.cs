using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_mobile.Models
{
    public class Movie 
    { 

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("title")]
        public string Title { get; set; } = null!;

        [BsonElement("plot")]
        public string Plot { get; set; } = null!;

        [BsonElement("genres")]
        public List<string> Genres { get; set; } = new();

        [BsonElement("actors")]
        public List<string> Actors { get; set; } = new();

        [BsonElement("poster")]
        public string Poster { get; set; } = null!;

        [BsonElement("imagefile")]
        [BsonIgnore]
        public IFormFile ImageFile { get; set; }

        [BsonElement("imagename")]
        public string ImageName { get; set; }

        [BsonElement("videofile")]
        [BsonIgnore]
        public IFormFile VideoFile { get; set; }

        [BsonElement("videoname")]
        public string VideoName { get; set; }

        [BsonElement("languages")]
        public List<string> Languages { get; set; } = new();

        [BsonElement("released")]
        public DateTime Released { get; set; }

        [BsonElement("directors")]
        public List<string> Directors { get; set; } = new();

        [BsonElement("video")]
        public string Video { get; set; }

        [BsonElement("averageRating")]
        public double AverageRating { get; set; } = 0;

        [BsonElement("ratingCount")]
        public int RatingCount { get; set; } = 0;

        [BsonElement("ratings")]
        public List<MovieRating> Ratings { get; set; } = new();
    }

    public class MovieRating
    {
        public string UserId { get; set; }
        public int Score { get; set; }
    }
}
