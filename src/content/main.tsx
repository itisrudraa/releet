/// <reference types="chrome"/>
import React, { useState } from "react";
import ReactDOM from "react-dom/client";

function getProblemData() {
  const titleElement = document.querySelector(
    'div.text-title-large a'
  );
  const difficultyElement = document.querySelector(
    '[class*="text-difficulty-"]'
  );
  return {
    title: titleElement?.textContent,
    difficulty: difficultyElement?.textContent,
    url: window.location.href,
    savedAt: new Date().toISOString()
  };
}

function SaveButton() {

  const [buttonText, setButtonText] =
  useState("Save for Revision");

  async function saveProblem() {
  const problemData = getProblemData();

  const result = await chrome.storage.local.get(
    "savedProblems"
  );

  const savedProblems = (result.savedProblems || []) as any[];

const alreadySaved = savedProblems.some(
  (problem) => problem.url === problemData.url
);

if (alreadySaved) {
  setButtonText("Already Saved ⚠️");

  setTimeout(() => {
    setButtonText("Save for Revision");
  }, 2000);

  return;
}
savedProblems.push(problemData);

  await chrome.storage.local.set({
    savedProblems: savedProblems
  });

  const updatedData =
    await chrome.storage.local.get("savedProblems");

      console.log(updatedData);
      setButtonText("Saved ✅");

      setTimeout(() => {
        setButtonText("Save for Revision");
      }, 2000);
  }

  return (
    <button
      onClick={saveProblem}
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
      {buttonText}
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