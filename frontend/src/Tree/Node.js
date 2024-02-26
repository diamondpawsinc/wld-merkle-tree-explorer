import React, { useState } from "react";
import { areNumberishEqual, truncateHexString } from "../utils";
import CopyAddressTooltip from "../Tooltip/CopyAddressTooltip";
import { Square2StackIcon } from "@heroicons/react/16/solid";
import { AddressTooltip } from "../Tooltip/AddressTooltip";
import WLDLogo from "../WLDLogo";
import { Group } from "@vx/group";
import { DepthTooltip } from "../Tooltip/DepthTooltip";

function Node({ node, onClick, showInitialTooltip, isAnimated }) {
  const [showPopper, setShowPopper] = useState(false);
  const [addressPopperText, setAdddressPopperText] = useState(node.data.name);
  const [depthPopperText, setDepthPopperText] = useState(node.depth);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);

  const width = 108;
  const height = 28;

  const isStart = false;
  const isEnd = false;

  let nodeColor;

  if (node.depth === 0) {
    nodeColor = "#FF7C2E";
  } else if (node.depth === 30) {
    let url = new URL(window.location);
    const val = url.searchParams.get("world-id");
    if (areNumberishEqual(val, node.data.name)) {
      nodeColor = "#00B979";
    }
  } else {
    nodeColor = "#000";
  }

  return (
    <Group
      x={isAnimated ? 0 : node.x}
      y={isAnimated ? 0 : node.y}
      onMouseOver={() => setShowPopper(true)}
      onMouseOut={() => setShowPopper(false)}
      className=""
    >
      {showInitialTooltip && (
        <g className="animate-bounce-x">
          <WLDLogo />
        </g>
      )}
      <rect
        style={{
          filter:
            "drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))",
        }}
        height={height}
        width={width}
        y={-height / 2}
        x={-width / 2}
        fill={nodeColor}
        rx={12}
        onClick={onClick}
        ref={setReferenceElement}
      ></rect>

      <text
        dy="0.33em"
        dx="-0.66em"
        fontSize={11}
        textAnchor={"middle"}
        fill={"#FFF"}
        className="pointer-events-none"
        onClick={onClick}
      >
        {truncateHexString(node.data.name)}
      </text>
      <CopyAddressTooltip
        address={node.data.name}
        offsetOptions={{ offset: [0, 0] }}
      >
        <Square2StackIcon
          className="cursor-copy"
          width={12}
          height={12}
          x={"2.1em"}
          y="-0.4em "
          color="#fff"
        />
      </CopyAddressTooltip>

      {showPopper && (
        <>
          <AddressTooltip
            popperText={addressPopperText}
            setPopperElement={setPopperElement}
            referenceElement={referenceElement}
            popperElement={popperElement}
            offsetOptions={[0, 0]}
            onMouseOver={() => setShowPopperOnAddress(true)}
            onMouseOut={() => setShowPopperOnAddress(false)}
          />
          <DepthTooltip
            popperText={depthPopperText}
            setPopperElement={setPopperElement}
            referenceElement={referenceElement}
            popperElement={popperElement}
            offsetOptions={[0, 0]}
            onMouseOver={() => setShowPopperOnAddress(true)}
            onMouseOut={() => setShowPopperOnAddress(false)}
          />
        </>
      )}
    </Group>
  );
}

export default Node;
