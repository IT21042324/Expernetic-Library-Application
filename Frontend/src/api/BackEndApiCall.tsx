import axios from "axios";
import type { Book, BookPost, BookPostMassEdit } from "../lib/type";

export const FetchAllBooksAsync = async (): Promise<Book[]> => {
  try {
    const { data } = await axios.get<Book[]>(
      "https://localhost:7137/api/books"
    );
    return data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

export const AddBookAsync = async (bookDto: BookPost): Promise<Book> => {
  try {
    console.log("bookDto", bookDto);
    const { data } = await axios.post(
      "https://localhost:7137/api/books",
      bookDto
    );

    console.log("Added book:", data);
    return data;
  } catch (error) {
    console.error("Error adding book:", error);
    throw error;
  }
};

export const UpdateBookAsync = async (
  id: number,
  bookDto: BookPost
): Promise<Book> => {
  try {
    const { data } = await axios.patch(
      `https://localhost:7137/api/books/${id}`,
      bookDto
    );
    return data;
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
};

export const MassEditBookAsync = async (
  booksToMassEdit: BookPostMassEdit[]
) => {
  try {
    const { data } = await axios.patch(
      "https://localhost:7137/api/books/mass-edit",
      booksToMassEdit
    );
    return data;
  } catch (error) {
    console.error("Error mass editing books:", error);
    throw error;
  }
};

export const DeleteBookAsync = async (id: number): Promise<void> => {
  try {
    const { data } = await axios.delete(
      `https://localhost:7137/api/books/${id}`
    );
    return data;
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
};
