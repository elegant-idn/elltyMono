import Drawer from "@mui/material/Drawer";
import Popper from "@mui/material/Popper";
import { StoreType } from "polotno/model/store";
import React from "react";
import { DownloadDropdownContent } from "./DownloadDropdownContent";

interface DownloadDropdownProps {
  store: StoreType;
  downloadTooltip: any;
  downloadTooltipRef: any;
  isOpenDrawer?: boolean;
  setIsOpenDrawer?: (value: boolean) => void;
  mobile?: boolean;
  downloadName?: string;
}

const DownloadDropdown: React.FC<
  React.PropsWithChildren<DownloadDropdownProps>
> = ({
  store,
  downloadTooltip,
  downloadTooltipRef,
  isOpenDrawer = false,
  setIsOpenDrawer = () => false,
  mobile = false,
  downloadName = "Untitled",
}) => {
  return mobile ? (
    <Drawer
      anchor={"bottom"}
      ref={downloadTooltipRef}
      onClose={() => setIsOpenDrawer(false)}
      open={!!isOpenDrawer}
      sx={{
        "& .MuiDrawer-paper": {
          bgcolor: "transparent",
          borderRadius: "16px 16px 0 0",
        },
      }}
    >
      <DownloadDropdownContent store={store} downloadName={downloadName} />
    </Drawer>
  ) : (
    <Popper
      ref={downloadTooltipRef}
      id="popper"
      open={!!downloadTooltip}
      anchorEl={downloadTooltip}
    >
      <DownloadDropdownContent store={store} downloadName={downloadName} />
    </Popper>
  );
};

export default DownloadDropdown;
