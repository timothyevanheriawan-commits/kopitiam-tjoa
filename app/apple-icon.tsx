// app/apple-icon.tsx
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // Full-bleed fill, no rounded corners here — iOS applies its
        // own mask/corner-radius on top of whatever you send.
        background: "#3a2a1d",
      }}
    >
      <svg width="130" height="130" viewBox="0 0 40 40">
        <path
          d="M15.5 12.2 C13.3 10.1 16.6 8.2 14.9 6.1 C17.9 7.5 17.6 10.7 15.5 12.2 Z"
          fill="#f2ead9"
        />
        <path
          d="M24.5 12.2 C26.7 10.1 23.4 8.2 25.1 6.1 C22.1 7.5 22.4 10.7 24.5 12.2 Z"
          fill="#f2ead9"
        />
        <path
          d="M12 14.5 L28 14.5 L24.2 29.3 C24 30.2 23.2 30.8 22.2 30.8
               L17.8 30.8 C16.8 30.8 16 30.2 15.8 29.3 Z"
          fill="#f2ead9"
        />
        <rect x="14.4" y="19.6" width="11.2" height="3.1" fill="#3f6b52" />
      </svg>
    </div>,
    { ...size },
  );
}
