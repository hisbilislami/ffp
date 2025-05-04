import {
  Button,
  createTheme,
  Input,
  MantineColorsTuple,
  rem,
} from "@mantine/core";

const billOrange: MantineColorsTuple = [
  "#FFF8F4",
  "#FFEEE4",
  "#FFE1D0",
  "#FFC7AA",
  "#FFA57C",
  "#F77E3D",
  "#E5621E",
  "#C24E16",
  "#A03D10",
  "#80300C",
];

const billBlue: MantineColorsTuple = [
  "#F3F6FC",
  "#E6EDF9",
  "#D0DDF4",
  "#A9C0E9",
  "#7B9DDB",
  "#4D73C9",
  "#3759AE",
  "#284492",
  "#1C3276",
  "#12235C",
];

const billGreen: MantineColorsTuple = [
  "#F1FBF4",
  "#E3F7E9",
  "#D0F1DC",
  "#ADDCBF",
  "#84CA9D",
  "#5AC17F",
  "#44A968",
  "#329152",
  "#21783E",
  "#165F2F",
];

const billYellow: MantineColorsTuple = [
  "#FEFBF2",
  "#FEF6E0",
  "#FDF0C8",
  "#FADA8F",
  "#F9C74F",
  "#F0B12A",
  "#DA9A1A",
  "#B67D13",
  "#94640E",
  "#76500A",
];

const billGray: MantineColorsTuple = [
  "#F9FAFB",
  "#F5F6F8",
  "#EBEDF0",
  "#DFE2E6",
  "#C5C8CE",
  "#9CA0A8",
  "#8A8A8A",
  "#61656D",
  "#4A4D53",
  "#333333",
];

const billDark: MantineColorsTuple = [
  "#C1C2C5",
  "#A6A7AB",
  "#909296",
  "#5C5F66",
  "#373A40",
  "#2C2E33",
  "#25262B",
  "#1A1B1E",
  "#141517",
  "#101113",
];

export const theme = createTheme({
  primaryColor: "billOrange",
  primaryShade: 5,
  colors: {
    billOrange: billOrange,
    billBlue: billBlue,
    billGreen: billGreen,
    billYellow: billYellow,
    billGray: billGray,
    billDark: billDark,
  },
  fontFamily: "inherit",
  components: {
    Button: Button.extend({
      vars: (theme, props) => {
        if (props.size === "sm") {
          return {
            root: {
              "--button-height": rem(32),
              "--button-padding-x": rem(16),
            },
          };
        }

        if (props.size === "md") {
          return {
            root: {
              "--button-height": rem(40),
              "--button-padding-x": rem(20),
            },
          };
        }

        if (props.size === "lg") {
          return {
            root: {
              "--button-height": rem(48),
              "--button-padding-x": rem(24),
            },
          };
        }

        return {
          root: {
            "--button-height": rem(32),
            "--button-padding-x": rem(16),
          },
        };
      },
    }),
    Input: Input.extend({
      vars: (theme, props) => {
        if (props.size === "sm") {
          return {
            wrapper: {
              "--input-height": rem(32),
            },
          };
        }

        if (props.size === "md") {
          return {
            wrapper: {
              "--input-height": rem(40),
            },
          };
        }

        return {
          wrapper: {
            "--input-height": rem(32),
          },
        };
      },
    }),
  },
});
