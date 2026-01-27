using backend_mobile.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace backend_mobile.Controllers
{
    [Route("api/profile")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _config;

        public ProfileController(UserManager<User> userManager, IConfiguration config)
        {
            _userManager = userManager;
            _config = config;
        }

        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var user = await GetUserFromToken();
            if (user == null)
                return Unauthorized();

            return Ok(new { email = user.Email });
        }

       
        [HttpPut]
           public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest model)
        {
            var user = await GetUserFromToken();
            if (user == null)
                return Unauthorized();

            if (!string.IsNullOrEmpty(model.Email))
                user.Email = model.Email;

            if (!string.IsNullOrEmpty(model.Status))
                user.Status = model.Status;

            IdentityResult result = IdentityResult.Success;

            if (!string.IsNullOrEmpty(model.NewPassword))
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                result = await _userManager.ResetPasswordAsync(user, token, model.NewPassword);

                if (!result.Succeeded)
                    return BadRequest(result.Errors);
            }

            await _userManager.UpdateAsync(user);

            return Ok(new { user , message = "Profile updated successfully." });
        }


        private async Task<User?> GetUserFromToken()
        {
            var authHeader = Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                return null;

            var token = authHeader.Substring("Bearer ".Length).Trim();

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);

            try
            {
                var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = _config["Jwt:Issuer"],
                    ValidAudience = _config["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                }, out SecurityToken validatedToken);

                var username = principal.FindFirst(ClaimTypes.Email)?.Value;
                if (string.IsNullOrEmpty(username))
                    return null;

                return await _userManager.FindByNameAsync(username);
            }
            catch
            {
                return null;
            }
        }
    }

    public class UpdateProfileRequest
    {
      
            public string Email { get; set; }
            public string NewPassword { get; set; }
            public string Status { get; set; }
        }
    }

