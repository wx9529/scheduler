import React, { useState } from "react";
export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  function transition(newMode, replace = false) {
    if (replace) {
      setMode(newMode);
      history.pop();
      setHistory([...history, newMode]);
      return;
    }
    setMode(newMode);
    setHistory([...history, newMode]);
  }
  function back() {
    if (history.length > 1) {
      history.pop();
      setMode(history[history.length - 1]);
      setHistory([...history]);
    }
  }
  return { mode, transition, back };
}
