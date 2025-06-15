using LibraryApp.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using LibraryApp.Model;
using LibraryApp.Service;
using LibraryApp.Dto.Responses;

namespace LibraryApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController(BookService service) : ControllerBase
    {
        private readonly BookService _service = service;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetAllBooks()
        {
            return Ok(await _service.GetAllBooks());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBookById([FromRoute] int id)
        {
            return Ok(await _service.GetBookById(id));
        }

        [HttpPost]
        public async Task<ActionResult<Book>> SaveNewBook([FromBody] BookDto bookToSave)
        {
            var savedBook = await _service.SaveNewBook(bookToSave);
            return CreatedAtAction(nameof(GetBookById), new { id = savedBook.Id }, savedBook);
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult<Book>> UpdateBookById([FromRoute] int id, [FromBody] BookDtoForUpdate bookDto)
        {
            var (updatedBook, isUpdated) = await _service.UpdateBookById(id, bookDto);

            if(isUpdated)
                return Ok(updatedBook);

            return NoContent();
        }

        [HttpPatch("mass-edit")]
        public async Task<ActionResult<IEnumerable<Book>>> MassEditBooks([FromBody] List<BookDtoForMassEdit> booksToUpdate)
        {
            var updatedBooks = await _service.MassEditBooks(booksToUpdate);
            if(!updatedBooks.Any())
                return NoContent();

            return Ok(updatedBooks);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<DeleteBookResponse>> DeleteBookById([FromRoute] int id)
        {
            var deletedBook = await _service.DeleteBookById(id);
            return Ok(deletedBook);
        }
    }
}
