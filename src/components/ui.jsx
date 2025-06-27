import { useState } from "react";
import { FaShuffle } from "react-icons/fa6";
import { CAMERAS, COLORS, useApp } from "../state";

export function UI() {
  const colorIndex = useApp((state) => state.colorIndex);
  const currentCamera = useApp((state) => state.currentCamera);

  const [interfaceVisible, setInterfaceVisible] = useState(true);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          zIndex: 1000,
          padding: "1rem 2rem",
          boxSizing: "border-box",
          maxWidth: "700px",
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: interfaceVisible ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
            marginTop: "1rem",
          }}
        >
          {CAMERAS.map((text, i) => (
            <button
              key={i}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: currentCamera === i ? "#fff" : "#555",
                color: currentCamera === i ? "#000" : "#fff",
                border: "none",
                borderRadius: "0.25rem",
                cursor: "pointer",
                pointerEvents: "all",
                transition: "background-color 0.3s, color 0.3s",
              }}
              onClick={() =>
                useApp.setState((state) => ({
                  currentCamera: i,
                }))
              }
            >
              {text}
            </button>
          ))}
        </div>
      </div>

      <footer
        style={{
          position: "absolute",
          bottom: "9rem",
          right: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-center",
          justifyContent: "flex-center",
          gap: "1rem",
          padding: "1rem 1rem",
          boxSizing: "border-box",
          color: "#fff",
          zIndex: 1000,
          pointerEvents: "none",
        }}
      >
        <h3
          style={{
            fontFamily: '"Bricolage Grotesque", sans-serif',
            color: "#fff",
            fontWeight: "800",
            textAlign: "left",
            width: "100%",
            margin: 0,
            opacity: interfaceVisible ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
          }}
        >
          Pick a color
        </h3>
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "0.5rem",
            opacity: interfaceVisible ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
          }}
        >
          {COLORS.map((color, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                width: "1.5rem",
                aspectRatio: "1 / 1",
                backgroundColor: color.color,
                borderRadius: "50%",
                marginRight: "0.5rem",
                outline: "2px solid #fff",
                outlineWidth: colorIndex === i ? "5px" : "1px",
                cursor: "pointer",
                pointerEvents: "all",
              }}
              onClick={() => useApp.setState({ colorIndex: i })}
            />
          ))}

          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "1.5rem",
              aspectRatio: "1 / 1",
              backgroundColor: "#555",
              borderRadius: "50%",
              marginRight: "0.5rem",
              outline: "2px solid #fff",
              outlineWidth: colorIndex === -1 ? "5px" : "1px",
              cursor: "pointer",
              pointerEvents: "all",
            }}
            onClick={() => useApp.setState({ colorIndex: -1 })}
          >
            <FaShuffle
              size="0.8rem"
              style={{
                color: "#fff",
                pointerEvents: "none",
              }}
            />
          </span>
        </div>
      </footer>
    </>
  );
}
