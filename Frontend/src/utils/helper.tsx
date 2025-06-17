import type { Book, BookContextType, BookPost } from "../lib/type";

export const BookToBookPostMapper = (
  book: Book | BookContextType
): BookPost => {
  const { id, createdAt, updatedAt, status, ...bookPost } = book;
  return bookPost as BookPost;
};

export const BookToBookPostMapperArray = (
  books: Book[] | BookContextType[]
): BookPost[] => {
  return books.map((book) => BookToBookPostMapper(book));
};

export const BookToBookMassEditBookMapperArray = (
  books: Book[] | BookContextType[]
) => {
  return books.map((book) => {
    const { createdAt, updatedAt, status, ...bookPost } = book;
    return bookPost as BookPost;
  });
};
