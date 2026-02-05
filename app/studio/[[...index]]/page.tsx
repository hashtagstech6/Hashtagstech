"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export default function StudioPage() {
  return (
    <div style={{ marginTop: "80px" }}>
      <NextStudio config={config} />
    </div>
  );
}
