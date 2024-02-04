import Image from "next/image";
import s from "./BrandIdentity.module.scss";
import Container from "../../Container";
import { useTranslation } from "next-i18next";

interface BrandIdentityProps {
  title?: string;
  subtitle?: string;
}

const BrandIdentity: React.FC<React.PropsWithChildren<BrandIdentityProps>> = ({
  title,
  subtitle,
}) => {
  const { t }: any = useTranslation("ContentBlocks");
  const i18n = t("brandIdentity", { returnObjects: true });

  return (
    <div className={s.root}>
      <Container>
        <div className={s.title}>{title || i18n.title}</div>
        <div className={s.subtitle}>{subtitle || i18n.subtitle}</div>

        <div className={s.grid}>
          <div className={s.gridItem}>
            <div className={s.text}>{i18n.card1}</div>
            <div className={s.imgWrapper}>
              <div className={s.img}>
                <Image
                  src="/create/brand1.png"
                  width={275}
                  height={168}
                  layout="responsive"
                  alt="block image"
                />
              </div>
            </div>
          </div>
          <div className={s.gridItem}>
            <div className={s.text}>{i18n.card2}</div>
            <div className={s.imgWrapper}>
              <div className={s.img}>
                <Image
                  src="/create/brand2.png"
                  width={205}
                  height={156}
                  layout="responsive"
                  alt="block image"
                />
              </div>
            </div>
          </div>
          <div className={s.gridItem}>
            <div className={s.text}>{i18n.card3}</div>
            <div className={s.imgWrapper}>
              <div className={s.img}>
                <Image
                  src="/create/brand3.png"
                  width={253}
                  height={133}
                  layout="responsive"
                  alt="block image"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BrandIdentity;
