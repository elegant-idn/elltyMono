import Image from "next/image";
import React from "react";
import s from "./ImageStack.module.scss";

interface ImageStackProps {
  images: { preview: string; title?: string; _id: string }[];
}

export const ImageStack: React.FC<ImageStackProps> = ({ images }) => {
  const imagesToShow = images.slice(0, 3);

  return (
    <div className={s.images}>
      {imagesToShow.map((image) => {
        return (
          <React.Fragment key={image._id}>
            <div className={s.spacingImage} />
            <div className={s.imageContainer}>
              <Image
                src={image.preview}
                alt={image.title}
                layout="fill"
                objectFit="cover"
                loader={(props) => props.src}
              />
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
