import { useEffect, useState } from "react";
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

const inlineStyles = `
.table-cell-editing .rs-table-cell-content {
    padding: 4px;
}
.table-cell-editing .rs-input {
    width: 100%;
}
`;

export const BookTable = () => {
  const [data, setData] = useState<Book[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [alertProps, setAlertProps] = useState<AlertProps>({
    severity: "success",
    message: "Book table loaded successfully!",
    color: "success",
    isVisible: false,
  });

  const { books, dispatch } = UseBookContext();

  useEffect(() => {
    if (books.length > 0 && data.length === 0) {
      const initialData = books.map((book) => ({
        ...book,
        status: selectedRowKeys.includes(book.id) ? "EDIT" : null,
      }));
      setData(initialData);
      setAlertProps(BooksFetchedAlertProps);
    }
  }, [books]);

  const handleChange = (id: number, key: BookField, value: BookFieldType) => {
    const bookToUpdate = books.find((b) => b.id === id);
    if (!bookToUpdate) {
      dispatch({ type: "AddBook", payload: { id } });
    }
    if (bookToUpdate !== undefined) {
      dispatch({
        type: "EditBook",
        payload: { ...(bookToUpdate as BookContextType), [key]: value },
      });
    }
  };

  const handleEdit = (id: number) => {
    setData((prevData) =>
      prevData.map((item) => {
        if (item.id === id) {
          const isEdit = item.status === "EDIT";
          if (!isEdit && !selectedRowKeys.includes(id)) {
            setSelectedRowKeys((prev) => [...prev, id]);
          }
          return { ...item, status: isEdit ? null : "EDIT" };
        }
        return item;
      })
    );
  };

  const handleRemove = (id: number) => {
    setData(data.filter((item) => item.id !== id));
    setSelectedRowKeys(selectedRowKeys.filter((key) => key !== id));
  };

  const rowKey = "id";

  const handleExpanded = (rowData: Book | undefined) => {
    if (!rowData) return;
    const currentId = rowData[rowKey];
    const isCurrentlyExpanded = expandedRowKeys.includes(currentId as number);
    setExpandedRowKeys((prev) =>
      isCurrentlyExpanded
        ? prev.filter((key) => key !== currentId)
        : [...prev, currentId as number]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = data.map((item) => item.id);
      setSelectedRowKeys(allIds);
      setData((prev) => prev.map((item) => ({ ...item, status: "EDIT" })));
    } else {
      setSelectedRowKeys([]);
      setData((prev) => prev.map((item) => ({ ...item, status: null })));
    }
  };

  const handleSelect = (rowData: Book) => {
    const currentId = rowData.id;
    const isSelected = selectedRowKeys.includes(currentId);
    if (isSelected) {
      setSelectedRowKeys(selectedRowKeys.filter((key) => key !== currentId));
      setData((prev) =>
        prev.map((item) =>
          item.id === currentId ? { ...item, status: null } : item
        )
      );
    } else {
      setSelectedRowKeys([...selectedRowKeys, currentId]);
      setData((prev) =>
        prev.map((item) =>
          item.id === currentId ? { ...item, status: "EDIT" } : item
        )
      );
    }
  };

  const renderRowExpanded = (rowData?: Book) => {
    if (!rowData) return <div>No details available.</div>;
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

  const isAllSelected =
    selectedRowKeys.length === data.length && data.length > 0;
  const isIndeterminate =
    selectedRowKeys.length > 0 && selectedRowKeys.length < data.length;

  const handleMassEdit = async () => {
    const booksForMassEdit = books.filter((book) =>
      selectedRowKeys.includes(book.id)
    );
    setSelectedRowKeys([]);
    setData((prev) => prev.map((item) => ({ ...item, status: null })));

    try {
      const data = await MassEditBookAsync(
        BookToBookMassEditBookMapperArray(
          booksForMassEdit as BookContextType[]
        ) as BookPostMassEdit[]
      );

      if (data) {
        dispatch({
          type: "MassEditBooks",
          payload: data as BookContextType[],
        });
        setAlertProps(BookMassEditAlertProps);
      }
    } catch (error) {
      console.error("Error during mass edit:", error);
      setAlertProps(BookMassEditErrorAlertProps);
    }
  };

  return (
    <div className={customStyles.container}>
      <style>{inlineStyles}</style>
      <div>
        <Button
          onClick={handleMassEdit}
          disabled={selectedRowKeys.length === 0}
          appearance="primary"
        >
          Apply Mass Edit ({selectedRowKeys.length} selected)
        </Button>

        <Button
          onClick={() => {
            let newId = -Math.floor(Date.now() + Math.random() * 1000);

            const newRecord = {
              id: newId,
              title: "",
              author: "",
              description: "",
              createdAt: new Date(),
              updatedAt: new Date(),
              status: "EDIT",
            };

            dispatch({ type: "AddBook", payload: newRecord });
            setData((prevData) => [newRecord, ...prevData]);
            setSelectedRowKeys((prev) => [newRecord.id, ...prev]);
          }}
          appearance="ghost"
          style={{ marginLeft: "10px" }}
        >
          Add record
        </Button>
      </div>
      <hr />
      <Table
        height={550}
        data={data}
        rowKey={rowKey}
        expandedRowKeys={expandedRowKeys}
        renderRowExpanded={renderRowExpanded}
      >
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
            setAlertProps={setAlertProps}
          />
        </Column>
      </Table>
      <AlertToast alertProps={alertProps} />
    </div>
  );
};
