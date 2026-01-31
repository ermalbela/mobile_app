using backend_mobile.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Security.Claims;

namespace backend_mobile.Controllers
{
    [ApiController]
    [Route("api/comments")]
    [Authorize]
    public class CommentController : Controller
    {
        private readonly IMongoCollection<Comment> _comments;

        public CommentController(IConfiguration config)
        {
            var client = new MongoClient(config.GetConnectionString("MongoDb"));
            var database = client.GetDatabase(config["MongoDbSettings:DatabaseName"]);
            _comments = database.GetCollection<Comment>(config["MongoDbSettings:CommentsCollectionName"]);
        }

        [HttpPost("add_comment")]
        public async Task<IActionResult> AddComment(Comment comment)
        {
            try
            {
                await _comments.InsertOneAsync(comment);
                return Ok(new {message = "Comment Added Successfully!"});
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet("get_comments/{movieId}")]
        public async Task<IActionResult> GetCommentsForMovie(string movieId)
        {
            try
            {
                var comments = await _comments.Find(c => c.MovieId == movieId).ToListAsync();
                return Ok(comments);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet("get_limited_comments/{movieId}")]
        public async Task<IActionResult> GetCommentsForMovie(string movieId,[FromQuery] int page = 1,[FromQuery] int pageSize = 5)
        {
            try
            {
                var skip = (page - 1) * pageSize;

                var comments = await _comments
                    .Find(c => c.MovieId == movieId)
                    .Skip(skip)
                    .Limit(pageSize)
                    .ToListAsync();

                var totalCount = await _comments.CountDocumentsAsync(c => c.MovieId == movieId);

                return Ok(new { limited_comments = comments, totalCount });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("delete_comment/{commentId}")]
        public async Task<IActionResult> DeleteComment(string commentId, [FromBody] DeleteRequest request)
        {
            try
            {

                var comment = await _comments.Find(c => c.Id == commentId).FirstOrDefaultAsync();
                if (comment == null)
                    return NotFound("Comment not found.");

                if (comment.UserId != request.UserId && request.Role != "Superadmin")
                    return StatusCode(403, "You can only delete your own comments.");

                await _comments.DeleteOneAsync(c => c.Id == commentId);

                return Ok(new { message = "Comment deleted successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        public class DeleteRequest
        {
            public string UserId { get; set; }
            public string Role { get; set; }
        }


    }
}
