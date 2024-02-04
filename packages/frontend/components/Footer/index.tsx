import React from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import s from "./Footer.module.scss";
import clsx from "clsx";
import data from "../../data/main";
import { useCookies } from "react-cookie";
import { useSelector, useDispatch } from "react-redux";
import {
  ChangeLangAction,
  SetDesignTabAction,
  SetInitialSectionAction,
} from "../../redux/actions";
import { RootState } from "../../redux/store";
import ContainerFluid from "../ContainerFluid";
import jump from "jump.js";
import getHCLocale from "../../utils/getHCLocale";

interface FooterProps {
  local: any;
  languageSelector?: boolean;
}

const Footer: React.FC<React.PropsWithChildren<FooterProps>> = ({
  local,
  languageSelector = true,
}) => {
  const { locale } = useRouter();
  const dispatch = useDispatch();
  const [cookie, setCookie] = useCookies();

  const footerTooltipRef = React.useRef<any>(null);
  const footerTooltipBtn = React.useRef<any>(null);
  const [footerTooltipState, setFooterTooltipState] = React.useState(false);

  const footerLocal = local("footer", { returnObjects: true });

  const handleClickOutside = (event: any) => {
    /* @ts-ignore */
    if (
      footerTooltipRef.current &&
      !footerTooltipRef.current.contains(event.target) &&
      !footerTooltipBtn.current.contains(event.target)
    ) {
      setFooterTooltipState(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  const router = useRouter();
  const handleClickFooterLink = (category: string) => {
    dispatch(SetDesignTabAction(category));
    router.pathname == "/" ? jump("#slider") : router.push("/#slider");
  };

  const langState = useSelector((state: RootState) => state.mainReducer.lang);
  const langElements = data.langList.map((elem) => {
    return (
      <span
        key={elem.abbr}
        onClick={() => window.location.assign(`/${elem.abbr}${router.asPath}`)}
      >
        <div
          className={clsx(
            s.tooltipRow,
            langState.abbr == elem.abbr ? s.active : null
          )}
          onClick={() => {
            setFooterTooltipState(false);
            setCookie("locale", elem.abbr, { path: "/" });
          }}
        >
          {elem.value}
          {/* check svg */}
          <svg viewBox="0 0 12 8" fill="none">
            <path
              d="M11 1.5L5 7L1 4.5"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </span>
    );
  });

  const handleClickOpenDesign = (e: any) => {
    e.preventDefault();
    router.push("/design");
  };

  return (
    <section className={s.footer}>
      <div className={s.lineTop}></div>

      <div className={s.first}>
        <ContainerFluid>
          <div className={s.social}>
            <ul>
              <li className={clsx(s.socialItem, s.inst)}>
                <a
                  href="https://www.instagram.com/elltycom/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                >
                  <svg className={s.inst}>
                    <use href="#inst" />
                  </svg>
                  <span>Instagram</span>
                </a>
              </li>
              <li className={clsx(s.socialItem, s.fb)}>
                <a
                  href="https://www.facebook.com/elltycom/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                >
                  <svg className={s.fb}>
                    <use href="#fb" />
                  </svg>
                  <span>Facebook</span>
                </a>
              </li>
              <li className={clsx(s.socialItem, s.twitter)}>
                <a
                  href="https://twitter.com/elltycom"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter"
                >
                  <svg className={s.twitter}>
                    <use href="#twitter" />
                  </svg>
                  <span>Twitter</span>
                </a>
              </li>
              <li className={clsx(s.socialItem, s.pinterest)}>
                <a
                  href="https://www.pinterest.com/elltycom/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Pinterest"
                >
                  <svg className={s.pinterest}>
                    <use href="#pinterest" />
                  </svg>
                  <span>Pinterest</span>
                </a>
              </li>
            </ul>
            <a href="#">
              <img className={s.logo} src="/logo.svg" alt="logo" />
            </a>
          </div>
          {/* /.footer__social */}

          <div className={s.footerList}>
            <ul>
              <li className={s.footerListTitle}>{footerLocal.design.title}</li>
              <li>
                <NextLink href="/create/presentation" passHref>
                  <a href="#">{footerLocal.design.presentation}</a>
                </NextLink>
              </li>
              <li>
                <NextLink href="/create/business-card" passHref>
                  <a href="#">{footerLocal.design.card}</a>
                </NextLink>
              </li>
              <li>
                <NextLink href="/create/logo-maker" passHref>
                  <a href="#">{footerLocal.design.logo}</a>
                </NextLink>
              </li>
              <li>
                <NextLink href="/create/web-banner" passHref>
                  <a href="#">{footerLocal.design.banner}</a>
                </NextLink>
              </li>
              <li>
                <NextLink href="/create/media-kit" passHref>
                  <a href="#">{footerLocal.design.mediakit}</a>
                </NextLink>
              </li>
              <li>
                <NextLink href="/create/checklist" passHref>
                  <a href="#">{footerLocal.design.checklist}</a>
                </NextLink>
              </li>
              <li className={s.footerListLast}>
                <NextLink href="/create/proposal" passHref>
                  <a href="#">{footerLocal.design.proposal}</a>
                </NextLink>
              </li>
              <li className={s.footerListLast}>
                <NextLink href="/create/announcement" passHref>
                  <a href="#">{footerLocal.design.announcement}</a>
                </NextLink>
              </li>
              <li className={s.footerListLast}>
                <NextLink href="/create/resume" passHref>
                  <a href="#">{footerLocal.design.resume}</a>
                </NextLink>
              </li>
            </ul>
            <ul>
              <li className={s.footerListTitle}>
                {footerLocal.templates.title}
              </li>
              <li>
                <NextLink href="/create/instagram-post-maker" passHref>
                  <a href="#">{footerLocal.templates.instPost}</a>
                </NextLink>
              </li>
              <li>
                <NextLink href="/create/instagram-story-maker" passHref>
                  <a href="#">{footerLocal.templates.instStory}</a>
                </NextLink>
              </li>
              <li>
                <NextLink href="/create/facebook-post-maker" passHref>
                  <a href="#">{footerLocal.templates.fbPost}</a>
                </NextLink>
              </li>
              <li>
                <NextLink href="/create/facebook-covers" passHref>
                  <a href="#">{footerLocal.templates.fbcover}</a>
                </NextLink>
              </li>
              <li>
                <NextLink href="/create/youtube-thumbnail" passHref>
                  <a href="#">{footerLocal.templates.youtubethumbnail}</a>
                </NextLink>
              </li>
              <li>
                <NextLink href="/create/youtube-banner-maker" passHref>
                  <a href="#">{footerLocal.templates.youtubecover}</a>
                </NextLink>
              </li>
              <li>
                <NextLink href="/create/twitter-post" passHref>
                  <a href="#">{footerLocal.templates.twitterpost}</a>
                </NextLink>
              </li>
              <li>
                <NextLink href="/create/pinterest-pin" passHref>
                  <a href="#">{footerLocal.templates.pinPin}</a>
                </NextLink>
              </li>
            </ul>
            <ul>
              <li className={s.footerListTitle}>{footerLocal.info.title}</li>
              <li>
                <NextLink href="/create/flyer" passHref>
                  <a href="#">{footerLocal.info.flyer}</a>
                </NextLink>
              </li>
              <li>
                <NextLink href="/create/infographic" passHref>
                  <a href="#">{footerLocal.info.infographic}</a>
                </NextLink>
              </li>
              <li>
                <NextLink href="/create/brochure" passHref>
                  <a href="#">{footerLocal.info.brochure}</a>
                </NextLink>
              </li>
              <li>
                <NextLink href="/create/menu" passHref>
                  <a href="#">{footerLocal.info.menu}</a>
                </NextLink>
              </li>
              <li>
                <NextLink href="/create/invitation" passHref>
                  <a href="#">{footerLocal.info.invitation}</a>
                </NextLink>
              </li>
              <li>
                <NextLink href="/create/postcard" passHref>
                  <a href="#">{footerLocal.info.postcard}</a>
                </NextLink>
              </li>
              <li>
                <NextLink href="/create/certificate" passHref>
                  <a href="#">{footerLocal.info.certificate}</a>
                </NextLink>
              </li>
              <li>
                <NextLink href="/create/label" passHref>
                  <a href="#">{footerLocal.info.label}</a>
                </NextLink>
              </li>
              <li>
                <NextLink href="/create/sticker" passHref>
                  <a href="#">{footerLocal.info.sticker}</a>
                </NextLink>
              </li>
            </ul>
            <ul>
              <li className={s.footerListTitle}>{footerLocal.prod.title}</li>
              <li>
                <NextLink href="/features/photo-editor" passHref>
                  <a href="#">{footerLocal.prod.photoeditor}</a>
                </NextLink>
              </li>
              <li>
                <NextLink href="/features/add-text-to-photo" passHref>
                  <a href="#">{footerLocal.prod.addtexttophoto}</a>
                </NextLink>
              </li>
              <li>
                <NextLink href="/features/add-photo-to-photo" passHref>
                  <a href="#">{footerLocal.prod.addphototophoto}</a>
                </NextLink>
              </li>
              <li>
                <NextLink href="/create/watermark" passHref>
                  <a href="#">{footerLocal.prod.watermark}</a>
                </NextLink>
              </li>
            </ul>
            <ul>
              <li className={s.footerListTitle}>{footerLocal.company.title}</li>
              <li>
                <NextLink href="/plans" passHref>
                  <a href="#">{footerLocal.company.plans}</a>
                </NextLink>
              </li>
              <li>
                <NextLink href={getHCLocale(locale)} passHref>
                  <a href="#">{footerLocal.company.contacts}</a>
                </NextLink>
              </li>
              <li>
                <NextLink href="/contact" passHref>
                  <a href="#">{footerLocal.company.contact}</a>
                </NextLink>
              </li>
              <li>
                <NextLink href="/policy/privacy-policy" passHref>
                  <a href="#">{footerLocal.company.privacypolicy}</a>
                </NextLink>
              </li>
              <li>
                <NextLink href="/policy/cookie-policy" passHref>
                  <a href="#">{footerLocal.company.cookiepolicy}</a>
                </NextLink>
              </li>
            </ul>
          </div>

          <div className={clsx(s.footerList, s.mobile)}>
            <div>
              <ul>
                <li className={s.footerListTitle}>
                  {footerLocal.design.title}
                </li>
                <li>
                  <NextLink href="/create/presentation" passHref>
                    <a href="#">{footerLocal.design.presentation}</a>
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/create/business-card" passHref>
                    <a href="#">{footerLocal.design.card}</a>
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/create/logo-maker" passHref>
                    <a href="#">{footerLocal.design.logo}</a>
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/create/web-banner" passHref>
                    <a href="#">{footerLocal.design.banner}</a>
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/create/media-kit" passHref>
                    <a href="#">{footerLocal.design.mediakit}</a>
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/create/checklist" passHref>
                    <a href="#">{footerLocal.design.checklist}</a>
                  </NextLink>
                </li>
                <li className={s.footerListLast}>
                  <NextLink href="/create/proposal" passHref>
                    <a href="#">{footerLocal.design.proposal}</a>
                  </NextLink>
                </li>
                <li className={s.footerListLast}>
                  <NextLink href="/create/announcement" passHref>
                    <a href="#">{footerLocal.design.announcement}</a>
                  </NextLink>
                </li>
                <li className={s.footerListLast}>
                  <NextLink href="/create/resume" passHref>
                    <a href="#">{footerLocal.design.resume}</a>
                  </NextLink>
                </li>
              </ul>
              <ul>
                <li className={s.footerListTitle}>
                  {footerLocal.templates.title}
                </li>
                <li>
                  <NextLink href="/create/instagram-post-maker" passHref>
                    <a href="#">{footerLocal.templates.instPost}</a>
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/create/instagram-story-maker" passHref>
                    <a href="#">{footerLocal.templates.instStory}</a>
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/create/facebook-post-maker" passHref>
                    <a href="#">{footerLocal.templates.fbPost}</a>
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/templates/facebook-cover" passHref>
                    <a href="#">{footerLocal.templates.fbcover}</a>
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/create/youtube-thumbnail" passHref>
                    <a href="#">{footerLocal.templates.youtubethumbnail}</a>
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/create/youtube-banner-maker" passHref>
                    <a href="#">{footerLocal.templates.youtubecover}</a>
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/create/twitter-post" passHref>
                    <a href="#">{footerLocal.templates.twitterpost}</a>
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/create/pinterest-pin" passHref>
                    <a href="#">{footerLocal.templates.pinPin}</a>
                  </NextLink>
                </li>
              </ul>
            </div>

            <div>
              <ul>
                <li className={s.footerListTitle}>
                  <a href="#">{footerLocal.info.title}</a>
                </li>
                <li>
                  <NextLink href="/create/flyer" passHref>
                    <a href="#">{footerLocal.info.flyer}</a>
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/create/infographic" passHref>
                    <a href="#">{footerLocal.info.infographic}</a>
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/create/brochure" passHref>
                    <a href="#">{footerLocal.info.brochure}</a>
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/create/menu" passHref>
                    <a href="#">{footerLocal.info.menu}</a>
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/create/invitation" passHref>
                    <a href="#">{footerLocal.info.invitation}</a>
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/create/postcard" passHref>
                    <a href="#">{footerLocal.info.postcard}</a>
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/create/certificate" passHref>
                    <a href="#">{footerLocal.info.certificate}</a>
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/create/label" passHref>
                    <a href="#">{footerLocal.info.label}</a>
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/create/sticker" passHref>
                    <a href="#">{footerLocal.info.sticker}</a>
                  </NextLink>
                </li>
              </ul>
              <ul>
                <li className={s.footerListTitle}>{footerLocal.prod.title}</li>
                <li>
                  <NextLink href="/features/photo-editor" passHref>
                    <a href="#">{footerLocal.prod.photoeditor}</a>
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/features/add-text-to-photo" passHref>
                    <a href="#">{footerLocal.prod.addtexttophoto}</a>
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/features/add-photo-to-photo" passHref>
                    <a href="#">{footerLocal.prod.addphototophoto}</a>
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/create/watermark" passHref>
                    <a href="#">{footerLocal.prod.watermark}</a>
                  </NextLink>
                </li>
              </ul>
              <ul>
                <li className={s.footerListTitle}>
                  {footerLocal.company.title}
                </li>
                <li>
                  <NextLink href="/plans" passHref>
                    <a href="#">{footerLocal.company.plans}</a>
                  </NextLink>
                </li>
                <li>
                  <NextLink href={getHCLocale(locale)} passHref>
                    <a href="#">{footerLocal.company.contacts}</a>
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/contact" passHref>
                    <a href="#">{footerLocal.company.contact}</a>
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/policy/privacy-policy" passHref>
                    <a href="#">{footerLocal.company.privacypolicy}</a>
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/policy/cookie-policy" passHref>
                    <a href="#">{footerLocal.company.cookiepolicy}</a>
                  </NextLink>
                </li>
              </ul>
            </div>
          </div>
        </ContainerFluid>
      </div>

      <div className={s.lineBottom}></div>

      <div className={s.second}>
        <ContainerFluid>
          <div className={s.infoLeft}>
            {languageSelector && (
              <div className={s.infoLang}>
                <div
                  ref={footerTooltipBtn}
                  onClick={() => {
                    setFooterTooltipState(!footerTooltipState);
                  }}
                  className={s.infoLangPicker}
                >
                  <svg className={s.langSvg} viewBox="0 0 17 17" fill="none">
                    <path
                      d="M1 8.3125C1 12.3512 4.27381 15.625 8.3125 15.625C12.3512 15.625 15.625 12.3512 15.625 8.3125C15.625 4.27381 12.3512 1 8.3125 1C4.27381 1 1 4.27381 1 8.3125Z"
                      stroke="#36373C"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.90786 1.21077L9.61863 0.802915L8.80291 1.38137L9.09214 1.78923L9.90786 1.21077ZM8.60448 15.1941C8.43555 15.4126 8.47568 15.7266 8.69411 15.8955C8.91255 16.0645 9.22658 16.0243 9.39552 15.8059L8.60448 15.1941ZM9.5 1.5C9.09214 1.78923 9.09203 1.78907 9.09192 1.78891C9.09189 1.78887 9.09179 1.78873 9.09173 1.78865C9.09162 1.78849 9.09153 1.78837 9.09147 1.78828C9.09135 1.78811 9.09133 1.78808 9.09141 1.78819C9.09157 1.78842 9.09213 1.78922 9.09308 1.7906C9.09497 1.79334 9.09841 1.79838 9.1033 1.80569C9.11307 1.82032 9.12862 1.84404 9.14914 1.87677C9.19018 1.94223 9.25105 2.04367 9.32523 2.18032C9.47363 2.45364 9.67516 2.86755 9.87789 3.41601C10.2831 4.51233 10.6937 6.14768 10.6937 8.27594H11.6937C11.6937 6.01669 11.2575 4.26408 10.8159 3.0693C10.5952 2.47222 10.3732 2.0148 10.2041 1.70318C10.1195 1.54735 10.048 1.42792 9.99642 1.34562C9.97062 1.30447 9.94978 1.2726 9.93475 1.2501C9.92723 1.23884 9.92116 1.22993 9.91664 1.22337C9.91438 1.2201 9.91251 1.21741 9.91104 1.2153C9.91031 1.21425 9.90968 1.21335 9.90914 1.21259C9.90888 1.21222 9.90864 1.21188 9.90842 1.21157C9.90832 1.21142 9.90817 1.21122 9.90812 1.21114C9.90798 1.21095 9.90786 1.21077 9.5 1.5ZM10.6937 8.27594C10.6937 10.386 10.1662 12.1236 9.63856 13.3334C9.3749 13.938 9.11199 14.409 8.91685 14.7263C8.81932 14.8849 8.73888 15.0049 8.68396 15.0838C8.65651 15.1232 8.63545 15.1523 8.62184 15.1708C8.61504 15.1801 8.61011 15.1867 8.60717 15.1906C8.6057 15.1925 8.60473 15.1938 8.60428 15.1944C8.60405 15.1947 8.60395 15.1948 8.60399 15.1948C8.604 15.1947 8.60405 15.1947 8.60414 15.1946C8.60418 15.1945 8.60426 15.1944 8.60428 15.1944C8.60438 15.1942 8.60448 15.1941 9 15.5C9.39552 15.8059 9.39564 15.8057 9.39577 15.8056C9.39582 15.8055 9.39596 15.8053 9.39606 15.8052C9.39628 15.8049 9.39653 15.8046 9.39681 15.8042C9.39738 15.8035 9.39808 15.8026 9.3989 15.8015C9.40056 15.7993 9.40274 15.7964 9.40542 15.7929C9.41078 15.7858 9.41816 15.7759 9.42743 15.7633C9.44596 15.7381 9.47203 15.702 9.50456 15.6553C9.56961 15.5619 9.66056 15.426 9.7687 15.2501C9.98488 14.8985 10.2704 14.3861 10.5552 13.7332C11.1244 12.4278 11.6937 10.5534 11.6937 8.27594H10.6937Z"
                      fill="#36373C"
                    />
                    <path
                      d="M6.79557 15.8543C6.96259 16.0742 7.27626 16.1171 7.49616 15.9501C7.71607 15.783 7.75895 15.4694 7.59193 15.2495L6.79557 15.8543ZM7.38335 1.821L7.70435 1.43766L6.93766 0.795647L6.61665 1.179L7.38335 1.821ZM7.19375 15.5519C7.59193 15.2495 7.59203 15.2496 7.59212 15.2497C7.59214 15.2497 7.59222 15.2498 7.59226 15.2499C7.59234 15.25 7.59238 15.2501 7.59239 15.2501C7.59242 15.2501 7.59231 15.25 7.59207 15.2497C7.5916 15.249 7.59061 15.2477 7.58912 15.2457C7.58614 15.2417 7.58117 15.2349 7.57432 15.2254C7.56064 15.2065 7.5395 15.1768 7.51196 15.1366C7.45687 15.0562 7.37626 14.934 7.27858 14.7729C7.0831 14.4503 6.81987 13.9725 6.55593 13.3611C6.02769 12.1373 5.5 10.3862 5.5 8.27594H4.5C4.5 10.5532 5.06919 12.4401 5.63782 13.7574C5.92232 14.4165 6.20753 14.935 6.42338 15.2912C6.53135 15.4693 6.62213 15.6071 6.68702 15.7018C6.71946 15.7492 6.74545 15.7858 6.7639 15.8113C6.77313 15.824 6.78047 15.834 6.78579 15.8412C6.78845 15.8448 6.79061 15.8477 6.79225 15.8499C6.79306 15.851 6.79375 15.8519 6.79431 15.8526C6.79458 15.853 6.79483 15.8533 6.79504 15.8536C6.79514 15.8537 6.79528 15.8539 6.79533 15.854C6.79546 15.8541 6.79557 15.8543 7.19375 15.5519ZM5.5 8.27594C5.5 6.15999 5.98196 4.5339 6.45825 3.44267C6.69658 2.89664 6.93364 2.48425 7.10843 2.2116C7.1958 2.07531 7.26753 1.97408 7.31594 1.90868C7.34014 1.87599 7.3585 1.85227 7.37006 1.83761C7.37584 1.83029 7.37992 1.82524 7.38217 1.82246C7.3833 1.82108 7.38397 1.82026 7.38417 1.82002C7.38427 1.81989 7.38426 1.81992 7.38412 1.82008C7.38405 1.82016 7.38395 1.82028 7.38382 1.82043C7.38376 1.82051 7.38364 1.82065 7.38361 1.82069C7.38348 1.82084 7.38335 1.821 7 1.5C6.61665 1.179 6.6165 1.17917 6.61634 1.17936C6.61628 1.17944 6.61612 1.17963 6.61599 1.17978C6.61574 1.18008 6.61546 1.18042 6.61515 1.18079C6.61453 1.18154 6.61379 1.18244 6.61293 1.18348C6.61121 1.18557 6.60901 1.18824 6.60635 1.19151C6.60104 1.19804 6.59389 1.20693 6.58502 1.21817C6.56728 1.24065 6.54267 1.27253 6.51219 1.31371C6.45122 1.39607 6.3667 1.51571 6.26657 1.6719C6.06636 1.98419 5.80342 2.44313 5.54175 3.04264C5.01804 4.2425 4.5 6.00439 4.5 8.27594H5.5Z"
                      fill="#36373C"
                    />
                    <path
                      d="M2 11H15"
                      stroke="#36373C"
                      strokeLinecap="square"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 6H15"
                      stroke="#36373C"
                      strokeLinecap="square"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>
                    {langState.value}
                    {/* <svg className="footer__info-chevron--svg"><use href="#chevron"/></svg> */}
                    <svg className={s.chevronSvg} viewBox="0 0 6 10">
                      <path
                        d="M1.45222 0.644603L5.40234 4.59473L1.39462 8.60245"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
                <div
                  ref={footerTooltipRef}
                  className={clsx(s.tooltip, footerTooltipState && s.active)}
                >
                  {langElements}
                </div>
              </div>
            )}
            <div className={s.footerLinks}>
              <NextLink href="/policy/terms-of-use" passHref>
                <a className={s.footerLink} href="#">
                  {footerLocal.bottom.polUse}
                </a>
              </NextLink>
              <NextLink href="/policy/privacy-policy" passHref>
                <a href="#">{footerLocal.bottom.polConf}</a>
              </NextLink>
            </div>
          </div>
          <div className={s.infoRight}>
            {footerLocal.bottom.copyright} <sup>{footerLocal.bottom.tm}</sup>
          </div>
        </ContainerFluid>
      </div>
    </section>
  );
};

export default Footer;
