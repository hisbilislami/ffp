import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, FocusTrap, Modal, ScrollArea } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";

type Props = {
  opened: boolean;
  size?: string;
  paddingContent?: string;
  onClose: Dispatch<SetStateAction<boolean>>;
  onEdit?: () => void;
  onDelete?: () => void;
};

const OptionDialog = ({
  opened,
  size = "xl",
  paddingContent = "p-4",
  onEdit,
  onDelete,
  onClose,
}: Props) => {
  return (
    <Modal.Root
      opened={opened}
      closeOnClickOutside={true}
      size={size}
      onClose={() => onClose(false)}
      centered
      padding={0}
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <Modal.Overlay backgroundOpacity={0.25} blur={5} />

      <Modal.Content radius="md">
        <FocusTrap.InitialFocus />
        <Modal.Body className="bg-bill-gray-100">
          <div className={`${paddingContent} bg-white flex flex-col gap-2`}>
            {onEdit ? (
              <Button
                variant="gradient"
                gradient={{
                  from: "cyan",
                  to: "billGreen.5",
                  deg: 124,
                }}
                onClick={onEdit}
                leftSection={<Icon icon="tabler:pencil" />}
              >
                Edit
              </Button>
            ) : null}
            {onDelete ? (
              <Button
                variant="gradient"
                onClick={onDelete}
                leftSection={<Icon icon="tabler:trash" />}
                gradient={{
                  from: "red",
                  to: "billOrange.5",
                  deg: 124,
                }}
              >
                Delete
              </Button>
            ) : null}
          </div>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default OptionDialog;
