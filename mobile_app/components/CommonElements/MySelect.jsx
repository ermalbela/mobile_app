import React from "react";
import { default as ReactSelect } from "react-select";

const MySelect = props => {
  if (props.allowSelectAll) {
return (
  <ReactSelect
    {...props}
    options={[props.allOption, ...props.options]}
    onChange={(selected, event) => {
      if (selected !== null && selected.length > 0) {
        if (selected[selected.length - 1].value === props.allOption.value) {
          return props.onChange([props.allOption, ...props.options]);
        }
        let result = [];
        if (selected.length === props.options.length) {
          if (selected.includes(props.allOption)) {
            result = selected.filter(
              option => option.value !== props.allOption.value
            );
          } else if (event.action === "select-option") {
            result = [props.allOption, ...props.options];
          }
          return props.onChange(result);
        }
      }

      return props.onChange(selected);
    }}
  />
);
}

return <ReactSelect {...props} />;
};

MySelect.defaultProps = {
allOption: {
label: "Select all",
value: "*"
}
};  

export default MySelect;