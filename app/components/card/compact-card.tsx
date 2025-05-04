import { Card, CardProps, Group, Text } from "@mantine/core";
import { ReactNode } from "react";

interface CompactCardProps extends CardProps {
  title: string;
  children: ReactNode;
}
function CompactCard(props: CompactCardProps) {
  const { title, children, ...rest } = props;
  return (
    <Card radius="lg" {...rest}>
      <Card.Section withBorder inheritPadding py={12} px={24} bg="gray.1">
        <Group justify="space-between">
          <Text fw={500}>{title}</Text>
        </Group>
      </Card.Section>
      {children}
    </Card>
  );
}

export default CompactCard;
