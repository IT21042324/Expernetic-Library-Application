import { useEffect, useRef, useState } from "react";
import { Button, Checkbox, Table } from "rsuite"; // Import Checkbox
import "rsuite/dist/rsuite.min.css";
import type {
  Book,
  BookContextType,
  BookField,
  BookFieldType,
  BookPost,
  BookPostMassEdit,
} from "../../lib/type";

import { AddBookAsync, MassEditBookAsync } from "../../api/BackEndApiCall";
import { ActionCell } from "./ActionCell";
import { EditableCell } from "./EditableCell";
import { ExpandCell } from "./ExpandCell";

import { UseBookContext } from "../../context/useBookContext";
import customStyles from "./BookTable.module.css";
import {
  BookToBookMassEditBookMapperArray,
  BookToBookPostMapperArray,
} from "../../utils/helper";

const { Column, HeaderCell, Cell } = Table;

const inlineStyles = `
.table-cell-editing .rs-table-cell-content {
    padding: 4px;
}
.table-cell-editing .rs-input {
    width: 100%;
}

/* .rs-table-expanded-row {
    max-height: 80px;
    overflow-y: auto;
} */
`;

export const BookTable = () => {
  const [data, setData] = useState<Book[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const { books, dispatch } = UseBookContext();

  useEffect(() => {
    setData(books as Book[]);
  }, [books.length === 0]);

  const handleChange = (id: number, key: BookField, value: BookFieldType) => {
    const bookToUpdate = books.find((b) => b.id === id);
    if (!bookToUpdate) {
      dispatch({
        type: "AddBook",
        payload: {
          id,
        },
      });
    }

    if (bookToUpdate !== undefined) {
      dispatch({
        type: "EditBook",
        payload: { ...(bookToUpdate as BookContextType), [key]: value },
      });
    }
  };

  const handleEdit = (id: number) => {
    const nextData = data.map((item) => {
      if (item.id === id) {
        const newStatus: "EDIT" | null = item.status === "EDIT" ? null : "EDIT";
        return { ...item, status: newStatus };
      }
      return item;
    });
    setData(nextData);
  };

  const handleRemove = (id: number) => {
    setData(data.filter((item) => item.id !== id));
    // Also remove from selectedRowKeys if the row is deleted
    setSelectedRowKeys(selectedRowKeys.filter((key) => key !== id));
  };

  const handleAddNewRowOnClick = async (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    data: Book
  ) => {
    try {
      const { id, createdAt, updatedAt, status, ...dataToSendPost } = data;

      const newBook = await AddBookAsync(dataToSendPost);
      console.log(newBook);

      setData((prevData) => [newBook, ...prevData]);
      event.preventDefault();
    } catch (err) {
      console.error("Error adding new book:", err);
      return;
    }
  };

  const rowKey = "id";

  const handleExpanded = (rowData: Book | undefined) => {
    if (!rowData) {
      console.warn("handleExpanded received undefined rowData");
      return;
    }
    const currentId = rowData[rowKey];
    const isCurrentlyExpanded = expandedRowKeys.includes(currentId as number);
    if (isCurrentlyExpanded) {
      setExpandedRowKeys(expandedRowKeys.filter((key) => key !== currentId));
    } else {
      setExpandedRowKeys([...expandedRowKeys, currentId as number]);
    }
  };

  // --- NEW SELECTION HANDLERS ---
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all IDs from the current data
      const allIds = data.map((item) => item.id);
      setSelectedRowKeys(allIds);
    } else {
      // Deselect all
      setSelectedRowKeys([]);
    }
  };

  const handleSelect = (rowData: Book) => {
    const currentId = rowData.id;
    const isSelected = selectedRowKeys.includes(currentId);
    if (isSelected) {
      // Deselect if already selected
      setSelectedRowKeys(selectedRowKeys.filter((key) => key !== currentId));
    } else {
      // Select if not selected
      setSelectedRowKeys([...selectedRowKeys, currentId]);
    }
  };
  // --- END NEW SELECTION HANDLERS ---

  // Function to render the expanded content for each row
  const renderRowExpanded = (rowData?: Book) => {
    if (!rowData) {
      return <div>No details available.</div>;
    }
    return (
      <div className={customStyles.expandedRowContent}>
        <p className={customStyles.detailField}>
          <strong>Description</strong>
        </p>
        <p>
          <span className={customStyles.descriptionText}>
            {rowData.description}
          </span>
        </p>
      </div>
    );
  };

  // Determine if all rows are selected for the "Select All" checkbox
  const isAllSelected =
    selectedRowKeys.length === data.length && data.length > 0;
  const isIndeterminate =
    selectedRowKeys.length > 0 && selectedRowKeys.length < data.length;

  const handleMassEdit = async () => {
    const booksForMassEdit = books.filter((book) =>
      selectedRowKeys.includes(book.id)
    );

    setSelectedRowKeys([]);

    try {
      const data = await MassEditBookAsync(
        BookToBookMassEditBookMapperArray(
          booksForMassEdit as BookContextType[]
        ) as BookPostMassEdit[]
      );
    } catch (error) {
      console.error("Error during mass edit:", error);
    }
  };

  return (
    <>
      <style>{inlineStyles}</style>
      <div className={customStyles.massEditControls}>
        <Button
          onClick={() => {
            handleMassEdit();
          }}
          disabled={selectedRowKeys.length === 0} // Disable if no rows selected
          appearance="primary"
        >
          Apply Mass Edit ({selectedRowKeys.length} selected)
        </Button>

        <Button
          onClick={() => {
            let newId = -Math.floor(Date.now() + Math.random() * 1000);

            setData((prevData) => [
              {
                id: newId,
                title: "",
                author: "",
                description: "",
                createdAt: new Date(),
                updatedAt: new Date(),
                status: "EDIT",
              },
              ...prevData,
            ]);
          }}
          appearance="ghost"
          style={{ marginLeft: "10px" }}
        >
          Add record
        </Button>
      </div>
      <hr />
      <Table
        height={420}
        data={data}
        rowKey={rowKey}
        expandedRowKeys={expandedRowKeys}
        renderRowExpanded={renderRowExpanded}
      >
        {/* --- NEW COLUMN FOR SELECTION CHECKBOXES --- */}
        <Column width={50} align="center">
          <HeaderCell style={{ padding: 0 }}>
            <div style={{ lineHeight: "40px" }}>
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onChange={(_, checked) => handleSelectAll(checked)}
              />
            </div>
          </HeaderCell>
          <Cell style={{ padding: 0 }}>
            {(rowData: Book) => (
              <div style={{ lineHeight: "40px" }}>
                <Checkbox
                  value={rowData.id}
                  checked={selectedRowKeys.includes(rowData.id)}
                  onChange={() => handleSelect(rowData)}
                />
              </div>
            )}
          </Cell>
        </Column>
        {/* --- END NEW COLUMN --- */}

        {/* The ExpandCell is now the second column */}
        <Column width={50} align="center">
          <HeaderCell>...</HeaderCell>
          <ExpandCell
            dataKey="id"
            expandedRowKeys={expandedRowKeys}
            onChange={handleExpanded}
          />
        </Column>

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

        <Column flexGrow={0.5}>
          <HeaderCell>Created At</HeaderCell>
          <Cell dataKey="createdAt">
            {(rowData: Book) =>
              rowData.createdAt instanceof Date
                ? rowData.createdAt.toLocaleDateString()
                : String(rowData.createdAt)
            }
          </Cell>
        </Column>

        <Column flexGrow={0.5}>
          <HeaderCell>Updated At</HeaderCell>
          <Cell dataKey="updatedAt">
            {(rowData: Book) =>
              rowData.updatedAt instanceof Date
                ? rowData.updatedAt.toLocaleDateString()
                : String(rowData.updatedAt)
            }
          </Cell>
        </Column>

        <Column width={100}>
          <HeaderCell>Action</HeaderCell>
          <ActionCell
            dataKey="id"
            onEdit={handleEdit}
            onRemove={handleRemove}
            bookDataFromLocalState={data}
            setBookDataFromLocalState={setData}
          />
        </Column>
      </Table>
    </>
  );
};
