const gaEvent = (eventName: string, callback?: any) => {
  process.env.NODE_ENV === "production"
    ? // @ts-ignore
      window.gtag("event", eventName, {
        transport_type: "beacon",
        event_callback: function () {
          callback && callback();
        },
      })
    : // console.log('callback')
      callback && callback();
};

export default gaEvent;
