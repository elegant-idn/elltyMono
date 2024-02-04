import React from "react";
import s from "./DownloadDropdown.module.scss";
import clsx from "clsx";
import Select from "../../Select";
import * as unit from "polotno/utils/unit";
import { useTranslation } from "next-i18next";
import { Slider, styled, useMediaQuery } from "@mui/material";
import { useDispatch } from "react-redux";
import useTypedSelector from "../../../utils/useTypedSelector";
import { useCookies } from "react-cookie";
import {
  ChangeAuthFormAction,
  SetIsDownloadingAction,
  ToggleAuthModalAction,
  ToggleDownloadModalAction,
  ToggleRemainingDownloadsModalAction,
} from "../../../redux/actions";
import StatusBadge from "../../StatusBadge";
import BtnOutline from "../../BtnOutline";
import gaEvent from "../../../utils/gaEvent";
import { Api } from "../../../api";

const DownloadDropdownSlider = styled(Slider)(({ theme }) => ({
  color: "#3880ff",
  height: 3,
  padding: "10px 0",
  "&.disabled": {
    opacity: 0.4,
    // cursor: 'pointer'
  },
  "& .MuiSlider-rail": {
    opacity: 1,
    backgroundColor: "#E1E5ED",
    borderRadius: "10px",
  },
  "& .MuiSlider-track": {
    opacity: 1,
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 10,
    width: 10,
    backgroundColor: "#fff",
    boxShadow: "unset ",
    border: "2px solid var(--blue-color)",
    "&:focus, &:hover, &.Mui-active": {
      boxShadow: "unset",
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        boxShadow: "unset",
      },
    },
    "&:before, &:after": {
      width: 10,
      height: 10,
    },
  },
  "& .MuiSlider-valueLabel": {
    fontSize: 12,
    fontWeight: "normal",
    top: -6,
    backgroundColor: "unset",
    // color: theme.palette.text.primary,
    "&:before": {
      display: "none",
    },
    "& *": {
      background: "transparent",
      color: "#000",
    },
  },
  "& .MuiSlider-mark": {
    backgroundColor: "#bfbfbf",
    height: 8,
    width: 1,
    "&.MuiSlider-markActive": {
      opacity: 1,
      backgroundColor: "currentColor",
    },
  },
}));

interface DownloadDropdownContentProps {
  store: any;
  downloadName: string;
}

export const DownloadDropdownContent: React.FC<
  DownloadDropdownContentProps
> = ({ store, downloadName = "Untitled" }) => {
  const { t }: any = useTranslation("design");
  const i18n = t("content", { returnObjects: true });
  const isMobile = useMediaQuery("(max-width: 500px)");
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.mainReducer.user);
  const [cookie, setCookie] = useCookies();

  const fileTypes = [
    {
      value: i18n.JPG,
      svg: "jpg",
      pro: false,
    },
    {
      value: i18n.PNG,
      svg: "png",
      pro: false,
    },
    {
      value: i18n.transparentPNG,
      svg: "png",
      pro: true,
    },
    {
      value: i18n.PDF,
      svg: "pdf",
      pro: false,
    },
  ];

  const allowJSONFileType = ["admin", "designer"].includes(user.role);

  if (allowJSONFileType) {
    fileTypes.push({
      value: i18n.JSON,
      svg: "pdf",
      pro: false,
    });
  }

  const [downloadFileType, setDownloadFileType] = React.useState<string>("PNG");
  const [downloadQuality, setDownloadQuality] = React.useState<number>(1);

  const downloadDesign = async (method: string) => {
    gaEvent("download_template");

    switch (method) {
      case i18n.JPG:
        await store.saveAsImage({
          fileName: `${downloadName}.jpg`,
          mimeType: "image/jpg" as any,
          pixelRatio: downloadQuality,
          pageId: store.activePage?.id,
        });
        gaEvent("download_template_jpg");
        break;
      case i18n.PNG:
        await store.saveAsImage({
          fileName: downloadName,
          mimeType: "image/png",
          pixelRatio: downloadQuality,
          pageId: store.activePage?.id,
        });
        gaEvent("download_template_png");
        break;
      case i18n.transparentPNG:
        await store.saveAsImage({
          fileName: downloadName,
          ignoreBackground: true,
          mimeType: "image/png",
          pixelRatio: downloadQuality,
          pageId: store.activePage?.id,
        });
        gaEvent("download_template_transparent_png");
        break;
      case i18n.PDF:
        await store.saveAsPDF({
          fileName: downloadName,
          dpi: store.dpi / downloadQuality,
          pixelRatio: 2 * downloadQuality,
          pageId: store.activePage?.id,
        });
        gaEvent("download_template_pdf");
        break;
      case i18n.JSON:
        if (!allowJSONFileType) return;
        const jsonObject = store.toJSON();
        const a = document.createElement("a");
        a.href = URL.createObjectURL(
          new Blob([JSON.stringify(jsonObject, null, 2)], {
            type: "text/plain",
          })
        );
        a.setAttribute("download", `${downloadName}.json`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        gaEvent("download_template_json");
        break;
      default:
        await store.saveAsImage({
          fileName: `${downloadName}.jpg`,
          mimeType: "image/jpg" as any,
          pixelRatio: downloadQuality,
          pageId: store.activePage?.id,
        });
        gaEvent("download_template_jpg");
        break;
    }
  };

  const handleClickDownload = (method: string) => {
    // console.log(downloadQuality);
    if (user.email === null) {
      dispatch(ToggleAuthModalAction(null));
      dispatch(ChangeAuthFormAction("logIn"));
      return;
    }

    const axiosHeader = {
      headers: {
        Authorization: cookie.user.accessToken,
      },
    };

    // Api.get("/user/download", axiosHeader)
    //   .then(async (result) => {
    //     if (!isMobile) {
    //       dispatch(ToggleDownloadModalAction(true));
    //     }

    //     if (result.data.canDownload) {
    //       dispatch(SetIsDownloadingAction(true));
    //       await downloadDesign(method);
    //       dispatch(SetIsDownloadingAction(false));

    //       const newCookieUser = { ...cookie.user };
    //       newCookieUser.remainingDownloads = result.data.downloadsLeft || 0;
    //       setCookie("user", newCookieUser, {
    //         path: "/",
    //         expires: new Date(newCookieUser.expiresIn),
    //       });
    //     }

    //     if (user.plan == "free" && isMobile) {
    //       dispatch(ToggleRemainingDownloadsModalAction(true));
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    if (!isMobile) {
      dispatch(ToggleDownloadModalAction(true));
    }
    dispatch(SetIsDownloadingAction(true));
    downloadDesign(method).then(() => dispatch(SetIsDownloadingAction(false)));
  };

  return (
    <div className={clsx(s.root)}>
      <span className={s.text}>{i18n.fileType}</span>

      <div className={s.select}>
        <Select
          value={downloadFileType}
          elements={fileTypes}
          onSelect={(item: any) => {
            setDownloadFileType(item.value);
            setDownloadQuality(1);
          }}
          downloadDropdown
        />
      </div>

      {downloadFileType !== "JSON" && (
        <div className={s.slider}>
          <div className={s.sizeRow}>
            <span
              className={clsx(
                user.plan !== "pro" && s.disabled,
                user.plan !== "pro" && "unselectable"
              )}
            >
              {i18n.size} x {downloadQuality} (
              {downloadFileType === "PDF" && (
                <>
                  {unit.pxToUnitRounded({
                    px: store.width,
                    dpi: store.dpi / downloadQuality,
                    precious: 0,
                    unit: "mm",
                  })}
                  x
                  {unit.pxToUnitRounded({
                    px: store.height,
                    dpi: store.dpi / downloadQuality,
                    precious: 0,
                    unit: "mm",
                  })}{" "}
                  {i18n.mm}
                </>
              )}
              {downloadFileType !== "PDF" && (
                <>
                  {Math.round(store.width * downloadQuality)}x
                  {Math.round(store.height * downloadQuality)} {i18n.px}
                </>
              )}
              )
            </span>
            <StatusBadge />
          </div>

          <DownloadDropdownSlider
            value={downloadQuality}
            onChange={(event, value) => {
              if (user.plan === null) {
                dispatch(ChangeAuthFormAction("logIn"));
                dispatch(ToggleAuthModalAction(null));
                return;
              }

              if (user.plan === "free") {
                dispatch(ToggleRemainingDownloadsModalAction(true));
                return;
              }

              setDownloadQuality(Number(value));
            }}
            defaultValue={downloadQuality}
            step={0.2}
            min={0.2}
            max={3}
            className={clsx(user.plan !== "pro" && "disabled")}
          />
          {/* <Slider
            value={downloadQuality}
            onChange={(event, value) => {
              setDownloadQuality(Number(value))
            }}
            valueLabelDisplay="auto"
            defaultValue={downloadQuality}
            step={0.2}
            min={0.2}
            max={3}
          /> */}
        </div>
      )}

      <div className={s.downloadBtnPopper}>
        <BtnOutline
          onClick={() => {
            handleClickDownload(downloadFileType);
          }}
          variant="yellow"
        >
          {i18n.download}
        </BtnOutline>
      </div>
    </div>
  );
};
