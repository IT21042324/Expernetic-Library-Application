import { createContext, useReducer } from "react";
import type {
  ActionState,
  BookContextProviderProps,
  BookContextType,
  BookState,
} from "../lib/type";

export const BookContext = createContext<
  | {
      books: BookContextType[];
      dispatch: React.Dispatch<ActionState>;
    }
  | undefined
>(undefined);

const BookContextProvider = (props: BookContextProviderProps) => {
  function reducer(state: BookState, action: ActionState) {
    switch (action.type) {
      case "AddBook":
        return {
          ...state,
          books: [...state.books, action.payload],
        };

      case "LoadBooks":
        return {
          ...state,
          books: action.payload,
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
              ? { ...book, ...action.payload }
              : book
          ),
        };

      default:
        return state;
    }
  }

  const [book, dispatch] = useReducer(reducer, {
    books: [],
  });

  return (
    <BookContext.Provider value={{ ...book, dispatch }}>
      {props.children}
    </BookContext.Provider>
  );
};

export default BookContextProvider;
