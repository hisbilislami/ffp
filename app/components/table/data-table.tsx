import { Icon } from "@iconify/react/dist/iconify.js";
import {
  ActionIcon,
  Button,
  CSSProperties,
  Flex,
  Paper,
  Table,
  TableProps,
  Text,
  TextInput,
} from "@mantine/core";
import { IconEdit, IconSearch, IconTrash } from "@tabler/icons-react";
import {
  Column,
  ColumnDef,
  flexRender,
  Table as TableType,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useRef } from "react";

interface DataTableProps<TData, TValue> extends TableProps {
  table: TableType<TData>;
  columns: ColumnDef<TData, TValue>[];
  withAction?: boolean;
  withFilter?: boolean;
  onEdit?: (data: TData) => void;
  onDelete?: (data: TData) => void;
  onAdd?: () => void;
  onRefresh?: () => void;
  withSearchField?: boolean;
  onSearch?: (search: string) => void;
  onFilter?: () => void;
  textName?: string;
}

const getCommonPinningStyles = (column: Column<any>): CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right");
  const columnIndexFromLeft = column.getIndex("left");
  const columnIndexFromRight = column.getIndex("right");
  return {
    boxShadow: isLastLeftPinnedColumn
      ? "-4px 0 4px -4px gray inset"
      : isFirstRightPinnedColumn
        ? "4px 0 4px -4px gray inset"
        : undefined,
    // left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    // NOTE: Temporary calculation, should calculate the with of the column to get the offset precisely
    left: isPinned === "left" ? `${36 * columnIndexFromLeft}px` : undefined,
    right:
      isPinned === "right"
        ? `${(column.getAfter("right") / 5) * columnIndexFromRight}px`
        : undefined,
    opacity: 1,
    position: isPinned ? "sticky" : "inherit",
    zIndex: isPinned ? 10 : 0,
    /* backgroundColor: "#fff", */
  };
};

export function DataTable<TData, TValue>({
  table,
  columns,
  isLoading = false,
  onTrClick,
  withAction,
  withFilter,
  onEdit,
  onDelete,
  onAdd,
  onRefresh,
  onSearch,
  onFilter,
  withSearchField,
  textName = "ID",
  ...props
}: DataTableProps<TData, TValue> & {
  isLoading?: boolean;
  onTrClick?: (data: TData) => void;
}) {
  const searchRef = useRef<HTMLInputElement>(null);
  const searchFieldHandling = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSearch?.(searchRef.current?.value || "");
    }
  };

  const handleRefresh = () => {
    if (searchRef.current) {
      searchRef.current.value = "";
    }
    onRefresh?.();
  };

  const searchIcon = <IconSearch size={16} stroke={1.5} />;
  return (
    <Table.ScrollContainer minWidth={500}>
      <Flex className="mb-2" justify="space-between">
        {/* ADD BUTTON */}
        {withAction && onAdd ? (
          <div className="w-full sm:w-[50%]">
            <Button
              size="xs"
              leftSection={
                <Icon icon="tabler:plus" className="w-3 h-3 font-semibold" />
              }
              variant="filled"
              onClick={() => onAdd()}
            >
              <Text fw={300} size="xs">
                Tambah {textName}
              </Text>
            </Button>
          </div>
        ) : (
          <div className="w-full sm:w-[50%]">&nbsp;</div>
        )}

        <div className="w-full sm:w-[50%] gap-2 flex justify-end items-center">
          {withSearchField && onRefresh ? (
            <>
              <Button
                size="xs"
                leftSection={
                  <Icon
                    icon="tabler:refresh"
                    className="w-3 h-3 font-semibold"
                  />
                }
                variant="default"
                onClick={handleRefresh}
              >
                <Text fw={300} size="xs">
                  Refresh
                </Text>
              </Button>
              <TextInput
                size="xs"
                leftSection={searchIcon}
                placeholder="Cari di sini"
                autoComplete="off"
                onKeyDown={searchFieldHandling}
                aria-label="pencarian"
                name="s"
                ref={searchRef} // Attach ref to the input field
              />
            </>
          ) : null}
          {withFilter && onFilter ? (
            <>
              <Button
                size="xs"
                leftSection={
                  <Icon
                    icon="tabler:filter"
                    className="w-3 h-3 font-semibold"
                  />
                }
                variant="default"
                onClick={() => onFilter()}
              >
                <Text fw={300} size="xs">
                  Filter
                </Text>
              </Button>
            </>
          ) : null}
        </div>
      </Flex>
      <Paper withBorder p={".8px"}>
        <Table
          bg="#fff"
          verticalSpacing="xs"
          striped
          withColumnBorders
          withTableBorder={false}
          withRowBorders
          variant="default"
          {...props}
        >
          <Table.Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Tr key={headerGroup.id}>
                {withAction ? (
                  <Table.Th
                    className="text-sm font-semibold leading-none p-2 text-ihcGrey-700"
                    style={{
                      width: "1%", // Shrinks to fit content
                      whiteSpace: "nowrap", // Prevents unnecessary wrapping
                    }}
                  >
                    Aksi
                  </Table.Th>
                ) : null}
                {headerGroup.headers.map((header) => {
                  // START HEAD CHECKBOX ---------------------------------------------
                  const { column } = header;
                  // if (header.id === "select") {
                  //   return (
                  //     <Table.Th key={header.id} style={{ width: rem(40) }}>
                  //       {header.isPlaceholder ? null : (
                  //         <Container
                  //           pos="relative"
                  //           display="flex"
                  //           className="left-[1px] p-0"
                  //         >
                  //           {flexRender(
                  //             header.column.columnDef.header,
                  //             header.getContext(),
                  //           )}
                  //         </Container>
                  //       )}
                  //     </Table.Th>
                  //   );
                  // }
                  // END HEAD CHECKBOX -----------------------------------------------

                  return (
                    <Table.Th
                      key={header.id}
                      className="text-sm font-semibold leading-none p-2 text-ihcGrey-700"
                      style={{
                        ...getCommonPinningStyles(column),
                        width: column.getSize(),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </Table.Th>
                  );
                })}
              </Table.Tr>
            ))}
          </Table.Thead>
          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td
                  colSpan={withAction ? columns.length + 1 : columns.length}
                  className="h-24 text-center"
                >
                  Memuat Data...
                </Table.Td>
              </Table.Tr>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <Table.Tr
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : null}
                  className={clsx({
                    "cursor-pointer hoverable": !!onTrClick,
                  })}
                  onClick={() => onTrClick && onTrClick(row.original)}
                >
                  {withAction ? (
                    <Table.Td
                      className="text-sm leading-none text-black"
                      style={{
                        width: "1%", // Shrinks to fit content
                        whiteSpace: "nowrap", // Prevents unnecessary wrapping
                      }}
                    >
                      {onEdit ? (
                        <ActionIcon
                          variant="subtle"
                          color="tmDark.8"
                          size="md"
                          aria-label="Edit"
                          onClick={() => onEdit(row.original)}
                        >
                          <IconEdit />
                        </ActionIcon>
                      ) : null}
                      {onDelete ? (
                        <ActionIcon
                          variant="subtle"
                          color="tmDark.8"
                          size="md"
                          aria-label="Delete"
                          onClick={() => onDelete(row.original)}
                        >
                          <IconTrash />
                        </ActionIcon>
                      ) : null}
                    </Table.Td>
                  ) : null}
                  {row.getVisibleCells().map((cell) => {
                    // START ROW CHECKBOX  ---------------------------------------------
                    const { column } = cell;
                    // if (cell.column.id === "select")
                    //   return (
                    //     <Table.Td key={cell.id}>
                    //       <Container
                    //         pos="relative"
                    //         display="flex"
                    //         className="left-[1px] p-0"
                    //       >
                    //         {flexRender(
                    //           cell.column.columnDef.cell,
                    //           cell.getContext(),
                    //         )}
                    //       </Container>
                    //     </Table.Td>
                    //   );
                    // END ROW CHECKBOX  -----------------------------------------------

                    return (
                      <Table.Td
                        key={cell.id}
                        className="text-sm leading-none text-black"
                        style={{
                          ...getCommonPinningStyles(column),
                          width: column.getSize(),
                        }}
                        onClick={(e) =>
                          cell.column.id === "select" && e.stopPropagation()
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </Table.Td>
                    );
                  })}
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td
                  colSpan={withAction ? columns.length + 1 : columns.length}
                  className="h-24 text-center"
                >
                  Data Kosong.
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>
    </Table.ScrollContainer>
  );
}
