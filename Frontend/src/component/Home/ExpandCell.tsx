// src/components/BookTable/ExpandCell.tsx
import React from "react";
import ExpandOutlineIcon from "@rsuite/icons/ExpandOutline";
import MoreIcon from "@rsuite/icons/More";
import { IconButton, Table } from "rsuite";
import type { ExpandCellProps } from "../../lib/type";

const { Cell } = Table;

/**
 * ExpandCell renders a button that toggles the expanded state of a row.
 * When clicked, it calls `onChange` with the row data, allowing the parent
 * table to show or hide the detail panel for that row.
 */
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
        // Choose icon based on whether this row is currently expanded
        icon={
          expandedRowKeys.includes(rowData.id) ? (
            <MoreIcon /> // Shown when row is expanded (click to collapse)
          ) : (
            <ExpandOutlineIcon /> // Shown when row is collapsed (click to expand)
          )
        }
      />
    )}
  </Cell>
);
