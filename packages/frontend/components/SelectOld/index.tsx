import Select, { StylesConfig } from "react-select";

interface SelectProps {
  options: any;
  onChange: any;
  value: any;
}

const colourStyles: StylesConfig = {
  control: (styles, { isFocused }) => ({
    ...styles,
    width: "400px",
    minHeight: "40px",
    backgroundColor: "white",
    boxShadow: "none",
    fontSize: "0.875rem",
    borderColor: isFocused ? "var(--blue-color)" : "#E1E5ED",
  }),
  valueContainer: (styles) => ({
    ...styles,
    height: "auto",
    padding: "8px",
    // minHeight: '50px',
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      cursor: isDisabled ? "not-allowed" : "default",
    };
  },
  input: (styles) => ({
    ...styles,
    height: "auto",
  }),
  multiValue: (styles, { data }) => {
    return {
      ...styles,
      fontSize: "1rem",
      // backgroundColor: data.color,
    };
  },
  // multiValueLabel: (styles, { data }) => ({
  //   ...styles,
  //   color: data.color,
  // }),
  // multiValueRemove: (styles, { data }) => ({
  //   ...styles,
  //   color: data.color,
  //   ':hover': {
  //     backgroundColor: data.color,
  //     color: 'white',
  //   },
  // }),
  // indicatorsContainer: (styles) => ({
  //   ...styles,
  //   height: '40px',
  // }),
  indicatorSeparator: (styles) => {
    return {
      ...styles,
      backgroundColor: "#E1E5ED",
    };
  },
  menu: (styles) => {
    return {
      ...styles,
      width: "400px",
    };
  },
};

const SelectComponent: React.FC<React.PropsWithChildren<SelectProps>> = ({
  options,
  onChange,
  value,
}) => {
  return (
    <Select
      closeMenuOnSelect={false}
      isMulti
      // defaultValue={[colourOptions[0], colourOptions[1]]}
      options={options}
      styles={colourStyles}
      onChange={onChange}
      value={value}
    />
  );
};

export default SelectComponent;
