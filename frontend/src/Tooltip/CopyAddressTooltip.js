import React, { useState } from "react";
import { CopyTooltip } from "./CopyTooltip";

export default function CopyAddressTooltip({
  address,
  children,
  offsetOptions,
}) {
  const [showPopper, setShowPopper] = useState(false);
  const [popperText, setPopperText] = useState("Copy");

  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);

  function switchPopperText(text) {
    setPopperText(text);
    setTimeout(() => {
      setPopperText("Copy");
    }, 1500);
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText(address).then(
      () => {
        switchPopperText("Copied");
      },
      (err) => {
        switchPopperText("Failed to copy");
      }
    );
  }

  return (
    <>
      <g
        onClick={copyToClipboard}
        onMouseOver={() => setShowPopper(true)}
        onMouseOut={() => setShowPopper(false)}
        ref={setReferenceElement}
      >
        {children}
      </g>

      {showPopper && (
        <CopyTooltip
          popperText={popperText}
          setPopperElement={setPopperElement}
          referenceElement={referenceElement}
          popperElement={popperElement}
          offsetOptions={offsetOptions}
        />
      )}
    </>
  );
}
