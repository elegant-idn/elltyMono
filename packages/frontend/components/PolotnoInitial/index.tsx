import React from "react";
import { useRouter } from "next/router";
// import Image from 'next/image'
// import '@blueprintjs/icons/lib/css/blueprint-icons.css';
// import '@blueprintjs/core/lib/css/blueprint.css';
// import '@blueprintjs/popover2/lib/css/blueprint-popover2.css';
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Api } from "../../api";
import { createStore } from "polotno/model/store";
// @ts-ignore polotno issue
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { SidePanel } from "polotno/side-panel";
import { Workspace } from "polotno/canvas/workspace";
import { setTranslations } from "polotno/config";
import { useTranslation } from "next-i18next";
import setPolotnoI18n from "../../utils/design/setPolotnoI18n";

interface PolotnoProps {
  userToken: string;
  templateId: string | undefined;
  categoryId: string | undefined;
}

// @ts-ignore
// const TextToolbar = observer(({ store }) => {
//   const element = store.selectedElements[0];

//   return (
//     <FontFamilyInput elements={store.selectedElements} store={store} />
//   );
// });

const PolotnoInitial: React.FC<React.PropsWithChildren<PolotnoProps>> = ({
  userToken,
  templateId,
  categoryId,
}) => {
  const { t }: any = useTranslation("design");
  const i18n = t("content", { returnObjects: true });

  const [cookie, setCookie] = useCookies();
  const router = useRouter();
  const [store, setStore] = React.useState<any>("");
  const inputNameDefaultValue = i18n.input;
  const [designName, setDesignName] = React.useState<string>(
    inputNameDefaultValue
  );
  const [isLoadingSave, setIsLoadingSave] = React.useState<boolean>(false);

  const dispatch = useDispatch();
  const pageSizes = useSelector(
    (state: RootState) => state.designReducer.initialSizes
  );
  const defaultSection = useSelector(
    (state: RootState) => state.designReducer.initialSection
  );
  const sidePanelDefaultOpen = useSelector(
    (state: RootState) => state.designReducer.sidePanelDefaultOpen
  );
  const [defaultSectionIsSet, setDefaultSectionIsSet] =
    React.useState<boolean>(false);
  const [image, setImage] = React.useState("");
  const [userTemplateId, setUserTemplateId] = React.useState("");

  React.useEffect(() => {
    setPolotnoI18n(i18n.polotno, setTranslations);

    const storeLib = createStore({
      key: "5WZgkgr7CZj0XSGxxdjj",
      showCredit: false,
    });
    setStore(storeLib);
    const page = storeLib.addPage();

    // the sizes are taken from the redux store
    // by default, 1080x1080, the remaining sizes are delivered to the store from the /templates page
    // storeLib.setSize(+pageSizes.width, +pageSizes.height)
    storeLib.setSize(
      Number(router.query.width) || 1080,
      Number(router.query.height) || 1080
    );

    // console.log(router);

    const loadInitialJson = async () => {
      const axiosHeaders = {
        headers: {
          Authorization: userToken,
        },
      };

      const createUserTemplate = (
        templateTitle: string = "Untitled design"
      ) => {
        if (!userToken) return;

        // an empty user design is created and stored in the database
        // console.log(storeLib.toJSON());
        const json = storeLib.toJSON();

        // const json = JSON.stringify(storeBlank);
        const jsonStr = JSON.stringify(json);
        const blobTemplate = new Blob([jsonStr], {
          type: "application/json",
        });
        const fileTemplate = new File([blobTemplate], "template.json", {
          type: "application/json",
        });

        let formData = new FormData();
        formData.append("template", fileTemplate);
        formData.append("title", templateTitle);

        Api.post("/user/templates/create", formData, axiosHeaders)
          .then(async (result) => {
            // console.log(result);
            const userTemplateId = result.data._id;

            // a preview for the template is being created
            const previewUrl = await storeLib.toDataURL();
            let blob = await fetch(previewUrl).then((r) => r.blob());
            const filePreview = new File([blob], "template.png", {
              type: "image/png",
            });

            let formDataPreview = new FormData();
            formDataPreview.append("preview", filePreview);

            Api.patch(
              `/user/templates/${userTemplateId}/preview`,
              formDataPreview,
              axiosHeaders
            )
              .then((result) => {
                // console.log(result);
                if (categoryId) {
                  router.replace(`/design/${userTemplateId}/${categoryId}`);
                } else {
                  router.replace(`/design/${userTemplateId}`);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      };

      // user template is created either from an existing template
      // with its name,or an empty one with a default name
      await storeLib.waitLoading().then(() => {
        // console.log(templateId);
        if (templateId) {
          Api.get(`/templates/single/${templateId}`)
            .then((result) => {
              // console.log(result);
              Api.get(result.data.data)
                .then(async (resultJson) => {
                  // console.log(resultJson);
                  storeLib.loadJSON(resultJson.data);
                  await storeLib.waitLoading();
                  // createUserTemplate(result.data.title);
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {});
        } else {
          createUserTemplate();
        }
      });

      await storeLib.waitLoading().then(() => {
        // createUserTemplate()
        // saving the template to the user
        // if(router.query.create !== undefined) {
        //   autosave(0, storeLib, String(router.query.type), cookieUser.accessToken, isLoadingSave, setIsLoadingSave)
        //   return
        // }
        // const polotnoStore = localStorage.getItem('polotnoStore')
        // if (polotnoStore) {
        //   storeLib.loadJSON(JSON.parse(polotnoStore))
        //   return;
        // }
      });
    };

    loadInitialJson();

    // request saving operation on any changes
    storeLib.on("change", () => {
      // requestSave()
      // autosave(3000, storeLib, cookieUser.accessToken, isLoadingSave, setIsLoadingSave)
    });

    if (router.query.type) {
      // window.history.replaceState(null, '', `/design`)
      // router.replace(`/design`)
    }
  }, []);

  // in order to open the sidePanel on mobile devices (always open on PC)
  React.useEffect(() => {
    store &&
      !defaultSectionIsSet &&
      sidePanelDefaultOpen &&
      (store.openSidePanel(defaultSection), setDefaultSectionIsSet(true));
  }, [store]);

  return (
    store && (
      <div style={{ display: "none" }}>
        <PolotnoContainer>
          <SidePanelWrap>
            <SidePanel store={store} />
          </SidePanelWrap>
          <WorkspaceWrap>
            <Toolbar store={store} />
            <Workspace store={store} />
            <ZoomButtons store={store} />
          </WorkspaceWrap>
        </PolotnoContainer>
      </div>
    )
  );
};

export default PolotnoInitial;
