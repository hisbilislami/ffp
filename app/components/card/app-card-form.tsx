import { Card, Text } from "@mantine/core";
import { ReactNode } from "react";

interface AppCardFormProps {
  children: ReactNode;
  title: string;
  isForm: boolean;
  actionButtons?: ReactNode;
  ctButtonClassName?: string;
  borderTop?: boolean;
}

function AppCardForm({
  children,
  title,
  isForm = false,
  actionButtons,
  ctButtonClassName,
}: AppCardFormProps) {
  return (
    <div className="h-full w-full px-5 py-5 rounded-2xl">
      <Card
        className={`flex flex-col gap-6 w-full bg-white rounded-2xl p-0 shadow-sm`}
        radius="lg"
        shadow="sm"
      >
        <div className={`px-5 py-2 w-full`}>
          <Text className="text-black text-2xl capitalize" size="xl" fw={600}>
            {title}
          </Text>
        </div>
        {isForm ? (
          <>
            {children}
            {actionButtons && (
              <FormActionButton
                actionButtons={actionButtons}
                ctButtonClassName={ctButtonClassName}
              />
            )}
          </>
        ) : (
          <div className="p-5">{children}</div>
        )}
      </Card>
    </div>
  );
}

export function FormActionButton({
  actionButtons,
  ctButtonClassName,
}: {
  actionButtons?: ReactNode;
  ctButtonClassName?: string;
}) {
  return (
    <>
      <div
        className={`bg-white rounded-b-xl py-2 px-8 w-full border-t border-t-gray-200 border-b-0 ${ctButtonClassName} flex justify-end col-span-full`}
      >
        {actionButtons}
      </div>
    </>
  );
}

export default AppCardForm;
