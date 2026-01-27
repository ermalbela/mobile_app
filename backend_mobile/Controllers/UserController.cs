using backend_mobile.Data;
using backend_mobile.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace backend_mobile.Controllers
{
    [Route("api/users")]
    [ApiController]

    public class UserController : ControllerBase
    {
        private readonly SignInManager<User> signInManager;
        private readonly UserManager<User> userManager;
        private readonly IConfiguration _config;
        private readonly ApplicationDbContext _context;
        private readonly IMongoCollection<Movie> _movies;

        public UserController(SignInManager<User> sm, UserManager<User> um, IConfiguration config, ApplicationDbContext context)
        {
            signInManager = sm;
            userManager = um;
            _config = config;
            _context = context;

            // MongoDB setup like in your MovieController
            var client = new MongoClient(_config.GetConnectionString("MongoDb"));
            var database = client.GetDatabase(_config["MongoDbSettings:DatabaseName"]);
            _movies = database.GetCollection<Movie>(_config["MongoDbSettings:CollectionName"]);
        }



        [HttpPost("register")]
        public async Task<ActionResult> RegisterUser(User user)
        {

            IdentityResult result = new();

            try
            {
                User user_ = new User()
                {
                    Name = user.Name,
                    Email = user.Email,
                    UserName = user.UserName,
                    Role = "User",
                    Status = user.Status
                };

                result = await userManager.CreateAsync(user_, user.PasswordHash);

                if (!result.Succeeded)
                {
                    return BadRequest(result);
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Something went wrong, please try again. " + ex.Message);
            }

            return Ok(new { message = "Registered Successfully.", result });
        }

        [HttpPost("login")]
        public async Task<ActionResult> LoginUser(Login login)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(login.Email))
                {
                    return BadRequest(new { message = "Email is required." });
                }

                User? user_ = await userManager.FindByEmailAsync(login.Email);

                if (user_ != null)
                {
                    login.Username = user_.UserName;

                    if (!user_.EmailConfirmed)
                    {
                        user_.EmailConfirmed = true;
                    }

                    var result = await signInManager.PasswordSignInAsync(user_, login.Password, login.Remember, false);

                    if (!result.Succeeded)
                    {
                        return Unauthorized(new { message = "Check your login credentials and try again" });
                    }

                    // Set LastLogin
                    user_.LastLogin = DateTime.Now;

                    // Default status to Active (except Do Not Disturb)
                    if (user_.Status != "Do Not Disturb")
                    {
                        user_.Status = "Active";
                    }

                    await userManager.UpdateAsync(user_);

                    // Generate JWT token
                    var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user_.UserName),
                new Claim(ClaimTypes.Role, user_.Role == "Superadmin" ? "Superadmin" : user_.Role == "Admin" ? "Admin" : "User")
            };
                    var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("Jwt:Key").Value));
                    var signInCred = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);
                    var securityToken = new JwtSecurityToken(
                        claims: claims,
                        expires: DateTime.Now.AddMinutes(60),
                        issuer: _config.GetSection("Jwt:Issuer").Value,
                        audience: _config.GetSection("Jwt:Audience").Value,
                        signingCredentials: signInCred
                    );
                    var tokenString = new JwtSecurityTokenHandler().WriteToken(securityToken);

                    // Set cookie
                    HttpContext.Response.Cookies.Append("token", tokenString, new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = false,
                        SameSite = SameSiteMode.Lax,
                        Expires = DateTime.Now.AddMinutes(60)
                    });

                    return Ok(new { updateResult = user_, tokenString });
                }
                else
                {
                    return BadRequest(new { message = "Please check your credentials and try again." });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Something went wrong, please try again. " + ex.Message });
            }
        }

        [HttpGet("logout")]
        public async Task<ActionResult> LogoutUser()
        {
            try
            {
                var token = Request.Cookies["token"];
                if (!string.IsNullOrEmpty(token))
                {
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));

                    try
                    {
                        var claimsPrincipal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                        {
                            ValidateIssuer = true,
                            ValidateAudience = true,
                            ValidIssuer = _config["Jwt:Issuer"],
                            ValidAudience = _config["Jwt:Audience"],
                            IssuerSigningKey = securityKey
                        }, out var validatedToken);

                        var userName = claimsPrincipal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

                        if (!string.IsNullOrEmpty(userName))
                        {
                            var user = await userManager.FindByNameAsync(userName);
                            if (user != null && user.Status != "Do Not Disturb")
                            {
                                user.Status = "Offline";
                                await userManager.UpdateAsync(user);
                            }
                        }
                    }
                    catch
                    {
                        // Invalid token, ignore
                    }
                }

                // Sign out and delete token
                await signInManager.SignOutAsync();
                Response.Cookies.Delete("token");

                return Ok(new { message = "You have logged out successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Something went wrong, please try again. " + ex.Message });
            }
        }




        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            try
            {
                // Retrieve all users from the database
                var users = await userManager.Users.Select(u => new { userName = u.UserName, email = u.Email }).ToListAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Something went wrong while fetching users. " + ex.Message });
            }
        }

        [HttpGet("user-role")]
        public ActionResult GetUserRole()
        {
            var token = Request.Cookies["token"];
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized();
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));

            try
            {
                var claimsPrincipal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = _config["Jwt:Issuer"],
                    ValidAudience = _config["Jwt:Audience"],
                    IssuerSigningKey = securityKey
                }, out var validatedToken);

                var roleClaim = claimsPrincipal.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Role);

                if (roleClaim == null)
                {
                    return Unauthorized();
                }

                return Ok(new { role = roleClaim.Value });
            }
            catch (Exception)
            {
                return Unauthorized();
            }
        }

        [HttpPost("toggle_favorite")]
        public async Task<IActionResult> ToggleFavorite(FavoriteRequest request)
        {
            var user = await userManager.Users.Include(u => u.Favorites).FirstOrDefaultAsync(u => u.Id == request.UserId);

            if (user == null)
                return NotFound("User not found");

            var existingFavorite = user.Favorites.FirstOrDefault(f => f.MovieId == request.MovieId);
            if (existingFavorite != null)
            {
                user.Favorites.Remove(existingFavorite);
            }
            else
            {
                user.Favorites.Add(new UserFavorite { MovieId = request.MovieId, UserId = request.UserId });
            }

            await _context.SaveChangesAsync();
            return Ok(user.Favorites);
        }

        [HttpGet("favorites/{userId}")]
        public async Task<IActionResult> GetFavorites(string userId)
        {
            var user = await userManager.Users.Include(u => u.Favorites).FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound();

            return Ok(user.Favorites);
        }

        [HttpGet("get_all_favorites/{userId}")]
        public async Task<IActionResult> GetFavoriteMovies(string userId)
        {
            var user = await userManager.Users
                .Include(u => u.Favorites)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound("User not found");

            var movieIds = user.Favorites.Select(f => f.MovieId).ToList();

            var filter = Builders<Movie>.Filter.In(m => m.Id, movieIds);
            
            
            var favoriteMovies = await _movies.Find(filter).ToListAsync();
            
            foreach (var movie in favoriteMovies)
            {
                movie.Poster = String.Format("http://localhost:5064/Images/{0}", movie.ImageName);
                movie.Video = String.Format("http://localhost:5064/Videos/{0}", movie.VideoName);
            }

            return Ok(favoriteMovies);
        }
    }

        public class FavoriteRequest
        {
            public string UserId { get; set; }
            public string MovieId { get; set; }
        }
}
