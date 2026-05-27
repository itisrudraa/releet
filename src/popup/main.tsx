
import ReactDOM from "react-dom/client";

function Popup() {

  function openDashboard() {

    chrome.runtime.openOptionsPage();

  }

  return (
    <div
      style={{
        width: "260px",
        padding: "20px",
        background: "#0f0f1a",
        color: "white",
        fontFamily: "sans-serif"
      }}
    >

      <h2
        style={{
          marginTop: 0
        }}
      >
        🔁 ReLeet
      </h2>

      <button
        onClick={openDashboard}

        style={{
          width: "100%",
          padding: "12px",

          border: "none",
          borderRadius: "10px",

          background: "orange",
          color: "black",

          cursor: "pointer",
          fontWeight: 600
        }}
      >
        Open Dashboard
      </button>

    </div>
  );
}

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <Popup />
);