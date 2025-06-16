import { useContext, useEffect } from "react";
import { FetchAllBooksAsync } from "../api/BackEndApiCall";
import type { BookContextType } from "../lib/type";
import { BookContext } from "./BookContext";

export const UseBookContext = () => {
  const bookContext = useContext(BookContext);
  if (!bookContext) {
    throw new Error("UseItemContext must be used within a BookContextProvider");
  }

  const { dispatch, books } = bookContext;

  useEffect(() => {
    (async () => {
      try {
        const data = await FetchAllBooksAsync();
        // Ensure fetched data aligns with Book type, especially for dates

        if (data?.length > 0) {
          const processedData: BookContextType[] = data.map((book: any) => ({
            ...book,
            // Convert date strings to Date objects for consistent handling
            createdAt: book.createdAt ? new Date(book.createdAt) : new Date(),
            updatedAt: book.updatedAt ? new Date(book.updatedAt) : new Date(),
            status: book.status || null, // Initialize status if it's not always present
          }));
          console.log(processedData);

          dispatch({
            type: "LoadBooks",
            payload: processedData,
          });
        } else {
          console.error("Items not found in the response", data);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return {
    bookContext,
    dispatch,
    books,
  };
};
