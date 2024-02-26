import { ArrowRightCircleIcon } from "@heroicons/react/20/solid";
import React from "react";

const people = [
  {
    name: "0x7164E6BEBE32D8862713537D8F44D4F860E76C180D647A510BA53AF89EAC5C",
  },
];

export default function HomeRecommendation({ setValue }) {
  return (
    <div className="mt-10">
      <h3 className="text-sm font-medium text-gray-500">Example World ID</h3>
      <ul role="list" className="mt-3 grid grid-cols-1 gap-4">
        {people.map((person, personIdx) => (
          <li key={personIdx}>
            <button
              type="button"
              className="group flex w-full items-center justify-between rounded-full border border-gray-300 px-2 text-left shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              onClick={() => setValue(person.name)}
            >
              <span className="flex min-w-0 flex-1 items-center space-x-3">
                <span className="block min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-gray-900 pl-2">
                    {person.name}
                  </span>
                </span>
              </span>
              <span className="inline-flex h-10 w-8 flex-shrink-0 items-center justify-center">
                <ArrowRightCircleIcon
                  className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
