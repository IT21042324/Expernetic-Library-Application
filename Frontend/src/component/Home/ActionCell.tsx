import { VscEdit, VscRemove, VscSave } from "react-icons/vsc";
import { IconButton, Table } from "rsuite";
import type { ActionCellProps, BookPost, Book } from "../../lib/type";
import type React from "react";
import { AddBookAsync } from "../../api/BackEndApiCall";
import { UseBookContext } from "../../context/useBookContext";

export const ActionCell = ({
  rowData,
  dataKey,
  onEdit,
  onRemove,
  style,
  bookDataFromLocalState,
  setBookDataFromLocalState,
  ...props
}: ActionCellProps) => {
  const { Cell } = Table;

  const { books, dispatch } = UseBookContext();

  const onSave = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const bookWithChanges = books.find((book) => book.id === rowData?.id);

    const { id, createdAt, updatedAt, ...bookToPost } = bookWithChanges as Book;

    if (rowData?.status === "EDIT") {
      console.log(bookToPost);
      const data = await AddBookAsync(bookToPost as BookPost);

      if (data !== undefined && bookWithChanges !== undefined) {
        dispatch({
          type: "EditBook",
          payload: {
            ...bookWithChanges,
            ...data,
            status: null, // Reset status after saving
          },
        });

        setBookDataFromLocalState(books);
      }

      event.preventDefault();
    }
    return;
  };

  return (
    <Cell
      {...props}
      style={{ padding: "6px", display: "flex", gap: "4px", ...style }}
    >
      {rowData?.id && (
        <>
          <IconButton
            appearance="subtle"
            icon={rowData?.status === "EDIT" ? <VscSave /> : <VscEdit />}
            onClick={(e) => {
              onEdit(rowData?.id);
              console.log(rowData);
              onSave(e);
            }}
          />
          <IconButton
            appearance="subtle"
            icon={<VscRemove />}
            onClick={() => {
              onRemove(rowData?.id);
            }}
          />
        </>
      )}
    </Cell>
  );
};
