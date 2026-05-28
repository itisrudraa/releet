/// <reference types="chrome"/>

import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";

function getProblemData() {
  const titleElement = document.querySelector('div.text-title-large a');
  const difficultyElement = document.querySelector('[class*="text-difficulty-"]');
  const title = titleElement?.textContent;
  const difficulty = difficultyElement?.textContent;
  if (!title || !difficulty) return null;
  return {
    title,
    difficulty,
    url: window.location.href,
    savedAt: new Date().toISOString()
  };
}

const styles = {
  btn: {
    position: "fixed" as const,
    bottom: "28px",
    right: "28px",
    zIndex: 999999,
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "9px 16px",
    background: "#1a1a1a",
    color: "#fff",
    border: "1px solid #3a3a3a",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    letterSpacing: "0.01em",
    transition: "border-color 0.15s, background 0.15s",
    userSelect: "none" as const,
  },
  btnHover: {
    background: "#222",
    borderColor: "#f89f1b",
  },
  dot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#f89f1b",
    flexShrink: 0,
  },
  panel: {
    position: "fixed" as const,
    bottom: "72px",
    right: "28px",
    zIndex: 999999,
    background: "#1a1a1a",
    border: "1px solid #3a3a3a",
    borderRadius: "10px",
    padding: "8px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "5px",
    width: "172px",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  panelLabel: {
    fontSize: "11px",
    color: "#6b6b6b",
    padding: "4px 8px 2px",
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    fontWeight: 500,
  },
  divider: {
    height: "1px",
    background: "#2e2e2e",
    margin: "2px 0",
  },
  dayBtn: {
    padding: "8px 10px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    background: "transparent",
    color: "#c9c9c9",
    fontSize: "13px",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "background 0.12s, color 0.12s",
    width: "100%",
    textAlign: "left" as const,
  },
  dayBadge: {
    fontSize: "11px",
    color: "#6b6b6b",
    background: "#252525",
    borderRadius: "4px",
    padding: "2px 6px",
  },
  input: {
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #2e2e2e",
    background: "#111",
    color: "#c9c9c9",
    fontSize: "13px",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    outline: "none",
    width: "100%",
    boxSizing: "border-box" as const,
  },
  saveCustomBtn: {
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #f89f1b33",
    cursor: "pointer",
    background: "#f89f1b1a",
    color: "#f89f1b",
    fontSize: "13px",
    fontWeight: 600,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    width: "100%",
    transition: "background 0.12s",
  },
};

function SaveButton() {
  const [buttonText, setButtonText] = useState("Save for Revision");
  const [buttonState, setButtonState] = useState<"default" | "saved" | "exists">("default");
  const [showOptions, setShowOptions] = useState(false);
  const [selectedDays, setSelectedDays] = useState(1);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const optionsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    }
    if (showOptions) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showOptions]);

  async function handleSaveClick() {
    const problemData = getProblemData();
    if (!problemData) {
      setButtonText("Loading...");
      setButtonState("default");
      setTimeout(() => { setButtonText("Save for Revision"); }, 2000);
      return;
    }
    const result = await chrome.storage.local.get("savedProblems");
    const savedProblems = (result.savedProblems || []) as any[];
    const alreadySaved = savedProblems.some((p) => p.url === problemData.url);
    if (alreadySaved) {
      setButtonText("Already saved");
      setButtonState("exists");
      setTimeout(() => { setButtonText("Save for Revision"); setButtonState("default"); }, 2000);
      return;
    }
    setShowOptions(true);
  }

  async function handleRevisionSave(days?: number) {
    const finalDays = days || selectedDays;
    const problemData = getProblemData();
    if (!problemData) return;
    const result = await chrome.storage.local.get("savedProblems");
    const savedProblems = (result.savedProblems || []) as any[];
    const nextReviewDate = new Date(Date.now() + finalDays * 24 * 60 * 60 * 1000).toISOString();
    const updatedProblem = { ...problemData, revised: false, reviseAfterDays: finalDays, nextReviewDate };
    savedProblems.push(updatedProblem);
    await chrome.storage.local.set({ savedProblems });
    setButtonText("Saved");
    setButtonState("saved");
    setShowOptions(false);
    setTimeout(() => { setButtonText("Save for Revision"); setButtonState("default"); }, 2500);
  }

  const mainBtnStyle = {
    ...styles.btn,
    ...(hoveredBtn === "main" ? styles.btnHover : {}),
    ...(buttonState === "saved" ? { borderColor: "#3a7d44", color: "#6fcf7d" } : {}),
    ...(buttonState === "exists" ? { borderColor: "#7a3a3a", color: "#f47" } : {}),
  };

  return (
    <>
      <button
        onClick={handleSaveClick}
        onMouseEnter={() => setHoveredBtn("main")}
        onMouseLeave={() => setHoveredBtn(null)}
        style={mainBtnStyle}
      >
        {buttonState === "default" && <span style={styles.dot} />}
        {buttonState === "saved" && <span style={{ fontSize: "13px" }}>✓</span>}
        {buttonState === "exists" && <span style={{ fontSize: "13px" }}>!</span>}
        {buttonText}
      </button>

      {showOptions && (
        <div ref={optionsRef} style={styles.panel}>
          <div style={styles.panelLabel}>Review in</div>
          <div style={styles.divider} />

          {[
            { days: 1, label: "Tomorrow", badge: "1d" },
            { days: 3, label: "3 days", badge: "3d" },
            { days: 7, label: "Next week", badge: "7d" },
          ].map(({ days, label, badge }) => (
            <button
              key={days}
              onClick={() => handleRevisionSave(days)}
              onMouseEnter={() => setHoveredBtn(String(days))}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                ...styles.dayBtn,
                ...(hoveredBtn === String(days) ? { background: "#252525", color: "#fff" } : {}),
              }}
            >
              {label}
              <span style={styles.dayBadge}>{badge}</span>
            </button>
          ))}

          <div style={styles.divider} />

          <input
            type="number"
            placeholder="Custom days"
            min={1}
            onChange={(e) => setSelectedDays(Number(e.target.value))}
            style={styles.input}
          />

          <button
            onClick={() => handleRevisionSave()}
            onMouseEnter={() => setHoveredBtn("custom")}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              ...styles.saveCustomBtn,
              ...(hoveredBtn === "custom" ? { background: "#f89f1b33" } : {}),
            }}
          >
            Save custom →
          </button>
        </div>
      )}
    </>
  );
}

const root = document.createElement("div");
document.body.appendChild(root);
const reactRoot = ReactDOM.createRoot(root);

function checkSubmissionResult() {
  const pageText = document.body.innerText;
  const hasFailedSubmission =
    pageText.includes("Wrong Answer") ||
    pageText.includes("Time Limit Exceeded") ||
    pageText.includes("Runtime Error") ||
    pageText.includes("Memory Limit Exceeded") ||
    pageText.includes("Output Limit Exceeded");

  const problemData = getProblemData();
  const isProblemReady = problemData?.title && problemData?.difficulty;

  if (hasFailedSubmission && isProblemReady) {
    reactRoot.render(<SaveButton />);
  } else {
    reactRoot.render(<></>);
  }
}

const observer = new MutationObserver(() => { checkSubmissionResult(); });
observer.observe(document.body, { childList: true, subtree: true });
checkSubmissionResult();