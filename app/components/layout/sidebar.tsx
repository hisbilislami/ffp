import { Icon } from "@iconify/react/dist/iconify.js";
import {
  ActionIcon,
  Image,
  Title,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";

import { cn } from "~/utils/style";

import { LinksGroup } from "./links-group";
import { AppModuleMenu } from "./types";

const appModuleData: AppModuleMenu[] = [
  {
    icon: "tabler:file-invoice",
    label: "Berkas",
    submodules: [
      { label: "Dashboard", icon: "", path: "/app", pages: [] },
      {
        label: "Dokumen",
        icon: "",
        path: "/app/documents/documents",
        pages: [],
      },
      { label: "e-KYC", icon: "", path: "/file/e-kyc", pages: [] },
      {
        label: "Pembelian e-Sign",
        icon: "",
        path: "file/buy-quota",
        pages: [],
      },
      {
        label: "Data Pasien & Pegawai",
        icon: "",
        path: "/file/data-subject",
        pages: [],
      },
    ],
  },
  {
    icon: "tabler:settings-2",
    label: "Pengaturan",
    submodules: [
      {
        label: "Profile",
        path: "",
        icon: "user-cog",
        pages: [
          {
            icon: "user-code",
            label: "Roles",
            path: "/app/setting/roles",
          },
          {
            icon: "menu-2",
            label: "Init Menu",
            path: "/app/setting/initial-menu",
          },
          {
            icon: "user-exclamation",
            label: "Informasi Pribadi",
            path: "/app/setting/personal-information",
          },
          {
            icon: "bell-ringing",
            label: "Notifikasi",
            path: "/app/setting/notification",
          },
          {
            icon: "credit-card",
            label: "Langganan",
            path: "/app/setting/subscribtion",
          },
        ],
      },
    ],
  },
];

export function Sidebar() {
  const [isMenuMinimize, minimizeMenuHandlrers] = useDisclosure();
  const [activeModule, setActiveModule] = useLocalStorage({
    key: "active-module",
    defaultValue: appModuleData[0],
  });

  const appModules = appModuleData.map((module) => (
    <Tooltip
      label={module.label}
      position="right"
      withArrow
      transitionProps={{ duration: 0 }}
      key={module.label}
    >
      <UnstyledButton
        onClick={() => setActiveModule(module)}
        className={cn(
          "rounded-lg flex items-center justify-center p-[10px]",
          "text-[var(--mantine-color-gray-7)] hover:bg-[var(--mantine-color-gray-0)]",
          module.label === activeModule.label
            ? "bg-tm-blue-100 text-tm-blue-600 hover:bg-tm-blue-100"
            : "",
        )}
      >
        <Icon icon={module.icon} className="h-6 w-6 stroke-[1.5]" />
      </UnstyledButton>
    </Tooltip>
  ));

  return (
    <nav
      className={cn(
        "w-full flex h-full",
        "border-r border-[var(--mantine-color-gray-3]",
        isMenuMinimize ? "max-w-[68px]" : "max-w-80",
      )}
    >
      <div
        className={cn(
          "w-[68px] flex flex-col gap-2 items-center justify-between",
          "bg-[var(--mantine-color-body)] z-[5]",
          "border-r border-[var(--mantine-color-gray-3]",
        )}
      >
        <div className="flex flex-col flex-1">
          <div
            className={cn(
              "w-full flex justify-center h-[68px] p-[12px]",
              "border-b border-[var(--mantine-color-gray-3]",
            )}
          >
            <Image src="/logo/e-sign-logo.svg" w={44} h={44} />
          </div>
          <div className="gap-2 flex flex-col px-3 py-4">{appModules}</div>
        </div>

        <div className="px-3 py-4 flex w-full">
          <ActionIcon
            variant="subtle"
            size="xl"
            color="tmBlue.5"
            className="rounded-lg"
            aria-label="sidebar minimize button"
            onClick={() =>
              isMenuMinimize
                ? minimizeMenuHandlrers.close()
                : minimizeMenuHandlrers.open()
            }
          >
            <Icon
              icon="tabler:chevrons-right"
              className={cn(
                "h-6 w-6 text-tm-blue-600",
                "transition-transform duration-300 ease-in-out",
                isMenuMinimize ? "-rotate-180" : "rotate-0",
              )}
            />
          </ActionIcon>
        </div>
      </div>
      <div
        className={cn(
          "flex-1 bg-[#F1F3F5] flex flex-col transition-transform duration-300 overflow-hidden",
          isMenuMinimize
            ? "-translate-x-full"
            : "w-[calc(256px - 68px)] translate-x-0",
        )}
      >
        <Title
          order={4}
          className={cn(
            "bg-[var(--mantine-color-body)] min-h-[68px] px-3 flex items-center",
            "border-b border-[var(--mantine-color-gray-3]",
          )}
        >
          {activeModule.label}
        </Title>
        <div className="gap-2 flex flex-col px-3 py-4 overflow-y-scroll">
          {activeModule.submodules.map((submodule, idx) => {
            const { pages, ...module } = submodule;
            return (
              <LinksGroup
                module={module}
                child={pages}
                key={`menu-p-${submodule.label}-${idx}`}
              />
            );
          })}
        </div>
      </div>
    </nav>
  );
}
