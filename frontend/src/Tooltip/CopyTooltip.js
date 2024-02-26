import React from "react";
import { usePopper } from "react-popper";

export function CopyTooltip({
  popperText,
  setPopperElement,
  referenceElement,
  popperElement,
  offsetOptions,
  flipOptions,
}) {
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "top",
    modifiers: [
      { name: "offset", options: offsetOptions },
      {
        name: "flip",
        options: flipOptions,
      },
    ],
  });
  return (
    <>
      <rect
        style={{
          filter:
            "drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))",
        }}
        height={20}
        width={popperText === "Copy" ? 39 : 53}
        y={-10.5}
        x={59}
        fill={"#334155"}
        rx={6}
      ></rect>
      <text
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
        data-popper-placement="bottom"
        fill={"#FFF"}
        dx="65px"
        dy="3px"
        fontSize={11}
        fontFamily=""
        className="font-mono"
      >
        {popperText}
      </text>
    </>
  );
}
