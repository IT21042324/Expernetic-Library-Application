// src/components/BookTable/EditableCell.tsx
import React from "react";
import { DatePicker, Input, InputNumber, Table } from "rsuite";
import type { BookFieldType, EditableCellProps } from "../../lib/type";

// Map each data type to the corresponding input component
const fieldMap = {
  string: Input,
  number: InputNumber,
  date: DatePicker,
};

// Convert the stored value to a readable string for display mode
function toValueString(value: BookFieldType) {
  return value instanceof Date ? value.toLocaleDateString() : String(value);
}

export const EditableCell: React.FC<EditableCellProps> = ({
  rowData,
  dataType,
  dataKey,
  onChange,
  onEdit,
  ...props
}) => {
  // Determine if this row is currently in edit mode
  const editing = rowData?.status === "EDIT";

  // Select the appropriate input component and current value
  const Field = fieldMap[dataType];
  const value = rowData ? rowData[dataKey] : undefined;
  const text = toValueString(value);

  const { Cell } = Table;

  return (
    <Cell
      {...props}
      className={editing ? "table-cell-editing" : ""}
      // Double-click enters edit mode
      onDoubleClick={() => {
        if (rowData?.id != null) {
          onEdit?.(rowData.id);
        }
      }}
    >
      {editing ? (
        // Render input when editing
        <Field
          defaultValue={value as any}
          onChange={(val: any) => {
            // Notify parent of changes
            if (rowData?.id != null) {
              onChange?.(rowData.id, dataKey, val);
            }
          }}
        />
      ) : (
        // Display text when not editing
        text
      )}
    </Cell>
  );
};
