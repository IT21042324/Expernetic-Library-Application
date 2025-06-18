// src/context/BookContext.tsx

import { createContext, useReducer, useEffect } from "react"; // Import useEffect and ReactNode
import type {
  ActionState,
  BookContextProviderProps,
  BookState,
  Book,
  BookContextType,
} from "../lib/type";
import { FetchAllBooksAsync } from "../api/BackEndApiCall";
import { UseAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

interface BookContextValue {
  books: BookContextType[];
  dispatch: React.Dispatch<ActionState>;
}

export const BookContext = createContext<BookContextValue | undefined>(
  undefined
);

function reducer(state: BookState, action: ActionState): BookState {
  switch (action.type) {
    case "AddBook":
      return {
        ...state,
        books: [...state.books, action.payload as Book],
      };

    case "LoadBooks":
      return {
        ...state,
        books: action.payload as Book[],
      };

    case "DeleteBook":
      return {
        ...state,
        books: state.books.filter((data) => data.id !== action.payload.id),
      };

    case "EditBook":
      return {
        ...state,
        books: state.books.map((book) =>
          book.id === action.payload.id
            ? { ...book, ...action.payload, status: null } // Force clear "EDIT"
            : book
        ),
      };

    case "MassEditBooks":
      return {
        ...state,
        books: state.books.map((book) => {
          const updatedBook = action.payload?.find((buk) => buk.id === book.id);
          if (updatedBook)
            return {
              ...book,
              ...updatedBook,
            };
          else return book;
        }),
      };

    default:
      return state;
  }
}

const BookContextProvider = (props: BookContextProviderProps) => {
  const [bookState, dispatch] = useReducer(reducer, {
    books: [],
  });

  const { token, logout } = UseAuthContext();

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await FetchAllBooksAsync();

        if (data?.length > 0) {
          const processedData: Book[] = data.map((book: any) => ({
            ...book,
            createdAt: book.createdAt ? new Date(book.createdAt) : new Date(),
            updatedAt: book.updatedAt ? new Date(book.updatedAt) : new Date(),
            status: book.status || null,
          }));

          dispatch({
            type: "LoadBooks",
            payload: processedData as BookContextType[],
          });
        } else {
          console.warn("No books found or empty response from API.");
          dispatch({ type: "LoadBooks", payload: [] as BookContextType[] });
        }
      } catch (err) {
        console.error("Error fetching books in BookContextProvider:", err);

        const { status } = err as { status?: number };

        if (status === 401) {
          // token expired or invalid → logout the user
          logout();
        }
      }
    };

    if (token) loadBooks();
  }, [token]);

  return (
    <BookContext.Provider value={{ books: bookState.books, dispatch }}>
      {props.children}
    </BookContext.Provider>
  );
};

export default BookContextProvider;
