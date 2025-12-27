import { Icon } from "@iconify/react/dist/iconify.js";
import {
  ActionIcon,
  Button,
  Card,
  Center,
  CSSProperties,
  Flex,
  Grid,
  Paper,
  Popover,
  ScrollArea,
  Table,
  TableProps,
  Text,
  TextInput,
} from "@mantine/core";
import { IconEdit, IconSearch, IconTrash, IconX } from "@tabler/icons-react";
import {
  Column,
  ColumnDef,
  flexRender,
  Table as TableType,
} from "@tanstack/react-table";
import { clsx } from "clsx";
import { ComponentType, useRef, useState } from "react";
import OptionDialog from "../dialog/option-dialog";

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
  onFilterReset?: () => void;
  FilterComponent?: ComponentType<unknown>;
  textName?: string;
}

const getCommonPinningStyles = (column: Column<unknown>): CSSProperties => {
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
  onFilterReset,
  FilterComponent,
  withSearchField,
  textName = "ID",
  ...props
}: DataTableProps<TData, TValue> & {
  isLoading?: boolean;
  onTrClick?: (data: TData) => void;
}) {
  const searchRef = useRef<HTMLInputElement>(null);
  const searchFieldHandling = (
    event: React.KeyboardEvent<HTMLInputElement>
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

  const [filterOpened, setFilterOpened] = useState(false);

  const [showOtherMobileButton, setShowOtherMobileButton] =
    useState<boolean>(false);

  const searchIcon = <IconSearch size={16} stroke={1.5} />;

  const [showOptionDialog, setShowOptionDialog] = useState<boolean>(false);

  return (
    <>
      {/* for mobile */}
      <ScrollArea className="block md:hidden min-h-[63vh]">
        <Flex justify="center" align="center" direction="column" gap="sm">
          {withAction && onAdd ? (
            <div className="w-full flex justify-between items-center">
              <Button
                size="xs"
                leftSection={
                  <Icon icon="tabler:plus" className="w-3 h-3 font-semibold" />
                }
                variant="filled"
                onClick={() => onAdd()}
              >
                <Text fw={300} size="xs">
                  Add {textName}
                </Text>
              </Button>
              <ActionIcon
                variant="light"
                size="lg"
                color="billGreen"
                onClick={() => {
                  setShowOtherMobileButton((s) => !s);
                }}
                className="rounded-full md:hidden"
              >
                <Icon icon="tabler:dots" className="h-6 w-6" />
              </ActionIcon>
            </div>
          ) : (
            <div className="w-full sm:w-[50%]">&nbsp;</div>
          )}

          {showOtherMobileButton && (
            <div
              className={`border rounded-lg p-4 transition-all duration-500 ease-in-out bg-bill-gray-100`}
            >
              <div className="w-full sm:w-[50%] gap-2 flex justify-between items-center">
                {withSearchField && onRefresh ? (
                  <>
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
                  </>
                ) : null}
                {withFilter && onFilter && onFilterReset ? (
                  <>
                    <Popover
                      opened={filterOpened}
                      width={350}
                      radius={10}
                      position="bottom"
                      trapFocus
                      clickOutsideEvents={["mouseup", "touchend"]}
                      shadow="md"
                      offset={{ mainAxis: 5, crossAxis: -135 }}
                    >
                      <Popover.Target>
                        <Button
                          size="xs"
                          leftSection={
                            <Icon
                              icon="tabler:filter"
                              className="w-3 h-3 font-semibold"
                            />
                          }
                          variant="default"
                          onClick={() => setFilterOpened((o) => !o)}
                        >
                          <Text fw={300} size="xs">
                            Filter
                          </Text>
                        </Button>
                      </Popover.Target>
                      <Popover.Dropdown className="p-0 border-0">
                        <div className="filter-header bg-tm-gray-100 p-2 items-center rounded-t-[10px] border-b-tm-gray-300 border-[1px] border-t-0 border-r-0 border-l-0 px-6 inline-flex w-full justify-between">
                          <Text className="font-medium">Filter</Text>
                          <Button
                            bg="transparent"
                            onClick={() => {
                              setFilterOpened(false);
                              onFilterReset();
                            }}
                            className="p-0 m-0"
                            size="xs"
                          >
                            <IconX color="black"></IconX>
                          </Button>
                        </div>
                        <div className="py-4 px-6">
                          {FilterComponent ? <FilterComponent /> : null}
                        </div>
                        <div className="filter-footer p-4 items-center rounded-b-[10px] border-t-tm-gray-300 border-[1px] border-b-0 border-r-0 border-l-0 px-6 inline-flex w-full justify-around">
                          <Button
                            size="sm"
                            leftSection={
                              <Icon
                                icon="tabler:x"
                                className="text-tm-dark-800 text-xl font-bold"
                              />
                            }
                            className="border-tm-gray-400"
                            variant="outline"
                            type="button"
                            onClick={() => onFilterReset()}
                          >
                            <Text
                              fw={300}
                              size="sm"
                              className="text-tm-dark-800"
                            >
                              Atur Ulang
                            </Text>
                          </Button>
                          <Button
                            size="sm"
                            leftSection={
                              <Icon
                                icon="tabler:filter"
                                className="text-xl font-bold"
                              />
                            }
                            variant="filled"
                            onClick={() => onFilter()}
                          >
                            <Text fw={300} size="sm">
                              Terapkan
                            </Text>
                          </Button>
                        </div>
                      </Popover.Dropdown>
                    </Popover>
                  </>
                ) : null}
              </div>

              <div className="w-full sm:w-[50%] gap-2 flex justify-between items-center">
                {withFilter && onFilter && onFilterReset ? (
                  <>
                    <Popover
                      opened={filterOpened}
                      width={350}
                      radius={10}
                      position="bottom"
                      trapFocus
                      clickOutsideEvents={["mouseup", "touchend"]}
                      shadow="md"
                      offset={{ mainAxis: 5, crossAxis: -135 }}
                    >
                      <Popover.Target>
                        <Button
                          size="xs"
                          leftSection={
                            <Icon
                              icon="tabler:filter"
                              className="w-3 h-3 font-semibold"
                            />
                          }
                          variant="default"
                          onClick={() => setFilterOpened((o) => !o)}
                        >
                          <Text fw={300} size="xs">
                            Filter
                          </Text>
                        </Button>
                      </Popover.Target>
                      <Popover.Dropdown className="p-0 border-0">
                        <div className="filter-header bg-tm-gray-100 p-2 items-center rounded-t-[10px] border-b-tm-gray-300 border-[1px] border-t-0 border-r-0 border-l-0 px-6 inline-flex w-full justify-between">
                          <Text className="font-medium">Filter</Text>
                          <Button
                            bg="transparent"
                            onClick={() => {
                              setFilterOpened(false);
                              onFilterReset();
                            }}
                            className="p-0 m-0"
                            size="xs"
                          >
                            <IconX color="black"></IconX>
                          </Button>
                        </div>
                        <div className="py-4 px-6">
                          {FilterComponent ? <FilterComponent /> : null}
                        </div>
                        <div className="filter-footer p-4 items-center rounded-b-[10px] border-t-tm-gray-300 border-[1px] border-b-0 border-r-0 border-l-0 px-6 inline-flex w-full justify-around">
                          <Button
                            size="sm"
                            leftSection={
                              <Icon
                                icon="tabler:x"
                                className="text-tm-dark-800 text-xl font-bold"
                              />
                            }
                            className="border-tm-gray-400"
                            variant="outline"
                            type="button"
                            onClick={() => onFilterReset()}
                          >
                            <Text
                              fw={300}
                              size="sm"
                              className="text-tm-dark-800"
                            >
                              Atur Ulang
                            </Text>
                          </Button>
                          <Button
                            size="sm"
                            leftSection={
                              <Icon
                                icon="tabler:filter"
                                className="text-xl font-bold"
                              />
                            }
                            variant="filled"
                            onClick={() => onFilter()}
                          >
                            <Text fw={300} size="sm">
                              Terapkan
                            </Text>
                          </Button>
                        </div>
                      </Popover.Dropdown>
                    </Popover>
                  </>
                ) : null}
              </div>
            </div>
          )}

          {isLoading ? (
            <p>Loading...</p>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <>
                <OptionDialog
                  opened={showOptionDialog}
                  onClose={() => setShowOptionDialog(false)}
                  onEdit={() => onEdit?.(row.original)}
                  onDelete={() => onDelete?.(row.original)}
                />
                <Card
                  key={row.id}
                  className="w-full flex justify-center"
                  mih={50}
                  onClick={() => {
                    setShowOptionDialog(true);
                  }}
                  radius={"md"}
                  bg={"billOrange.1"}
                  p={"xs"}
                >
                  <Grid columns={5} align="center">
                    <Grid.Col span={1}>
                      <Center>
                        <Icon
                          className="text-bill-orange-500"
                          icon="tabler:moneybag"
                        />
                      </Center>
                    </Grid.Col>
                    <Grid.Col span={3} px={"3px"}>
                      <ul>
                        {row.getVisibleCells().map((cell) => {
                          const meta = cell.column.columnDef.meta;
                          const label = meta?.mobileLabel;
                          const showLabel = meta?.showColumnNameOnMobile;

                          return (
                            <li key={cell.id} className="flex">
                              {showLabel && (
                                <>
                                  {/* Label */}
                                  <Text
                                    size="xs"
                                    c="dimmed"
                                    fw={500}
                                    miw={"50%"}
                                  >
                                    {label}
                                  </Text>
                                </>
                              )}

                              {/* Value */}
                              <Text size="xs" fw={600} miw={"50%"}>
                                {showLabel ? " : " : null}
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </Text>
                            </li>
                          );
                        })}
                      </ul>
                    </Grid.Col>
                    <Grid.Col span={1}>
                      <Center>
                        <Icon
                          icon="tabler:chevron-right"
                          className="text-bill-orange-500"
                        />
                      </Center>
                    </Grid.Col>
                  </Grid>
                </Card>
              </>
            ))
          ) : (
            <Card>Data kosong</Card>
          )}
        </Flex>
      </ScrollArea>

      {/* for web / large display */}
      <Table.ScrollContainer minWidth={500} className="hidden md:block">
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
                  Add {textName}
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
            {withFilter && onFilter && onFilterReset ? (
              <>
                <Popover
                  opened={filterOpened}
                  width={350}
                  radius={10}
                  position="bottom"
                  trapFocus
                  clickOutsideEvents={["mouseup", "touchend"]}
                  shadow="md"
                  offset={{ mainAxis: 5, crossAxis: -135 }}
                >
                  <Popover.Target>
                    <Button
                      size="xs"
                      leftSection={
                        <Icon
                          icon="tabler:filter"
                          className="w-3 h-3 font-semibold"
                        />
                      }
                      variant="default"
                      onClick={() => setFilterOpened((o) => !o)}
                    >
                      <Text fw={300} size="xs">
                        Filter
                      </Text>
                    </Button>
                  </Popover.Target>
                  <Popover.Dropdown className="p-0 border-0">
                    <div className="filter-header bg-tm-gray-100 p-2 items-center rounded-t-[10px] border-b-tm-gray-300 border-[1px] border-t-0 border-r-0 border-l-0 px-6 inline-flex w-full justify-between">
                      <Text className="font-medium">Filter</Text>
                      <Button
                        bg="transparent"
                        onClick={() => {
                          setFilterOpened(false);
                          onFilterReset();
                        }}
                        className="p-0 m-0"
                        size="xs"
                      >
                        <IconX color="black"></IconX>
                      </Button>
                    </div>
                    <div className="py-4 px-6">
                      {FilterComponent ? <FilterComponent /> : null}
                    </div>
                    <div className="filter-footer p-4 items-center rounded-b-[10px] border-t-tm-gray-300 border-[1px] border-b-0 border-r-0 border-l-0 px-6 inline-flex w-full justify-around">
                      <Button
                        size="sm"
                        leftSection={
                          <Icon
                            icon="tabler:x"
                            className="text-tm-dark-800 text-xl font-bold"
                          />
                        }
                        className="border-tm-gray-400"
                        variant="outline"
                        type="button"
                        onClick={() => onFilterReset()}
                      >
                        <Text fw={300} size="sm" className="text-tm-dark-800">
                          Atur Ulang
                        </Text>
                      </Button>
                      <Button
                        size="sm"
                        leftSection={
                          <Icon
                            icon="tabler:filter"
                            className="text-xl font-bold"
                          />
                        }
                        variant="filled"
                        onClick={() => onFilter()}
                      >
                        <Text fw={300} size="sm">
                          Terapkan
                        </Text>
                      </Button>
                    </div>
                  </Popover.Dropdown>
                </Popover>
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
                          ...getCommonPinningStyles(
                            column as Column<unknown, unknown>
                          ),
                          width: column.getSize(),
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </Table.Th>
                    );
                  })}

                  {withAction ? (
                    <Table.Th
                      className="text-sm font-semibold leading-none p-2 text-ihcGrey-700"
                      style={{
                        width: "1%", // Shrinks to fit content
                        whiteSpace: "nowrap", // Prevents unnecessary wrapping
                      }}
                    >
                      Action
                    </Table.Th>
                  ) : null}
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
                            ...getCommonPinningStyles(
                              column as Column<unknown, unknown>
                            ),
                            width: column.getSize(),
                          }}
                          onClick={(e) =>
                            cell.column.id === "select" && e.stopPropagation()
                          }
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Table.Td>
                      );
                    })}

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
    </>
  );
}
