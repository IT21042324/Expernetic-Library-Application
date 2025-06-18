// src/components/BookTable/ActionCell.tsx
import React, { useState } from "react";
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
import { useAlertContext } from "../../context/useAlertContext";
import { ConfirmModal } from "../Model/ConfirmationModel";

export const ActionCell: React.FC<ActionCellProps> = ({
  rowData,
  onEdit,
  onRemove,
  bookDataFromLocalState,
  setBookDataFromLocalState,
  ...props
}) => {
  const { Cell } = Table;
  const { dispatch } = UseBookContext();
  const { SetAndDisplayAlert } = useAlertContext();

  // State for delete confirmation
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const onSave = async (tempId: number) => {
    const book = bookDataFromLocalState.find((b) => b.id === tempId)!;

    // Required‐field validation
    const missing: string[] = [];
    if (!book.title?.trim()) missing.push("Title");
    if (!book.author?.trim()) missing.push("Author");
    if (!book.description?.trim()) missing.push("Description");
    if (missing.length) {
      SetAndDisplayAlert({
        severity: "error",
        color: "error",
        isVisible: true,
        message: `${missing.join(" & ")} ${
          missing.length > 1 ? "are" : "is"
        } required.`,
      });
      return;
    }

    // Only allow letters and spaces in author
    const author = book.author ?? "";
    if (/[^A-Za-z\s]/.test(author)) {
      SetAndDisplayAlert({
        severity: "error",
        color: "error",
        isVisible: true,
        message: "Author name may only contain letters and spaces.",
      });
      return;
    }

    // strip out non-payload properties
    const { id: _, status, createdAt, updatedAt, ...payload } = book as Book;

    try {
      let savedRaw: Book;

      if (tempId < 0) {
        // CREATE
        savedRaw = await AddBookAsync(payload as BookPost);
        SetAndDisplayAlert(BookAddedAlertProps);
      } else {
        // UPDATE
        savedRaw = await UpdateBookAsync(tempId, payload as BookPost);
        SetAndDisplayAlert(BookUpdatedAlertProps);
      }

      // Parse timestamps into Date instances
      const saved: Book = {
        ...savedRaw,
        createdAt: new Date(savedRaw.createdAt ?? Date.now()),
        updatedAt: new Date(savedRaw.updatedAt ?? Date.now()),
      };

      // Update context
      if (tempId < 0) {
        dispatch({ type: "AddBook", payload: saved });
      } else {
        dispatch({ type: "EditBook", payload: { ...saved, status: null } });
      }

      // Update local table state
      setBookDataFromLocalState((prev) =>
        prev.map((r) =>
          r.id === tempId
            ? ({
                ...saved,
                status: null,
                isDirty: false,
              } as Book)
            : r
        )
      );
    } catch {
      SetAndDisplayAlert(
        tempId < 0 ? ErrorSavingBookAlertProps : BookNotFoundAlertProps
      );
    }
  };

  const onDelete = async (id: number) => {
    if (id < 0) {
      // just client‐side
      dispatch({ type: "DeleteBook", payload: { id } });
      setBookDataFromLocalState((p) => p.filter((r) => r.id !== id));
      onRemove(id);
      SetAndDisplayAlert(BookDeletedAlertProps);
      return;
    }
    try {
      await DeleteBookAsync(id);
      dispatch({ type: "DeleteBook", payload: { id } });
      setBookDataFromLocalState((p) => p.filter((r) => r.id !== id));
      onRemove(id);
      SetAndDisplayAlert(BookDeletedAlertProps);
    } catch {
      SetAndDisplayAlert(BookNotFoundAlertProps);
    }
  };

  const confirmDeletion = (id: number) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (pendingDeleteId != null) onDelete(pendingDeleteId);
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };

  return (
    <>
      <ConfirmModal
        open={confirmOpen}
        message="Are you sure you want to delete this record?"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
      <Cell {...props} style={{ padding: 6, display: "flex", gap: 4 }}>
        {rowData?.id != null && (
          <>
            <IconButton
              appearance="subtle"
              icon={rowData.status === "EDIT" ? <VscSave /> : <VscEdit />}
              disabled={
                rowData.status === "EDIT" &&
                (!rowData.isDirty ||
                  !rowData.title?.trim() ||
                  !rowData.author?.trim() ||
                  !rowData.description?.trim())
              }
              onClick={async () => {
                if (rowData.status === "EDIT") await onSave(rowData.id);
                else onEdit!(rowData.id);
              }}
            />
            <IconButton
              appearance="subtle"
              icon={<VscRemove />}
              onClick={() => confirmDeletion(rowData.id)}
            />
          </>
        )}
      </Cell>
    </>
  );
};
