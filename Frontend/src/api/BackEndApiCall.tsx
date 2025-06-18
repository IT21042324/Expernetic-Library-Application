import type { Book, BookPost, BookPostMassEdit } from "../lib/type";
import axiosInstance from "../utils/axiosInstance";

export const LoginAuthAsync = async (user: {
  username: string;
  password: string;
}) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", user);
    return data;
  } catch (err) {
    console.error("Error during login authentication:", err);
    throw err;
  }
};

export const RegisterUserAuthAsync = async (user: {
  username: string;
  password: string;
}) => {
  try {
    const { data } = await axiosInstance.post("/auth/register", user);
    return data;
  } catch (err) {
    console.error("Error during signup authentication:", err);
    throw err;
  }
};

export const FetchAllBooksAsync = async (): Promise<Book[]> => {
  try {
    const { data } = await axiosInstance.get<Book[]>("/books");
    return data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

export const AddBookAsync = async (bookDto: BookPost): Promise<Book> => {
  try {
    const { data } = await axiosInstance.post("/books", bookDto);
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
    const { data } = await axiosInstance.patch(`/books/${id}`, bookDto);
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
    const { data } = await axiosInstance.patch(
      "/books/mass-edit",
      booksToMassEdit
    );
    return [...data];
  } catch (error) {
    console.error("Error mass editing books:", error);
    throw error;
  }
};

export const DeleteBookAsync = async (id: number): Promise<void> => {
  try {
    const { data } = await axiosInstance.delete(`/books/${id}`);
    return data;
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
};
