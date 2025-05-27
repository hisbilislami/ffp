import { Icon } from "@iconify/react/dist/iconify.js";

import { LinksGroup } from "./links-group";
import { AppModuleMenu } from "./types";

import { cn } from "~/utils/style";

const appModuleData: AppModuleMenu[] = [
  {
    icon: "tabler:file-invoice",
    label: "Planning",
    path: "/app/planning",
    pages: [
      {
        label: "Dashboard",
        icon: "",
        path: "/app/planning/",
        pages: [],
      },
      {
        label: "Budget Tracker",
        icon: "",
        path: "/app/planning/budget-tracker-lists",
        pages: [],
      },
    ],
  },
  {
    icon: "tabler:settings-2",
    label: "Setting",
    path: "/app/setting",
    pages: [
      {
        icon: "user-exclamation",
        label: "User Profile",
        path: "/app/setting/personal-information",
      },
      {
        icon: "users",
        label: "List Users",
        path: "/app/setting/user",
      },
    ],
  },
];

export function Sidebar() {
  return (
    <nav
      className={cn(
        "w-full flex h-full bg-white",
        "border-r border-[var(--mantine-color-gray-3)]",
        "w-80"
      )}
    >
      <div
        className={cn(
          "flex-1 bg-white flex flex-col transition-transform duration-300 overflow-hidden",
          "w-[calc(256px - 68px)] translate-x-0"
        )}
      >
        <div
          className={cn(
            "w-full flex justify-center h-[68px] p-[12px] bg-white"
          )}
        >
          <Icon
            icon="tabler:coin-rupee"
            width={60}
            height={60}
            className="text-bill-dark-400"
          />
        </div>
        <div className="gap-2 flex flex-col px-3 py-4 overflow-y-scroll bg-white">
          {appModuleData.map((menu, idx) => {
            const { pages, ...module } = menu;
            return (
              <LinksGroup
                menu={module}
                child={pages}
                key={`menu-p-${menu.label}-${idx}`}
              />
            );
          })}
        </div>
      </div>
    </nav>
  );
}
