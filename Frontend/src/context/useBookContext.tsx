// src/context/useBookContext.ts

import { useContext } from "react";
import { BookContext } from "./BookContext"; // Import the actual context

export const UseBookContext = () => {
  const bookContext = useContext(BookContext);

  if (!bookContext) {
    throw new Error("UseBookContext must be used within a BookContextProvider");
  }

  return {
    dispatch: bookContext.dispatch,
    books: bookContext.books,
  };
};
