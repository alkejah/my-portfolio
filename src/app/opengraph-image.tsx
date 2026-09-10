import { ImageResponse } from "next/og"

import { siteConfig } from "@/config/site"

export const alt =
  `${siteConfig.name} — Full-Stack Developer`

export const size = {
  width: 1200,
  height: 630,
}

export const contentType =
  "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",

          display: "flex",
          flexDirection: "column",
          justifyContent:
            "space-between",

          padding: "72px",

          background:
            "#09090b",

          color: "#fafafa",

          fontFamily:
            "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",

            fontSize: 28,

            color:
              "#a1a1aa",
          }}
        >
          Full-Stack Developer
        </div>

        <div
          style={{
            display: "flex",
            flexDirection:
              "column",

            gap: "24px",
          }}
        >
          <div
            style={{
              display: "flex",

              fontSize: 72,

              fontWeight: 700,

              letterSpacing:
                "-0.04em",
            }}
          >
            {siteConfig.name}
          </div>

          <div
            style={{
              display: "flex",

              maxWidth:
                "850px",

              fontSize: 32,

              lineHeight: 1.35,

              color:
                "#d4d4d8",
            }}
          >
            Building modern,
            scalable, and
            thoughtfully designed
            web applications.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}