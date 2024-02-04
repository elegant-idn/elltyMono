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
  const i18n = t("policy.termsOfUsePage", { returnObjects: true });

  return (
    <PageLayout userToken={userToken}>
      <Head>
        <title>{i18n.headTitle}</title>
        <meta
          name="description"
          content="By using our Services, You agree to be bound by the Terms. Your use of or access to our Services, including but not limited to the App."
        />
        {/* <meta name="robots" content="noindex, nofollow" /> */}
      </Head>
      <PolicyLayout
        userToken={userToken}
        cookieUser={cookieUser}
        authorized={cookieUser.accessToken ? true : false}
        title="Terms of Use"
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
            path: "/policy/terms-of-use",
            title: "Terms of Use",
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
            Welcome to our Services including the Ellty App (the App) and the
            Website (Ellty.com), which is owned and operated by TASKINA PTY LTD,
            ABN 63639538891 (we, us, our or Ellty).
          </p>
          <p>
            By using our Services, You agree to be bound by the Terms. Your use
            of or access to our Services, including but not limited to the App,
            is conditional upon your acceptance and ongoing compliance with the
            Terms. If you do not want to agree to these Terms you must not
            access or use our Services. You warrant that You have full legal
            authority and eligibility to enter into and accept the Terms on
            behalf of such individual, company or other legal entity, and to
            legally bind such individual, company or other legal entity.
          </p>
          <h3>2. Definitions</h3>

          <p>
            1. Account means the account which must be created by the User via
            the Website in order to access the Services.
          </p>
          <p>
            2. Free Licence is a Product and means the license to use the
            Services commonly referred to on the Website at{" "}
            <a href="https://www.ellty.com/plans"> this page</a> as the Ellty
            Free plan.
          </p>
          <p>
            3. Confidential Information means any written or oral information of
            a party (the Discloser) disclosed to, or otherwise acquired by, the
            other party (the Recipient) in connection with the Terms or in
            connection with Ellty or the Website, which is by its nature
            confidential, marked or treated as confidential by the Disclosure at
            the time of its disclosure or which the Recipient otherwise knows or
            ought to reasonably know is confidential, and includes all
            information that is Personal Information but does not include
            information that the Recipient can establish:
          </p>
          <ul>
            <p>
              a) Was in the public domain at the time of its disclosure by the
              Disclosure.
            </p>
            <p>
              b) Becomes, after being given to the Recipient, part of the public
              domain, except through disclosure contrary to these Terms.
            </p>
            <p>
              c) Was already in the Recipient’s possession through no wrongful
              act.
            </p>
            <p>
              d) Was lawfully received from another person having the
              unrestricted legal right to disclose that information without
              requiring the maintenance of confidentiality.
            </p>
          </ul>
          <p>
            4. Content means if you as a User upload or create content
            (including any contact details, designs, images, drawings, marketing
            material of whatever kind, proposals, or any data, information,
            documentation, specifications, photographs, audio-visual materials,
            recordings, and anything else in a material form (which, for the
            avoidance of doubt includes information stored in an electronic
            form) on the Website.
          </p>
          <p>
            5. Data means all Personal Information submitted by or on behalf of
            You or any User.
          </p>
          <p>
            6. Ellty means TASKINA PTY LTD ABN 63639538891 or any of its
            subsidiaries, affiliates, officers, agents, employees or partners.
          </p>
          <p>
            7. Ellty App (the App) means the proprietary design and marketing
            software application, service and tools available on the Website or
            available through any Ellty tool or application including mobile,
            web or iOS application. It includes the design, software, services,
            platform, website and Intellectual Property including any Ellty
            Design or services associated with the use of the software and is
            considered as a software as a service.
          </p>
          <p>
            8. Ellty Design means, whether in whole or in part, any of Ellty’s,
            or any work You have created that consists of any of Ellty’s visual
            or graphic design, images, stock media, fonts, videos, wording,
            templates or any element of Ellty’s Intellectual Property or any
            third party stock media, fonts, or third party intellectual
            property, accessed through the Website or through accessing or using
            the Ellty App. For avoidance of doubt and by way of example, it
            includes work created by the User under all Subscriptions where the
            work created by the User includes an element of Ellty’s Stock Media,
            images, Font, Intellectual Property, Etc.
          </p>
          <p>
            9. Export means to download or otherwise obtain the benefit of an
            Ellty Design.
          </p>
          <p>
            10. Force Majeure means an event or series of events that is outside
            the reasonable control of Ellty which include any failures to public
            telecommunication networks, acts of war, technical issues, sabotage,
            labour shortage or dispute, governmental act, changes to the law,
            disasters, explosions, fires, floods or public security attacks
            (whether actual or virtual) or complete or partial failure of the
            Internet.
          </p>
          <p>
            11. Free Trial is a Product and means the Subscription which has
            been offered to You for free at the election of Ellty, for a short
            period of time so You can try the Service.
          </p>
          <p>
            12. GDPR means the Regulation (EU) 2016/679 of the European
            Parliament and of the Council of 27 April 2016 on the protection of
            natural persons with regard to the processing of personal data and
            on the free movement of such data, and repealing Directive 95/46/EC
            (General Data Protection Regulation).
          </p>
          <p>
            13. GST means the goods and services tax as imposed by the GST Law.
          </p>
          <p>
            14. GST Law has the meaning given in A New Tax System (Goods and
            Services Tax) Act 1999 (Cth) and includes all regulations and
            associated legislation and delegated legislation.
          </p>
          <p>15. Intellectual Property means:</p>
          <ul>
            <p>
              a) All present and future intellectual property rights, whether
              registered or not, under statute or at common law or equity,
              including designs, trademarks, patents, applications, copyright,
              know-how, Confidential Information and trade secrets, software,
              templates, business names, domain names and rights of a similar
              nature that exist, or that may come to exist anywhere in the
              world.
            </p>
            <p>
              b) any application or right to apply for any rights referred to in
              paragraph (a).
            </p>
          </ul>
          <p>
            16. Fee means the amount specified via the Website on{" "}
            <a href="https://www.ellty.com/plans">Plans page</a> for a Product
            represented as plan based pricing or as otherwise agreed between the
            parties in writing.
          </p>
          <p>
            17. Local Laws means any legislation, regulations, by-law,
            ordinances and orders applicable in any country, state or territory
            either within Australia or in other countries.
          </p>
          <p>
            18. Permitted Use means the use permitted as set out in Clause 8.
          </p>
          <p>
            19. Personal Information has the same meaning as in the Privacy Act
            1988 (Cth)
          </p>
          <p>
            20. Pro Licence means the Products and license to use the Services
            commonly referred to on the Website at{" "}
            <a href="https://www.ellty.com/plans">Plans page</a> as either the
            Ellty Pro plan.
          </p>
          <p>
            21. Privacy Laws includes the Privacy Act 1988 (Cth) as amended,
            replaced or supplemented from time to time and any other applicable
            legislation in force in any jurisdiction affecting privacy, personal
            information or the collection, handling, storage, processing, use or
            disclosure of personal information (to the extent that such
            legislation would apply with respect to Ellty, the Ellty App,
            software or our Services. It includes any ancillary rules,
            guidelines, orders, directions, directives, codes of conduct or
            other instruments made or issued under such instruments, as amended
            from time to time. For the avoidance of doubt, Privacy Laws will be
            taken to include General Data Protection Rules in so far as those
            rules apply to the User.
          </p>
          <p>
            22. Product means the packages or plans available on the Website.
            For avoidance of doubt, this includes Free Trial and Pro Licence.{" "}
          </p>
          <p>
            23. Privacy Policy means the Privacy Policy applicable to Users
            using the Services.
          </p>
          <p>
            24. Services means the products or services offered by Ellty either
            directly, through the Ellty App, Website or other proprietary
            software. It includes any design, elements, Intellectual Property
            and Ellty Design, any third-party licensed software or elements, or
            our design products or services. It includes any related user tools,
            elements or documentation in connection with the Ellty App, the
            Website or other design or marketing service methods offered by
            Ellty (collectively the “Services”).
          </p>
          <p>
            25. Share means to email, post, transmit, upload, online chat or
            otherwise make available (whether to us or other users) through your
            use of the Services.
          </p>
          <p>
            26. Specified Intellectual Property means any logo, brand or other
            Intellectual Property, which may be incorporated into an Ellty
            Design as an item of Stock Media.
          </p>
          <p>
            27. Stock Media means the component parts of the Ellty Design,
            including but not limited to logos, trademarks, shapes, colours,
            design or design elements, images or any other component parts that
            may be incorporated into a design.
          </p>
          <p>
            28. Subscription means the licence that the User obtains to access
            or use the Services by successfully creating an active Account for
            one of the Products available on the Website.
          </p>
          <p>
            29. Supervisory Authority means an independent public authority
            which is established by an EU Member State pursuant to the GDPR.
          </p>
          <p>
            30. Team Product Licence means the Pro Licence where the
            Subscription to the said Pro Licence has two or more Users (For
            example, where a team of users within a company are using a Pro
            Licence).
          </p>
          <p>
            31. Terms means these Terms of Use and the terms of the Privacy
            Policies including Privacy Policy (GDPR), Social Media Terms and
            Cookies Policies, together with any other terms associated with Your
            Subscription which You accept by using the Services
          </p>
          <p>32. User means an individual who accesses the Services.</p>
          <p>
            33. Website means Ellty’s website{" "}
            <a href="https://www.ellty.com">Ellty.com</a> and includes any other
            service, tool or application, including any mobile web, any iOS
            application, Android application or other access mechanism connected
            to the Services.
          </p>
          <p>
            34. You means you, a user, individual or entity subscribing to the
            Services, whether as an individual or on behalf of an entity,
            including but not limited to include any of Your employees,
            consultants or customers, to use the Services. For the avoidance of
            doubt, it includes any person or entity in which You the user
            provides access to the Services.
          </p>

          <h3>3. Interpretation</h3>
          <p>In these Terms of Use:</p>
          <p>
            1. A reference to this Terms of Use, Terms or other instrument
            includes any variation or replacement of any of them.
          </p>
          <p>
            2. A reference to a statute, code or another law includes
            regulations and other instruments made under it and any
            consolidations, amendment or re-enactments or replacements of any of
            them.
          </p>
          <p>
            3. A reference to a party includes a reference to that party’s
            executors, administrators, successors, employees, customers and
            consultants. References to an individual shall include a firm, body
            corporate or association, whether incorporated or not.
          </p>
          <p>4. The singular includes the plural and vice versa.</p>
          <p>
            5. “Includes”, “including”, “for example” and similar terms are not
            terms of limitation
          </p>
          <p>
            6. Unless stated otherwise such as in the Ellty App which allows for
            Australian Dollars (AUD) and United States Dollars (US), all other
            references to currency are in the currency where Ellty is located
            and includes GST (where applicable).
          </p>
          <h3>4. General</h3>
          <p>
            1. These Terms apply to the use of our Services including any
            licences granted to You by way of a Subscription to use the
            Services.
          </p>
          <p>
            2. Unless expressly stated otherwise, the Terms apply to all
            Services and Products, including Ellty Free Trial and Pro Licence
            Products.
          </p>
          <p>
            3. All licences require an active Subscription to use the Services.
            You must not continue to use the Services or any Ellty Design after
            the termination of your Subscription.
          </p>
          <p>
            4. The Terms constitute the entire agreement between the parties and
            replaces all prior understandings, agreements and warranties.
          </p>
          <p>
            5. Ellty reserves the right to amend the Terms at any time by
            publishing amended Terms on the Website. In relation to any
            significant amendments that may have a material adverse effect on
            your use of the Website or our Services, Ellty will notify you of
            those changes by publishing the amended Terms on the Website and
            publish the amended Terms at least fourteen (14) days prior to the
            changes being implemented (the Notice Period), unless the
            circumstances of the amendments make it unreasonable to provide You
            with such Notice Period.
          </p>
          <p>
            6. You agree to check our Website periodically to ensure you are
            aware of our current Terms.
          </p>
          <p>
            7. Your continued use after the Notice Period has lapsed indicates
            your consent to be bound by the amended Terms. If you do not agree
            to the amended Terms, you may elect to terminate Your Subscription
            in accordance with these Terms.
          </p>
          <p>
            8. You must not use or disclose any Confidential Information
            concerning Ellty or the Website, which You possess, other than for
            the Permitted Use.
          </p>
          <p>
            9. If Ellty does not act in relation to a breach of these Terms by
            you, this does not waive Our rights to act with respect to
            subsequent or similar breaches of these Terms by You.
          </p>
          <h3>5. Subscription Licences</h3>
          <p>
            1. You may only access or use the Services contained in the Ellty
            App by purchasing a licence and entering into an active
            Subscription.
          </p>
          <p>
            2. You can obtain a licence to use the Services, and the right to
            use the Ellty App by:
          </p>
          <ul>
            <p>
              a) Entering into a Subscription and paying the relevant Fee for
              one of Ellty’s Products on the Website, or registering for a Free
              Trial.
            </p>
            <p>b) Agreeing to be bound by the Terms.</p>
          </ul>
          <p>
            3. Ellty grants You a non-exclusive, non-transferable, limited,
            revocable licence to Use the Services after You have paid the Fee.
            Ellty reserves all rights which are not expressly granted to You.
          </p>
          <p>
            4. Except where expressly stated otherwise in these Terms, Ellty is
            and remains the owner of any intellectual property rights with
            respect to Ellty and the Services as a result of Your Subscription.
          </p>
          <h3>6. Free Licences</h3>
          <p>
            Where You have entered into a Subscription for a Free Licence, these
            additional provisions will apply:
          </p>
          <p>
            1. The licence granted to You allows You to use the Ellty App and
            any Ellty Design for the Permitted Use set out in Clause 8.
          </p>
          <p>
            2. Before You may take possession of or use an Ellty Design in the
            Ellty App, you must first obtain a Licence from Ellty by entering
            into a Subscription for a Free Licence. There is no fee payable to
            obtain a Free Licence.
          </p>
          <p>
            3. Ellty retains all rights in and to the Stock Media, including and
            without limitation, all copyright and other intellectual property
            rights. Ellty may at its absolute discretion, use any Content or
            work containing an Ellty Design for any purpose whatsoever. For
            example, Ellty may use parts of the work created by You in so far as
            it utilises Ellty’s Stock Media, Ellty Design or any of Ellty’s
            intellectual property. All rights will be retained by Ellty in
            perpetuity.
          </p>
          <p>
            4. You must not dissect or use any element of an Ellty Design and
            must only use the whole Ellty Design. For the avoidance of doubt,
            you cannot take an element of an Ellty Design and use that element
            elsewhere.
          </p>
          <p>
            5. Ellty reserves the right to remove or replace any of the Stock
            Media with an alternative for any reason. To the extent that any
            Stock Media is owned or licenced with a third party, You agree that
            Ellty may move or replace those elements from time to time.
          </p>
          <h3>7. Pro Licences &amp; Free Trial</h3>
          <p>
            1. Where you have entered into a Subscription for a Free Trial,
            these additional provisions will apply:
          </p>
          <ul>
            <p>
              a) Free Trials are available under a one-time evaluation period.
              You agree to provide Ellty with certain information as indicated
              in the Subscription process. At the end of the trial period, and
              unless the trial is converted to a paid Subscription, the Services
              will automatically convert to a Free Licence.
            </p>
            <p>
              b) Ellty reserves the right to delete any Data or content that was
              uploaded during the trial after twelve months of inactivity on
              that Account.
            </p>
            <p>
              c) Ellty reserves the right to terminate your trial at any time at
              its sole discretion. To the maximum extent permitted by applicable
              law, trial versions are provided by Ellty without any warranty or
              indemnification to you.
            </p>
          </ul>
          <p>
            2. Pro Licences are considered Team Products insofar as a
            Subscription relating to a Pro Licence can either be for an
            individual User or for a team of Users. Where You have entered into
            a Subscription for a Pro Licence via the Website, these additional
            provisions will apply:
          </p>
          <ul>
            <p>
              a) You may obtain the right to obtain a Licence and use the
              Services when you have Subscribed to either the Pro Licence plans
              available on the Website.
            </p>
            <p>
              b) You retain all rights and ownership of your Content or work
              except where Your Content contains, whether in whole in part, any
              Ellty Design. The licence granted to You allows You to use any
              Ellty Design and any Stock Media for the Permitted Use. However,
              insofar as Your work or Content contains any element of an Ellty
              Design, whether in whole or in part, you agree that you will be
              restricted to using that Content or work to the terms set out in
              Clause 6 above relating to a Free Licence.
            </p>
          </ul>
          <p>
            3. We require certain licences from you to your content to operate
            and enable the Services. When you upload Content to the Services,
            you grant us a non-exclusive, worldwide, royalty-free, sub-licence
            and a transferable licence to access, use, reproduce, distribute and
            translate the content as needed in response to user driven actions
            (such as when you chose to store privately or share your content
            with others). This licence is granted for the purpose of:
          </p>
          <ul>
            <p>a) Providing, operating or improving the Services.</p>
            <p>b) Responding to support requests.</p>
            <p>
              c) Detecting, preventing or otherwise addressing fraud, security,
              unlawful or technical issues.
            </p>
            <p>d) Enforcing these Terms.</p>
          </ul>
          <p>
            4. Some Services may provide features that allow you to Share your
            content with other users or to make it public. Other users may use,
            copy, modify, or re-share your content in many ways. You are
            required to carefully consider what you Share or make public, as you
            are entirely responsible for the content that you Share.
          </p>
          <p>
            5. The permissions and settings which can be adjusted by your
            administrator are your responsibility. We do not monitor or control
            what others do with your content so you are therefore responsible
            for determining the limitations that are placed on your content and
            for applying the appropriate level of access to your content. If you
            do not choose the access level to apply to your content, the system
            may default to its most permissive setting. It is your
            responsibility to let other Users know how your content may be
            Shared and adjust the setting related to accessing and sharing your
            content. Under Pro Licences, the administrator is granted authority
            to delete or transfer your content to other Users.
          </p>
          <p>
            6. If You have a Pro Licence and a User no longer requires the use
            of the Services, the administrator may reassign such usage rights to
            a new User, and so long as the transfers support employee turnover
            or user role changes where the User no longer requires access to the
            Services. You acknowledge that you will be required to pay Fees for
            any additional Users on your Account under the Subscription.{" "}
          </p>
          <h3>8. Permitted Uses</h3>
          <p>
            1. The Permitted Uses for all Licences including Free Trial, Free
            Licence and Pro Licences.{" "}
          </p>
          <ul>
            <p>
              a) To enable You to take possession of or use any Ellty Design
              created in the Ellty App, your Subscription must be active. You
              must not use the Ellty App or any work created in the Ellty App
              beyond the expiry of your Subscription, regardless of whether you
              created these works under a previous Subscription.{" "}
            </p>
            <p>
              b) Active Subscription gives You the right to use any Ellty Design
              or Stock Media to create or distribute works for any of the
              following permitted uses:{" "}
            </p>
            <ul>
              <p>
                - Invitations, advertising and promotional projects, including
                printed materials, product packaging, presentations, film and
                audio presentations, commercials, catalogues, brochures,
                promotional greeting cards and promotional postcards up to 2,000
                prints.
              </p>
              <p>
                - Online or electronic publications, including web pages, blogs,
                eBooks and videos, limited to a maximum of 480,000 total pixels
                per Stock Media file.
              </p>
              <p>
                - Books and book covers, magazines, newspapers, editorials,
                newsletters and video broadcast and theatrical presentations up
                to 2,000 prints.
              </p>
              <p>- School or university projects.</p>
              <p>- Social media posts or to create a profile image.</p>
              <p>
                - Decorative background on a personal computer or background
                device.
              </p>
              <p>
                - Prints, posters and other reproductions for promotional
                purposes, but not for resale, licence or other distribution.
              </p>
              <p>- Any other uses approved in writing by Ellty.</p>
            </ul>
            <p>
              c) Any use of an Ellty Design or Stock Media outside, or in excess
              of, the Permitted Uses is prohibited.{" "}
            </p>
          </ul>
          <p>2. Pro Licence Permitted Use. </p>
          <ul>
            <p>
              a) In addition to the Permitted Uses set out in Clause 8.1 above,
              a Pro Licence User with an active Subscription may also use
              Content and work created by its Pro Users where that work is not
              based on any Ellty Design as follows:
            </p>
            <ul>
              <p>
                - For commercial purposes, the content or work solely created by
                you.
              </p>
              <p>- To make copies or reproductions as you elect.</p>
              <p>
                - To allow third parties to use those copies or reproductions
                for a commercial purpose as they or You see fit provided the use
                does not breach these Terms.
              </p>
            </ul>
            <p>
              b) For the avoidance of doubt, should Your Content or work contain
              an element in whole or in part of any Ellty Design, then you will
              be restricted to the Permitted Uses set out in Clause 8.1 Any
              Content or work solely created by you without any Ellty Design
              element including but not limited to fonts, photos and graphics,
              is able to be used and sold as an end product provided you
              maintain your Subscription to use our Services.
            </p>
            <p>
              c) Where You have created an end product for a client, you are
              permitted to transfer the entire end product to the client. When
              you do this, you must have an active Subscription at the time of
              transfer to the client. You are permitted to distribute end
              products in any and multiple media formats but must inform the
              client of their obligations in relation to intellectual property
              rights, those obligations of which are the same as those imposed
              on You under this Agreement.
            </p>
          </ul>
          <h3>9. Intellectual Property</h3>
          <p>
            1. The materials displayed on the Ellty App, including any software,
            design, text, images, audio, video or graphics comprised in the
            Ellty App, including the selection and layout of the Website, are
            owned or under licence by Ellty and are protected by Australian and
            International intellectual property laws.{" "}
          </p>
          <p>
            2. Ellty retains all rights in and to the Stock Media, including and
            without limitation, all copyright and other intellectual property
            rights. Ellty may at its absolute discretion, use any Ellty Design,
            in whole or in part, for any purpose whatsoever. All rights will be
            retained by Ellty in perpetuity.{" "}
          </p>
          <p>
            3. Your use of the Services does not grant you a licence or act as a
            right of use of any of the trademarks or logos, whether registered
            or unregistered, that are displayed on the Website and the Services
            without the express written permission of the trademark owner.{" "}
          </p>
          <p>
            4. We own the copyright and other Intellectual Property which
            includes all creative and literary works that are displayed on the
            Website and the Services.{" "}
          </p>
          <p>
            5. You may view the Website and Services, and any contents by
            visiting the Website and accessing the Services. You may make a
            temporary copy of the Services by means of the usual operation of
            your web browser only.{" "}
          </p>
          <p>
            6. You must not sell, replicate, alter, change or use Ellty
            Intellectual Property in any way other than for the permitted uses
            set out in Clause 8.{" "}
          </p>
          <p>
            7. In the event that you in any way breach Ellty’s Intellectual
            Property rights, Ellty will not hesitate to enforce its intellectual
            property rights against You.{" "}
          </p>
          <h3>10. Prohibited Conduct and Restrictions</h3>
          <p>
            1. In the event that you in any way breach Ellty’s Intellectual
            Property rights, Ellty will not hesitate to enforce its intellectual
            property rights against You.{" "}
          </p>
          <ul>
            <p>
              a) Except where you have obtained a Pro Licence, You must not:{" "}
            </p>
            <ul>
              <p>
                - Reproduce or use any of the material on the Website or
                Services for commercial purposes, including sale.{" "}
              </p>
              <p>
                - In any way modify the material displayed on the Website or
                Services.{" "}
              </p>
              <p>
                - Cause any of the material on the Website or Services to be
                framed or embedded in another website or product.{" "}
              </p>
            </ul>
            <p>
              b) Where you have obtained a Pro Licence, you may sell your
              Content or work provided that:
            </p>
            <ul>
              <p>- It does not contain any element of an Ellty Design.</p>
              <p>
                - That the work has been derived independently of any of any
                element or Ellty Design template and exists completely on the
                User’s own template.
              </p>
            </ul>
          </ul>
          <p>
            2. To modify, adapt or translate any software or other Intellectual
            Property elements underlying the Services.
          </p>
          <p>
            3. To post or share false, inaccurate, misleading, deceptive,
            defamatory or offensive content (including Personal Information.{" "}
          </p>
          <p>
            4. To download and aggregate content from our Website without our
            express written permission, “frame”, “mirror” or otherwise
            incorporate any part of the Website into any other without our prior
            written authorisation.{" "}
          </p>
          <p>
            5. To reverse engineer, decompile, disassemble, or otherwise attempt
            to discover the source code of any software or other intellectual
            property elements underlying the Services.{" "}
          </p>
          <p>
            6. To allow items incorporated into end products to be extracted or
            used separately from the end-product. You must take reasonable steps
            to prevent this from happening and inform any client who the project
            is for of their responsibilities in relation to this.{" "}
          </p>
          <p>
            7. To engage in any cross-selling between Users in relation to any
            Intellectual Property of Ellty.{" "}
          </p>
          <p>
            8. For any activities, post or transmit via the Services any
            information or materials which breach any laws or regulations,
            infringe a third party’s rights, or are contrary to any relevant
            standards or codes.{" "}
          </p>
          <p>
            9. To post or transmit any material which interferes with other
            users or defames, harasses, bullies, intimidates, threatens, menaces
            or restricts any person or which inhibits any user from using the
            Services or the Internet.{" "}
          </p>
          <p>
            10. To post or transmit any material where doing so violates the
            intellectual property rights, confidentiality or trade secrets of
            another party.{" "}
          </p>
          <p>
            11. To use, post or transmit for an unlawful purposes where the
            material contains or is being used in a way that is offensive,
            defamatory, pornographic, obscene, contains violence (including
            self-harm), hate speech or demeaning, or promotes discrimination.
            You cannot use items in a way that creates a fake identity, implies
            personal endorsement of a product by the person or in connection
            with sensitive subject.{" "}
          </p>
          <p>12. To send unsolicited email messages. </p>
          <p>
            13. To post or transmit content that contains, or amounts to,
            advertisement, attempted business solicitations, marketing materials
            or sales promotional materials.{" "}
          </p>
          <p>
            14. You must not modify, copy, reproduce, republish, frame, upload
            to a third party, post, transmit or distribute the content of the
            Ellty App in any way except as expressly provided for by us or
            expressly authorised in writing by us.{" "}
          </p>
          <p>
            15. To knowingly transmit any viruses, spyware or other forms of
            malware or other disabling features to the Services.{" "}
          </p>
          <p>
            16. To attempt any of the above acts or encourage, or facilitate, or
            assist another person to do any of the above acts.{" "}
          </p>
          <h3>11. Prohibited Conduct and Restrictions</h3>
          <p>
            1. You must not act in any way which does not align with the values
            of the community, or in a way that could cause harm to us or to
            others.
          </p>
          <p>
            2. You must only download or use an Ellty Design or Stock Media if:
          </p>
          <ul>
            <p>a) You have an intention to use it.</p>
            <p>
              b) You have an active and appropriate level of Subscription
              relating to the intended use of those elements, Ellty Design or
              Stock Media. It is a breach of our Terms if you download Ellty
              Designs or Stock Media that you do not intent to appropriately
              use, which are mass downloads or which are downloaded in advance
              in order to use them after the Subscription is over. If you wish
              to use an item which you have downloaded under an old
              Subscription, then you must enter into an active Subscription to
              reuse it.
            </p>
          </ul>
          <p>
            3. You must enter into a Subscription plan which aligns with your
            intended Permitted Use under these Terms. For the avoidance of
            doubt, you must not enter into a Pro Licence plan and downgrade to a
            Free Licence plan with the intention of using previously downloaded
            images for Pro LIcence Product Permitted Uses. This would be a
            breach of our Terms.
          </p>
          <p>
            4. If we suspect you may be breaching our Terms, we may elect to
            terminate your access to the Ellty App and cancel your Subscription
            in accordance with these Terms.
          </p>
          <h3>12. Maintenance, Service Availability and Support</h3>
          <p>
            1. The Services may automatically be updated from time to time by
            Ellty. These updates may take the form of bug fixes, new features,
            or new versions. You agree to receive such updates from Ellty as
            part of your use of the Services.
          </p>
          <p>
            2. Services may be accessible worldwide but for clarity, this does
            not mean all Services or service features are accessible in all
            languages or all areas, or that content is available via the
            Services is legally compliant in all areas. It is Your
            responsibility to make sure your use of the Services is available
            and legally compliant in your area.
          </p>
          <p>
            3. We cannot be responsible for any delays or interruptions to our
            Services. We will use commercially reasonable efforts to minimise
            delays and interruptions. However, we cannot warrant that the
            Services will be available at all times or at any given time.
          </p>
          <p>
            4. We may modify or discontinue any or all the Services at any time
            without notice or liability to you or anyone else. If we discontinue
            a Service, you have the right to request a refund in writing within
            thirty (30) days of discontinuance, in which case, we will provide
            you with a pro rata refund for any unused fees for the Service for
            which you may have prepaid, in which event, your right to use the
            discontinued Service (or all Services as the case may be) will
            terminate. This will be your sole remedy in the event we discontinue
            any or all of the Services.
          </p>
          <p>
            5. We will not be responsible for any loss, cost, damage or
            liability that may result from our modification or the
            discontinuance of the Website or the Services.
          </p>
          <h3>13. Force Majeure</h3>
          <p>
            1. Except for the obligation to make payments, neither party will be
            liable for any failure or delay in its performance under these Terms
            due to any Force Majeure provided that the delayed party:
          </p>
          <ul>
            <p>a) Gives the other party prompt notice of such cause.</p>
            <p>
              b) Uses its reasonable commercial efforts to promptly correct such
              failure or delay in performance.
            </p>
          </ul>
          <h3>14. Assignment</h3>
          <p>
            1. You must not assign any right or obligation that exists under
            these Terms without prior written consent from Ellty. Ellty may
            however assign its rights and obligations under these Terms.
          </p>
          <h3>15. Privacy</h3>
          <p>
            Our Privacy Policies govern any Personal Information or personally
            identifiable information You provide to us. By agreeing to and
            accepting to these Terms, you consent to all actions we take with
            respect to your information consistent with our Privacy Policies.
          </p>
          <h3>16. Account Information</h3>
          <p>
            1. You are responsible for all activity that occurs via your
            Account. You are required to notify Ellty immediately if you become
            aware of any unauthorised use of your Account.
          </p>
          <p>
            2. Ellty or Your account administrator may use your account
            information to manage your access to the Services.
          </p>
          <h3>17. Collection and Use of Data</h3>
          <p>
            1. By accepting these Terms, You consent to Ellty acting in
            accordance with the Terms, including but not limited to the Privacy
            Policy and Cookies Policy, as amended from time to time.
          </p>
          <p>
            2. Ellty works towards continually improving the Services to benefit
            You by improving its Products or Services and to provide further
            services or technologies to You. As such, Ellty may collect and use
            data to review Your experience with the Services.
          </p>
          <p>
            3. Ellty may periodically collect, monitor and use any technical,
            personal and related data concerning Your use of the Services,
            including the details of any:
          </p>
          <ul>
            <p>a) Technical issues You may be experiencing.</p>
            <p>
              b) Ellty Design that you have Exported or monitor anything You
              Export from or upload to the Website or Services
            </p>
            <p>
              c) Misuse of the Website or Services by You or any person using
              Your Account.
            </p>
          </ul>
          <p>
            4. You agree that Ellty at its sole discretion may opt to use
            recording software for this purpose and that Ellty may retain any
            data collected indefinitely. To the extent that Ellty will possess
            Personal Information, it will comply with its obligations under
            applicable data protection laws. Please see our Privacy Policy for
            more details on the processing of Your personal data that Ellty has
            collected and received through the Services.
          </p>
          <p>
            5. Where You have deleted data, including Personal Information, such
            data may persist in back-up copies for a reasonable time however
            Ellty does not take any responsibility in implementing or
            maintaining back-ups on your behalf.
          </p>
          <p>
            6. In relation to actual or suspected Data Incidents, Ellty shall:
          </p>
          <ul>
            <p>
              a) Implement and maintain reasonable and appropriate data security
              and incident management policies and procedures.
            </p>
            <p>
              b) Notify You without undue delay after becoming aware of the
              unlawful or accidental destruction, alteration or damage or loss,
              unauthorised disclosure of, or access to Data including Personal
              Information, transmitted, stored or otherwise processed by Ellty
              or of which Ellty becomes aware (Data Incident), as required to
              assist You in ensuring compliance with Your obligations to notify
              the Supervisory Authority in the event of Personal Information
              breach.
            </p>
          </ul>
          <p>
            7. Ellty shall make reasonable efforts to identify the cause of such
            Data Incident and take those steps as Ellty deems necessary and
            reasonable in order to remediate the cause of such as Data Incident,
            to the extent that the remediation is within Ellty’s reasonable
            control.
          </p>
          <p>
            8. The obligations set out above shall not apply to incidents that
            are caused by You or Your Users.
          </p>
          <p>
            9. When the Services provide storage, we recommend that you continue
            to back up your content regularly. You may store copies of any
            Content or work you have created which does not have a component, in
            whole or in part, of any Ellty Design in either an image file (e.g.
            .JPEG, .PNG, .GIF) file or PDF format.
          </p>
          <p>
            10. We may create reasonable technical limits on your content, such
            as limits on file size, storage space, processing capacity and other
            technical limits. We may suspend the Services until you are within
            the storage space limit associated with your Account.
          </p>
          <h3>18. Third Party Links or Software</h3>
          <p>
            1. The Services may contain advertising, software, hyperlinks and
            other pointers to websites operated by third parties (Linked
            Websites). We do not control Linked Websites and are therefore not
            responsible for the content of any Linked Website or any hyperlink
            contained in a Linked Website.
          </p>
          <p>
            2. We provide hyperlinks for your convenience only and do not
            indicate, expressly or implicitly, any endorsement, sponsorship or
            approval by us of a Linked Website or the products or services
            offered at Linked Websites. You visit Linked Websites entirely at
            your own risk.
          </p>
          <p>
            3. We do not provide any warranty or take any responsibility for any
            aspect of Linked Websites or their content. You should make your own
            investigations with respect to the suitability of goods or services
            offered to you via a Linked Website.
          </p>
          <h3>19. Warranties and Indemnities</h3>
          <p>
            1. By agreeing to the terms and conditions contained in these Terms,
            You warrant that you:
          </p>
          <ul>
            <p>
              a) Will provide true, accurate, current and complete information
              about yourself as a User as prompted in the Subscription process.
            </p>
            <p>
              b) Will maintain and promptly update the information provided
              during the Subscription process to keep your details up to date.
            </p>
            <p>c) Will not share your User ID with any third party.</p>
            <p>
              d) Will not use any Ellty Design or Stock Media for any use other
              than a Permitted Use.
            </p>
            <p>
              e) Will validate the accuracy of any factual information included
              in an Ellty Design.
            </p>
            <p>
              f) Will not engage in any conduct, which damages or is likely to
              prejudice Ellty’s business or reputation.
            </p>
            <p>
              g) Will not defame any person, infringe the copyright or other
              intellectual property rights of any third party.
            </p>
            <p>
              h) Will not breach, or cause Ellty to breach, any other law
              applicable to Ellty or an Ellty Design.
            </p>
          </ul>
          <p>
            2. Ellty warrants that no Stock Media will include any material
            which infringes any person’s intellectual property rights.
          </p>
          <p>
            3. If You provide any information that is untrue, inaccurate,
            outdated or incomplete, or if Ellty has reasonable grounds to
            suspect that such information is untrue, inaccurate, outdated or
            incomplete, Ellty may suspend or terminate your Account and refuse
            the Services.
          </p>
          <p>
            4. You acknowledge that misuse of the Website or a Service, as
            determined in the sole discretion of Ellty, may result in suspension
            or termination of Your access to the Services and any further action
            deemed necessary by Ellty.
          </p>
          <p>
            5. You indemnify Ellty against any and all liability, loss, costs
            and expenses arising from a breach by You or any of Your Users, of
            any warranty or representation or term within these Terms.
          </p>
          <p>
            6. We rely upon your continued observance of the Terms. If we suffer
            loss or damage or incur any costs associated with any breach by you
            of the Terms or any associated legal obligation, you agree to
            indemnify us for those losses, damages and costs.
          </p>
          <p>
            7. By using the Services, you agree to indemnify us from and against
            all actions, claims, suits, demands, damages, liabilities, costs or
            expenses (whether in tort or in contract including and without
            limitation, negligence) arising out of or in any way connected to
            the use of the Services by You.
          </p>
          <h3>20. Disclaimer</h3>
          <p>
            1. While Ellty has made reasonable efforts to correctly categorise,
            keyword, caption and title the Stock Media, Ellty takes no
            responsibility for the accuracy of such information, or any
            metadata, which may be provided with the Stock Media.
          </p>
          <p>
            2. Ellty takes no responsibility for any harm whatsoever, which may
            occur, as a direct or indirect result of Your use of the Services.
            You Use the Services is at Your own risk and the entire risk as to
            satisfactory quality, performance and accuracy is with You.
          </p>
          <p>
            3. Ellty takes no responsibility whatsoever, for any infringement of
            copyright or Intellectual Property rights, which may occur as a
            direct or indirect result of Your use of the Services.
          </p>
          <p>
            4. Ellty does not make any claims that the information is
            appropriate or may be downloaded in all areas, countries or
            jurisdictions. Access to the information contained in the Services
            may not be legal by certain persons or in certain countries. If You
            access the Services, you do so at your own risk and You are
            responsible for compliance with the laws of Your jurisdiction, and
            any other laws applicable to You.
          </p>
          <p>
            5. Some legislation such as the Australian Consumer and Competition
            Act 2010 (Cth) may confer you with rights and remedies relating to
            the provision of goods or services to you by us via the App and/or
            Service which cannot be excluded, restricted or modified (your
            Statutory Rights). We exclude all conditions and warranties implied
            by custom, law or statute except for your Statutory Rights.
          </p>
          <p>
            6. Except for your Statutory Rights and with respect to the App and
            the Services:
          </p>
          <ul>
            <p>
              a) All material displayed on the App is provided to you without
              warranties of any kind, either express or implied.
            </p>
            <p>
              b) The Service is provided to you without warranties of any kind,
              either express or implied.
            </p>
            <p>
              c) We expressly disclaim all warranties of any kind including but
              not limited to warranties of acceptable quality and fitness for a
              particular purpose.
            </p>
            <p>
              d) We do not warrant that the functions contained in any material
              within the App or your access to the App and/or Service will be
              uninterrupted or error free, that any defects will be corrected or
              that the App and/or Service, or the servers which stores and
              transmits material to you are free of viruses or any other harmful
              components.
            </p>
            <p>
              e) We do not warrant or make any representation regarding your
              access to, or the results of your access to, the App and/or
              Service including its correctness, accuracy, timeliness,
              completeness, reliability or otherwise.
            </p>
          </ul>
          <p>
            7. To the extent permitted by law, including but not limited to any
            act or omission on your part, we will not be liable for any loss,
            damage, costs or expense whether direct, indirect, incidental,
            special and/or consequential, including loss of profits, suffered by
            you or claims made against you which result from any use or access
            of, or any inability to use or access, the App and/or Service.
          </p>
          <p>
            8. You expressly acknowledge that we do not exert control over users
            of the Internet and we are not liable for damage suffered by you,
            either directly or indirectly, as a result of your access to the App
            and/or the Service. In particular, as the App and the Service may
            serve as a conduit for information, you may be able to access,
            download or otherwise use content provided by other users of the
            Service. Such content may contain viruses, spyware and other forms
            of malware. We do not undertake to screen the content and accept no
            liability for damage suffered by you, either directly or indirectly,
            as a result of your access to user generated content via the App
            and/or the Service.
          </p>
          <h3>21. Limitation of Liability</h3>
          <p>
            To the extent permitted by law, our liability for breach of any
            implied warranty or condition, which cannot be excluded by the Terms
            of Use, is limited, at our option, to one or more of the following:
          </p>
          <p>1. In the case of services supplied or offered by us:</p>
          <ul>
            <p>a) The resupply of the services.</p>
            <p>b) The payment of the cost of having the services resupplied.</p>
          </ul>
          <p>2. In the case of goods supplied or offered by us:</p>
          <ul>
            <p>
              a) The replacement of the goods or the supply of equivalent goods.
            </p>
            <p>
              b) The payment of the costs of replacing the goods or acquiring
              equivalent goods.
            </p>
            <p>c) The payment of the costs of having the goods repaired.</p>
          </ul>
          <h3>22. Fees, Payment, Period and Renewal</h3>
          <p>
            1. You agree to pay any and all applicable charges including any
            Fees associated with your Account, in advance, regardless of usage.
            For Products paid on a non-credit card based transaction, payment is
            due within thirty (30) days following the date of Ellty’s invoice,
            and any amount not paid when due is subject to interest at a rate of
            5% per annum calculated and charged daily. If an invoice is not paid
            when due, we reserve the right to suspend or terminate your licence,
            access or other rights to the related Services for which fees are
            not paid when due.
          </p>
          <p>
            2. No refunds or credits for charges or other fees or payments will
            be provided to you if you elect to cancel or downgrade your Services
            plan or scope of licence, access or other rights with respect
            thereto.
          </p>
          <p>
            3. You must pay any applicable GST under GST Law or any other
            applicable taxes or third-party fees (for example mobile carrier
            fees, data plan charges, credit card fees, foreign exchange fees)
            connected with the use of the Services.
          </p>
          <p>
            4. Where you elect to terminate the Services, and unless otherwise
            as a result of cause and by providing us with thirty (30) days
            written notice, you will not be entitled to a refund of the Fees.
          </p>
          <p>
            5. You agree to keep your credit card and other billing information
            that is provided to Ellty up to date at all times. If you do not
            notify us of updates to your payment methods and billing
            information, your use of the Services may be interrupted.
          </p>
          <p>
            6. The period of your Subscription will commence on the date in
            which you enter into a Subscription with us to obtain an Account and
            will continue until terminated in accordance with the Subscription
            Plan or terminated in accordance with these Terms.
          </p>
          <p>
            7. Where you have Subscribed to a Pro Licence, you may add
            additional Users beyond your initial user subscriptions at any time.
            Added user subscriptions are priced at the rates available at the
            time of purchase and will be invoiced to You at the time of your
            next billing cycle. All User Subscriptions under a specific plan
            will have the same scheduled subscription end date regardless of
            when additional Users were added to your Account.
          </p>
          <h3>23. Termination and Suspension of Account</h3>
          <p>
            1. The Terms are effective until terminated by us, which we may do
            at any time and without prior notice to you. In the event of
            termination, we will post a notice to that effect on the Website.
            All restrictions imposed on You by the Terms, confidentiality,
            intellectual property, warranties, indemnities, limitations of
            liability and governing laws set out in the Terms will survive
            termination.
          </p>
          <p>
            2. These Terms commence upon the User expressing his or her
            acceptance of the Terms contained on the Website.
          </p>
          <p>
            3. If You engage in any use of an Ellty Design or any Stock Media
            that does not constitute Permitted Use, then Ellty may, at its
            absolute discretion take all or any of the following actions:
          </p>
          <ul>
            <p>
              a) Terminate Your Account by giving you notice in writing with
              immediate effect.
            </p>
            <p>b) Suspend a Your Account.</p>
            <p>c) Take any further action it deems necessary.</p>
          </ul>
          <p>
            4. If any act by You or any person using Your access constitutes a
            breach of these Terms , then Ellty may, in its absolute discretion
            suspend and/or terminate Your Account, effective immediately.
          </p>
          <p>
            5. You may terminate these Terms by destroying the Ellty Design and
            Stock Media, along with copies or archives of it or accompanying
            materials, ceasing to use the Ellty App for any purpose and
            deactivating your Account.
          </p>
          <p>
            6. Termination of these Terms will not affect the accrued rights or
            remedies of either party.
          </p>
          <h3>24. Severability</h3>
          <p>
            If any provision of the Terms is found to be invalid or
            unenforceable by a Court of Law, such invalidity or unenforceability
            will not affect the remainder of the document, which will continue
            in full force and effect.
          </p>
          <h3>25. Jurisdiction and Governing Law</h3>
          <p>
            1. These Terms are governed by and construed in accordance with the
            laws of the State of Victoria, Australia, without regard to conflict
            of law provisions. You irrevocably and unconditionally submit to the
            exclusive jurisdiction of the Courts of Victoria and Courts of
            Appeal concerning any dispute in relation to these Terms or your
            Subscription.
          </p>
          <p>
            2. You may have additional rights and we do not seek to limit those
            rights to the extent prohibited by law.
          </p>
          <p>3. This clause will survive termination of any Subscription.</p>

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
