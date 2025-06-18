using LibraryApp.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.WebUtilities;

namespace LibraryApp.ExceptionFilter;

public sealed class GlobalExceptionFilter(ILogger<GlobalExceptionFilter> log)
    : IAsyncExceptionFilter
{
    public async Task OnExceptionAsync(ExceptionContext ctx)
    {
        var status = ctx.Exception switch
        {
            NotFoundException => StatusCodes.Status404NotFound,
            BadRequestException => StatusCodes.Status400BadRequest,
            InvalidCredentialsException => StatusCodes.Status401Unauthorized,
            UserAlreadyExistsException => StatusCodes.Status409Conflict,
            _ => StatusCodes.Status500InternalServerError
        };

        log.LogWarning(ctx.Exception, "Handled application exception");

        var detail = status == StatusCodes.Status500InternalServerError
            ? "An unexpected error occurred."          
            : ctx.Exception.Message;                   

        var problem = new ProblemDetails
        {
            Status = status,
            Title = ReasonPhrases.GetReasonPhrase(status),
            Detail = detail
        };

        ctx.Result = new ObjectResult(problem) { StatusCode = status };
        ctx.ExceptionHandled = true;
        await Task.CompletedTask;      
    }
}