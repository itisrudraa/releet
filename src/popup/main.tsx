import ReactDOM from "react-dom/client";

const styles = {

  container: {

    width: "260px",

    padding: "16px",

    background: "#1a1a1a",

    color: "#fff",

    fontFamily:
      "'Segoe UI', system-ui, sans-serif",

    border:
      "1px solid #3a3a3a",

    borderRadius: "12px",

    boxSizing: "border-box" as const
  },

  titleRow: {

    display: "flex",

    alignItems: "center",

    gap: "8px",

    marginBottom: "14px"
  },

  dot: {

    width: "8px",

    height: "8px",

    borderRadius: "50%",

    background: "#f89f1b"
  },

  title: {

    margin: 0,

    fontSize: "18px",

    fontWeight: 600,

    letterSpacing: "0.01em"
  },

  subtitle: {

    fontSize: "12px",

    color: "#7a7a7a",

    marginBottom: "16px",

    lineHeight: 1.5
  },

  button: {

    width: "100%",

    padding: "10px 14px",

    borderRadius: "8px",

    border:
      "1px solid #f89f1b33",

    background: "#f89f1b1a",

    color: "#f89f1b",

    cursor: "pointer",

    fontWeight: 600,

    fontSize: "13px",

    transition:
      "background 0.15s ease",

    fontFamily:
      "'Segoe UI', system-ui, sans-serif"
  }
};

function Popup() {

  function openDashboard() {

    chrome.runtime.openOptionsPage();

  }

  return (

    <div style={styles.container}>

      <div style={styles.titleRow}>

        <div style={styles.dot}></div>

        <h2 style={styles.title}>
          ReLeet
        </h2>

      </div>

      <div style={styles.subtitle}>
        Save failed problems and
        revisit them with spaced
        repetition.
      </div>

      <button
        onClick={openDashboard}

        style={styles.button}

        onMouseEnter={(e) => {

          e.currentTarget.style.background =
            "#f89f1b33";

        }}

        onMouseLeave={(e) => {

          e.currentTarget.style.background =
            "#f89f1b1a";

        }}
      >
        Open Dashboard →
      </button>

    </div>

  );
}

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <Popup />
);