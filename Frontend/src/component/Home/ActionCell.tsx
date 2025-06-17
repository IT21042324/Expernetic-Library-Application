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
  const { dispatch } = UseBookContext();

  // Handles saving or updating a book
  const onSave = async (tempId: number) => {
    // read from local table state
    const book = bookDataFromLocalState.find((b) => b.id === tempId)!;

    // ── VALIDATION ─────────────────────────────────────────────────────
    const missing: string[] = [];
    if (!book.title?.trim()) missing.push("Title");
    if (!book.author?.trim()) missing.push("Author");
    if (!book.description?.trim()) missing.push("Description");

    if (missing.length) {
      setAlertProps({
        severity: "error",
        color: "error",
        isVisible: true,
        message: `${missing.join(" & ")} ${
          missing.length > 1 ? "are" : "is"
        } required.`,
      });
      return; // abort save
    }
    // ────────────────────────────────────────────────────────────────────

    // strip out internal fields
    const { id: _, status, createdAt, updatedAt, ...payload } = book as Book;

    try {
      let saved: Book;
      if (tempId < 0) {
        // New book
        saved = await AddBookAsync(payload as BookPost);
        dispatch({ type: "AddBook", payload: saved });
        setAlertProps({ ...BookAddedAlertProps });
      } else {
        // Existing book
        saved = await UpdateBookAsync(tempId, payload as BookPost);
        dispatch({ type: "EditBook", payload: { ...saved, status: null } });
        setAlertProps({ ...BookUpdatedAlertProps });
      }

      // reflect saved result back into table and clear edit mode
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

  // Handles deletion of a book record
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
          {/* Save or Edit */}
          <IconButton
            appearance="subtle"
            icon={rowData.status === "EDIT" ? <VscSave /> : <VscEdit />}
            disabled={
              rowData.status === "EDIT" &&
              (!rowData.title?.trim() ||
                !rowData.author?.trim() ||
                !rowData.description?.trim())
            }
            onClick={async () => {
              if (rowData.status === "EDIT") {
                await onSave(rowData.id);
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
