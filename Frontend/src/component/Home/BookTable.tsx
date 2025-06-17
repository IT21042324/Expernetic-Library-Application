// src/components/BookTable/BookTable.tsx

import React, { useEffect, useState } from "react";
import { Button, Checkbox, Table } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import type {
  AlertProps,
  Book,
  BookContextType,
  BookField,
  BookFieldType,
  BookPostMassEdit,
} from "../../lib/type";

import { MassEditBookAsync } from "../../api/BackEndApiCall";
import { ActionCell } from "./ActionCell";
import { EditableCell } from "./EditableCell";
import { ExpandCell } from "./ExpandCell";

import { UseBookContext } from "../../context/useBookContext";
import { BookToBookMassEditBookMapperArray } from "../../utils/helper";
import { AlertToast } from "../Alert/Alert";
import customStyles from "./BookTable.module.css";
import {
  BookMassEditAlertProps,
  BookMassEditErrorAlertProps,
  BooksFetchedAlertProps,
} from "../Strings/strings";

const { Column, HeaderCell, Cell } = Table;

// Inline styles applied for edit mode
const inlineStyles = `
.table-cell-editing .rs-table-cell-content {
  padding: 4px;
}
.table-cell-editing .rs-input {
  width: 100%;
}
.rs-table-row-expanded {
  height: 200px;
}
`;

export const BookTable: React.FC = () => {
  // --- Local state ---
  const [data, setData] = useState<Book[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [alertProps, setAlertProps] = useState<AlertProps>({
    severity: "success",
    message: "Book table loaded successfully!",
    color: "success",
    isVisible: false,
  });

  // Context provides master list and dispatch
  const { books, dispatch } = UseBookContext();

  // --- Initialize table data when context loads ---
  useEffect(() => {
    if (books.length > 0 && data.length === 0) {
      const initialData = books.map((book) => ({
        ...book,
        status: selectedRowKeys.includes(book.id) ? "EDIT" : null,
      }));
      setData(initialData as Book[]);
      setAlertProps({ ...BooksFetchedAlertProps });
    }
  }, [books]);

  // --- Handlers for edit and change events ---

  // Update local table state and context when a cell value changes
  const handleChange = (id: number, key: BookField, value: BookFieldType) => {
    // 1) Update local table state so blanks & edits stick
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    );

    // 2) (optional) keep context in sync
    const bookToUpdate = books.find((b) => b.id === id);
    if (bookToUpdate) {
      dispatch({
        type: "EditBook",
        payload: { ...(bookToUpdate as BookContextType), [key]: value },
      });
    }
  };

  // Toggle edit mode and selection for a single row
  const handleEdit = (id: number) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "EDIT" ? null : "EDIT" }
          : item
      )
    );
    setSelectedRowKeys((prev) =>
      prev.includes(id) ? prev.filter((k) => k !== id) : [...prev, id]
    );
  };

  // Remove a row locally (and clear selection)
  const handleRemove = (id: number) => {
    setData((prev) => prev.filter((i) => i.id !== id));
    setSelectedRowKeys((prev) => prev.filter((k) => k !== id));
  };

  // Toggle expanded detail row
  const handleExpanded = (row?: Book) => {
    if (!row) return;
    setExpandedRowKeys((prev) =>
      prev.includes(row.id)
        ? prev.filter((k) => k !== row.id)
        : [...prev, row.id]
    );
  };

  // Select or deselect all rows
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = data.map((i) => i.id);
      setSelectedRowKeys(allIds);
      setData((prev) => prev.map((i) => ({ ...i, status: "EDIT" })));
    } else {
      setSelectedRowKeys([]);
      setData((prev) => prev.map((i) => ({ ...i, status: null })));
    }
  };

  // Toggle selection for a single row
  const handleSelect = (row: Book) => {
    const id = row.id;
    if (selectedRowKeys.includes(id)) {
      setSelectedRowKeys((p) => p.filter((k) => k !== id));
      setData((p) => p.map((i) => (i.id === id ? { ...i, status: null } : i)));
    } else {
      setSelectedRowKeys((p) => [...p, id]);
      setData((p) =>
        p.map((i) => (i.id === id ? { ...i, status: "EDIT" } : i))
      );
    }
  };

  // --- Mass edit handler ---
  const handleMassEdit = async () => {
    // ── VALIDATION FOR MASS EDIT ──────────────────────────────────────────
    const invalid = data.filter(
      (row) =>
        selectedRowKeys.includes(row.id) &&
        (!row.title?.trim() || !row.author?.trim() || !row.description?.trim())
    );
    if (invalid.length) {
      setAlertProps({
        severity: "error",
        color: "error",
        isVisible: true,
        message: `Please fill Title, Author & Description for all selected records (Titled: ${invalid
          .map((r) => r.title)
          .join(", ")})`,
      });
      return;
    }
    // ────────────────────────────────────────────────────────────────────

    // Filter selected books, ensure all are saved
    const toEdit = books.filter((b) => selectedRowKeys.includes(b.id));
    const unsaved = toEdit.filter((b) => b.id < 0);
    if (unsaved.length) {
      setAlertProps({
        severity: "warning",
        message: "Please save new records before mass edit.",
        color: "warning",
        isVisible: true,
      });
      return;
    }

    // Clear selections & edit flags
    setSelectedRowKeys([]);
    setData((p) => p.map((i) => ({ ...i, status: null })));

    try {
      const result = await MassEditBookAsync(
        BookToBookMassEditBookMapperArray(
          toEdit as BookContextType[]
        ) as BookPostMassEdit[]
      );
      dispatch({ type: "MassEditBooks", payload: result as BookContextType[] });
      setAlertProps({ ...BookMassEditAlertProps });

      // Merge updated data back into table
      setData((prev) =>
        prev.map((row) => {
          const updated = (result as Book[]).find((r) => r.id === row.id);
          return updated ? { ...row, ...updated, status: null } : row;
        })
      );
    } catch {
      setAlertProps({ ...BookMassEditErrorAlertProps });
    }
  };

  // --- Render Expanded Content ---
  const renderRowExpanded = (row?: Book) =>
    row?.description ? (
      <div className={customStyles.expandedRowContent}>
        <p className={customStyles.detailField}>
          <strong>Description</strong>
        </p>
        <p className={customStyles.descriptionText}>{row.description}</p>
      </div>
    ) : (
      <p className={customStyles.noContent}>No details available.</p>
    );

  // Determine header checkbox states
  const isAllSelected =
    data.length > 0 && selectedRowKeys.length === data.length;
  const isIndeterminate =
    selectedRowKeys.length > 0 && selectedRowKeys.length < data.length;

  // --- JSX Output ---
  return (
    <div className={customStyles.container}>
      <style>{inlineStyles}</style>

      <div style={{ marginBottom: 12 }}>
        {/* Mass Edit Button */}
        <Button
          onClick={handleMassEdit}
          disabled={selectedRowKeys.length === 0}
          appearance="primary"
        >
          Apply Mass Edit ({selectedRowKeys.length})
        </Button>
        <Button
          onClick={() => {
            const newId = -Date.now();
            const rec: Book = {
              id: newId,
              title: "",
              author: "",
              description: "",
              createdAt: new Date(),
              updatedAt: new Date(),
              status: "EDIT",
            };
            dispatch({ type: "AddBook", payload: rec as BookContextType });
            setData((p) => [rec, ...p]);
          }}
          appearance="ghost"
          style={{ marginLeft: 10 }}
        >
          Add record
        </Button>
      </div>

      <Table
        height={550}
        data={data}
        rowKey="id"
        expandedRowKeys={expandedRowKeys}
        renderRowExpanded={renderRowExpanded}
      >
        {/* Selection column */}
        <Column width={50} align="center" fixed>
          <HeaderCell style={{ padding: 0 }}>
            <Checkbox
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              onChange={(_, chk) => handleSelectAll(chk)}
            />
          </HeaderCell>
          <Cell style={{ padding: 0 }}>
            {(row: Book) => (
              <Checkbox
                checked={selectedRowKeys.includes(row.id)}
                onChange={() => handleSelect(row)}
              />
            )}
          </Cell>
        </Column>

        {/* Expand/Collapse column */}
        <Column width={50} align="center">
          <HeaderCell>…</HeaderCell>
          <ExpandCell
            expandedRowKeys={expandedRowKeys}
            onChange={handleExpanded}
          />
        </Column>

        {/* Editable columns */}
        <Column flexGrow={1}>
          <HeaderCell>Title</HeaderCell>
          <EditableCell
            dataKey="title"
            dataType="string"
            onChange={handleChange}
            onEdit={handleEdit}
          />
        </Column>
        <Column flexGrow={1}>
          <HeaderCell>Author</HeaderCell>
          <EditableCell
            dataKey="author"
            dataType="string"
            onChange={handleChange}
            onEdit={handleEdit}
          />
        </Column>
        <Column flexGrow={1}>
          <HeaderCell>Description</HeaderCell>
          <EditableCell
            dataKey="description"
            dataType="string"
            onChange={handleChange}
            onEdit={handleEdit}
          />
        </Column>

        {/* Timestamp columns */}
        <Column flexGrow={0.5}>
          <HeaderCell>Created At</HeaderCell>
          <Cell dataKey="createdAt">
            {(r: Book) =>
              r.createdAt instanceof Date
                ? r.createdAt.toLocaleDateString()
                : String(r.createdAt)
            }
          </Cell>
        </Column>
        <Column flexGrow={0.5}>
          <HeaderCell>Updated At</HeaderCell>
          <Cell dataKey="updatedAt">
            {(r: Book) =>
              r.updatedAt instanceof Date
                ? r.updatedAt.toLocaleDateString()
                : String(r.updatedAt)
            }
          </Cell>
        </Column>

        {/* Action column */}
        <Column width={100}>
          <HeaderCell>Action</HeaderCell>
          <ActionCell
            onEdit={handleEdit}
            onRemove={handleRemove}
            bookDataFromLocalState={data}
            setBookDataFromLocalState={setData}
            setAlertProps={setAlertProps}
          />
        </Column>
      </Table>

      {/* Toast notifications */}
      <AlertToast alertProps={alertProps} />
    </div>
  );
};
