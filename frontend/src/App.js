import React, { useEffect, useState } from "react";
import AnimatedTree from "./Tree";
import Header from "./Header";
import Home from "./HomePage/Home";
import Error from "./Error";
import Loading from "./Loading";

const BACKEND_URL = "http://0.0.0.0:3000"

export default function App() {
  const [searchInput, setSearchInput] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchInput) {
      // Check to ensure the search term isn't empty
      setLoading(true);
      fetch(`${BACKEND_URL}/get_tree_path/${searchInput}`)
        .then((response) => response.json())
        .then((result) => {
          if (result?.status === "NOT_FOUND") {
            setData(null);
            setError("World ID not found. Please try again.");
            setLoading(false);
          } else {
            setData(result);
            setError(null);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch data:", err);
          setData(null);
          setError(err);
          setLoading(false);
        });
    }
  }, [searchInput]);

  useEffect(() => {
    if (window.history.pushState) {
      let url = new URL(window.location);
      if (searchInput) {
        url.searchParams.set("world-id", searchInput);
      } else {
        url.searchParams.delete("world-id");
      }
      window.history.pushState({ path: url.toString() }, "", url.toString());
    }
  }, [searchInput]);

  function resetHome() {
    setData(null);
    setError(null);
    setLoading(false);
    setSearchInput("");
  }

  function renderTree() {
    if (loading) {
      return (
        <>
          <Header
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            resetHome={resetHome}
          />
          <Loading></Loading>
        </>
      );
    }
    if (error) {
      return (
        <>
          <Header
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            resetHome={resetHome}
          />
          <Error error={error}></Error>
        </>
      );
    }

    if (!data) {
      return <Home setSearchInput={setSearchInput} />;
    }

    return (
      <>
        <Header
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          resetHome={resetHome}
        />
        <AnimatedTree data={data} searchInput={searchInput} />
      </>
    );
  }

  return <div>{renderTree()}</div>;
}
