import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@material-ui/core";
import styled from "styled-components";

const StyledTableCell = styled(TableCell)`
  && {
    font-weight: 600;
  }
`;

const DataTable = ({ data, dataSchema }) => {
  const [localItems, setLocalItems] = useState(data);
  const [sortItem, setSortItem] = useState({ sortBy: null, sortOrder: "asc" });

  //sets the localItems back to the data provided when data is changed by the parent component
  useEffect(() => {
    setLocalItems(data);
  }, [data]);

  useEffect(() => {
    const sortData = (sortBy, sortOrder, itemsToSort) => {
      // const itemsToSort = [...localItems];
      const sortedItems = itemsToSort.sort((i, j) => {
        if (i[sortBy] < j[sortBy]) {
          return sortOrder === "asc" ? -1 : 1;
        } else {
          if (i[sortBy] > j[sortBy]) {
            return sortOrder === "asc" ? 1 : -1;
          } else {
            return 0;
          }
        }
      });
      setLocalItems(sortedItems);
    };
    if (sortItem.sortBy)
      sortData(sortItem.sortBy, sortItem.sortOrder, [...localItems]);
  }, [sortItem, localItems]);

  // normally one would commit/save any order changes via an api call here...
  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    setLocalItems((prev) => {
      const temp = [...prev];
      const d = temp[result.destination.index];
      temp[result.destination.index] = temp[result.source.index];
      temp[result.source.index] = d;

      return temp;
    });
  };

  const requestSort = (requestedSortBy) => {
    const newSortItem = { ...sortItem };

    if (requestedSortBy === newSortItem.sortBy)
      newSortItem.sortOrder = newSortItem.sortOrder === "asc" ? "desc" : "asc";
    else {
      newSortItem.sortOrder = "asc";
      newSortItem.sortBy = requestedSortBy;
    }
    setSortItem(newSortItem);
  };

  return (
    <TableContainer>
      <Table>
        <colgroup>
          <col style={{ width: "25%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "35%" }} />
        </colgroup>
        <TableHead>
          <TableRow>
            {dataSchema.map((schema) => (
              <StyledTableCell align={schema.align}>
                {schema.sortable ? (
                  <TableSortLabel
                    active={sortItem.sortBy === schema.id}
                    direction={sortItem.sortOrder}
                    onClick={() => requestSort(schema.id)}
                  >
                    {schema.label}
                  </TableSortLabel>
                ) : (
                  schema.label
                )}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable" direction="vertical">
            {(droppableProvided) => (
              <TableBody
                ref={droppableProvided.innerRef}
                {...droppableProvided.droppableProps}
              >
                {localItems.map((item, index) => (
                  <Draggable
                    key={item.series_id}
                    draggableId={item.series_id}
                    index={index}
                  >
                    {(draggableProvided, snapshot) => {
                      return (
                        <TableRow
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          style={{
                            ...draggableProvided.draggableProps.style,
                            background: snapshot.isDragging
                              ? "rgba(245,245,245, 0.75)"
                              : "none",
                          }}
                          {...draggableProvided.dragHandleProps}
                        >
                          {/*TODO: Use schema here to display value and parse it too depending on the type*/}
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="right">{item.from}</TableCell>
                          <TableCell align="right">{item.to}</TableCell>
                          <TableCell align="right">
                            <strong>${item.value.toFixed(1)}M</strong>
                          </TableCell>
                        </TableRow>
                      );
                    }}
                  </Draggable>
                ))}
                {droppableProvided.placeholder}
              </TableBody>
            )}
          </Droppable>
        </DragDropContext>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
