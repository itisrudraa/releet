import React from "react";
import ReactDOM from "react-dom/client";

function SaveButton() {
  return (
    <button
      style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        zIndex: 999999,
        padding: "10px 16px",
        background: "rgba(255, 165, 0, 0.18)",
        backdropFilter: "blur(10px)",
        color: "white",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "12px",
        cursor: "pointer",
        boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        transition: "all 0.2s ease"
      }}
    >
      Save for Revision
    </button>
  );
}

const root = document.createElement("div");
document.body.appendChild(root);

const reactRoot = ReactDOM.createRoot(root);

function checkSubmissionResult() {

  const hasWrongAnswer = document.body.innerText.includes("Wrong Answer");

  if (hasWrongAnswer) {
    reactRoot.render(
      <SaveButton />
    );
  } else {
    reactRoot.render(
      <></>
    );

  }
}

const observer = new MutationObserver(() => {
  checkSubmissionResult();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

checkSubmissionResult();