import { Api } from "../../api";

const autosave = async (
  store: any,
  userTemplateId: string | undefined,
  jwt: string | undefined,
  isLoading: boolean,
  setIsLoading: any,
  templateTitle: string,
  temporaryUserToken?: string | null,
  setUserTemplateId?: (templateId: string) => unknown,
  meta?: { categoryId?: string; height?: string; width?: string }
) => {
  if (isLoading) return;
  setIsLoading(true);

  const json = store.toJSON();

  const jsonStr = JSON.stringify(json);
  const blobTemplate = new Blob([jsonStr], { type: "application/json" });

  const fileTemplate = new File([blobTemplate], "template.json", {
    type: "application/json",
  });

  const formData = new FormData();
  const formDataPreview = new FormData();

  if (temporaryUserToken) {
    // this parameter should be appended before the file to be populated on a backend
    formData.append("temporaryUserToken", temporaryUserToken);
    formDataPreview.append("temporaryUserToken", temporaryUserToken);
  }

  formData.append("template", fileTemplate);
  formData.append("title", templateTitle);

  const previewUrl = await store.toDataURL();
  let blob = await fetch(previewUrl).then((r) => r.blob());
  const filePreview = new File([blob], "template.png", {
    type: "image/png",
  });

  formDataPreview.append("preview", filePreview);

  formData.append("height", store.height);
  formData.append("width", store.width);

  const axiosHeaders = {
    headers: {
      Authorization: jwt ?? "",
    },
  };

  try {
    if (userTemplateId) {
      await Api.patch(
        `/user/templates/save/${userTemplateId}/0`,
        formData,
        axiosHeaders
      );

      await Api.patch(
        `/user/templates/${userTemplateId}/preview`,
        formDataPreview,
        axiosHeaders
      );
    } else {
      if (temporaryUserToken || jwt) {
        if (meta?.categoryId) {
          formData.append("categoryId", meta.categoryId);
        }

        const result = await Api.post(
          "/user/templates/create",
          formData,
          axiosHeaders
        );

        const userTemplateId = result.data._id;
        setUserTemplateId?.(userTemplateId);

        await Api.patch(
          `/user/templates/${userTemplateId}/preview`,
          formDataPreview,
          axiosHeaders
        );
      }
    }
  } catch (err) {
    console.log(err);
  }

  setIsLoading(false);
};

export default autosave;
