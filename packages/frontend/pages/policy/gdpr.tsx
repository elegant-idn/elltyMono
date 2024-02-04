import Head from "next/head";
import type { NextPage } from "next";
import s from "../../styles/Policy.module.scss";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import PolicyLayout from "../../components/Layouts/PolicyLayout";
import Link from "../../components/Link";
import PageLayout from "../../components/Layouts/PageLayout";

interface PolicyProps {
  cookieUser: any;
  userToken: string;
}

const PrivacyPolicy: NextPage<PolicyProps> = ({ cookieUser, userToken }) => {
  const { t }: any = useTranslation("index");
  const i18n = t("policy.gdprPage", { returnObjects: true });

  return (
    <PageLayout userToken={userToken}>
      <Head>
        <title>{i18n.headTitle}</title>
        <meta
          name="description"
          content="We recognise that you have an interest in our collection and use of your personal information via our website, which is located at our website."
        />
        {/* <meta name="robots" content="noindex, nofollow" /> */}
      </Head>
      <PolicyLayout
        userToken={userToken}
        cookieUser={cookieUser}
        authorized={cookieUser.accessToken ? true : false}
        title="GDPR"
        routes={[
          {
            path: "/",
            title: "Home",
          },
          {
            path: "/policy/",
            title: "Policies and Terms",
          },
          {
            path: "/policy/gdpr",
            title: "GDPR",
          },
        ]}
      >
        <div className={s.content}>
          <div className={s.date}>
            <div className={s.dateTitle}>Effective Date:</div>
            <div className={s.dateText}>November 10, 2021</div>
          </div>

          <h3>1. Introduction</h3>
          <p>
            We recognise that you have an interest in our collection and use of
            your personal information via our website, which is located at{" "}
            <a href="https://www.ellty.com">our Website</a>. We have implemented
            this Privacy Policy in order to be open and transparent about how we
            collect, hold, and use your personal information, and under what
            circumstances we may disclose or transfer your personal information.
            This Privacy Policy also outlines your rights under the General Data
            Protection Regulation (GDPR).
          </p>
          <p>
            Please note that this Privacy Policy forms part of the Terms of Use
            document, which is displayed at the footer of each page of our
            Website.
          </p>
          <p>
            As a resident of a country that the GDPR applies to our activities,
            you have particular rights with respect to your personal
            information. This Privacy Policy sets out information about:
          </p>
          <p>- Information we collect and hold about you.</p>
          <p>- Our use and disclosure of your personal information.</p>
          <p>
            - The legal basis we rely upon to process your personal information.
          </p>
          <p>- Your rights over your personal information.</p>
          <p>- The security of personal information.</p>
          <p>- Our disposal of personal information, when no longer needed.</p>
          <p>- Overseas transfer of personal information.</p>
          <p>- The use of cookies and online tracking technologies.</p>
          <p>- Privacy relating to persons aged under 16 years.</p>
          <p>
            - Contacting us with any questions or concerns that you may have.
          </p>
          <h3>2. Information we collect and hold</h3>
          <p>
            Wherever possible, you can elect to remain anonymous, or use a
            pseudonym, in interacting with us (for example, when making an
            enquiry). From time to time, we may ask you to supply personal
            information such as your name, address, date of birth, telephone
            number, e-mail address or cookies and usage data. However, under no
            circumstances will we request any information from you that may
            disclose your:
          </p>
          <p>
            - Political, religious or philosophical opinions, beliefs,
            associations or affiliations.
          </p>
          <p>- Health and sexuality.</p>
          <p>- Racial or ethnic origin.</p>
          <p>
            - Membership of a trade union, or a professional or trade
            association.
          </p>
          <p>- Criminal records.</p>
          <p>
            We may also conduct surveys or market research and may seek other
            information from you on a periodic basis. These surveys will provide
            us with information that allows improvement in the types and quality
            of services offered to you, and the manner in which those services
            are offered to you.
          </p>
          <h3>3. How we collect your personal information</h3>
          <p>
            We use various methods to collect personal information about you,
            including:
          </p>
          <p>
            1. Direct interactions – you may provide us with your personal
            information by filling in forms or by corresponding with us, in
            various ways.
          </p>
          <p>
            2. Automated technologies or interactions – we may, as you interact
            with our Website, automatically collect information about your
            equipment, browsing actions and patterns. We collect this
            information by using cookies and other online technologies. Please
            see our Cookie Policy for further details.
          </p>
          <h3>4. Use and disclosure of your personal information</h3>
          <p>
            1. When we hold your personal information, it will be used for the
            following primary purposes:
          </p>
          <ul>
            <p>- To ensure the proper functioning of our Website.</p>
            <p>- To ensure the proper functioning of our business.</p>
            <p>
              - To assist us with our auditing, marketing, planning, billing,
              product development and research requirements.
            </p>
          </ul>
          <p>
            2. We will not use or disclose (or permit the use or disclosure of)
            information that could be used to identify you in any circumstances,
            except:
          </p>
          <ul>
            <p>
              - To ensure the proper functioning of our business and the
              Website.
            </p>
            <p>
              - To communicate promotional offers and special events to you.
            </p>
            <p>
              - Where the law requires us, or authorises us, or a third party
              holding data on our behalf, to do so.
            </p>
            <p>
              - Where you have given express consent to us for a prescribed
              purpose.
            </p>
          </ul>
          <p>
            We will not sell, distribute, rent, licence, disclose, share or pass
            your personal information on to any third parties, other than those
            that are contracted to us, to keep the information confidential.
          </p>
          <p>
            Should a third party approach us, with a demand to access your
            personal information, we will take reasonable steps to redirect the
            third party to request the information directly from you, wherever
            it is lawful and reasonable for us to do so.
          </p>
          <p>
            If we are compelled to disclose your personal information, to a
            third party, we will take reasonable steps to notify you of this in
            advance, provided that it is lawful and reasonable for us to do so.
          </p>
          <h3>
            5. Legal basis we rely upon to process your personal information
          </h3>
          <p>
            1. The GDPR sets out numerous grounds upon which we may lawfully
            collect and process your personal information, including:
          </p>
          <ul>
            <p>- Where you have provided us with your consent to do so.</p>
            <p>- Where we need to perform a contract with you.</p>
            <p>- Where we are required to comply with the law.</p>
            <p>- For payment processing purposes.</p>
            <p>
              - When processing of your personal information is in our
              legitimate interests and it’s not overridden by your rights.
            </p>
          </ul>
          <p>2. Consent</p>
          <p>
            We can collect and process your data if we have your consent. In
            many circumstances, if we rely on your consent as our legal basis
            for processing your personal data, you have the right to withdraw
            that consent, at any time.
          </p>
          <p>3. Contractual obligations</p>
          <p>
            In many circumstances, we require your personal information to
            comply with contractual obligations. For example, we collect your
            identity and contact information when we provide you with our goods
            or services. If you are unable to provide such information to us, we
            may not be able to perform the contract we have with you or your
            business, or enter into a contract with you or your business.
          </p>
          <p>4. Legal compliance</p>
          <p>
            We may need to collect and process your personal data, if the law
            requires us to. If you are unable to provide such information to us,
            we may not be able to perform the contract we have with you or your
            business, or enter into a contract with you or your business.
          </p>
          <p>5. Legitimate interests</p>
          <p>
            We will often require your personal information to pursue our
            legitimate interests, in a way which might reasonably be expected as
            part of running our business and which does not materially impact
            upon your rights, freedoms or interests. For example, it may be in
            our legitimate interests to use your personal information for
            marketing purposes to assist us with the growth of our business.
            Please email us if you require details of the specific legal ground
            we are relying on to process your personal information.
          </p>
          <h3>6. Your rights over your personal information</h3>
          <p>
            You have a number of rights with respect to the personal information
            that we hold about you. These rights are subject to certain
            exemptions and differ across the jurisdictions, in which we may
            operate.
          </p>
          <p>
            1. Request access to the personal information that we hold about you
          </p>
          <p>
            Subject to any applicable exceptions, we will provide you with a
            copy of your personal information, within the timeframes set out in
            relevant legislation. If you reside within the EU, then we will do
            this at no charge, in accordance with the GDPR. Please email us.
          </p>
          <p>2. Right to rectification</p>
          <p>
            You have the right to have us rectify any inaccurate information
            that we hold about you. Please email us.
          </p>
          <p>3. Right to erasure</p>
          <p>
            You will, in certain circumstances, have the right to request that
            we delete or remove your personal information. Whenever you have
            given us your consent to use your personal information, you have the
            right to change your mind, at any time, and withdraw that consent.
            In cases where we are processing your personal information on the
            basis of our legitimate interests, you can ask us to stop processing
            your information, for reasons connected to your individual
            situation. We must then do so, unless we believe that we have a
            legitimate reason to continue processing your personal information.
            Please email us.
          </p>
          <p>4. Right to data portability</p>
          <p>
            You will, in certain circumstances, have the right to obtain your
            personal information in a structured, commonly used and
            machine-readable format. You also have the right to request that we
            transfer your personal information, to a third party, without any
            hindrance from us. Please email us.
          </p>
          <p>5. Right to object</p>
          <p>
            You will, in certain circumstances, have the right to object to our
            processing of your personal information. Where personal information
            is being processed for direct marketing purposes, you have a right
            to object at any time. Please email us.
          </p>
          <p>6. Right to withdraw consent</p>
          <p>
            You have the right to withdraw your consent, at any time, for us to
            process your personal information. We may ask you to verify your
            identity before responding to such requests. Please email us.
          </p>
          <p>
            7. Rights in relation to automated decision-making and profiling
          </p>
          <p>
            You will, in certain circumstances, have a right not to be subject
            to a decision that is based on automated processing, where the
            decision will produce a legal effect or a similarly significant
            effect on you. To protect the confidentiality of your personal
            information, we will require you to verify your identity before
            proceeding with any request. If you have authorised a third party to
            submit a request to us on your behalf, then we will ask them to
            prove they have obtained your permission to act on your behalf.
            Please email us.
          </p>
          <p>8. Security of personal information</p>
          <p>
            We may store personal information, both electronically, and in
            hard-copy form. We are committed to keeping your personal
            information secure, regardless of the format in which we hold it and
            we take all reasonable steps to protect your information from
            misuse, interference, loss, and unauthorised access, modification or
            disclosure. However, you use our Website at your own risk and we
            accept no responsibility, whether we are deemed to have been
            negligent or not, in the event of a security that affects your
            privacy. Please email us.
          </p>
          <p>9. Overseas transfer of personal information</p>
          <p>
            We may transfer your personal information, and have it maintained on
            computers, outside of your state, province, country or other
            governmental jurisdiction, where data protection laws may differ
            than those from your jurisdiction. Your consent to this Privacy
            Policy, followed by your submission of such information, represents
            your agreement to that transfer. We will take reasonable steps to
            ensure that your personal information is treated securely and in
            accordance with this Privacy Policy, and no transfer of your
            personal information will take place to any organisation or country,
            unless there are adequate controls in place, including the security
            of your personal information.
          </p>
          <p>10. Disposal of personal information not required</p>
          <p>
            If we hold personal information about you, and we do not need that
            information for any purpose for which the information may be used or
            disclosed, we will take reasonable steps to destroy or de-identify
            that information, unless we are otherwise prevented from doing so by
            law.
          </p>
          <p>11. Cookies data and online tracking technologies</p>
          <p>
            We may use cookies, beacons, tags, scripts, and other online
            tracking technologies (collectively, referred to as Cookies) to
            collect and use personal information about you and to serve you with
            Internet-based advertising. For further information about the types
            of Cookies we use and why, as well as how you can control Cookies,
            please see our Cookie Policy.
          </p>
          <p>12. Privacy relating to persons under the age of 16 years</p>
          <p>
            We do not knowingly collect personally identifiable information from
            anyone under the age of 16. If you are under 16 years of age, then
            your parent or guardian must provide us with consent for us to
            process your personal information.
          </p>
          <p>13. Contacting us and complaints</p>
          <p>
            If you have any questions or concerns about our Privacy Policy, or
            if you wish to lodge a privacy-related complaint, please email us.
          </p>
          <p>14. Amendments of this Privacy Policy</p>
          <p>
            We undertake to regularly review and update this policy. We,
            therefore, reserve the right to amend this Privacy Policy at any
            time. Should any significant amendments occur, notification will be
            provided by publication on our website 14 days prior to the changes
            being implemented (the Notice Period), unless the circumstances of
            the amendments make it unreasonable to provide such a Notice Period.
            Your continued use after the Notice Period has lapsed indicates your
            consent to be bound by the amended Privacy Policy.
          </p>

          <div className={s.link}>
            <Link href="/policy" chevron>
              Back to Policies and Terms
            </Link>
          </div>
        </div>
      </PolicyLayout>
    </PageLayout>
  );
};

// @ts-ignore
export async function getServerSideProps({ req, res, locale, resolvedUrl }) {
  const fullLocale = locale || req.cookies.locale || "en";

  const redirect =
    fullLocale === "en"
      ? undefined
      : { destination: resolvedUrl, permanent: false };

  return {
    redirect,
    props: {
      ...(await serverSideTranslations(fullLocale, [
        "common",
        "index",
        "AuthModal",
        "Checkout",
      ])),
      cookieUser: !!req.cookies.user && (JSON.parse(req.cookies.user) || ""),
      userToken: !!req.cookies.user_token && (req.cookies.user_token || null),
    },
  };
}

export default PrivacyPolicy;
