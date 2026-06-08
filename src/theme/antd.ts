import { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    colorPrimary: "#F28B23",
    borderRadius: 3,
    fontFamily: "var(--font-baiJamjuree), var(--font-hindSiliguri)",
  },
  components: {
    Collapse: {
      contentBg: "#fff",
      headerBg: "#fff",
    },
    Checkbox: {
      colorBorder: "gray",
    },
    Rate: {
      starSize: 13,
      starColor: "#404040",
    },
  },
};

export { theme };
