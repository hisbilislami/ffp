import { Icon } from "@iconify/react";
import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  UnstyledButton,
  rem,
} from "@mantine/core";
import { Link, useLocation, useNavigate } from "@remix-run/react";
import { useState } from "react";

import { cn } from "~/utils/style";

import { AppModuleMenu, AppPageMenu } from "./types";

type LinksGroupProps = {
  menu: Omit<AppModuleMenu, "pages">;
  child: AppPageMenu[];
};

export function LinksGroup({ menu, child }: LinksGroupProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const hasLinks = Array.isArray(child) && child.length > 0;
  const [opened, setOpened] = useState(false);

  function isPathnameMatch(link: string) {
    if (!link) return false;
    return location.pathname === link && location.pathname.includes(link);
  }

  function isPathnameInclude(link: string) {
    if (!link) return false;

    const firstTwoSegments = link
      .split("/")
      .filter(Boolean) // remove empty strings
      .slice(0, 2) // take the first two segments
      .join("/");

    const normalizedLink = `/${firstTwoSegments}`;

    return location.pathname.startsWith(normalizedLink);
  }

  function onClickParentMenu() {
    menu?.path && child.length === 0
      ? navigate(menu.path)
      : setOpened((o) => !o);
  }
  const items = (hasLinks ? child : []).map((link, idx) => (
    <Link to={link.path} key={`menu-${link.path}-${idx}`} prefetch="none">
      <UnstyledButton
        className={cn(
          "font-normal w-full !py-2 !pl-2 !ml-8 !text-sm",
          "!text-[var(--mantine-color-black)]",
          "!border-l !border-solid !border-[var(--mantine-color-gray-3)]",
          "hover:!text-[var(--mantine-color-tmBlue-6)]",
          isPathnameMatch(link.path)
            ? "!text-[var(--mantine-color-tmBlue-6)] !bg-[var(--mantine-color-gray-3)]"
            : "hover:!bg-[var(--mantine-color-gray-2)]",
          isPathnameMatch(link.path)
            ? "!border-l !border-solid !border-[var(--mantine-color-tmBlue-6)]"
            : ""
        )}
      >
        <Box style={{ display: "flex", alignItems: "center" }}>
          {link.icon ? (
            <ThemeIcon
              variant="white"
              className="!bg-transparent"
              color={isPathnameMatch(link.path) ? "tmBlue" : "black"}
              size={30}
            >
              <Icon
                icon={`tabler:${link.icon}`}
                style={{ width: rem(18), height: rem(18) }}
              />
            </ThemeIcon>
          ) : null}
          <Box ml="md">{link.label}</Box>
        </Box>
      </UnstyledButton>
    </Link>
  ));

  return (
    <>
      <UnstyledButton
        onClick={onClickParentMenu}
        className={cn(
          "w-full font-semibold block no-underline !px-4 !py-[0.625rem] text-sm text-[var(--mantine-color-text)] rounded-l",
          "hover:!text-[var(--mantine-color-black)]",
          isPathnameInclude(menu?.path)
            ? "!text-bill-orange-500 !bg-bill-orange-50"
            : "hover:!bg-bill-orange-50 "
        )}
        style={
          isPathnameInclude(menu?.path)
            ? { borderRight: "3px solid #F77E3D" }
            : undefined
        }
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <ThemeIcon variant="transparent" size={30}>
              <Icon
                icon={`${menu?.icon || "help-square-rounded"}`}
                style={{ width: rem(20), height: rem(20) }}
                className={`${
                  isPathnameInclude(menu.path)
                    ? "!text-bill-orange-500"
                    : "!text-[var(--mantine-color-text)]"
                }`}
              />
            </ThemeIcon>
            <Box ml="md" className="uppercase">
              {menu?.label}
            </Box>
          </Box>
          {hasLinks ? (
            <Icon
              icon="tabler:chevron-right"
              className={cn(
                "transition-transform duration-200",
                "w-6 h-6",
                opened ? "rotate-90" : "rotate-0",
                "stroke-[1.5]"
              )}
            />
          ) : null}
        </Group>
      </UnstyledButton>
      {hasLinks ? (
        <Collapse in={opened} className="overflow-x-hidden">
          {items}
        </Collapse>
      ) : null}
    </>
  );
}
