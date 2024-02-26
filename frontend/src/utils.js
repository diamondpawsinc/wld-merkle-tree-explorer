import { pointRadial } from "d3-shape";
import { useState, useEffect } from "react";
import BigNumber from "bignumber.js";

export function areNumberishEqual(
  value1,
  value2,
) {
  const value1Final =
    typeof value1 === "string" ? value1.toLowerCase() : value1;
  const value2Final =
    typeof value2 === "string" ? value2.toLowerCase() : value2;

  const value1BN = new BigNumber(value1Final);
  const value2BN = new BigNumber(value2Final);
  if (value1BN.isNaN() || value2BN.isNaN()) {
    return false;
  }
  return value1BN.isEqualTo(value2BN);
}

export function findCollapsedParent(node) {
  if (!node.data.isExpanded) {
    return node;
  } else if (node.parent) {
    return findCollapsedParent(node.parent);
  } else {
    return null;
  }
}

export function getTopLeft(node, layout, orientation) {
  if (layout === "polar") {
    const [radialX, radialY] = pointRadial(node.x, node.y);
    return {
      top: radialY,
      left: radialX,
    };
  } else if (orientation === "vertical") {
    return {
      top: node.y,
      left: node.x,
    };
  } else {
    return {
      top: node.x,
      left: node.y,
    };
  }
}

const HEX_REGEX = /0[xX][0-9a-fA-F]+$/;
export function isHexString(value) {
  if (typeof value !== "string") {
    return false;
  }
  return HEX_REGEX.test(value);
}

// Truncates an hex string to the format 0x0000…0000
// https://github.com/gpxl-dev/truncate-eth-address/blob/main/src/index.ts
export function truncateHexString(hexString) {
  const TRUNCATE_HEX_STR_REGEX =
    /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

  if (isHexString(hexString)) {
    const match = hexString?.match(TRUNCATE_HEX_STR_REGEX);
    if (match) {
      return `${match[1]}…${match[2]}`;
    }
  }

  return hexString;
}

export const useDebouncedValue = (inputValue, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(inputValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, delay]);

  return debouncedValue;
};
