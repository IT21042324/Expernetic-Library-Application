import ExpandOutlineIcon from "@rsuite/icons/ExpandOutline";
import MoreIcon from "@rsuite/icons/More";
import React from "react";
import { IconButton, Table } from "rsuite";
import type { ExpandCellProps } from "../../lib/type";

const { Cell } = Table;

export const ExpandCell: React.FC<ExpandCellProps> = ({
  rowData,
  expandedRowKeys,
  onChange,
  ...props
}) => (
  <Cell {...props} style={{ padding: 5 }}>
    {rowData && (
      <IconButton
        appearance="subtle"
        onClick={() => onChange(rowData)}
        icon={
          expandedRowKeys.includes(rowData.id) ? (
            <MoreIcon />
          ) : (
            <ExpandOutlineIcon />
          )
        }
      />
    )}
  </Cell>
);
