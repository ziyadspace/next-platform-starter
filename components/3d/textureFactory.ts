"use client";

import * as THREE from "three";
import type { DesignDraft, DesignTemplate, Material } from "@/types";
import { getProductionArtwork } from "@/lib/rendering/productionArtwork";

function seededNoise(seed: number) {
  let value = seed % 2147483647;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function prepareTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

export function createSurfaceTexture(material: Material, color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const random = seededNoise(material.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 1));
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 512, 512);

  if (material.family === "wood") {
    for (let y = 0; y < 512; y += 5) {
      const wave = 3 + random() * 11;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= 512; x += 16) ctx.lineTo(x, y + Math.sin(x / 34 + random() * 2) * wave);
      ctx.strokeStyle = `rgba(63,35,18,${0.035 + random() * 0.075})`;
      ctx.lineWidth = random() > 0.86 ? 2 : 0.7;
      ctx.stroke();
    }
    for (let i = 0; i < 7; i += 1) {
      const x = random() * 512;
      const y = random() * 512;
      ctx.strokeStyle = "rgba(72,42,22,.11)";
      ctx.beginPath();
      ctx.ellipse(x, y, 35 + random() * 45, 7 + random() * 8, random() * 0.2, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (material.family === "leather") {
    const image = ctx.getImageData(0, 0, 512, 512);
    for (let i = 0; i < image.data.length; i += 4) {
      const noise = (random() - 0.5) * 22;
      image.data[i] = Math.max(0, Math.min(255, image.data[i] + noise));
      image.data[i + 1] = Math.max(0, Math.min(255, image.data[i + 1] + noise));
      image.data[i + 2] = Math.max(0, Math.min(255, image.data[i + 2] + noise));
    }
    ctx.putImageData(image, 0, 0);
    ctx.strokeStyle = material.id === "saffiano" ? "rgba(255,255,255,.075)" : "rgba(255,255,255,.035)";
    ctx.lineWidth = 1;
    const gap = material.id === "saffiano" ? 8 : 15;
    for (let x = -512; x < 1024; x += gap) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 512, 512); ctx.stroke();
      if (material.id === "saffiano") { ctx.beginPath(); ctx.moveTo(x + 512, 0); ctx.lineTo(x, 512); ctx.stroke(); }
    }
  } else {
    for (let i = 0; i < 2200; i += 1) {
      const alpha = 0.015 + random() * 0.03;
      ctx.fillStyle = random() > 0.5 ? `rgba(255,255,255,${alpha})` : `rgba(45,30,20,${alpha})`;
      ctx.fillRect(random() * 512, random() * 512, 0.7 + random() * 1.8, 0.4 + random());
    }
  }
  return prepareTexture(canvas);
}

function star(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const r = i % 2 === 0 ? radius : radius * 0.38;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

function drawPattern(ctx: CanvasRenderingContext2D, template: DesignTemplate, colors: [string, string, string], engraving: boolean) {
  const [primary, secondary, accent] = colors;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = primary;
  ctx.fillStyle = secondary;
  ctx.lineWidth = engraving ? 13 : 9;
  switch (template.pattern) {
    case "stars":
      [170, 850].forEach((x, index) => star(ctx, x, index ? 190 : 220, 42));
      ctx.beginPath(); ctx.arc(512, 505, 350, 0, Math.PI * 2); ctx.stroke();
      break;
    case "arches":
      for (let x = 120; x <= 900; x += 195) { ctx.beginPath(); ctx.arc(x, 190, 86, Math.PI, 0); ctx.stroke(); }
      ctx.beginPath(); ctx.moveTo(120, 190); ctx.lineTo(900, 190); ctx.stroke();
      break;
    case "lines":
      ctx.beginPath(); ctx.moveTo(140, 250); ctx.quadraticCurveTo(512, 100, 884, 250); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(140, 765); ctx.quadraticCurveTo(512, 910, 884, 765); ctx.stroke();
      break;
    case "frame":
      ctx.strokeRect(108, 108, 808, 808); ctx.lineWidth *= 0.45; ctx.strokeRect(137, 137, 750, 750);
      break;
    case "band":
      ctx.globalAlpha = engraving ? 1 : 0.15; ctx.fillRect(0, 410, 1024, 204); ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.moveTo(75, 390); ctx.lineTo(949, 390); ctx.moveTo(75, 635); ctx.lineTo(949, 635); ctx.stroke();
      break;
    case "badge":
      ctx.beginPath(); ctx.arc(512, 500, 300, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(512, 500, 262, 0, Math.PI * 2); ctx.lineWidth *= 0.45; ctx.stroke();
      break;
    case "signature":
      ctx.beginPath(); ctx.moveTo(190, 690); ctx.bezierCurveTo(350, 610, 630, 790, 840, 650); ctx.stroke();
      break;
    case "corners":
      [[120, 120, 1, 1], [904, 120, -1, 1], [120, 904, 1, -1], [904, 904, -1, -1]].forEach(([x, y, sx, sy]) => {
        ctx.beginPath(); ctx.moveTo(x, y + 130 * sy); ctx.lineTo(x, y); ctx.lineTo(x + 130 * sx, y); ctx.stroke();
        ctx.fillStyle = accent; star(ctx, x + 48 * sx, y + 48 * sy, 18);
      });
      break;
  }
}

export function createArtworkTexture(draft: DesignDraft, material: Material, template: DesignTemplate, baseColor: string) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 1024, 1024);
  const artwork = getProductionArtwork(template, material, draft, baseColor);
  const engraving = material.family !== "paper";
  const colors: [string, string, string] = engraving
    ? [artwork.primary, artwork.primary, artwork.primary]
    : [template.palette[0], template.palette[1], template.palette[2]];
  ctx.globalAlpha = artwork.opacity;
  if (engraving) {
    ctx.shadowColor = material.family === "wood" ? "rgba(35,16,7,.42)" : "rgba(0,0,0,.32)";
    ctx.shadowBlur = 11;
    ctx.shadowOffsetY = 5;
  }
  drawPattern(ctx, template, colors, engraving);
  ctx.shadowColor = "transparent";
  ctx.direction = "rtl";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = engraving ? artwork.primary : draft.textColor;
  const weight = draft.fontWeight >= 700 ? 700 : 500;
  const nameSize = Math.max(58, Math.min(144, draft.fontSize * 1.65));
  ctx.font = `${weight} ${nameSize}px "IBM Plex Sans Arabic", "Noto Sans Arabic", sans-serif`;
  ctx.fillText(draft.name || "اسمك", 512, draft.phrase ? 470 : 520, 650);
  if (draft.phrase) {
    ctx.globalAlpha = engraving ? artwork.opacity * 0.88 : 0.9;
    ctx.font = `500 ${Math.max(34, nameSize * 0.35)}px "IBM Plex Sans Arabic", sans-serif`;
    ctx.fillText(draft.phrase, 512, 585, 620);
  }
  if (draft.year) {
    ctx.globalAlpha = engraving ? artwork.opacity * 0.78 : 0.8;
    ctx.direction = "ltr";
    ctx.font = `500 ${Math.max(30, nameSize * 0.28)}px sans-serif`;
    ctx.fillText(draft.year, 512, 660, 360);
  }
  const texture = prepareTexture(canvas);
  texture.flipY = false;
  return { texture, artwork };
}
