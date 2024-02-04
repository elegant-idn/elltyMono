import { useRef, useState } from "react";
import { useClickOutside } from "./useClickOutside";

export const useDropdown = () => {
  const [anchor, setAnchor] = useState<null | HTMLButtonElement>(null);
  const popperRef = useRef(null);
  const [activeItem, setActiveItem] = useState<any | null>(null);

  const closeDropdown = () => {
    setAnchor(null);
    setActiveItem(null);
  };

  const openDropdown = (ref: any, item?: any) => {
    if (item._id === activeItem?._id) {
      closeDropdown();
      return;
    }

    setAnchor(ref.current);
    setActiveItem(item ?? null);
  };

  useClickOutside(popperRef, closeDropdown, anchor);

  return { closeDropdown, openDropdown, anchor, popperRef, activeItem };
};
