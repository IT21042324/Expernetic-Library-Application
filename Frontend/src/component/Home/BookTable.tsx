// src/components/BookTable/BookTable.tsx
import React, { useEffect, useState } from "react";
import { Button, Checkbox, Table } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import type {
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

import { useAlertContext } from "../../context/useAlertContext";
import { UseBookContext } from "../../context/useBookContext";
import { BookToBookMassEditBookMapperArray } from "../../utils/helper";
import {
  BookMassEditAlertProps,
  BookMassEditErrorAlertProps,
  BookMassEditNeedChangesWarnAlertProps,
  BooksFetchedAlertProps,
  SaveNewRecordsBeforeMassEditAlertProps,
} from "../Strings/strings";
import customStyles from "./BookTable.module.css";

const { Column, HeaderCell, Cell } = Table;

/* Inline styles applied for edit mode */
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
  const [data, setData] = useState<Book[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const { SetAndDisplayAlert } = useAlertContext();
  const { books, dispatch } = UseBookContext();

  /* Initialize from context */
  useEffect(() => {
    if (books.length > 0 && data.length === 0) {
      const initialData = books.map((book) => ({
        ...book,
        status: selectedRowKeys.includes(book.id) ? "EDIT" : null,
        isDirty: false,
      }));
      setData(initialData as Book[]);
      SetAndDisplayAlert(BooksFetchedAlertProps);
    }
  }, [books]);

  /* Cell edits */
  const handleChange = (id: number, key: BookField, value: BookFieldType) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [key]: value, isDirty: true } : item
      )
    );
    const bookToUpdate = books.find((b) => b.id === id);
    if (bookToUpdate) {
      dispatch({
        type: "EditBook",
        payload: { ...(bookToUpdate as BookContextType), [key]: value },
      });
    }
  };

  /* Toggle edit‐mode & selection */
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

  /* Remove row */
  const handleRemove = (id: number) => {
    setData((prev) => prev.filter((i) => i.id !== id));
    setSelectedRowKeys((prev) => prev.filter((k) => k !== id));
  };

  /* Expand detail */
  const handleExpanded = (row?: Book) => {
    if (!row) return;
    setExpandedRowKeys((prev) =>
      prev.includes(row.id)
        ? prev.filter((k) => k !== row.id)
        : [...prev, row.id]
    );
  };

  /* Select / Deselect all—but only saved rows */
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = data.filter((r) => r.id >= 0).map((i) => i.id);
      setSelectedRowKeys(allIds);
      setData((prev) =>
        prev.map((i) => (i.id >= 0 ? { ...i, status: "EDIT" } : i))
      );
    } else {
      setSelectedRowKeys([]);
      setData((prev) =>
        prev.map((i) => (i.id >= 0 ? { ...i, status: null } : i))
      );
    }
  };

  /* Toggle single row—but block unsaved */
  const handleSelect = (row: Book) => {
    if (row.id < 0) return; // ← block selecting temp rows
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

  /* Mass‐edit */
  const handleMassEdit = async () => {
    /* blank‐field validation */
    const invalid = data.filter(
      (row) =>
        selectedRowKeys.includes(row.id) &&
        (!row.title?.trim() || !row.author?.trim() || !row.description?.trim())
    );
    if (invalid.length) {
      SetAndDisplayAlert({
        severity: "error",
        color: "error",
        isVisible: true,
        message: `Please fill Title, Author & Description (Titled: ${invalid
          .map((r) => r.title)
          .join(", ")})`,
      });
      return;
    }

    // find any row where author contains digits OR special chars
    const invalidNames = data.filter(
      (row) =>
        selectedRowKeys.includes(row.id) && /[^A-Za-z\s]/.test(row.author ?? "")
    );

    if (invalidNames.length) {
      SetAndDisplayAlert({
        severity: "error",
        color: "error",
        isVisible: true,
        message: `Author must only contain letters and spaces (Titled: ${invalidNames
          .map((r) => r.title || "<untitled>")
          .join(", ")})`,
      });
      return;
    }

    /* ensure only saved rows */
    let toEdit = books.filter((b) => selectedRowKeys.includes(b.id));
    toEdit = toEdit.filter((b) => b.id >= 0);
    if (toEdit.length === 0) return;

    /* ensure no temp rows */
    const unsaved = toEdit.filter((b) => b.id < 0);
    if (unsaved.length) {
      SetAndDisplayAlert(SaveNewRecordsBeforeMassEditAlertProps);
      return;
    }

    /* clear UI */
    setSelectedRowKeys([]);
    setData((p) => p.map((i) => ({ ...i, status: null })));

    try {
      const raw = await MassEditBookAsync(
        BookToBookMassEditBookMapperArray(
          toEdit as BookContextType[]
        ) as BookPostMassEdit[]
      );
      const parsed = raw.map((r) => ({
        ...r,
        createdAt: new Date(r.createdAt ?? Date.now()),
        updatedAt: new Date(r.updatedAt ?? Date.now()),
      }));

      if (parsed.length > 0) {
        dispatch({
          type: "MassEditBooks",
          payload: parsed as BookContextType[],
        });
        SetAndDisplayAlert(BookMassEditAlertProps);
        setData((prev) =>
          prev.map((row) => {
            const updated = parsed.find((r) => r.id === row.id);
            return updated ? { ...row, ...updated, status: null } : row;
          })
        );
      } else {
        SetAndDisplayAlert(BookMassEditNeedChangesWarnAlertProps);
      }
    } catch {
      SetAndDisplayAlert(BookMassEditErrorAlertProps);
    }
  };

  /* Expanded detail */
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

  const isAllSelected =
    data.length > 0 && selectedRowKeys.length === data.length;
  const isIndeterminate =
    selectedRowKeys.length > 0 && selectedRowKeys.length < data.length;

  return (
    <div className={customStyles.container}>
      <style>{inlineStyles}</style>

      <div style={{ marginBottom: 12 }}>
        <Button
          onClick={handleMassEdit}
          disabled={selectedRowKeys.length === 0}
          appearance="primary"
        >
          Apply Mass Edit ({selectedRowKeys.length})
        </Button>
        <Button
          appearance="ghost"
          style={{ marginLeft: 10 }}
          onClick={() => {
            const newId = -Date.now();
            const rec: Book & { isDirty: boolean } = {
              id: newId,
              title: "",
              author: "",
              description: "",
              createdAt: new Date(),
              updatedAt: new Date(),
              status: "EDIT",
              isDirty: false,
            };
            dispatch({ type: "AddBook", payload: rec as BookContextType });
            setData((p) => [rec, ...p]);
            // ← no selection here
          }}
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
        {/* Selection */}
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

        {/* Expand/Collapse */}
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

        {/* Timestamps */}
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

        {/* Action */}
        <Column width={100}>
          <HeaderCell>Action</HeaderCell>
          <ActionCell
            onEdit={handleEdit}
            onRemove={handleRemove}
            bookDataFromLocalState={data}
            setBookDataFromLocalState={setData}
          />
        </Column>
      </Table>
    </div>
  );
};
