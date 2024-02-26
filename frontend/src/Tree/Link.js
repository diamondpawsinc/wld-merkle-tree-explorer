import React, { Fragment } from "react";

import { LinkHorizontal, LinkVertical } from "@vx/shape";

function Link({ data, linkType, layout, orientation, stepPercent, ...props }) {
  let LinkComponent;

  if (orientation === "vertical") {
    LinkComponent = LinkVertical;
  } else {
    LinkComponent = LinkHorizontal;
  }

  return (
    <LinkComponent
      data={data}
      percent={stepPercent}
      stroke="#374469"
      strokeWidth="1"
      fill="none"
      className="pointer-events-none"
      {...props}
    />
  );
}

export default Link;
