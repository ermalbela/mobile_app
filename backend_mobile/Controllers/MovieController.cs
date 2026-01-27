using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using backend_mobile.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using System.Text.Json;
using Microsoft.Extensions.Hosting;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using MongoDB.Bson;
using System.Xml.Linq;

[ApiController]
[Route("api/movies")]
[Authorize]
public class MovieController : ControllerBase
{
    private readonly IMongoCollection<Movie> _movies;
    private readonly IMongoCollection<Comment> _comments;
    private readonly IWebHostEnvironment _hostEnvironment;

    public MovieController(IConfiguration config, IWebHostEnvironment hostEnvironment)
    {
        var client = new MongoClient(config.GetConnectionString("MongoDb"));
        var database = client.GetDatabase(config["MongoDbSettings:DatabaseName"]);
        _movies = database.GetCollection<Movie>(config["MongoDbSettings:CollectionName"]);
        _comments = database.GetCollection<Comment>(config["MongoDbSettings:CommentsCollectionName"]);
        this._hostEnvironment = hostEnvironment;
    }

    [HttpGet("get_movies")]
    public async Task<ActionResult<List<Movie>>> GetMovies()
    {
        var movies = await _movies.Find(_ => true).ToListAsync();

        foreach (var movie in movies)
        {
            movie.Poster = String.Format("http://localhost:5064/Images/{0}", movie.ImageName);
            movie.Video = String.Format("http://localhost:5064/Videos/{0}", movie.VideoName);
        }

        return Ok(movies);
    }

    [HttpGet("filter_movies")]
    public async Task<ActionResult<List<Movie>>> GetMoviesByGenre([FromQuery] string genre)
    {
        if (string.IsNullOrWhiteSpace(genre))
            return BadRequest("Genre is required.");

        // Case-insensitive filter on the Genres array
        var filter = Builders<Movie>.Filter.AnyEq(m => m.Genres, genre);

        var movies = await _movies.Find(filter).ToListAsync();

        if (!movies.Any())
            return NotFound($"No movies found for genre '{genre}'.");

        foreach (var movie in movies)
        {
            movie.Poster = $"http://localhost:5064/Images/{movie.ImageName}";
            movie.Video = $"http://localhost:5064/Videos/{movie.VideoName}";
        }

        return Ok(movies);
    }


    [HttpGet("get_movie")]
    public ActionResult<Movie> GetMovie([FromQuery] string id)
    {
        if (!ObjectId.TryParse(id, out ObjectId objectId))
            return BadRequest("Invalid movie ID.");

        var movie = _movies.Find(m => m.Id == objectId.ToString()).FirstOrDefault();


        if (movie == null)
        {
            return NotFound($"Movie with ID {id} not found.");
        }

        movie.Poster = $"http://localhost:5064/Images/{movie.ImageName}";
        movie.Video = $"http://localhost:5064/Videos/{movie.VideoName}";

        return Ok(movie);
    }

    [HttpPost("create_movie")]
    public async Task<ActionResult> CreateMovie(Movie movie)
    {
        try
        {

            if (string.IsNullOrWhiteSpace(movie.Title))
            {
                return BadRequest("Movie title is required");
            }

            if (movie.Genres == null || !movie.Genres.Any())
            {
                return BadRequest("At least one genre is required.");
            }

            if (string.IsNullOrWhiteSpace(movie.Title))
                return BadRequest("Title is required.");

            if (movie.ImageName == null || movie.ImageName.Length == 0)
                return BadRequest("Poster image is required.");

            if (movie.Video == null || movie.Video.Length == 0)
                return BadRequest("Video file is required.");

            // Save image and video
            string posterFileName = await SaveFile(movie.ImageFile, "Images");
            string videoFileName = await SaveFile(movie.VideoFile, "Videos");

            var _movie = new Movie
            {
                Title = movie.Title,
                Plot = movie.Plot,
                Genres = movie.Genres,
                Actors = movie.Actors,
                Directors = movie.Directors,
                Languages = movie.Languages,
                Released = movie.Released,
                ImageName = posterFileName,
                VideoName = videoFileName,
            };


            _movies.InsertOne(_movie);

            return Ok(movie);
        }
        catch (Exception ex)
        {
            return BadRequest($"Failed to create movie: {ex.Message}");
        }
    }

    [HttpDelete("delete_movie/{id}")]
    public async Task<IActionResult> DeleteMovie(string id)
    {
        if (!ObjectId.TryParse(id, out ObjectId objectId))
            return BadRequest("Invalid movie ID.");

        var movie = await _movies.Find(m => m.Id == id).FirstOrDefaultAsync();
        if (movie == null)
            return NotFound($"Movie with ID {id} not found.");

        // Delete associated files
        DeleteImage(movie.ImageName);
        DeleteVideo(movie.VideoName);

        await _movies.DeleteOneAsync(m => m.Id == id);

        await _comments.DeleteManyAsync(c => c.MovieId == id);

        return Ok(new { message = "Movie deleted successfully." });
    }


    public class RateRequest
    {
        public string UserId { get; set; }
        public int Score { get; set; }
    }


    [HttpPost("rate_movie/{movieId}")]
    public async Task<IActionResult> RateMovie(string movieId, RateRequest request)
    {
        var movie = await _movies.Find(m => m.Id == movieId).FirstOrDefaultAsync();
        if (movie == null)
            return NotFound("Movie not found.");

        if (movie.Ratings.Any(r => r.UserId == request.UserId))
            return BadRequest("You have already rated this movie.");

        movie.Ratings.Add(new MovieRating
        {
            UserId = request.UserId,
            Score = request.Score
        });

        movie.RatingCount = movie.Ratings.Count;
        movie.AverageRating = movie.Ratings.Average(r => r.Score);

        await _movies.ReplaceOneAsync(m => m.Id == movieId, movie);

        return Ok(new {message = "Rating added successfully.", movie});
    }



    [NonAction]
    public void DeleteImage(string imageName)
    {
        var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, "Images", imageName);
        if (System.IO.File.Exists(imagePath))
        {
            System.IO.File.Delete(imagePath);
        }
    }

    [NonAction]
    private async Task<string> SaveFile(IFormFile file, string folder)
    {
        var fileName = Path.GetFileNameWithoutExtension(file.FileName);
        fileName = Regex.Replace(fileName, @"[^a-zA-Z0-9_-]", "");
        fileName = fileName.Length > 10 ? fileName.Substring(0, 10) : fileName;
        fileName += DateTime.Now.ToString("yyyyMMddHHmmssfff") + Path.GetExtension(file.FileName);

        var folderPath = Path.Combine(_hostEnvironment.ContentRootPath, folder);
        Directory.CreateDirectory(folderPath);

        var fullPath = Path.Combine(folderPath, fileName);
        using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return fileName;
    }

    public void DeleteVideo(string videoName)
    {
        var videoPath = Path.Combine(_hostEnvironment.ContentRootPath, "Videos", videoName);
        if (System.IO.File.Exists(videoPath))
        {
            System.IO.File.Delete(videoPath);
        }
    }
}