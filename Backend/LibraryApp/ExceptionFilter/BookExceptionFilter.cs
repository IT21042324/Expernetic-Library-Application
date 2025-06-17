using LibraryApp.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace LibraryApp.ExceptionFilter
{
    // Global exception filter to translate exceptions into standardized HTTP responses
    public class BookExceptionFilter : IExceptionFilter
    {
        // Called by ASP.NET Core when an exception bubbles up to the MVC pipeline
        public void OnException(ExceptionContext context)
        {
            var exception = context.Exception;

            // Create a JSON response with the exception message and appropriate status code
            var response = new ObjectResult(new { Message = exception.Message })
            {
                StatusCode = GetStatusCode(exception)
            };

            // Short-circuit the pipeline with our custom response
            context.Result = response;
            context.ExceptionHandled = true; // mark exception as handled
        }

        // Maps specific exception types to HTTP status codes
        private int GetStatusCode(Exception exception)
        {
            return exception switch
            {
                NotFoundException => StatusCodes.Status404NotFound,      // Resource not found
                BadRequestException => StatusCodes.Status400BadRequest,   // Invalid input / request
                _ => StatusCodes.Status500InternalServerError            // Unhandled exceptions
            };
        }
    }
}