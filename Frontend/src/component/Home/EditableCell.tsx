import { DatePicker, Input, InputNumber, Table } from "rsuite";
import type { BookFieldType, EditableCellProps } from "../../lib/type";

const fieldMap = {
  string: Input,
  number: InputNumber,
  date: DatePicker,
};

function toValueString(value: BookFieldType) {
  return value instanceof Date ? value.toLocaleDateString() : value;
}

export const EditableCell = ({
  rowData,
  dataType,
  dataKey,
  onChange,
  onEdit,
  ...props
}: EditableCellProps) => {
  const editing = rowData?.status === "EDIT";

  const Field = fieldMap[dataType];
  const value = rowData ? rowData[dataKey] : undefined;
  const text = toValueString(value);

  const { Cell } = Table;

  return (
    <Cell
      {...props}
      className={editing ? "table-cell-editing" : ""}
      onDoubleClick={() => {
        if (rowData?.id != null) {
          onEdit?.(rowData.id);
        }
      }}
    >
      {editing ? (
        <Field
          defaultValue={value as any}
          onChange={(val: any) => {
            if (rowData?.id != null) {
              // Type guard
              onChange?.(rowData.id, dataKey, val);
            }
          }}
        />
      ) : (
        text
      )}
    </Cell>
  );
};
