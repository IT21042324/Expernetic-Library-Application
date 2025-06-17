using LibraryApp.Data;
using LibraryApp.ExceptionFilter;
using LibraryApp.Service;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers(options =>
{
    options.Filters.Add<BookExceptionFilter>();
});
builder.Services.AddOpenApi();
builder.Services.AddScoped<BookService>();

// Register Scalar API reference
builder.Services.AddDbContext<LibraryDbContext>(options => options.
UseSqlite(builder.Configuration.GetConnectionString("DBConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.AllowAnyOrigin() // to make sure anyone can access the backend for now
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});

var app = builder.Build();
app.UseCors("AllowFrontend");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapScalarApiReference(); 
    app.MapOpenApi();            // Enables Swagger/OpenAPI in dev
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
