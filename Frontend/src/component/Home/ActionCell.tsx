import { VscEdit, VscRemove, VscSave } from "react-icons/vsc";
import { IconButton, Table } from "rsuite";
import type { ActionCellProps, BookPost, Book } from "../../lib/type";
import {
  AddBookAsync,
  DeleteBookAsync,
  UpdateBookAsync,
} from "../../api/BackEndApiCall";
import { UseBookContext } from "../../context/useBookContext";
import {
  BookAddedAlertProps,
  BookDeletedAlertProps,
  BookNotFoundAlertProps,
  BookUpdatedAlertProps,
  ErrorSavingBookAlertProps,
} from "../Strings/strings";

export const ActionCell = ({
  rowData,
  dataKey,
  onEdit,
  onRemove,
  style,
  bookDataFromLocalState,
  setBookDataFromLocalState,
  setAlertProps,
  ...props
}: ActionCellProps) => {
  const { Cell } = Table;
  const { books, dispatch } = UseBookContext();

  const onSave = async (bookId: number) => {
    const bookWithChanges = books.find((book) => book.id === bookId);

    const { id, createdAt, updatedAt, ...bookToPost } = bookWithChanges as Book;

    let data: Book;

    try {
      if (rowData && rowData?.id >= 0) {
        data = await UpdateBookAsync(id, bookToPost as BookPost);
        if (data) setAlertProps(BookUpdatedAlertProps);
      } else {
        data = await AddBookAsync(bookToPost as BookPost);
        if (data) setAlertProps(BookAddedAlertProps);
      }

      data !== undefined &&
        bookWithChanges !== undefined &&
        dispatch({
          type: "EditBook",
          payload: {
            ...data,
            status: null,
          },
        });

      setBookDataFromLocalState(books as Book[]);
    } catch (err) {
      console.error("Error saving book:", err);
      setAlertProps(ErrorSavingBookAlertProps);
    }
  };

  const onDelete = async (id: number) => {
    try {
      const data = await DeleteBookAsync(id);

      if (data !== undefined) {
        dispatch({
          type: "DeleteBook",
          payload: { id },
        });
        setBookDataFromLocalState(books as Book[]);
        onRemove(id);
        setAlertProps(BookDeletedAlertProps);
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      setAlertProps(BookNotFoundAlertProps);
    }
  };

  return (
    <Cell
      {...props}
      style={{ padding: "6px", display: "flex", gap: "4px", ...style }}
    >
      {rowData?.id != null && (
        <>
          <IconButton
            appearance="subtle"
            icon={rowData.status === "EDIT" ? <VscSave /> : <VscEdit />}
            onClick={() => {
              if (rowData.status === "EDIT") {
                onSave(rowData.id);
                onEdit(rowData.id);
              } else {
                onEdit(rowData.id);
              }
            }}
          />
          <IconButton
            appearance="subtle"
            icon={<VscRemove />}
            onClick={() => onDelete(rowData.id)}
          />
        </>
      )}
    </Cell>
  );
};
