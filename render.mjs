// render.mjs — draws the newspaper front page for Tuesday 24 November 2026
// and writes it to entry.png (1024x1024). Run with: node render.mjs
// The drawing uses @napi-rs/canvas installed under the shared tools folder.
import { createCanvas } from "/home/hatch/workspace/makefun/tools/node_modules/@napi-rs/canvas/index.js";
import { writeFileSync } from "node:fs";

const W = 1024;
const H = 1024;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");

const INK = "#1b1b1b";
const PAPER = "#f7f2e4";
const RED = "#9e1b1b";
const BLUE = "#1f4e79";
const SEA = "#274b6d";
const GREY = "#5a5a5a";

const SERIF = "DejaVu Serif";
const SANS = "DejaVu Sans";

// ---------- helpers ----------
function wrapText(text, maxW, font) {
  ctx.font = font;
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width <= maxW) {
      line = test;
    } else {
      if (line) lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawLines(lines, x, y, lineH, font, color = INK) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  lines.forEach((ln, i) => ctx.fillText(ln, x, y + i * lineH));
  return y + lines.length * lineH;
}

function hRule(x, y, w, color = INK, lw = 2) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, lw);
}

function kicker(text, x, y, color = RED) {
  ctx.font = `bold 19px ${SANS}`;
  ctx.fillStyle = color;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(text, x, y);
}

// ---------- paper ----------
ctx.fillStyle = PAPER;
ctx.fillRect(0, 0, W, H);

// ---------- masthead ----------
ctx.textAlign = "center";
ctx.textBaseline = "top";
ctx.fillStyle = INK;
ctx.font = `bold 82px ${SERIF}`;
ctx.fillText("THE WORLD TODAY", W / 2, 26);
hRule(36, 122, W - 72, INK, 3);
hRule(36, 129, W - 72, INK, 1);
ctx.font = `bold 27px ${SANS}`;
ctx.fillText("T U E S D A Y ,  2 4  N O V E M B E R  2 0 2 6", W / 2, 142);
ctx.font = `italic 19px ${SERIF}`;
ctx.fillStyle = GREY;
ctx.fillText("Seven stories from around the world — as reported on 24 November 2026", W / 2, 176);

// ---------- lead story: Ukraine / Libya warship ----------
const LX = 36;
const LW = 600;
let y = 214;
kicker("UKRAINE  •  LIBYA", LX, y);
y += 28;
const leadHead = wrapText("UKRAINE SAYS IT SANK A RUSSIAN WARSHIP OFF LIBYA", LW, `bold 36px ${SERIF}`);
y = drawLines(leadHead, LX, y, 44, `bold 36px ${SERIF}`);
y += 8;

// Lead illustration: sea, warship, fire, drone — 600 x 150
const IX = LX;
const IY = y;
const IW = 600;
const IH = 150;
ctx.fillStyle = "#bfd9e8";
ctx.fillRect(IX, IY, IW, IH);
// sky band
ctx.fillStyle = "#dfe9ee";
ctx.fillRect(IX, IY, IW, 58);
// sun
ctx.fillStyle = "#e8b64c";
ctx.beginPath();
ctx.arc(IX + 540, IY + 28, 20, 0, Math.PI * 2);
ctx.fill();
// sea
ctx.fillStyle = SEA;
ctx.fillRect(IX, IY + 58, IW, IH - 58);
// waves
ctx.strokeStyle = "#8fb3cc";
ctx.lineWidth = 4;
for (let i = 0; i < 5; i++) {
  const wy = IY + 76 + i * 14;
  ctx.beginPath();
  for (let wx = IX + 8; wx <= IX + IW - 8; wx += 8) {
    const yy = wy + Math.sin(wx / 26 + i) * 4;
    if (wx === IX + 8) ctx.moveTo(wx, yy);
    else ctx.lineTo(wx, yy);
  }
  ctx.stroke();
}
// warship hull
ctx.fillStyle = "#3c3f45";
ctx.beginPath();
ctx.moveTo(IX + 150, IY + 108);
ctx.lineTo(IX + 470, IY + 108);
ctx.lineTo(IX + 440, IY + 136);
ctx.lineTo(IX + 185, IY + 136);
ctx.closePath();
ctx.fill();
// superstructure
ctx.fillStyle = "#565a61";
ctx.fillRect(IX + 250, IY + 76, 130, 32);
ctx.fillRect(IX + 300, IY + 56, 26, 20);
// mast + flag
ctx.fillStyle = INK;
ctx.fillRect(IX + 310, IY + 36, 4, 20);
ctx.fillStyle = RED;
ctx.fillRect(IX + 314, IY + 36, 26, 14);
// flames on deck
ctx.fillStyle = "#e8721c";
ctx.beginPath();
ctx.moveTo(IX + 400, IY + 108);
ctx.lineTo(IX + 420, IY + 60);
ctx.lineTo(IX + 438, IY + 108);
ctx.closePath();
ctx.fill();
ctx.fillStyle = "#f6c445";
ctx.beginPath();
ctx.moveTo(IX + 410, IY + 108);
ctx.lineTo(IX + 422, IY + 76);
ctx.lineTo(IX + 432, IY + 108);
ctx.closePath();
ctx.fill();
// smoke
ctx.fillStyle = "#8a8f96";
ctx.beginPath();
ctx.arc(IX + 425, IY + 46, 15, 0, Math.PI * 2);
ctx.arc(IX + 445, IY + 30, 18, 0, Math.PI * 2);
ctx.fill();
// drone above the ship
ctx.fillStyle = INK;
ctx.fillRect(IX + 196, IY + 26, 34, 10);
ctx.fillRect(IX + 188, IY + 22, 50, 3);
ctx.fillRect(IX + 188, IY + 35, 50, 3);
ctx.fillStyle = RED;
ctx.beginPath();
ctx.arc(IX + 213, IY + 31, 5, 0, Math.PI * 2);
ctx.fill();
y = IY + IH + 8;
const leadBody = wrapText(
  "President Zelenskyy confirms a drone strike on a Russian corvette docked at Benghazi, and posts video of the vessels being hit.",
  LW,
  `19px ${SERIF}`
);
y = drawLines(leadBody, LX, y, 25, `19px ${SERIF}`, "#333333");

// ---------- right column: Nvidia + Iran ----------
const RX = 664;
const RW = 324;
let ry = 214;
kicker("TECHNOLOGY", RX, ry);
ry += 28;
const nvHead = wrapText("HUANG BACK AS NVIDIA CHIEF", RW, `bold 25px ${SERIF}`);
ry = drawLines(nvHead, RX, ry, 30, `bold 25px ${SERIF}`);
ry += 6;
// chip illustration 324 x 70
ctx.fillStyle = "#123f2a";
ctx.fillRect(RX, ry, RW, 70);
ctx.fillStyle = "#1d7a44";
ctx.fillRect(RX + 92, ry + 14, 140, 42);
ctx.fillStyle = "#d8b25a";
for (let i = 0; i < 6; i++) {
  ctx.fillRect(RX + 14 + i * 52, ry + 4, 8, 8);
  ctx.fillRect(RX + 14 + i * 52, ry + 58, 8, 8);
}
ctx.fillStyle = "#ffffff";
ctx.font = `bold 26px ${SANS}`;
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText("AI", RX + 162, ry + 36);
ctx.textAlign = "left";
ctx.textBaseline = "top";
ry += 70 + 6;
const nvBody = wrapText(
  "The board reinstates Jensen Huang as CEO less than two weeks after his abrupt resignation.",
  RW,
  `17px ${SERIF}`
);
ry = drawLines(nvBody, RX, ry, 22, `17px ${SERIF}`, "#333333");
ry += 16;
hRule(RX, ry, RW, "#999999", 1);
ry += 14;
kicker("MIDDLE EAST", RX, ry);
ry += 26;
const irHead = wrapText("TEHRAN VOWS TO FIGHT BLOCKADE", RW, `bold 25px ${SERIF}`);
ry = drawLines(irHead, RX, ry, 30, `bold 25px ${SERIF}`);
ry += 6;
const irBody = wrapText(
  "Iran vows \u201Cevery means\u201D to counter a U.S. blockade of the Strait of Hormuz.",
  RW,
  `17px ${SERIF}`
);
ry = drawLines(irBody, RX, ry, 22, `17px ${SERIF}`, "#333333");

// ---------- divider ----------
const DY = 640;
hRule(36, DY, W - 72, INK, 3);
hRule(36, DY + 6, W - 72, INK, 1);

// ---------- bottom row: four stories ----------
const cols = [
  {
    kick: "GAZA",
    head: "GAZA'S LAND AND WATER \u201CTOXIC FOR DECADES\u201D",
    body: "An Oxfam report finds explosives left heavy metals, asbestos and dioxins across the Strip.",
    art: "gaza",
  },
  {
    kick: "UNITED STATES",
    head: "DEMOCRATS SEAL HISTORIC HOUSE MAJORITY",
    body: "At least 258 seats — the party's largest House majority since 1992.",
    art: "capitol",
  },
  {
    kick: "AFGHANISTAN",
    head: "TALIBAN ERASE WOMEN'S NAMES FROM PAPERS",
    body: "Officials in Balkh are told to replace women's names with \u201CBibi\u201D on documents.",
    art: "paper",
  },
  {
    kick: "SENEGAL",
    head: "MIGRANT BOAT CAPSIZES OFF SENEGAL",
    body: "At least four dead and dozens missing after a boat overturns off Yenne.",
    art: "boat",
  },
];

const colW = 228;
const colGap = 12;
const colX0 = 36;
const by = DY + 22;

function drawArt(kind, x, y, w, h) {
  if (kind === "gaza") {
    ctx.fillStyle = "#c9a86a";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#8a6d3b";
    ctx.fillRect(x, y + h - 26, w, 26);
    ctx.strokeStyle = "#5d4a26";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + 30, y + h - 26);
    ctx.lineTo(x + 70, y + h - 60);
    ctx.lineTo(x + 120, y + h - 40);
    ctx.lineTo(x + 170, y + h - 66);
    ctx.lineTo(x + 205, y + h - 34);
    ctx.stroke();
    ctx.fillStyle = "#6b7f8f";
    ctx.fillRect(x + 30, y + 14, 42, 34);
    ctx.fillRect(x + 84, y + 22, 36, 26);
    ctx.fillStyle = "#4a4a4a";
    ctx.beginPath();
    ctx.moveTo(x + 30, y + 14);
    ctx.lineTo(x + 51, y + 2);
    ctx.lineTo(x + 72, y + 14);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#2e6b8f";
    ctx.beginPath();
    ctx.arc(x + 190, y + 26, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold 15px ${SANS}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("H2O", x + 190, y + 27);
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
  } else if (kind === "capitol") {
    ctx.fillStyle = "#274b6d";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#f2ede0";
    ctx.beginPath();
    ctx.arc(x + w / 2, y + 52, 42, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(x + w / 2 - 42, y + 52, 84, 8);
    ctx.fillRect(x + w / 2 - 4, y + 4, 8, 12);
    ctx.fillStyle = "#f2ede0";
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(x + 52 + i * 32, y + 62, 10, 26);
    }
    ctx.fillRect(x + 44, y + 60, 140, 4);
    ctx.fillRect(x + 44, y + 88, 140, 4);
    ctx.fillStyle = "#f6c445";
    for (let i = 0; i < 3; i++) {
      const sx = x + 24 + i * 90;
      const sy = y + 16;
      ctx.beginPath();
      ctx.arc(sx, sy, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === "paper") {
    ctx.fillStyle = "#dfe5e8";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 54, y + 10, 120, 70);
    ctx.strokeStyle = "#999999";
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 54, y + 10, 120, 70);
    ctx.strokeStyle = "#444444";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + 66, y + 28);
    ctx.lineTo(x + 162, y + 28);
    ctx.moveTo(x + 66, y + 44);
    ctx.lineTo(x + 162, y + 44);
    ctx.moveTo(x + 66, y + 60);
    ctx.lineTo(x + 130, y + 60);
    ctx.stroke();
    ctx.strokeStyle = RED;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x + 60, y + 20);
    ctx.lineTo(x + 168, y + 52);
    ctx.moveTo(x + 168, y + 20);
    ctx.lineTo(x + 60, y + 52);
    ctx.stroke();
    ctx.fillStyle = INK;
    ctx.font = `bold 16px ${SANS}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("\u201CBIBI\u201D", x + w / 2, y + 84);
    ctx.textAlign = "left";
  } else if (kind === "boat") {
    ctx.fillStyle = "#bfd9e8";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#2e6b8f";
    ctx.fillRect(x, y + 52, w, h - 52);
    ctx.save();
    ctx.translate(x + w / 2, y + 46);
    ctx.rotate(-0.5);
    ctx.fillStyle = "#7a4a21";
    ctx.beginPath();
    ctx.moveTo(-58, 0);
    ctx.lineTo(58, 0);
    ctx.lineTo(40, 18);
    ctx.lineTo(-40, 18);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#5a3413";
    ctx.fillRect(-6, -26, 6, 26);
    ctx.restore();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + 8, y + 66);
    ctx.quadraticCurveTo(x + 60, y + 58, x + 110, y + 66);
    ctx.quadraticCurveTo(x + 160, y + 58, x + 220, y + 66);
    ctx.stroke();
    ctx.strokeStyle = "#e8721c";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(x + 188, y + 24, 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(x + 188, y + 24, 14, Math.PI * 0.25, Math.PI * 0.75);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 188, y + 24, 14, Math.PI * 1.25, Math.PI * 1.75);
    ctx.stroke();
  }
}

cols.forEach((c, i) => {
  const cx = colX0 + i * (colW + colGap);
  let cy = by;
  kicker(c.kick, cx, cy);
  cy += 26;
  drawArt(c.art, cx, cy, colW, 92);
  cy += 92 + 10;
  const head = wrapText(c.head, colW, `bold 21px ${SERIF}`);
  cy = drawLines(head, cx, cy, 26, `bold 21px ${SERIF}`);
  cy += 6;
  const body = wrapText(c.body, colW, `16px ${SERIF}`);
  drawLines(body, cx, cy, 21, `16px ${SERIF}`, "#333333");
});

// ---------- footer ----------
ctx.fillStyle = GREY;
ctx.font = `italic 16px ${SERIF}`;
ctx.textAlign = "center";
ctx.textBaseline = "top";
ctx.fillText(
  "THE WORLD TODAY  •  TUESDAY, 24 NOVEMBER 2026  •  All stories as reported on 24 November 2026",
  W / 2,
  994
);

writeFileSync("entry.png", canvas.toBuffer("image/png"));
console.log("wrote entry.png");
