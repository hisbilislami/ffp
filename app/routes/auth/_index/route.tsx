import { Button, Flex, PasswordInput, TextInput } from "@mantine/core";

const Signin = () => {
  return (
    <Flex>
      <div>
        <TextInput
          label="Username"
          placeholder="Username"
          withAsterisk
          name="username"
        />
        <PasswordInput
          label="Password"
          placeholder="***"
          withAsterisk
          name="Password"
        />
        <Button type="submit">Submit</Button>
      </div>
    </Flex>
  );
};

export default Signin;
