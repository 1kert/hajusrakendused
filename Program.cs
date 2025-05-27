using System.Text;
using hajusrakendused.Models;
using hajusrakendused.Models.Http;
using hajusrakendused.Models.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

string? jwtKey = builder.Configuration["JwtKey"];
string? connectionString = builder.Configuration["ConnectionStrings:Default"];
if(jwtKey == null)
{
    Console.WriteLine("no jwt key found");
    return;
}
if(connectionString == null)
{
    Console.WriteLine("connection string not found");
    return;
}

builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 8;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
})
.AddEntityFrameworkStores<DatabaseContext>()
.AddDefaultTokenProviders()
.AddRoles<IdentityRole>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => 
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "dunno",
            ValidAudience = "dunno",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration["JwtKey"]!))
        };
    });

builder.Services.AddScoped<MarkerRepository>();
builder.Services.AddScoped<WeatherRepository>();
builder.Services.AddScoped<BlogRepository>();
builder.Services.AddScoped<StoreRepository>();
builder.Services.AddScoped<FavoriteGameRepository>();
builder.Services.AddDbContext<DatabaseContext>(options => options
    .UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddCors();

builder.Services.AddScoped<FavouriteGameCreateValidator>();
builder.Services.AddScoped<FavouriteGameUpdateValidator>();

// builder.Services.AddHttpLogging();

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    await SeedRolesAsync(services);
}
app.UseCors(options =>
    options.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());


// app.UseHttpLogging();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

// app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapStaticAssets();

app.UseStaticFiles();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

app.MapFallbackToFile("index.html");

app.Run();
return;

static async Task SeedRolesAsync(IServiceProvider serviceProvider)
{
    var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    foreach (var roleName in Enum.GetNames<UserRole>())
    {
        if (!await roleManager.RoleExistsAsync(roleName))
        {
            await roleManager.CreateAsync(new IdentityRole(roleName));
        }
    }
}
