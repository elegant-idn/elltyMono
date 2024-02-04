import React from "react";
import {
  FontFamilyInput,
  FontSizeInput,
  FontStyleGroup,
  FontColorInput,
  SpacingInput,
} from "polotno/toolbar/text-toolbar";

interface ToolbarProps {
  store: any;
}

const Toolbar: React.FC<React.PropsWithChildren<ToolbarProps>> = ({
  store,
}) => {
  return <div>Toolbar</div>;
};

export default Toolbar;
