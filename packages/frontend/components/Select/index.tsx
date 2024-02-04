import React from "react";
import s from "./Select.module.scss";
import clsx from "clsx";
import StatusBadge from "../StatusBadge";
import { useDispatch } from "react-redux";
import {
  ChangeAuthFormAction,
  ToggleAuthModalAction,
  ToggleRemainingDownloadsModalAction,
} from "../../redux/actions";
import useTypedSelector from "../../utils/useTypedSelector";

interface SelectProps {
  value: any;
  elements: any;
  onSelect: any;
  downloadDropdown?: boolean;
  cookieUser?: any;
  isDropDownUp?: boolean;
  mobile?: boolean;
}

const Select: React.FC<React.PropsWithChildren<SelectProps>> = ({
  value,
  elements,
  onSelect,
  downloadDropdown,
  cookieUser,
  isDropDownUp,
  mobile = false,
}) => {
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.mainReducer.user);
  const dropdownRef = React.useRef<any>(null);
  const inputRef = React.useRef<any>(null);
  const [isOpenDropdown, setIsOpenDropdown] = React.useState(false);

  const handleClickOutside = (event: any) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !inputRef.current.contains(event.target) &&
      !document.querySelector(".modal")
    ) {
      setIsOpenDropdown(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  const dropdownElements = elements.map((item: any) => {
    if (downloadDropdown)
      return (
        <div
          className={clsx(
            s.dropdownElement,
            s.downloadElement,
            user.plan !== "pro" && item.pro && s.disabled
          )}
          key={item.value}
          onClick={() => {
            // console.log(cookieUser);
            if (user.plan === null) {
              dispatch(ToggleAuthModalAction(null));
              dispatch(ChangeAuthFormAction("logIn"));
              return;
            }

            if (user.plan !== "pro" && item.pro) {
              dispatch(ToggleRemainingDownloadsModalAction(true));
              return;
            }

            onSelect(item);
            setIsOpenDropdown(false);
          }}
        >
          <div className={clsx(user.plan !== "pro" && item.pro && s.disabled)}>
            <svg className={s[item.svg]}>
              <use href={`#${item.svg}`} />
            </svg>
            {item.value}
          </div>
          {item.pro && <StatusBadge />}
        </div>
      );

    return (
      <div
        className={clsx(s.dropdownElement)}
        key={item.value}
        onClick={() => {
          onSelect(item);
          setIsOpenDropdown(false);
        }}
      >
        {item.value}
      </div>
    );
  });

  return (
    <div className={s.root}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onClick={() => {
          setIsOpenDropdown(!isOpenDropdown);
        }}
        // this prevents the selection of text inside the input
        onMouseDown={(e) => {
          e.preventDefault();
        }}
        readOnly
      />

      <div
        ref={dropdownRef}
        className={clsx(
          s.dropdown,
          isOpenDropdown && s.open,
          isDropDownUp && s.dropDownUp,
          mobile && s.mobileDropDown
        )}
      >
        {dropdownElements}
      </div>
    </div>
  );
};

export default Select;

// export const DownloadSelect:React.FC<SelectProps> = ({value, elements, onSelect}) => {
//   const dropdownElements = elements.map((s: any) => {
//     return (
//       <div
//         key={s.value}
//         onClick={() => {
//           onSelect(s)
//           setIsOpenDropdown(false)
//         }}
//       >
//         <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
//           <path fillRule="evenodd" clipRule="evenodd" d="M4.39207 1.38789C2.71702 1.38789 1.63477 2.53644 1.63477 4.30834V9.64744C1.63477 10.1447 1.72707 10.5886 1.88502 10.9728C1.89183 10.9647 2.04052 10.7835 2.2345 10.5471C2.61377 10.0849 3.1662 9.41168 3.17007 9.40824C3.61987 8.89474 4.46422 8.12904 5.57247 8.59249C5.81532 8.69319 6.03118 8.83112 6.2299 8.9581C6.24925 8.97047 6.26843 8.98273 6.28747 8.99484C6.65992 9.24379 6.87897 9.36079 7.10647 9.34129C7.20072 9.32829 7.28912 9.30034 7.37297 9.24834C7.68927 9.05334 8.50932 7.89139 8.75489 7.54344C8.79091 7.49241 8.81457 7.45888 8.82247 7.44849C9.53097 6.52549 10.623 6.27849 11.533 6.82449C11.6552 6.89729 12.5307 7.50894 12.8206 7.75464V4.30834C12.8206 2.53644 11.7384 1.38789 10.0575 1.38789H4.39207ZM10.0567 0.481445C12.2517 0.481445 13.7266 2.01675 13.7266 4.30865V9.64775C13.7266 9.70539 13.7205 9.75944 13.7145 9.81347C13.7102 9.85143 13.706 9.88938 13.7038 9.92854C13.7024 9.95222 13.7017 9.9759 13.7011 9.99958C13.7002 10.0312 13.6993 10.0627 13.6967 10.0943C13.6954 10.1066 13.6929 10.1185 13.6905 10.1304C13.688 10.1422 13.6856 10.1541 13.6843 10.1664C13.6629 10.3705 13.6297 10.5655 13.5836 10.7547C13.5727 10.802 13.5601 10.8475 13.5473 10.8935L13.5446 10.9035C13.4926 11.0868 13.4315 11.2617 13.358 11.4287C13.3451 11.4568 13.3316 11.4842 13.318 11.5116C13.309 11.5298 13.2999 11.5481 13.2911 11.5665C13.2118 11.7258 13.126 11.8785 13.0265 12.0202C13.0081 12.0465 12.9885 12.0711 12.9689 12.0957C12.956 12.1119 12.943 12.1282 12.9303 12.145C12.827 12.2789 12.7191 12.407 12.5969 12.5233C12.5725 12.5465 12.5461 12.5678 12.5197 12.589C12.5032 12.6023 12.4868 12.6155 12.4708 12.6293C12.3453 12.7372 12.2173 12.8405 12.0762 12.9289C12.0454 12.9483 12.0127 12.9645 11.9801 12.9807C11.9591 12.9911 11.938 13.0016 11.9176 13.0128C11.774 13.0921 11.629 13.1694 11.4711 13.2292C11.4331 13.2437 11.3926 13.2541 11.3521 13.2646C11.3233 13.272 11.2944 13.2795 11.2663 13.2884C11.2523 13.2927 11.2382 13.2971 11.2242 13.3015C11.0831 13.3454 10.9424 13.3891 10.7905 13.4151C10.7025 13.4306 10.6091 13.4365 10.5156 13.4424C10.4752 13.445 10.4347 13.4476 10.3947 13.4509C10.3516 13.4541 10.3094 13.4593 10.2671 13.4645C10.1984 13.473 10.1295 13.4814 10.0567 13.4814H4.39126C4.14686 13.4814 3.91351 13.4567 3.68796 13.4197L3.66391 13.4158C2.78446 13.2643 2.05451 12.8399 1.54296 12.1996C1.53941 12.1996 1.53801 12.1972 1.53616 12.1941C1.53495 12.192 1.53356 12.1896 1.53126 12.1873C1.01711 11.5399 0.726562 10.6695 0.726562 9.64775V4.30865C0.726562 2.01675 2.20271 0.481445 4.39126 0.481445H10.0567ZM6.57617 4.71617C6.57617 5.59689 5.83925 6.33145 4.95432 6.33145C4.17646 6.33145 3.51324 5.76312 3.36459 5.02731C3.34003 4.9169 3.32617 4.80336 3.32617 4.68606C3.32617 3.79907 4.04671 3.08145 4.93732 3.08145C5.3908 3.08145 5.80146 3.27214 6.0956 3.57638C6.391 3.86995 6.57617 4.27455 6.57617 4.71617Z" fill="#1F2128"/>
//         </svg>
//         {s.value}
//         <StatusBadge />
//       </div>
//     )
//   })
// }
