import { Icon } from "@iconify/react/dist/iconify.js";
import {
  ActionIcon,
  Avatar,
  Group,
  UnstyledButton,
  Menu,
  TextInput,
} from "@mantine/core";
import { Form, Link } from "@remix-run/react";

import { cn } from "~/utils/style";

export function Topnavbar({
  username = "",
  email,
}: {
  username: string;
  email: string;
}) {
  return (
    <header
      className={cn(
        "z-10 bg-white py-3 px-[44px] w-[95%] shadow-sm",
        "flex justify-between items-center rounded-2xl"
      )}
    >
      <Group className="py-2">
        <TextInput
          size="xs"
          leftSection={
            <Icon
              icon="tabler:search"
              className="w-4 h-4"
              strokeWidth={5}
            ></Icon>
          }
          placeholder="Cari di sini"
          autoComplete="off"
          classNames={{
            root: "px-2",
          }}
          onKeyDown={() => {}}
          variant="filled"
          radius="lg"
          aria-label="pencarian"
          name="s"
          ref={() => {}} // Attach ref to the input field
        />
      </Group>

      <div className="flex gap-3">
        <ActionIcon
          variant="gradient"
          size="xl"
          className="rounded-full"
          aria-label="Gradient action icon"
          gradient={{ from: "#28B87A", to: "#3BC9DB", deg: 180 }}
        >
          <Icon icon="tabler:bell-ringing" className="h-6 w-6" />
        </ActionIcon>

        <Menu shadow="md" width={200}>
          <Menu.Target>
            <UnstyledButton className="block w-full bg-white rounded-full p-1">
              <Group>
                <Avatar
                  radius="xl"
                  size={36}
                  color="tmGreen"
                  variant="gradient"
                >
                  {username[0].toUpperCase()}
                  {email}
                </Avatar>
              </Group>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>{username}</Menu.Label>
            <Menu.Item
              leftSection={<Icon icon="tabler:user" className="w-4 h-4" />}
            >
              <Link to="/app/profile">Profile</Link>
            </Menu.Item>
            <Menu.Divider />
            <Form method="post" action="/auth/logout">
              <UnstyledButton type="submit" className="w-full">
                <Menu.Item
                  color="red"
                  leftSection={
                    <Icon icon="tabler:logout" className="w-4 h-4" />
                  }
                >
                  Logout
                </Menu.Item>
              </UnstyledButton>
            </Form>
          </Menu.Dropdown>
        </Menu>
      </div>
    </header>
  );
}
