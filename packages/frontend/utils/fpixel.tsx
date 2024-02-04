export const FB_PIXEL_ID = "697033498123877";

export const pageview = () => {
  // @ts-ignore
  if (window.fbq) {
    // @ts-ignore
    window.fbq("track", "PageView");
  } else {
    const intervalId = setInterval(() => {
      // @ts-ignore
      if (!window.fbq) {
        return;
      }

      // @ts-ignore
      window.fbq("track", "PageView");
      clearInterval(intervalId);
    }, 1000);
  }
};

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name: any, options = {}) => {
  // @ts-ignore
  window.fbq("track", name, options);
};
