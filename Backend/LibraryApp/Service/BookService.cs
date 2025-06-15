using LibraryApp.Model;
using LibraryApp.Data;
using LibraryApp.Dto;
using LibraryApp.Exceptions;
using Microsoft.EntityFrameworkCore;
using LibraryApp.Utils;
using LibraryApp.Dto.Responses;

namespace LibraryApp.Service
{
    public class BookService(LibraryDbContext context)
    {
        private readonly LibraryDbContext _context = context;

        public async Task<IEnumerable<Book>> GetAllBooks()
        {
            return await _context.Books.ToListAsync();
        }

        public async Task<Book?> GetBookById(int id)
        {
            var bookToReturn = await _context.Books.FindAsync(id);
            if (bookToReturn is null)
                throw new NotFoundException($"Book with id {id} not found.");

            return bookToReturn;
        }

        public async Task<Book> SaveNewBook(BookDto bookToSave)
        {
            var bookModelInstance = new Book(bookToSave);

            _context.Add(bookModelInstance);
            await _context.SaveChangesAsync();

            return bookModelInstance;
        }

        public async Task<(Book, Boolean)> UpdateBookById(int id, BookDtoForUpdate bookDto)
        {
            var existingBook = await GetBookById(id);

            if (existingBook is null)
                throw new NotFoundException($"Book with id {id} not found.");

            var (updatedBook, status) = BookDtoToModelMapper.MapBookDtoToBook(existingBook, bookDto);

            if(status)
            {
                existingBook.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }

            return (existingBook, status);
        }

        public async Task<IEnumerable<Book>> MassEditBooks(List<BookDtoForMassEdit> booksToUpdate)
        {
            if(booksToUpdate == null || !booksToUpdate.Any())
                throw new BadRequestException("No books provided for mass update.");

            var bookList = await _context.Books.ToListAsync();
            var bookListThatOnlyExistFromInput = bookList.Where(book => booksToUpdate.Any(b => b.Id == book.Id)).ToList();

            var changedBooksToUpdate = BookDtoToModelMapper.MapBookDtoToBook(bookListThatOnlyExistFromInput, booksToUpdate).ToList();

            if (!changedBooksToUpdate.Any())
                return Enumerable.Empty<Book>().ToList();

            _context.Books.UpdateRange(changedBooksToUpdate);
            await _context.SaveChangesAsync();

            return changedBooksToUpdate;
        }

        public async Task<Object> DeleteBookById(int id)
        {
            var bookToDelete = await GetBookById(id);

            if (bookToDelete is null)
                throw new NotFoundException($"Book with id {id} not found.");

            _context.Books.Remove(bookToDelete);
            await _context.SaveChangesAsync();
            return new DeleteBookResponse(bookToDelete);
        }
    }
}
