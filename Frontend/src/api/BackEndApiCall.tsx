import axios from "axios";
import type { Book, BookPost } from "../lib/type";

export const FetchAllBooksAsync = async (): Promise<Book[]> => {
  const { data } = await axios.get<Book[]>("https://localhost:7137/api/books");
  console.log("Here", data);
  return data;
};

export const AddBookAsync = async (book: BookPost): Promise<Book> => {
  console.log("data before saving book", book);
  const { data } = await axios.post("https://localhost:7137/api/books", book);
  return data;
};
