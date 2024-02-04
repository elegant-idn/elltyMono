import Box from "@mui/material/Box";
import { FC } from "react";
interface FormDivider {
  or: string;
}

const FormDivider: FC<React.PropsWithChildren<FormDivider>> = ({ or }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
        span: {
          padding: "0 10px",
          fontSize: ".75rem",
        },
      }}
    >
      <Box
        sx={{
          height: "1px",
          width: "100%",
          backgroundColor: "#E1E5ED",
          borderRadius: "1px",
        }}
      ></Box>
      <span>{or}</span>
      <Box
        sx={{
          height: "1px",
          width: "100%",
          backgroundColor: "#E1E5ED",
          borderRadius: "1px",
        }}
      ></Box>
    </Box>
  );
};

export default FormDivider;
