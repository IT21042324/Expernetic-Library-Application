import MoreIcon from "@rsuite/icons/More";
import ExpandOutlineIcon from "@rsuite/icons/ExpandOutline";
import { IconButton, Table } from "rsuite";
import type { Book, BookFieldType } from "../../lib/type";

type ExpandCellProps = {
  rowData?: Book;
  rowKey?: "id";
  dataKey: keyof Book;
  expandedRowKeys: BookFieldType[];
  onChange: (rowData: Book) => void;
};

const { Cell } = Table;

export const ExpandCell = ({
  rowData,
  rowKey,
  dataKey,
  expandedRowKeys,
  onChange,
  ...props
}: ExpandCellProps) => (
  <Cell {...props} style={{ padding: 5 }}>
    {rowData && (
      <IconButton
        appearance="subtle"
        onClick={() => {
          onChange(rowData);
        }}
        icon={
          expandedRowKeys.some((key) => key == [rowKey]) ? (
            <MoreIcon />
          ) : (
            <ExpandOutlineIcon />
          )
        }
      />
    )}
  </Cell>
);
