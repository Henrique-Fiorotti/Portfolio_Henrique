"use client";

import { useEffect, useState } from "react";
const partOfDay = hour => hour >= 5 && hour < 12 ? "morning" : hour >= 12 && hour < 18 ? "afternoon" : "evening";

// The server cannot know the visitor's clock, so it renders the plain greeting and the browser swaps in the timed one.
export function Greeting(greeting) {
  const [part, setPart] = useState("plain");
  useEffect(() => setPart(partOfDay(new Date().getHours())), []);
  return <p className="greeting">{greeting[part]}</p>;
}
