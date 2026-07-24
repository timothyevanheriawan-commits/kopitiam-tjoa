// app/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f2ead9",
          position: "relative",
        }}
      >
        {/* Corner rule, echoing the signboard treatment used on-site */}
        <div
          style={{
            position: "absolute",
            top: 48,
            left: 48,
            right: 48,
            bottom: 48,
            border: "3px solid #3a2a1d",
          }}
        />

        <svg width="90" height="90" viewBox="0 0 40 40" style={{ marginBottom: 28 }}>
          <path
            d="M15.5 12.2 C13.3 10.1 16.6 8.2 14.9 6.1 C17.9 7.5 17.6 10.7 15.5 12.2 Z"
            fill="#3a2a1d"
          />
          <path
            d="M24.5 12.2 C26.7 10.1 23.4 8.2 25.1 6.1 C22.1 7.5 22.4 10.7 24.5 12.2 Z"
            fill="#3a2a1d"
          />
          <path
            d="M12 14.5 L28 14.5 L24.2 29.3 C24 30.2 23.2 30.8 22.2 30.8
                 L17.8 30.8 C16.8 30.8 16 30.2 15.8 29.3 Z"
            fill="#3a2a1d"
          />
          <rect x="14.4" y="19.6" width="11.2" height="3.1" fill="#b5342a" />
        </svg>

        <div
          style={{
            fontSize: 96,
            color: "#3a2a1d",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            display: "flex",
          }}
        >
          Kopitiam Tjoa
        </div>

        <div
          style={{
            marginTop: 20,
            fontSize: 30,
            color: "#6b5847",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span>Jalan Kembang Jepun, Surabaya</span>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#a8813f",
              display: "flex",
            }}
          />
          <span>est. 1968</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
