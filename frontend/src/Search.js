import React from "react";

function Search({ setValue, value, className }) {
  return (
    <input
      type="text"
      name="name"
      id="name"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={className}
      placeholder="Enter your World ID..."
    />
  );
}
export default Search;
