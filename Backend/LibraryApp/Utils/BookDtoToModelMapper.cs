using LibraryApp.Dto;
using LibraryApp.Model;

namespace LibraryApp.Utils
{
    public static class BookDtoToModelMapper
    {
        public static (Book book, bool updateStatus) MapBookDtoToBook(Book book, BookDto bookDto)
        {
            return PatchMappingHelper<Book>.PatchMappingFields(book, new Book(bookDto));
        }

        public static (Book book, bool updateStatus) MapBookDtoToBook(Book book, BookDtoForUpdate bookDto)
        {
            return PatchMappingHelper<Book>.PatchMappingFields(book, new Book(bookDto));
        }

        public static IEnumerable<Book> MapBookDtoToBook(IEnumerable<Book> bookList, IEnumerable<BookDtoForMassEdit> bookDtoList)
        {
            var validPatchBookList = bookDtoList.Where(book => bookList.Any(b => b.Id == book.Id)).ToList();

            if (!validPatchBookList.Any())
                return Enumerable.Empty<Book>().ToList();

            var patchedBookList = new List<Book>();

            foreach (var book in bookList)
            {
                var bookDto = validPatchBookList.FirstOrDefault(b => b.Id == book.Id);
                if (bookDto != null)
                {
                    var original = new Book
                    {
                        Id = book.Id,
                        Title = book.Title,
                        Author = book.Author,
                        Description = book.Description
                    };

                    var patched = PatchMappingHelper<Book>.PatchMappingFields(book, new Book(bookDto));

                    // Check if anything changed before adding
                    if (!BooksAreEqual(original, patched.updated))
                    {
                        patched.updated.UpdatedAt = DateTime.UtcNow;
                        patchedBookList.Add(patched.updated);
                    }
                }
            }

            return patchedBookList;
        }
        private static bool BooksAreEqual(Book a, Book b)
        {
            return a.Title == b.Title &&
                   a.Author == b.Author &&
                   a.Description == b.Description;
        }
    }
}
