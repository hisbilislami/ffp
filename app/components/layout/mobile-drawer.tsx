import { Drawer } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";
import { cn } from "~/utils/tw";
import { appModuleData } from "./sidebar";
import { LinksGroup } from "./links-group";

type Props = {
  opened: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
};

export const MobileDrawer = ({ onClose, opened }: Props) => {
  return (
    <Drawer
      opened={opened}
      onClose={() => onClose(false)}
      transitionProps={{
        transition: "rotate-left",
        duration: 150,
        timingFunction: "linear",
      }}
    >
      <div
        className={cn(
          "flex-1 bg-white flex flex-col transition-transform duration-300 overflow-hidden",
          "w-[calc(256px - 68px)] translate-x-0"
        )}
      >
        <div className="gap-2 flex flex-col px-3 py-4 overflow-y-scroll bg-white">
          {appModuleData.map((menu, idx) => {
            const { pages, ...module } = menu;
            return (
              <LinksGroup
                menu={module}
                child={pages}
                key={`menu-p-${menu.label}-${idx}`}
                onNavigate={() => onClose(false)}
              />
            );
          })}
        </div>
      </div>
    </Drawer>
  );
};
