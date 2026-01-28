using backend_mobile.Data;
using backend_mobile.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.StaticFiles;

namespace backend_mobile
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowMobileApp",
                    policy =>
                    {
                        // You can put your mobile app URL or '*' for all (not recommended for production)
                        policy.WithOrigins("http://192.168.0.26:8081", "http://localhost:8081") // or your expo/metro URL
                              .AllowAnyHeader()
                              .AllowAnyMethod()
                              .AllowCredentials();
                    });
            });

            // Add services to the container.

            builder.Services.AddControllers();
            builder.Services.AddAuthorization();
            builder.Services.AddDbContext<ApplicationDbContext>(options => {
                options.UseSqlServer(builder.Configuration.GetConnectionString("SqlDb"));
            });

            // MongoDB settings configuration
            builder.Services.Configure<DatabaseSettings>(
                builder.Configuration.GetSection("MongoDbSettings"));

            // Register MongoDB client as a singleton
            builder.Services.AddSingleton<IMongoClient>(s =>
                new MongoClient(builder.Configuration.GetConnectionString("MongoDb")));

            builder.Services.AddIdentityApiEndpoints<User>().AddEntityFrameworkStores<ApplicationDbContext>();

            builder.Services.AddIdentityCore<User>(options => {
                options.SignIn.RequireConfirmedAccount = true;
                options.Password.RequiredLength = 6;
                options.Password.RequiredUniqueChars = 0;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;

                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.AllowedForNewUsers = true;


                // User settings
                options.User.RequireUniqueEmail = true;

            }).AddEntityFrameworkStores<ApplicationDbContext>();


            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateActor = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    RequireExpirationTime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration.GetSection("Jwt:Issuer").Value,
                    ValidAudience = builder.Configuration.GetSection("Jwt:Audience").Value,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("Jwt:Key").Value))
                };
            });
            var app = builder.Build();

            // Configure the HTTP request pipeline.

            app.UseStaticFiles(); // This allows serving wwwroot and other static files

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(builder.Environment.ContentRootPath, "Images")),
                RequestPath = "/Images"
            });

            var provider = new FileExtensionContentTypeProvider();
            provider.Mappings[".mp4"] = "video/mp4";
            provider.Mappings[".mov"] = "video/quicktime";

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(builder.Environment.ContentRootPath, "Videos")),
                RequestPath = "/Videos",
                ContentTypeProvider = provider
            });

            app.UseRouting();

            app.UseCors("AllowMobileApp");
            
            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();
            app.MapIdentityApi<User>();

            app.MapControllers();

            app.Run();
        }
    }
}
