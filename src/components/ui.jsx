import { useState } from "react";
import {
  FaArtstation,
  FaCode,
  FaEye,
  FaEyeSlash,
  FaLinkedin,
  FaSquareGithub,
  FaSquareInstagram,
  FaSquareTwitter,
  FaSquareXTwitter,
} from "react-icons/fa6";
import { CAMERAS, COLORS, useApp } from "../state";

export function UI() {
  const colorIndex = useApp((state) => state.colorIndex);
  const isStockMaterial = useApp((state) => state.isStockMaterial);
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
          pointerEvents: "none",
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
        <h1
          style={{
            width: "100%",
            textAlign: "center",
            fontFamily: '"Bricolage Grotesque", sans-serif',
            color: "#fff",
            margin: 0,
            fontWeight: "800",
          }}
        >
          CAR PAINT SHADER
        </h1>
        <p
          style={{
            width: "100%",
            textAlign: "center",
            fontFamily: '"Bricolage Grotesque", sans-serif',
            color: "#fff",
            margin: 0,
            fontWeight: "200",
          }}
        >
          Car paint with flakes. Started this project in 2023, I still dont
          think it is complete, but I am happy with the result.
        </p>
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
          bottom: 0,
          right: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          padding: "1rem 2rem",
          boxSizing: "border-box",
          color: "#fff",
          zIndex: 1000,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "center",
            width: "100%",
            maxWidth: "600px",
            marginBottom: "1rem",
            gap: "1rem",
          }}
        >
          <h3
            style={{
              fontFamily: '"Bricolage Grotesque", sans-serif',
              color: "#fff",
              margin: 0,
              fontWeight: "800",
              textAlign: "right",
              margin: 0,
              opacity: interfaceVisible ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
            }}
          >
            Pick a color
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
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
                  height: "1.5rem",
                  backgroundColor: color.color,
                  borderRadius: "50%",
                  marginRight: "0.5rem",
                  outline: "2px solid #fff",
                  outlineWidth: colorIndex === i ? "5px" : "1px",
                  cursor: "pointer",
                  pointerEvents: "all",
                }}
                onClick={() => useApp.setState({ colorIndex: i })}
              ></span>
            ))}
          </div>
          <button
            onClick={() =>
              useApp.setState((state) => ({
                isStockMaterial: !state.isStockMaterial,
              }))
            }
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#333",
              color: "#fff",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
              pointerEvents: "all",
              opacity: interfaceVisible ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
            }}
          >
            Use {isStockMaterial ? "custom" : "default"} material
          </button>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.25rem",
          }}
        >
          <a
            href="https://github.com/FarazzShaikh"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#fff",
              textDecoration: "none",
              pointerEvents: "all",
            }}
          >
            <FaSquareGithub size="1.5rem" />
          </a>
          <a
            href="https://x.com/cantBeFaraz"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#fff",
              textDecoration: "none",
              pointerEvents: "all",
            }}
          >
            <FaSquareTwitter size="1.5rem" />
          </a>
          <a
            href="https://x.com/cantBeFaraz"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#fff",
              textDecoration: "none",
              pointerEvents: "all",
            }}
          >
            <FaSquareXTwitter size="1.5rem" />
          </a>
          <a
            href="https://www.linkedin.com/in/faraz-shaikh-811655166/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#fff",
              textDecoration: "none",
              pointerEvents: "all",
            }}
          >
            <FaLinkedin size="1.5rem" />
          </a>
          <a
            href="https://www.instagram.com/cantBeFaraz/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#fff",
              textDecoration: "none",
              pointerEvents: "all",
            }}
          >
            <FaSquareInstagram size="1.5rem" />
          </a>
          <a
            href="https://www.artstation.com/farazshaikh"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#fff",
              textDecoration: "none",
              pointerEvents: "all",
            }}
          >
            <FaArtstation size="1.5rem" />
          </a>
        </div>
        <p
          style={{
            fontFamily: "sans-serif",
            fontSize: "0.9rem",
            margin: 0,
            textAlign: "right",
          }}
        >
          Design and code by Faraz
          <br />
          <a
            href="mailto:farazzshaikh@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#fff",
              textDecoration: "underline",
              pointerEvents: "all",
            }}
          >
            farazzshaikh@gmail.com
          </a>
        </p>
        <p
          style={{
            textAlign: "right",
            fontFamily: '"Cabin Sketch", sans-serif',
            color: "#fff",
            margin: 0,
            fontSize: "0.8rem",
            marginTop: "0.25rem",
          }}
        >
          Updated: June 2025
        </p>
      </footer>

      <div
        style={{
          position: "absolute",
          bottom: "1rem",
          left: "1rem",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <button
          style={{
            width: "3rem",
            height: "3rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borraderRadius: "100%",
            backgroundColor: interfaceVisible ? "#fff" : "#555",
            color: interfaceVisible ? "#000" : "#fff",
            border: "none",
            borderRadius: "0.25rem",
            cursor: "pointer",
            pointerEvents: "all",
            fontFamily: '"Bricolage Grotesque", sans-serif',
            textDecoration: "none",
            fontSize: "0.8rem",
          }}
          onClick={() => setInterfaceVisible((prev) => !prev)}
        >
          {!interfaceVisible ? (
            <FaEyeSlash size="1.5rem" />
          ) : (
            <FaEye size="1.5rem" />
          )}
          UI
        </button>

        <a
          href="https://www.artstation.com/farazshaikh"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            width: "3rem",
            height: "3rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borraderRadius: "100%",
            backgroundColor: "#fff",
            color: "#000",
            border: "none",
            borderRadius: "0.25rem",
            cursor: "pointer",
            pointerEvents: "all",
            fontFamily: '"Bricolage Grotesque", sans-serif',
            textDecoration: "none",
            fontSize: "0.8rem",
          }}
        >
          <FaCode size="1.5rem" />
          Code
        </a>
      </div>
    </>
  );
}
