import React from "react";
import { nanoid } from "nanoid";
import clsx from "clsx";
import s from "./SelectAdmin.module.scss";
import { InputCheckbox } from "../Inputs";
import { Api } from "../../api";
import { useCookies } from "react-cookie";

interface SelectAdminProps {
  // to query the database
  elemName: string;
  getElemName: string;
  // triggered when an element is added/removed from the database
  updateElements: any;
  elements: any;
  selectedElements: any;
  changeSelectedElements: any;
  searchTerm: string;
  changeSearchTerm: any;
}

interface TagItemProps {
  label: string;
  deleteTagItem: any;
}

const TagItem: React.FC<React.PropsWithChildren<TagItemProps>> = ({
  label,
  deleteTagItem,
}) => {
  return (
    <div className={s.tag} onClick={deleteTagItem}>
      <span>{label}</span>
      <button type="button">
        <svg viewBox="0 0 20 20" focusable="false" aria-hidden="true">
          <path d="m11.414 10 4.293-4.293a.999.999 0 1 0-1.414-1.414L10 8.586 5.707 4.293a.999.999 0 1 0-1.414 1.414L8.586 10l-4.293 4.293a.999.999 0 1 0 1.414 1.414L10 11.414l4.293 4.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L11.414 10z"></path>
        </svg>
      </button>
    </div>
  );
};

const SelectAdmin: React.FC<React.PropsWithChildren<SelectAdminProps>> = ({
  elemName,
  getElemName,
  updateElements,
  elements,
  selectedElements,
  changeSelectedElements,
  searchTerm,
  changeSearchTerm,
}) => {
  const [cookie] = useCookies();

  const dropdownRef = React.useRef(null);
  const [isOpenDropdown, setIsOpenDropdown] = React.useState(false);

  const deleteTagItem = (item: any) => {
    const idx = selectedElements.findIndex((s: any) => s == item);

    selectedElements.find((s: any) => s == item)
      ? changeSelectedElements([
          ...selectedElements.slice(0, idx),
          ...selectedElements.slice(idx + 1),
        ])
      : // @ts-ignore
        changeSelectedElements([...selectedElements, item]);
  };

  const tagItems = selectedElements.map((item: any) => {
    return (
      <TagItem
        key={item._id}
        label={item.value}
        deleteTagItem={() => {
          deleteTagItem(item);
        }}
      />
    );
  });

  const visibleDropdownItems = elements.filter((item: any) => {
    // console.log(item);
    return (
      item.value.toLowerCase().indexOf(searchTerm.toLowerCase().trim()) > -1
    );
  });

  const addTagHandler = () => {
    if (!searchTerm) return;

    const body = JSON.stringify({
      value: searchTerm,
    });

    // console.log(searchTerm);

    const config = {
      headers: {
        Authorization: cookie.user.accessToken,
      },
    };

    Api.post(`/${elemName}/create`, body, config)
      .then((result) => {
        console.log(result);

        Api.get(`/${getElemName}`)
          .then((result) => {
            // updateElements(result.data);
            const item = result.data.find((s: any) => s.value == searchTerm);
            elements.push(item);
            changeSelectedElements([...selectedElements, item]);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setIsOpenDropdown(false);
            changeSearchTerm("");
          });
      })
      .catch((err) => {
        console.log(err.response);
      })
      .finally(() => {
        // setIsOpenDropdown(false)
        // changeSearchTerm('')
      });
  };

  const deleteTagHandler = (elem: any) => {
    const body = JSON.stringify({
      value: searchTerm,
    });

    const config = {
      headers: {
        Authorization: cookie.user.accessToken,
      },
    };

    const idx = selectedElements.findIndex((s: any) => s._id == elem._id);

    Api.delete(`/${elemName}/${elem._id}`, config)
      .then((result) => {
        console.log(result);
        // changeSelectedElements([...selectedElements.slice(0, idx), ...selectedElements.slice(idx + 1)])
        // console.log(selectedElements);
        // console.log(selectedElements.slice(0, idx), selectedElements.slice(idx + 1));

        Api.get(`/${getElemName}`)
          .then((result) => {
            // console.log(result.data);
            // requesting all tags from the server after deletion
            updateElements(result.data);

            // if the item that was deleted was selected, then it is removed from the selected items
            if (idx != -1) {
              changeSelectedElements([
                ...selectedElements.slice(0, idx),
                ...selectedElements.slice(idx + 1),
              ]);
            }
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setIsOpenDropdown(false);
            changeSearchTerm("");
          });
      })
      .catch((err) => {
        console.log(err.response);
      })
      .finally(() => {
        // setIsOpenDropdown(false)
        // changeSearchTerm('')
      });
  };

  // if there is no element in the tag list that is equal
  // to the searchTerm, then this element is added
  const addTagItem = searchTerm.trim() &&
    !elements.find((s: any) => s.value == searchTerm.trim()) && (
      <div
        className={clsx(s.dropdownItem, s.dropdownAddItem)}
        onClick={addTagHandler}
      >
        <svg viewBox="0 0 20 20">
          <path d="M15 10a1 1 0 0 1-1 1h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 2 0v3h3a1 1 0 0 1 1 1zm-5-8a8 8 0 1 0 0 16 8 8 0 0 0 0-16z"></path>
        </svg>
        <span>{searchTerm}</span>
      </div>
    );

  const toggleTermTag = (item: any) => {
    // console.log(selectedElements.push(item));
    const idx = selectedElements.findIndex((s: any) => s._id == item._id);

    selectedElements.find((s: any) => s._id == item._id)
      ? changeSelectedElements([
          ...selectedElements.slice(0, idx),
          ...selectedElements.slice(idx + 1),
        ])
      : // @ts-ignore
        changeSelectedElements([...selectedElements, item]);

    // console.log(selectedElements, 'gg');
  };

  const termTags = visibleDropdownItems.map((item: any) => {
    const isActive = selectedElements.find((s: any) => s._id == item._id);

    return (
      <div
        key={item._id}
        className={s.dropdownItem}
        onClick={() => {
          toggleTermTag(item);
        }}
        // onClick={() => {console.log('console.log')}}
      >
        <div
          onClick={(e) => {
            e.preventDefault();
          }}
          className={s.checkbox}
        >
          {/* @ts-ignore */}
          <InputCheckbox
            // onChange={() => {setIsActive(!isActive)}}
            value={isActive}
            checked={isActive}
            variant="blue"
          />
        </div>
        <span>{item.value}</span>
        {/* <div className={s.deleteBtn} onClick={(e) => {e.stopPropagation(), deleteTagHandler(item)}}>delete</div> */}
      </div>
    );
  });

  // clicks outside the dropdown are listened to here
  const handleClickOutside = (event: any) => {
    /* @ts-ignore */
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpenDropdown(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  return (
    <div className={s.root}>
      <input
        type="text"
        value={searchTerm}
        onClick={() => {
          setIsOpenDropdown(true);
        }}
        onChange={(e) => {
          changeSearchTerm(e.target.value);
        }}
      />

      <div
        ref={dropdownRef}
        className={clsx(s.dropdown, isOpenDropdown && s.open)}
      >
        {addTagItem}
        {termTags}
      </div>

      <div className={s.tagsWrapper}>{tagItems}</div>
    </div>
  );
};

export default SelectAdmin;
