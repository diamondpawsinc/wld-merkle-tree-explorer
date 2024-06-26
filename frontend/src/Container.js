import React from "react";

function Container({ children }) {
  return (
    <div className="relative isolate overflow-hidden bg-white h-[calc(100vh-84px)]">
      <svg
        className="absolute inset-0 -z-10 h-full w-full stroke-gray-100"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
            width={200}
            height={200}
            x="50%"
            y={-1}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          strokeWidth={0}
          fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)"
        />
      </svg>
      {children}
    </div>
  );
}

export default Container;
