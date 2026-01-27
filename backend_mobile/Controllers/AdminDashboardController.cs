using backend_mobile.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend_mobile.Controllers
{
    [Route("api/admin_dashboard")]
    [ApiController]
    [Authorize(Roles = "Admin,Superadmin")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public AdminDashboardController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        // GET: api/admin-dashboard/users
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllUsers()
        {
            try
            {
                var users = await _userManager.Users
                    .Select(u => new
                    {
                        id = u.Id,
                        username = u.UserName,
                        email = u.Email,
                        role = u.Role,
                        status = u.Status,
                        lastLogin = u.LastLogin
                    })
                    .ToListAsync();

                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error fetching users: " + ex.Message });
            }
        }

        // DELETE: api/admin-dashboard/users/{id}
        [HttpDelete("users/{id}")]
        public async Task<ActionResult> DeleteUser(string id)
        {
            try
            {
                // Get role of currently logged-in user
                var currentUserRole = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Role)?.Value;
                var targetUser = await _userManager.FindByIdAsync(id);

                if (targetUser == null)
                    return NotFound(new { message = "User not found" });

                // Prevent deleting Superadmin accounts
                if (targetUser.Role == "Superadmin")
                    return BadRequest(new { message = "Cannot delete a Superadmin account." });

                // Admins can only delete Users
                if (currentUserRole == "Admin" && targetUser.Role != "User")
                    return Forbid();

                // Superadmins can delete Admins and Users
                if (currentUserRole == "Superadmin" && (targetUser.Role == "Admin" || targetUser.Role == "User"))
                {
                    var result = await _userManager.DeleteAsync(targetUser);
                    if (!result.Succeeded)
                        return BadRequest(result.Errors);

                    return Ok(new { message = $"User {targetUser.UserName} deleted successfully." });
                }

                return Forbid();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error deleting user: " + ex.Message });
            }
        }
    }
}
