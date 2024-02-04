import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import axios from "axios";
import { Api } from "../../api";
import { useCookies } from "react-cookie";
import gaEvent from "../../utils/gaEvent";
import { useDispatch } from "react-redux";
import { fetchUser } from "../../redux/asyncActions";

// @ts-ignore
const PaypalSuccessPage: NextPage = () => {
  const router = useRouter();
  const [cookie] = useCookies();
  const [paypalPrices, setPaypalPrices] = React.useState<any>();
  const dispatch = useDispatch();

  React.useEffect(() => {
    const axiosHeaders = {
      headers: {
        Authorization: cookie.user_token,
      },
    };

    Api.get("/paypal-pay/get-plans", axiosHeaders)
      .then((result) => {
        // console.log(result.data);
        setPaypalPrices(result.data);
      })
      .catch((reason) => {
        console.log(reason);
      });
  }, []);

  React.useEffect(() => {
    if (router.query.subscription_id && paypalPrices) {
      const { subscription_id, ba_token, userId } = router.query;
      Api.get(
        `/paypal-pay/success?subscription_id=${subscription_id}&ba_token=${ba_token}&userId=${userId}`
      )
        .then((result) => {
          // console.log(result.data);
          if (result.data.status == 200) {
            // console.log(result);
            const monthlyPlan = paypalPrices.find(
              (s: any) => s.interval == "monthly"
            );

            if (monthlyPlan == result.data.data.plan_id) {
              // console.log("monthly");
              gaEvent("complete_checkout");
              gaEvent("complete_checkout_monthly");
              gaEvent("complete_checkout_monthly_paypal");
            } else {
              // console.log("annual");
              gaEvent("complete_checkout");
              gaEvent("complete_checkout_annual");
              gaEvent("complete_checkout_annual_paypal");
            }

            dispatch(fetchUser(cookie.user_token) as any);
            router.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          // router.push('/')
        });
    }
  }, [router.query, paypalPrices]);

  return <div>Loading...</div>;
};

export default PaypalSuccessPage;
