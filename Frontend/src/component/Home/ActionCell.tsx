// src/components/BookTable/ActionCell.tsx
import React from "react";
import { IconButton, Table } from "rsuite";
import { VscEdit, VscRemove, VscSave } from "react-icons/vsc";
import type { ActionCellProps, Book, BookPost } from "../../lib/type";
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

export const ActionCell: React.FC<ActionCellProps> = ({
  rowData,
  onEdit,
  onRemove,
  bookDataFromLocalState,
  setBookDataFromLocalState,
  setAlertProps,
  ...props
}) => {
  const { Cell } = Table;
  const { books, dispatch } = UseBookContext();

  const onSave = async (tempId: number) => {
    const book = books.find((b) => b.id === tempId)!;
    const { id: _, status, createdAt, updatedAt, ...payload } = book as Book;

    try {
      let saved: Book;
      if (tempId < 0) {
        saved = await AddBookAsync(payload as BookPost);
        dispatch({ type: "AddBook", payload: saved });
        setAlertProps({ ...BookAddedAlertProps });
      } else {
        saved = await UpdateBookAsync(tempId, payload as BookPost);
        dispatch({ type: "EditBook", payload: { ...saved, status: null } });
        setAlertProps({ ...BookUpdatedAlertProps });
      }

      setBookDataFromLocalState((prev) =>
        prev.map((r) => (r.id === tempId ? { ...saved, status: null } : r))
      );
    } catch {
      setAlertProps(
        tempId < 0
          ? { ...ErrorSavingBookAlertProps }
          : { ...BookNotFoundAlertProps }
      );
    }
  };

  const onDelete = async (id: number) => {
    if (id < 0) {
      dispatch({ type: "DeleteBook", payload: { id } });
      setBookDataFromLocalState((p) => p.filter((r) => r.id !== id));
      onRemove(id);
      setAlertProps({ ...BookDeletedAlertProps });
      return;
    }
    try {
      await DeleteBookAsync(id);
      dispatch({ type: "DeleteBook", payload: { id } });
      setBookDataFromLocalState((p) => p.filter((r) => r.id !== id));
      onRemove(id);
      setAlertProps({ ...BookDeletedAlertProps });
    } catch {
      setAlertProps({ ...BookNotFoundAlertProps });
    }
  };

  return (
    <Cell {...props} style={{ padding: 6, display: "flex", gap: 4 }}>
      {rowData?.id != null && (
        <>
          <IconButton
            appearance="subtle"
            icon={rowData.status === "EDIT" ? <VscSave /> : <VscEdit />}
            onClick={async () => {
              if (rowData.status === "EDIT") {
                await onSave(rowData.id);
                // no onEdit after save
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
