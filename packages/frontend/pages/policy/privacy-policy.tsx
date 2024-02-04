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
  const i18n = t("policy.privacyPolicyPage", { returnObjects: true });

  return (
    <PageLayout userToken={userToken}>
      <Head>
        <title>{i18n.headTitle}</title>
        <meta
          name="description"
          content="This Privacy Policy applies only to those websites, services and applications included within Services."
        />
        {/* <meta name="robots" content="noindex, nofollow" /> */}
      </Head>
      <PolicyLayout
        userToken={userToken}
        cookieUser={cookieUser}
        authorized={cookieUser.accessToken ? true : false}
        title="Privacy Policy"
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
            path: "/policy/privacy-policy",
            title: "Privacy Policy",
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
            Ellty which is owned and operated by TASKINA PTY LTD ABN 63639538891
            (we, us, our or Ellty) recognises and values the protection of your
            personal information.
          </p>
          <p>
            We recognise that you have an interest in our collection and use of
            your personal information via our website, which is located at{" "}
            <a href="https://www.ellty.com">Ellty.com</a> (the Website). We have
            implemented this Website Privacy Policy in order to be open and
            transparent about how we collect, hold, and use your personal
            information, and under what circumstances we may disclose or
            transfer your personal information. The Website Privacy Policy also
            outlines your rights to gain access to, and seek corrections of,
            your personal information we hold. Finally, the Privacy Policy
            provides information about how you can approach us about your
            privacy-related concerns and complaints, and how we will deal with
            such communications.
          </p>
          <p>
            This policy applies only to information that Ellty collects via this
            Website.
          </p>
          <p>
            This Privacy Policy forms part of the Terms of Use document, which
            may be accessed via the footer of our Website.
          </p>
          <p>
            Please note that this Website Privacy Policy forms part of the Terms
            of Use document, which is displayed at the footer of each page of
            the Website and our Registration Terms.
          </p>
          <h3>2. Information we collect and hold</h3>
          <p>
            Wherever possible, you can elect to remain anonymous or use a
            pseudonym in interacting with us e.g. when making an enquiry.
          </p>
          <p>
            From time to time, we may ask you to supply personal information
            such as your name, address, date of birth, telephone number or
            e-mail address. However, under no circumstances will we request any
            information from you that may disclose your:
          </p>
          <ul>
            <li>
              Political, religious or philosophical opinions, beliefs,
              associations or affiliations.
            </li>
            <li>Health and sexuality.</li>
            <li>Racial or ethnic origin.</li>
            <li>
              Membership of a trade union, or a professional or trade
              association.
            </li>
            <li>Criminal records.</li>
          </ul>
          <p>
            We may also conduct surveys or market research and may seek other
            information from you on a periodic basis. These surveys will provide
            us with information that allows improvement in the types and quality
            of services offered to you, and the manner in which those services
            are offered to you.
          </p>
          <h3>3. Personal information via the Website</h3>
          <p>
            Most commercial websites use ‘cookies’, which are pieces of
            information that websites send to the browser and are stored in the
            computer hard-drive. Cookies make using the Website easier by
            storing information about your preferences on the Website. This
            allows the Website to be tailored to you for any of your return
            visits. Cookies will not identify you personally.
          </p>
          <p>
            If you would prefer not to receive cookies, you can alter your
            security settings on your web browser to disable cookies or to warn
            you when cookies are being used. However, by disabling the cookie
            function in your web browser you may impede your ability to use
            parts of the Website.
          </p>
          <h3>4. Your option not to provide your personal information</h3>
          <p>
            Providing us with your personal information is absolutely optional,
            but may be necessary for us to provide you with our services.
            Whenever it is optional for you to provide us with non-essential
            personal information, we will make this clear to you. When you
            provide us with your personal information, you are consenting to our
            storage, use and disclosure of that information as outlined in this
            Website Privacy Policy.
          </p>
          <p>
            We may from time to time run competitions or offer additional
            benefits to you and we may ask you to provide us with your personal
            details for these purposes. Providing us with this information is
            absolutely optional to you. However, if you do not provide your
            personal information to us we may not be able to contact you or give
            you access to the additional benefits.
          </p>
          <p>
            You may opt out of these additional communications at any time.
            Please contact us by <a href="mailto:hello@ellty.com">email</a> or
            3-5 St Kilda Road, Melbourne, Victoria, Australia, 3182.
          </p>
          <h3>5. Use and disclosure of your personal information</h3>
          <p>
            When we hold your personal information it will be used for the
            following primary purposes:
          </p>

          <p>1. To ensure the proper functioning of the Website.</p>
          <p>2. To ensure the proper functioning of the Ellty business.</p>
          <p>
            3. To assist Ellty with our auditing, marketing, planning, billing,
            product development and research requirements.We will not use or
            disclose (or permit the use or disclosure of) information that could
            be used to identify an individual member in any circumstances
            except:
          </p>

          <ul>
            <li>
              To ensure the proper functioning of our business and the Website.
            </li>
            <li>
              To communicate promotional offers and special events to you.
            </li>
            <li>
              Where the law requires us, or authorises us, or a company holding
              data on our behalf, to do so.
            </li>
            <li>
              Where you have given express consent to us for a prescribed
              purpose.
            </li>
          </ul>
          <p>
            We will not sell, distribute, rent, licence, disclose, share or pass
            your personal information onto any third parties, other than those
            who are contracted to us to keep the information confidential
            whether subject to a statute or a scheme which imposes similar
            restrictions to the Australian Privacy Principles contained in the
            Privacy Act 1988 (Cth), as amended, regarding the handling of
            personal information.
          </p>
          <p>
            Should a third party approach us with a demand to access your
            personal information, we will take reasonable steps to redirect the
            third party to request the information directly from you, wherever
            it is lawful and reasonable for us to do so.
          </p>
          <p>
            If we are compelled to disclose your personal information, to a
            third party we will take reasonable steps to notify you of this in
            advance, wherever it is lawful and reasonable for us to do so.
          </p>
          <h3>6. Security of personal information</h3>
          <p>
            In our business, personal information may be stored both
            electronically and in hard-copy form. We are committed to keeping
            your personal information secure regardless of the format in which
            we hold it and we take all reasonable steps to protect your
            information from misuse, interference, loss, and unauthorised
            access, modification or disclosure. However, you use the Website at
            your own risk and we accept no responsibility, whether we are deemed
            to have been negligent or not, in the event of a security that
            affects your privacy.
          </p>
          <p>
            Note that no information transmitted over the Internet can be
            guaranteed to be completely secure. However, we will endeavour to
            protect your personal information as best as possible but we cannot
            guarantee the security of any information that you transmit to us,
            or receive from us. The transmission and exchange of information is
            carried out at your own risk.
          </p>
          <h3>7. Accuracy and quality of personal information</h3>
          <p>
            We will take all such steps as are reasonable in the circumstances
            to ensure that:
          </p>
          <ul>
            <p>
              1. All information collected from you is kept accurate, up to date
              and complete.
            </p>
            <p>
              2. The personal information that we use or disclose is, having
              regard to the purpose of the use or disclosure, accurate,
              up-to-date, complete and relevant.
            </p>
          </ul>
          <h3>8. Access to your personal information</h3>
          <p>
            In most cases, you have the right to access the personal information
            that we hold about you. If you wish to access your personal
            information, please contact us by{" "}
            <a href="mailto:hello@ellty.com">email</a> or 3-5 St Kilda Road,
            Melbourne, Victoria, Australia, 3182.
          </p>
          <p>
            We will deal with all requests for access to personal information as
            quickly as possible. Requests for a large amount of information, or
            information which is not currently in use, may require further time
            before a response can be given.
          </p>
          <p>
            We may charge you a reasonable fee for access if a cost is incurred
            by us in order to retrieve your information, but in no case will we
            charge you a fee for your application for access.
          </p>
          <p>
            Whenever a fee will be applied, you will be notified of how that fee
            will be calculated, or where possible, the total amount that will be
            charged. You will then have the option to decide whether to proceed
            with your access request.
          </p>
          <p>
            In some cases, we will refuse to give you access to personal
            information we hold about you. This includes, but is not limited to,
            circumstances where denying access is required or authorised by or
            under an Australian law or a court/tribunal order or where giving
            you access would: be unlawful; have an unreasonable impact on other
            people’s privacy; prejudice an investigation of unlawful activity;
            reveal our intentions in relation to negotiations with you so as to
            prejudice those negotiations; prejudice enforcement related
            activities conducted by, or on behalf of, an enforcement body;
            reveal evaluative information generated within the Ellty business in
            connection with a commercially sensitive decision-making process.
          </p>
          <p>
            We will also refuse access where the personal information relates to
            existing or anticipated legal proceedings, and the information would
            not be accessible by the process of discovery in those proceedings.
            Further, we will refuse access where your request is frivolous or
            vexatious, and where we reasonably believe that: giving access would
            pose a serious threat to the life, health or safety of any
            individual, or to public health or public safety; unlawful activity,
            or misconduct of a serious nature, is being or may be engaged in
            against Ellty and giving access would be likely to prejudice the
            taking of appropriate action in relation to that matter.
          </p>
          <p>
            If we refuse to give you access we will provide you with reasons for
            our refusal, unless doing so would be unreasonable in the
            circumstances. We will also take reasonable steps to give you access
            in a way that meets your needs without giving rise to the reasons of
            our refusal. Further, we will provide details of how you may make a
            complaint about our decision.
          </p>
          <p>
            These mechanisms for accessing your personal information operate
            alongside, and do not replace, other informal or legal procedures by
            which you may be provided with access to your personal information.
          </p>
          <h3>9. Correction of your personal information</h3>
          <p>
            The accuracy of the personal information we have requested from you
            is important to us. Should you suspect, or become aware of, that
            your personal information we hold is inaccurate, out of date,
            incomplete or misleading, please contact us by{" "}
            <a href="mailto:hello@ellty.com">email</a> or 3-5 St Kilda Road,
            Melbourne, Victoria, Australia, 3182.
          </p>
          <p>
            We will deal with all requests for correction of personal
            information as quickly as possible. Requests relating to a large
            amount of information, or information which is not currently in use,
            may require further time before a response can be given.
          </p>
          <p>
            If we refuse to change the personal information as you request, we
            will provide you with reasons for our refusal, unless doing to would
            be unreasonable in the circumstances. We will also provide details
            of how you may make a complaint about our decision. Further, in case
            of our refusal, you may request that we take reasonable steps to
            associate, with the relevant information, a statement that you view
            it as inaccurate, out of date, incomplete or misleading.
          </p>
          <p>
            In the case we have corrected personal information about you, you
            may request that we take reasonable steps to give notice of the
            correction to any third party to which we have disclosed the
            inaccurate, out of date, incomplete or misleading personal
            information.
          </p>
          <p>
            These mechanisms for correcting your personal information operate
            alongside, and do not replace, other informal or legal procedures by
            which you may be provided correction of your personal information.
          </p>
          <h3>10. Overseas transfer of personal information</h3>
          <p>
            We may transfer your personal information to overseas recipients.
            However, we will seek your consent prior to disclosing your
            information if the overseas recipient is not regulated in a way that
            equally reflects the Australian Privacy Principles. We will take
            reasonable steps to ensure an overseas recipient does not breach the
            requirements of the Privacy Act 1988 (Cth).
          </p>
          <h3>11. Concerns and complaints about breaches</h3>
          <p>
            If you have concerns about how we handle your personal information,
            it is important that you notify us as soon as possible, so that we
            can address your concerns appropriately as the circumstances
            require. Any concern or complaint should be made in writing. Please
            send it to our <a href="mailto:hello@ellty.com">email</a> or 3-5 St
            Kilda Road, Melbourne, Victoria, Australia, 3182, and will respond
            as soon as reasonably possible.
          </p>
          <p>
            Alternatively you may contact the Office of the Australian
            Information Commissioner with your concern. Information about
            lodging a complaint is available on the Office of the Australian
            Information Commissioner’s website (see in particular:
            http://www.oaic.gov.au/privacy/privacy-complaints).
          </p>
          <h3>12. Disposal of personal information not required</h3>
          <p>
            If we hold personal information about you, and we do not need that
            information for any purpose for which the information may be used or
            disclosed, we will take reasonable steps to destroy or de-identify
            that information unless we are prevented from doing so by law.
          </p>
          <h3>13. Unsubscribing from our e-mail database</h3>
          <p>
            To unsubscribe from our e-mail database, please use the unsubscribe
            option contained in our emails or send us a return e-mail with
            “UNSUBSCRIBE” typed into the subject line of the e-mail.
          </p>
          <h3>14. Contacting us</h3>
          <p>
            If you have any questions, concerns or ideas about how we could
            improve our Website Privacy Policy, please contact us by{" "}
            <a href="mailto:hello@ellty.com">email</a> where you provide
            suggestions, materials or feedback it is considered non-confidential
            and we may, at our complete discretion, use it to improve the
            Website, service and/or how we handle personal information without
            any obligation to compensate you regardless of how we use,
            implement, copy, modify, display, distribute and/or otherwise
            benefit from your suggestions, materials or feedback.
          </p>
          <h3>15. Amendments of this Privacy Policy</h3>
          <p>
            We are obligated to regularly review and update this policy. We
            therefore reserve the right to amend this Website Privacy Policy at
            any time. Should any significant amendments occur, notification will
            be provided by publication on the Website 14 days prior to the
            changes being implemented (the Notice Period) unless the
            circumstances of the amendments makes it unreasonable to provide
            such a Notice Period. Your continued use after the Notice Period has
            lapsed indicates your consent to be bound by the amended Website
            Privacy Policy.
          </p>
          <p>
            For further information about privacy in general, please refer to
            the Office of the Australian Information Commissioner’s website
            located at http://www.oaic.gov.au.
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
