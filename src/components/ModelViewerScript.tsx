"use client";
import Script from 'next/script';

export default function ModelViewerScript() {
  return (
    <Script
      type="module"
      src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
      strategy="lazyOnload"
    />
  );
} 