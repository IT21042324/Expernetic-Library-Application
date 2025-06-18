using LibraryApp.Dto;
using Microsoft.AspNetCore.Mvc;
using LibraryApp.Model;
using LibraryApp.Service;
using LibraryApp.Dto.Responses;
using Microsoft.AspNetCore.Authorization;

namespace LibraryApp.Controllers
{
    // API controller for managing book resources
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class BooksController(BookService bookService) : ControllerBase
    {
        private readonly BookService _service = bookService;

        // GET api/books
        // Returns all books in the library
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetAllBooks()
        {
            var books = await _service.GetAllBooks();
            return Ok(books); // 200 OK with the list of books
        }

        // GET api/books/{id}
        // Retrieves a single book by its ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBookById([FromRoute] int id)
        {
            var book = await _service.GetBookById(id);
            return Ok(book); // 200 OK with the requested book
        }

        // POST api/books
        // Creates a new book record
        [HttpPost]
        public async Task<ActionResult<Book>> SaveNewBook([FromBody] BookDto bookToSave)
        {
            var savedBook = await _service.SaveNewBook(bookToSave);
            // Return 201 Created and include location header for the new resource
            return CreatedAtAction(nameof(GetBookById), new { id = savedBook.Id }, savedBook);
        }

        // PATCH api/books/{id}
        // Updates an existing book; returns 200 if updated, 204 if no changes
        [HttpPatch("{id}")]
        public async Task<ActionResult<Book>> UpdateBookById([FromRoute] int id, [FromBody] BookDtoForUpdate bookDto)
        {
            var (updatedBook, isUpdated) = await _service.UpdateBookById(id, bookDto);

            if (isUpdated)
                return Ok(updatedBook); // 200 OK with the updated book

            return NoContent(); // 204 No Content when update had no effect
        }

        // PATCH api/books/mass-edit
        // Applies bulk updates to multiple books
        [HttpPatch("mass-edit")]
        public async Task<ActionResult<IEnumerable<Book>>> MassEditBooks([FromBody] List<BookDtoForMassEdit> booksToUpdate)
        {
            var updatedBooks = await _service.MassEditBooks(booksToUpdate);
            if (!updatedBooks.Any())
                return NoContent(); // 204 No Content if nothing was updated

            return Ok(updatedBooks); // 200 OK with the list of updated books
        }

        // DELETE api/books/{id}
        // Deletes a book by its ID and returns details in response
        [HttpDelete("{id}")]
        public async Task<ActionResult<DeleteBookResponse>> DeleteBookById([FromRoute] int id)
        {
            var deletedBook = await _service.DeleteBookById(id);
            return Ok(deletedBook); // 200 OK with deletion confirmation
        }
    }
}
