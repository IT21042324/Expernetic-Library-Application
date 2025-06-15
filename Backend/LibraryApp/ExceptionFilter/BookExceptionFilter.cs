using LibraryApp.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace LibraryApp.ExceptionFilter
{
    public class BookExceptionFilter() : IExceptionFilter
    {
        void IExceptionFilter.OnException(ExceptionContext context)
        {
            var exception = context.Exception;
            var response = new ObjectResult(new { Message = exception.Message })
            {
                StatusCode = GetStatusCode(exception)
            };

            context.Result = response;
            context.ExceptionHandled = true;
        }

        private int GetStatusCode(Exception exception)
        {
        return exception switch
            {
                NotFoundException => StatusCodes.Status404NotFound,
                BadRequestException => StatusCodes.Status400BadRequest,
                _ => StatusCodes.Status500InternalServerError
            };
        }
    }
}
