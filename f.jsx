import React, { useEffect, useRef, useState, useCallback } from "react";

if (
  typeof window !== "undefined" &&
  typeof CanvasRenderingContext2D !== "undefined" &&
  !CanvasRenderingContext2D.prototype.roundRect
) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    const rr = typeof r === "number" ? r : 0;
    const cr = Math.min(rr, Math.abs(w) / 2, Math.abs(h) / 2);
    this.moveTo(x + cr, y);
    this.arcTo(x + w, y, x + w, y + h, cr);
    this.arcTo(x + w, y + h, x, y + h, cr);
    this.arcTo(x, y + h, x, y, cr);
    this.arcTo(x, y, x + w, y, cr);
    this.closePath();
    return this;
  };
}

// ─── PHASE DATA ───────────────────────────────────────────────────────────────
const PHASES = [
  {
    id: "sunny", label: "☀️ Clear", dur: 5000,
    sky: ["#4FC3F7","#B3E5FC","#E1F5FE"],
    ground: "#2E7D32", road: "#37474F",
    rain: 0, fog: 0, storm: false, aqi: 0,
    speed: 1.0,
    card: null,
    narrative: "Active policy · Ravi Kumar · Mumbai Kurla"
  },
  {
    id: "policy", label: "✅ Policy", dur: 3000,
    sky: ["#4FC3F7","#B3E5FC","#E1F5FE"],
    ground: "#2E7D32", road: "#37474F",
    rain: 0, fog: 0, storm: false, aqi: 0,
    speed: 1.0,
    card: "policy",
    narrative: "Week 12 — INR 2,500 coverage active"
  },
  {
    id: "cloudy", label: "☁️ Clouds", dur: 3500,
    sky: ["#78909C","#90A4AE","#B0BEC5"],
    ground: "#388E3C", road: "#455A64",
    rain: 0.15, fog: 0, storm: false, aqi: 0,
    speed: 0.75,
    card: null,
    narrative: "Clouds building over Bandra–Kurla corridor"
  },
  {
    id: "warning", label: "⚠️ Alert", dur: 3000,
    sky: ["#546E7A","#607D8B","#78909C"],
    ground: "#2E7D32", road: "#455A64",
    rain: 0.45, fog: 0.1, storm: false, aqi: 0,
    speed: 0.5,
    card: "warning",
    narrative: "⚠️ IMD Red Alert — 82mm/hr · Trigger evaluating…"
  },
  {
    id: "rain", label: "🌧️ Rain", dur: 5500,
    sky: ["#263238","#37474F","#455A64"],
    ground: "#1B5E20", road: "#263238",
    rain: 1.0, fog: 0.3, storm: true, aqi: 0,
    speed: 0.2,
    card: "trigger",
    narrative: "🌧️ Heavy rain confirmed — eligibility check running"
  },
  {
    id: "claim", label: "📋 Claim", dur: 3500,
    sky: ["#263238","#37474F","#455A64"],
    ground: "#1B5E20", road: "#263238",
    rain: 0.8, fog: 0.2, storm: false, aqi: 0,
    speed: 0.18,
    card: "claim",
    narrative: "📋 Auto-claim #MBI-042821 · Score 0.91 ✓"
  },
  {
    id: "payout", label: "💸 Payout", dur: 4000,
    sky: ["#37474F","#546E7A","#607D8B"],
    ground: "#2E7D32", road: "#455A64",
    rain: 0.3, fog: 0, storm: false, aqi: 0,
    speed: 0.55,
    card: "payout",
    narrative: "💸 ₹385 dispatched · 4 min 12 sec"
  },
  {
    id: "clearing", label: "🌤 Clear", dur: 3000,
    sky: ["#4FC3F7","#B3E5FC","#E1F5FE"],
    ground: "#388E3C", road: "#37474F",
    rain: 0, fog: 0, storm: false, aqi: 0,
    speed: 0.85,
    card: null,
    narrative: "Rain cleared — delivery operations resuming"
  },
  {
    id: "aqi", label: "🌫 AQI", dur: 5000,
    sky: ["#BF360C","#E64A19","#FF7043"],
    ground: "#33691E", road: "#4E342E",
    rain: 0, fog: 0.6, storm: false, aqi: 1.0,
    speed: 0.2,
    card: "aqi",
    narrative: "🌫️ AQI 318 · Severe · Whitefield Bangalore"
  },
  {
    id: "aqipay", label: "💸 AQI Pay", dur: 3500,
    sky: ["#BF360C","#E64A19","#FF7043"],
    ground: "#33691E", road: "#4E342E",
    rain: 0, fog: 0.4, storm: false, aqi: 0.7,
    speed: 0.5,
    card: "aqipay",
    narrative: "💸 ₹290 dispatched · Priya Sharma ✓"
  },
];

const CARDS = {
  policy: {
    color: "#4CAF50", icon: "✅",
    title: "Week 12 Coverage Active",
    body: "Ravi Kumar · Mumbai Kurla\nBand: ₹2,500 · Premium: ₹310\nZone: H3-88712c4a · Trust: 0.87",
    value: "₹2,500 covered"
  },
  warning: {
    color: "#FF9800", icon: "⚠️",
    title: "IMD Red Alert Issued",
    body: "Heavy Rain · 82mm/hr\nZones: Kurla · Bandra · Andheri\nThreshold: 50mm/hr",
    value: "Trigger: ACTIVE"
  },
  trigger: {
    color: "#03A9F4", icon: "⚡",
    title: "Parametric Trigger Fired",
    body: "GPS: Kurla ✓  Accel: 1.4g ✓\nCell tower: Match ✓  PPS: 0.91\nRing score: 0.02 (clean) ✓",
    value: "PPS: 0.91 → PASS"
  },
  claim: {
    color: "#9C27B0", icon: "📋",
    title: "Auto-Claim #MBI-042821",
    body: "Straight-through approved\nWindow: 15:30–19:00 · 3.5 hrs\nAdjudication: 0.91 ✓",
    value: "₹385 approved"
  },
  payout: {
    color: "#4CAF50", icon: "💸",
    title: "UPI Payout Complete",
    body: "→ ravi.kumar@upi\nRef: MBIP042025042\nTime: 4 min 12 sec ✓",
    value: "₹385 sent ✓"
  },
  aqi: {
    color: "#FF5722", icon: "🌫️",
    title: "AQI 318 — Severe",
    body: "Worker: Priya Sharma · Whitefield\nTrust: 0.88 · Threshold: 90 min met\nSignal SCS: 0.92 ✓",
    value: "₹290 calculating"
  },
  aqipay: {
    color: "#4CAF50", icon: "💸",
    title: "AQI Payout Dispatched",
    body: "→ priya.sharma@upi\nAQI event: 318 · Duration: 2.1 hrs\nIncome model: ₹290",
    value: "₹290 sent ✓"
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function lerpColor(a, b, t) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ar = (pa >> 16) & 0xff, ag = (pa >> 8) & 0xff, ab = pa & 0xff;
  const br = (pb >> 16) & 0xff, bg = (pb >> 8) & 0xff, bb = pb & 0xff;
  const r = Math.round(lerp(ar, br, t)), g = Math.round(lerp(ag, bg, t)), bl = Math.round(lerp(ab, bb, t));
  return `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${bl.toString(16).padStart(2,"0")}`;
}

// ─── CANVAS SCENE CLASS ───────────────────────────────────────────────────────
class Scene {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.W = canvas.width;
    this.H = canvas.height;
    this.t = 0;
    this.roadX = 0;
    this.bikeX = 0;
    this.bikeTargetX = 0;
    this.wheelAngle = 0;
    this.bobY = 0;
    this.rainDrops = Array.from({length:250}, () => this._newDrop());
    this.puddles = Array.from({length:6}, (_,i) => ({x: i*0.18+0.04, y: lerp(0.75, 0.92, Math.random()), rx: 40+Math.random()*50, ry: 8+Math.random()*10, life:0}));
    this.coins = [];
    this.lightning = null;
    this.ltTimer = 0;
    this.ltAlpha = 0;
    this.dustParticles = Array.from({length:80}, () => this._newDust());
    this.buildings = this._genBuildings();
    this.trees = this._genTrees();
    this.smokeParticles = [];
    this.exhaustTimer = 0;
    // state
    this.rain = 0; this.tRain = 0;
    this.fog = 0; this.tFog = 0;
    this.aqi = 0; this.tAqi = 0;
    this.speed = 1; this.tSpeed = 1;
    this.sky = ["#4FC3F7","#B3E5FC","#E1F5FE"];
    this.tSky = ["#4FC3F7","#B3E5FC","#E1F5FE"];
    this.groundColor = "#2E7D32"; this.tGround = "#2E7D32";
    this.roadColor = "#37474F"; this.tRoad = "#37474F";
    this.coinSpawned = false;
    this.onCoinSpawn = null;
    this.bikeTargetX = this.W * 0.38;
    this.bikeX = this.W * 0.38;
    // ground scroll layers
    this.grassX = 0;
    this.farBuildX = 0;
    this.midBuildX = 0;
  }

  _newDrop() {
    return {x: Math.random()*1400, y: Math.random()*-400, vx: 1.8+Math.random()*2, vy: 14+Math.random()*8, len: 12+Math.random()*18, alpha: 0.3+Math.random()*0.5};
  }
  _newDust() {
    return {x: Math.random(), y: Math.random()*0.65, r: 3+Math.random()*12, vx: (-0.3+Math.random()*0.6)*0.6, vy: (-0.2+Math.random()*0.4)*0.4, alpha: 0.08+Math.random()*0.22};
  }
  _genBuildings() {
    const arr = []; let x = 0;
    const r = (s => { let seed=s; return () => {seed=(seed*1664525+1013904223)>>>0; return seed/4294967296;}; })(4321);
    while(x < 3000) {
      const w = 40+Math.floor(r()*70), h = 55+Math.floor(r()*220);
      const floors = Math.max(3, Math.floor(h/18)), cols = Math.max(1, Math.floor(w/15));
      const wins = Array.from({length: floors*cols}, () => r()>0.35);
      arr.push({x, w, h, floors, cols, wins, shade: Math.floor(r()*30+12)});
      x += w + 5 + Math.floor(r()*18);
    }
    return arr;
  }
  _genTrees() {
    const arr = []; let x = 0;
    const r = (s => { let seed=s; return () => {seed=(seed*6364136223846793005n%BigInt(2**64)); return Number(seed)/2**64;}; })(77777);
    // simple seeded
    for(let i=0;i<60;i++) {
      arr.push({x: i*62 + Math.sin(i*1.3)*20, h: 35+Math.sin(i*2.1)*15, r: 14+Math.cos(i*1.7)*5});
    }
    return arr;
  }

  setPhase(phase) {
    this.tRain = phase.rain;
    this.tFog = phase.fog;
    this.tAqi = phase.aqi;
    this.tSpeed = phase.speed;
    this.tSky = phase.sky;
    this.tGround = phase.ground;
    this.tRoad = phase.road;
    this.coinSpawned = false;
    if(phase.id === "payout" || phase.id === "aqipay") {
      this.bikeTargetX = this.W * 0.50;
    } else if(phase.rain > 0.7 || phase.aqi > 0.7) {
      this.bikeTargetX = this.W * 0.30;
    } else {
      this.bikeTargetX = this.W * 0.38;
    }
  }

  spawnCoins() {
    for(let i=0;i<8;i++) {
      this.coins.push({x: this.bikeX+10, y: this.H*0.52, vx: (Math.random()-0.5)*5, vy: -(3+Math.random()*5), life:1.0, sym: ["₹","₹","✨","🎉","💰"][Math.floor(Math.random()*5)]});
    }
  }

  update(dt) {
    this.t += dt;
    const k = clamp(dt/400, 0, 0.12);
    this.rain = lerp(this.rain, this.tRain, k);
    this.fog = lerp(this.fog, this.tFog, k);
    this.aqi = lerp(this.aqi, this.tAqi, k);
    this.speed = lerp(this.speed, this.tSpeed, k*0.7);
    for(let i=0;i<3;i++) this.sky[i] = lerpColor(this.sky[i], this.tSky[i], k*0.5);
    this.groundColor = lerpColor(this.groundColor, this.tGround, k*0.4);
    this.roadColor = lerpColor(this.roadColor, this.tRoad, k*0.4);

    const spd = this.speed;
    this.roadX += spd * dt * 0.22;
    this.grassX += spd * dt * 0.18;
    this.midBuildX += spd * dt * 0.10;
    this.farBuildX += spd * dt * 0.05;
    this.wheelAngle += spd * dt * 0.009;
    this.bobY = Math.sin(this.t * 0.006) * spd * 5;
    this.bikeX = lerp(this.bikeX, this.bikeTargetX, 0.03);

    // rain
    if(this.rain > 0.05) {
      for(const d of this.rainDrops) {
        d.x += d.vx * this.rain;
        d.y += d.vy * this.rain;
        if(d.y > this.H+20) { Object.assign(d, this._newDrop()); d.y = -20; }
        if(d.x > this.W+20) d.x -= this.W+40;
      }
    }
    // puddle grow
    for(const p of this.puddles) {
      if(this.rain > 0.3) p.life = Math.min(1, p.life + 0.002);
      else p.life = Math.max(0, p.life - 0.003);
    }
    // lightning
    if(this.rain > 0.7) {
      this.ltTimer -= dt;
      if(this.ltTimer < 0) {
        this.ltTimer = 1500 + Math.random()*2500;
        this._genLightning();
        this.ltAlpha = 1;
      }
    }
    this.ltAlpha = Math.max(0, this.ltAlpha - dt*0.004);
    // dust
    if(this.aqi > 0.05) {
      for(const p of this.dustParticles) {
        p.x = (p.x + p.vx + 1.5)%1;
        p.y = (p.y + p.vy + 10)%0.65;
      }
    }
    // coins
    for(let i=this.coins.length-1; i>=0; i--) {
      const c = this.coins[i];
      c.x += c.vx; c.y += c.vy; c.vy += 0.2; c.life -= 0.018;
      if(c.life<=0) this.coins.splice(i,1);
    }
    // exhaust smoke
    this.exhaustTimer += dt;
    if(this.exhaustTimer > 120/Math.max(0.1,this.speed)) {
      this.exhaustTimer = 0;
      this.smokeParticles.push({x:this.bikeX-70, y:this.H*0.57+this.bobY, r:3+Math.random()*4, vx:-0.8-Math.random(), vy:-0.4-Math.random()*0.6, life:1.0, alpha:0.2+Math.random()*0.15});
    }
    for(let i=this.smokeParticles.length-1;i>=0;i--) {
      const s=this.smokeParticles[i];
      s.x+=s.vx; s.y+=s.vy; s.r+=0.15; s.life-=0.025; s.alpha*=0.97;
      if(s.life<=0) this.smokeParticles.splice(i,1);
    }
  }

  _genLightning() {
    const pts = [[this.W*0.25+Math.random()*this.W*0.5, 0]];
    let [lx,ly] = pts[0];
    while(ly < this.H*0.58) { lx+=(Math.random()-0.5)*80; ly+=20+Math.random()*35; pts.push([lx,ly]); }
    this.lightning = pts;
  }

  draw() {
    const {ctx,W,H} = this;
    ctx.clearRect(0,0,W,H);
    this._drawSky();
    if(this.ltAlpha>0.01) this._drawLightningFlash();
    this._drawFarBuildings();
    this._drawTrees();
    this._drawGround();
    this._drawRoad();
    this._drawPuddles();
    this._drawSmoke();
    this._drawBike();
    this._drawRain();
    this._drawFog();
    this._drawAQI();
    this._drawLightning();
    this._drawCoins();
  }

  _drawSky() {
    const {ctx,W,H} = this;
    const gy = H*0.60;
    const g = ctx.createLinearGradient(0,0,0,gy);
    g.addColorStop(0, this.sky[0]);
    g.addColorStop(0.5, this.sky[1]);
    g.addColorStop(1, this.sky[2]);
    ctx.fillStyle = g;
    ctx.fillRect(0,0,W,gy);
    // sun (only when clear)
    if(this.rain<0.2 && this.aqi<0.2 && this.fog<0.2) {
      const sa = 1-(this.rain*3+this.aqi*2+this.fog*3);
      if(sa>0) {
        const sx=W*0.82, sy=H*0.12;
        ctx.save(); ctx.globalAlpha = sa*0.9;
        const sg = ctx.createRadialGradient(sx,sy,6,sx,sy,70);
        sg.addColorStop(0,"rgba(255,236,100,0.45)");
        sg.addColorStop(1,"rgba(255,236,100,0)");
        ctx.fillStyle=sg; ctx.beginPath(); ctx.arc(sx,sy,70,0,Math.PI*2); ctx.fill();
        ctx.fillStyle="rgba(255,230,80,1)"; ctx.beginPath(); ctx.arc(sx,sy,22,0,Math.PI*2); ctx.fill();
        ctx.restore();
      }
    }
    // clouds
    this._drawClouds();
  }

  _drawClouds() {
    const {ctx,W,H} = this;
    const density = this.rain*0.8+this.fog*0.5+this.aqi*0.4;
    if(density<0.05) return;
    const dark = density>0.5;
    const fill = dark?`rgba(50,58,72,${density*0.7})`:`rgba(220,230,245,${density*0.8})`;
    ctx.fillStyle=fill;
    const coff = (this.t*0.018*this.speed)%(W+400);
    const cdefs=[
      {rx:0.08,ry:0.05,r:65},{rx:0.20,ry:0.04,r:80},{rx:0.13,ry:0.13,r:48},
      {rx:0.40,ry:0.06,r:72},{rx:0.55,ry:0.03,r:92},{rx:0.50,ry:0.15,r:55},
      {rx:0.70,ry:0.07,r:60},{rx:0.85,ry:0.04,r:75},{rx:0.92,ry:0.16,r:50},
      {rx:1.10,ry:0.05,r:68},{rx:1.25,ry:0.03,r:88},
    ];
    ctx.save();
    for(const c of cdefs) {
      const cx = ((c.rx*W-coff%(W*1.5+300))%(W+300)+W+300)%(W+300)-150;
      const cy = c.ry*H;
      ctx.beginPath();
      ctx.arc(cx,cy,c.r,0,Math.PI*2);
      ctx.arc(cx+c.r*0.7,cy-c.r*0.3,c.r*0.7,0,Math.PI*2);
      ctx.arc(cx-c.r*0.6,cy-c.r*0.22,c.r*0.6,0,Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  }

  _drawFarBuildings() {
    const {ctx,W,H} = this;
    const baseY = H*0.60;
    const off = this.farBuildX%(W+300);
    for(const b of this.buildings) {
      const bx = ((b.x - off)%(W+350)+W+350)%(W+350)-150;
      if(bx>W+120||bx+b.w<-120) continue;
      const by = baseY - b.h;
      const v = b.shade;
      ctx.fillStyle=`rgb(${v},${v+5},${v+15})`;
      ctx.fillRect(bx,by,b.w,b.h);
      // windows
      for(let row=0;row<b.floors;row++) {
        for(let col=0;col<b.cols;col++) {
          if(b.wins[row*b.cols+col]) {
            const wx = bx+col*14+4, wy = by+row*18+5;
            ctx.fillStyle = this.rain>0.4 ? "rgba(100,170,255,0.6)" : "rgba(255,220,100,0.55)";
            ctx.fillRect(wx,wy,9,9);
          }
        }
      }
      ctx.fillStyle="rgba(0,0,0,0.2)";
      ctx.fillRect(bx+b.w-3,by,3,b.h);
    }
  }

  _drawTrees() {
    const {ctx,W,H} = this;
    const baseY = H*0.60;
    const off = this.grassX%(W+200);
    ctx.save();
    for(let i=0;i<this.trees.length;i++) {
      const t = this.trees[i];
      const tx = ((t.x - off)%(W+250)+W+250)%(W+250)-100;
      if(tx>W+100||tx<-100) continue;
      // trunk
      ctx.fillStyle="#4E342E";
      ctx.fillRect(tx-4, baseY-t.h*0.3, 8, t.h*0.35);
      // foliage
      const swayX = Math.sin(this.t*0.002*this.speed+i*0.8)*this.speed*3;
      ctx.fillStyle = this.aqi>0.5 ? "#827717" : (this.rain>0.3 ? "#2E7D32" : "#388E3C");
      ctx.beginPath();
      ctx.arc(tx+swayX, baseY-t.h*0.38, t.r, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = this.aqi>0.5 ? "#9E9D24" : (this.rain>0.3 ? "#388E3C" : "#43A047");
      ctx.beginPath();
      ctx.arc(tx+swayX*0.7, baseY-t.h*0.55, t.r*0.75, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  }

  _drawGround() {
    const {ctx,W,H} = this;
    const gy = H*0.60;
    ctx.fillStyle = this.groundColor;
    ctx.fillRect(0,gy,W,H-gy);
    // grass blade texture
    if(this.rain<0.8) {
      ctx.fillStyle = lerpColor(this.groundColor, "#1B5E20", 0.3);
      for(let x=0;x<W;x+=8) {
        ctx.fillRect(x, gy, 2, 6+Math.sin(x*0.3)*3);
      }
    }
  }

  _drawRoad() {
    const {ctx,W,H} = this;
    const ry = Math.round(H*0.63);
    const rh = H - ry;
    // road surface
    const rg = ctx.createLinearGradient(0,ry,0,H);
    rg.addColorStop(0, this.roadColor);
    rg.addColorStop(0.3, lerpColor(this.roadColor, "#1a2230", 0.25));
    rg.addColorStop(1, lerpColor(this.roadColor, "#0d1117", 0.5));
    ctx.fillStyle=rg; ctx.fillRect(0,ry,W,rh);
    // kerb
    ctx.fillStyle = lerpColor(this.roadColor, "#ffffff", 0.3);
    ctx.fillRect(0,ry,W,4);
    // lane dashes
    const dashLen=52, dashGap=36, dashTotal=dashLen+dashGap;
    const doff = this.roadX*0.8 % dashTotal;
    ctx.fillStyle="rgba(255,255,255,0.55)";
    ctx.fillRect(0, H*0.90-2, W, 3);
    ctx.fillStyle="rgba(255,200,0,0.75)";
    for(let x=-dashTotal+doff; x<W+dashTotal; x+=dashTotal) {
      ctx.fillRect(x, H*0.765-2, dashLen, 4);
    }
    // kerb bottom
    ctx.fillStyle="rgba(255,255,255,0.4)";
    ctx.fillRect(0,H-5,W,5);
  }

  _drawPuddles() {
    const {ctx,W,H} = this;
    if(this.rain < 0.2) return;
    ctx.save();
    for(const p of this.puddles) {
      if(p.life < 0.05) continue;
      ctx.globalAlpha = p.life * this.rain * 0.5;
      ctx.beginPath();
      ctx.ellipse(p.x*W, p.y*H, p.rx, p.ry, 0, 0, Math.PI*2);
      ctx.fillStyle="rgba(100,160,220,0.4)"; ctx.fill();
      ctx.strokeStyle="rgba(140,200,255,0.4)"; ctx.lineWidth=1; ctx.stroke();
      // ripple
      if(this.rain > 0.5) {
        const rr = ((this.t*0.003)%1)*p.rx*1.4;
        ctx.globalAlpha = (1-(rr/p.rx/1.4))*0.3*this.rain;
        ctx.beginPath(); ctx.ellipse(p.x*W,p.y*H,rr,rr*0.35,0,0,Math.PI*2);
        ctx.strokeStyle="rgba(170,220,255,0.6)"; ctx.lineWidth=0.8; ctx.stroke();
      }
    }
    ctx.restore();
  }

  _drawSmoke() {
    const {ctx} = this;
    ctx.save();
    for(const s of this.smokeParticles) {
      ctx.globalAlpha = s.alpha * s.life;
      ctx.fillStyle = `rgba(150,150,150,1)`;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }

  _drawBike() {
    const {ctx,H} = this;
    const bx = this.bikeX;
    const gy = Math.round(H*0.63);
    const groundY = gy + 24;
    const bob = this.bobY;
    ctx.save();
    ctx.translate(bx, groundY + bob);

    // Enhanced shadow with blur
    ctx.save();
    ctx.globalAlpha=0.22+this.rain*0.12;
    ctx.translate(0,24);
    ctx.scale(1,0.18);
    ctx.filter="blur(4px)";
    ctx.beginPath(); ctx.ellipse(0,0,76,38,0,0,Math.PI*2);
    ctx.fillStyle="#000"; ctx.fill();
    ctx.restore();

    // REAR WHEEL - Enhanced
    this._wheel(-38, 0, 22, this.wheelAngle);
    // FRONT WHEEL - Enhanced
    this._wheel(42, 0, 20, this.wheelAngle*1.05);

    // MUDGUARDS with better shading
    ctx.beginPath(); ctx.arc(-38,0,27,Math.PI*1.05,Math.PI*1.95);
    ctx.strokeStyle="#546E7A"; ctx.lineWidth=5; ctx.lineCap="round"; ctx.stroke();
    ctx.strokeStyle="#37474F"; ctx.lineWidth=2; ctx.stroke();
    ctx.beginPath(); ctx.arc(42,0,25,Math.PI*1.05,Math.PI*1.95);
    ctx.strokeStyle="#546E7A"; ctx.lineWidth=5; ctx.stroke();
    ctx.strokeStyle="#37474F"; ctx.lineWidth=2; ctx.stroke();

    // DELIVERY BOX - Enhanced with 3D depth
    const bw=48,bh=42,bxL=-76,byT=-32-bh;
    ctx.save();
    // Shadow
    ctx.fillStyle="rgba(0,0,0,0.25)"; ctx.fillRect(bxL+4,byT+4,bw,bh);
    // Main box
    ctx.fillStyle="#FF6D38"; ctx.fillRect(bxL,byT,bw,bh);
    // Top stripe with gradient effect
    const grd1 = ctx.createLinearGradient(bxL,byT,bxL,byT+11);
    grd1.addColorStop(0,"#E55528");
    grd1.addColorStop(1,"#C44422");
    ctx.fillStyle=grd1; ctx.fillRect(bxL,byT,bw,11);
    // Shine effect
    ctx.fillStyle="rgba(255,255,255,0.18)"; ctx.fillRect(bxL+5,byT+13,bw-10,bh-18);
    ctx.fillStyle="rgba(255,255,255,0.25)"; ctx.fillRect(bxL+5,byT+13,bw-10,6);
    // Border
    ctx.strokeStyle="#C44422"; ctx.lineWidth=1.8; ctx.strokeRect(bxL,byT,bw,bh);
    // Logo
    ctx.fillStyle="rgba(255,255,255,0.98)"; ctx.font="bold 9px Arial";
    ctx.textAlign="center"; ctx.fillText("FOOD",bxL+bw/2,byT+28);
    ctx.restore();

    // BOX STRAP with depth
    ctx.beginPath(); ctx.moveTo(bxL+bw,-32); ctx.lineTo(-24,-28);
    ctx.strokeStyle="#455A64"; ctx.lineWidth=3; ctx.stroke();
    ctx.strokeStyle="#607D8B"; ctx.lineWidth=2; ctx.stroke();

    // MAIN FRAME with gradient
    ctx.beginPath();
    ctx.moveTo(-34,-6); ctx.lineTo(-20,-24); ctx.lineTo(-2,-24);
    ctx.lineTo(14,-34); ctx.lineTo(36,-20); ctx.lineTo(44,-10);
    ctx.lineTo(42,-4); ctx.lineTo(-34,-4); ctx.closePath();
    const frameGrad = ctx.createLinearGradient(-34,-34,44,0);
    frameGrad.addColorStop(0,"#F59E0B");
    frameGrad.addColorStop(0.5,"#FBBF24");
    frameGrad.addColorStop(1,"#F59E0B");
    ctx.fillStyle=frameGrad; ctx.fill();
    ctx.strokeStyle="#D97706"; ctx.lineWidth=1.8; ctx.stroke();

    // Engine cover with depth
    const engGrad = ctx.createLinearGradient(-8,-24,22,-11);
    engGrad.addColorStop(0,"#D97706");
    engGrad.addColorStop(1,"#B45309");
    ctx.fillStyle=engGrad; ctx.beginPath(); ctx.roundRect(-8,-24,30,13,3); ctx.fill();
    ctx.strokeStyle="#92400E"; ctx.lineWidth=1; ctx.stroke();

    // FRONT FORK with chrome effect
    ctx.beginPath(); ctx.moveTo(34,-18); ctx.lineTo(42,-4);
    ctx.strokeStyle="#37474F"; ctx.lineWidth=5; ctx.stroke();
    ctx.strokeStyle="#607D8B"; ctx.lineWidth=3; ctx.stroke();

    // HANDLEBAR with better detail
    ctx.beginPath(); ctx.moveTo(34,-20); ctx.lineTo(42,-38); ctx.lineTo(56,-40);
    ctx.strokeStyle="#1C2833"; ctx.lineWidth=4.5; ctx.lineCap="round"; ctx.lineJoin="round"; ctx.stroke();
    ctx.strokeStyle="#263238"; ctx.lineWidth=3; ctx.stroke();
    // Handlebar grip
    ctx.beginPath(); ctx.arc(56,-40,6,0,Math.PI*2);
    ctx.fillStyle="#1C1C1C"; ctx.fill();
    ctx.strokeStyle="rgba(255,255,255,0.1)"; ctx.lineWidth=1; ctx.stroke();

    // SEAT with padding detail
    const seatGrad = ctx.createLinearGradient(-22,-34,10,-26);
    seatGrad.addColorStop(0,"#1E2937");
    seatGrad.addColorStop(1,"#111827");
    ctx.fillStyle=seatGrad; ctx.beginPath(); ctx.roundRect(-22,-34,32,8,4); ctx.fill();
    ctx.strokeStyle="rgba(255,255,255,0.1)"; ctx.lineWidth=0.5; ctx.stroke();

    // RIDER LEGS with better anatomy
    // Left leg (thigh)
    ctx.fillStyle="#1A2436";
    ctx.beginPath(); ctx.roundRect(-17,-30,12,34,2); ctx.fill();
    // Right leg (thigh)
    ctx.beginPath(); ctx.roundRect(3,-30,12,34,2); ctx.fill();
    // Knee highlights
    ctx.fillStyle="rgba(255,255,255,0.05)";
    ctx.fillRect(-16,-6,10,6);
    ctx.fillRect(4,-6,10,6);
    // Shoes
    ctx.fillStyle="#0F172A";
    ctx.beginPath(); ctx.roundRect(-19,0,17,7,2); ctx.fill();
    ctx.beginPath(); ctx.roundRect(2,0,17,7,2); ctx.fill();
    ctx.strokeStyle="rgba(255,255,255,0.15)"; ctx.lineWidth=0.5;
    ctx.strokeRect(-19,0,17,7); ctx.strokeRect(2,0,17,7);

    // RIDER BODY with depth and jacket detail
    const bodyGrad = ctx.createLinearGradient(-18,-60,14,-30);
    bodyGrad.addColorStop(0,"#263849");
    bodyGrad.addColorStop(0.5,"#1E2D3D");
    bodyGrad.addColorStop(1,"#152232");
    ctx.fillStyle=bodyGrad;
    ctx.beginPath(); ctx.roundRect(-18,-60,32,30,6); ctx.fill();
    // Safety stripe
    ctx.fillStyle="#FF6D38"; ctx.fillRect(-18,-44,32,6);
    ctx.fillStyle="rgba(255,255,255,0.2)"; ctx.fillRect(-18,-44,32,2);
    // Zipper
    ctx.strokeStyle="rgba(255,255,255,0.2)"; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(-2,-58); ctx.lineTo(-2,-32); ctx.stroke();

    // GLOVES - new addition
    ctx.fillStyle="#1A2436";
    ctx.beginPath(); ctx.arc(54,-38,5,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle="rgba(255,255,255,0.1)"; ctx.lineWidth=1; ctx.stroke();

    // ARMS with better shading
    // Far arm
    ctx.beginPath(); ctx.moveTo(12,-52); ctx.quadraticCurveTo(32,-44,54,-39);
    ctx.strokeStyle="#152232"; ctx.lineWidth=10; ctx.lineCap="round"; ctx.stroke();
    ctx.strokeStyle="#1E2D3D"; ctx.lineWidth=8; ctx.stroke();
    ctx.strokeStyle="#2D3E54"; ctx.lineWidth=6; ctx.stroke();
    // Near arm
    ctx.beginPath(); ctx.moveTo(12,-52); ctx.quadraticCurveTo(30,-44,53,-37);
    ctx.strokeStyle="#152232"; ctx.lineWidth=10; ctx.stroke();
    ctx.strokeStyle="#1E2D3D"; ctx.lineWidth=8; ctx.stroke();

    // HELMET - Enhanced with better proportions
    // Base helmet
    ctx.beginPath(); ctx.arc(-2,-72,23,0,Math.PI*2);
    const helmetGrad = ctx.createRadialGradient(-8,-76,0,-2,-72,23);
    helmetGrad.addColorStop(0,"#FBBF24");
    helmetGrad.addColorStop(0.7,"#F59E0B");
    helmetGrad.addColorStop(1,"#D97706");
    ctx.fillStyle=helmetGrad; ctx.fill();
    ctx.strokeStyle="#D97706"; ctx.lineWidth=1.8; ctx.stroke();

    // Helmet racing stripe
    ctx.beginPath(); ctx.arc(-2,-72,23,Math.PI*0.5,Math.PI*1.5);
    ctx.strokeStyle="#DC2626"; ctx.lineWidth=4; ctx.stroke();
    ctx.strokeStyle="rgba(255,255,255,0.2)"; ctx.lineWidth=1; ctx.stroke();

    // Visor - improved with reflection
    ctx.save();
    ctx.beginPath(); ctx.ellipse(8,-67,15,10,0.25,0,Math.PI);
    const visorGrad = ctx.createLinearGradient(0,-77,16,-57);
    visorGrad.addColorStop(0,"rgba(20,40,120,0.95)");
    visorGrad.addColorStop(0.4,"rgba(28,55,145,0.9)");
    visorGrad.addColorStop(1,"rgba(15,30,80,0.85)");
    ctx.fillStyle=visorGrad; ctx.fill();
    ctx.strokeStyle="rgba(96,165,250,0.5)"; ctx.lineWidth=1.5; ctx.stroke();
    // Visor reflection
    ctx.beginPath(); ctx.ellipse(10,-70,8,4,0.25,0,Math.PI*0.6);
    ctx.fillStyle="rgba(150,200,255,0.3)"; ctx.fill();
    ctx.restore();

    // Helmet vents
    ctx.fillStyle="#D97706";
    ctx.fillRect(-10,-95,16,5);
    ctx.fillRect(-8,-90,12,4);
    ctx.strokeStyle="rgba(0,0,0,0.3)"; ctx.lineWidth=0.5;
    ctx.strokeRect(-10,-95,16,5);

    // Enhanced headlight with glow
    const headlightColor = (this.rain>0.4||this.aqi>0.3) ? "rgba(255,240,180,0.95)" : "rgba(255,240,180,0.7)";
    ctx.save();
    ctx.shadowColor="rgba(255,240,180,0.6)";
    ctx.shadowBlur=12;
    ctx.beginPath(); ctx.ellipse(44,-12,13,8,0,0,Math.PI*2);
    ctx.fillStyle="rgba(255,230,120,0.9)"; ctx.fill();
    ctx.shadowBlur=0;
    ctx.restore();
    // Light beam
    ctx.beginPath(); ctx.moveTo(47,-13); ctx.lineTo(80,-18); ctx.lineTo(80,-6); ctx.closePath();
    ctx.fillStyle=headlightColor; ctx.fill();

    ctx.restore();
  }

  _wheel(wx,wy,r,ang) {
    const {ctx}=this;
    ctx.save();
    ctx.translate(wx,wy);

    // Outer tire with gradient
    ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2);
    const tireGrad = ctx.createRadialGradient(-r*0.3,-r*0.3,0,0,0,r);
    tireGrad.addColorStop(0,"#202A38");
    tireGrad.addColorStop(0.7,"#141C28");
    tireGrad.addColorStop(1,"#0A0F16");
    ctx.fillStyle=tireGrad; ctx.fill();
    ctx.strokeStyle="#2D3748"; ctx.lineWidth=2.5; ctx.stroke();

    // Tire tread detail
    ctx.save();
    for(let i=0;i<12;i++) {
      ctx.rotate(Math.PI/6);
      ctx.beginPath(); ctx.moveTo(0,r-3); ctx.lineTo(0,r-0.5);
      ctx.strokeStyle="rgba(0,0,0,0.5)"; ctx.lineWidth=1.5; ctx.stroke();
    }
    ctx.restore();

    // Inner rim with metallic effect
    ctx.beginPath(); ctx.arc(0,0,r*0.7,0,Math.PI*2);
    const rimGrad = ctx.createRadialGradient(-r*0.2,-r*0.2,0,0,0,r*0.7);
    rimGrad.addColorStop(0,"#3A4A5E");
    rimGrad.addColorStop(0.5,"#232D3E");
    rimGrad.addColorStop(1,"#1A2332");
    ctx.fillStyle=rimGrad; ctx.fill();
    ctx.strokeStyle="#546E7A"; ctx.lineWidth=2; ctx.stroke();

    // Rotating spokes
    ctx.save();
    ctx.rotate(ang);
    for(let i=0;i<6;i++) {
      ctx.rotate(Math.PI/3);
      // Spoke body
      ctx.beginPath(); ctx.moveTo(0,r*0.12); ctx.lineTo(0,r*0.65);
      ctx.strokeStyle="#6B7A8F"; ctx.lineWidth=2.5; ctx.stroke();
      ctx.strokeStyle="#8896A8"; ctx.lineWidth=1.8; ctx.stroke();
      // Spoke highlight
      ctx.beginPath(); ctx.moveTo(0,r*0.15); ctx.lineTo(0,r*0.4);
      ctx.strokeStyle="rgba(200,220,240,0.3)"; ctx.lineWidth=1; ctx.stroke();
    }
    ctx.restore();

    // Center hub with metallic look
    ctx.beginPath(); ctx.arc(0,0,r*0.25,0,Math.PI*2);
    const hubGrad = ctx.createRadialGradient(-2,-2,0,0,0,r*0.25);
    hubGrad.addColorStop(0,"#FFD700");
    hubGrad.addColorStop(0.4,"#F59E0B");
    hubGrad.addColorStop(1,"#D97706");
    ctx.fillStyle=hubGrad; ctx.fill();
    ctx.strokeStyle="#B45309"; ctx.lineWidth=1; ctx.stroke();

    // Hub highlight
    ctx.beginPath(); ctx.arc(-r*0.08,-r*0.08,r*0.1,0,Math.PI*2);
    ctx.fillStyle="rgba(255,255,255,0.4)"; ctx.fill();

    ctx.restore();
  }

  _drawRain() {
    if(this.rain<0.03) return;
    const {ctx,W,H}=this;
    ctx.save();
    for(const d of this.rainDrops) {
      if(d.y>H || d.y<-d.len) continue;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x-d.vx*1.2, d.y-d.len);
      ctx.strokeStyle=`rgba(165,210,255,${d.alpha*this.rain})`;
      ctx.lineWidth=0.9; ctx.stroke();
    }
    ctx.restore();
  }

  _drawFog() {
    if(this.fog<0.03) return;
    const {ctx,W,H}=this;
    ctx.save();
    ctx.globalAlpha = this.fog*0.45;
    const fg = ctx.createLinearGradient(0,H*0.4,0,H*0.75);
    fg.addColorStop(0,"rgba(180,210,230,0)");
    fg.addColorStop(0.5,"rgba(180,210,230,0.6)");
    fg.addColorStop(1,"rgba(180,210,230,0.15)");
    ctx.fillStyle=fg; ctx.fillRect(0,H*0.35,W,H*0.4);
    ctx.restore();
  }

  _drawAQI() {
    if(this.aqi<0.03) return;
    const {ctx,W,H}=this;
    // haze overlay
    ctx.save();
    ctx.globalAlpha = this.aqi*0.42;
    const hg = ctx.createLinearGradient(0,0,0,H*0.65);
    hg.addColorStop(0,"rgba(180,120,30,0.7)");
    hg.addColorStop(1,"rgba(200,140,40,0.3)");
    ctx.fillStyle=hg; ctx.fillRect(0,0,W,H);
    ctx.restore();
    // dust motes
    ctx.save();
    ctx.globalAlpha = this.aqi*0.55;
    const scrollOff = (this.t*0.06)%W;
    for(const p of this.dustParticles) {
      const px = (p.x*W + scrollOff)%(W+20)-10;
      const py = p.y*H;
      ctx.beginPath(); ctx.arc(px,py,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(200,148,50,${p.alpha})`; ctx.fill();
    }
    ctx.restore();
  }

  _drawLightningFlash() {
    if(this.ltAlpha<0.01) return;
    const {ctx,W,H}=this;
    ctx.save();
    ctx.globalAlpha=this.ltAlpha*0.12;
    ctx.fillStyle="#FFFDE7"; ctx.fillRect(0,0,W,H);
    ctx.restore();
  }

  _drawLightning() {
    if(!this.lightning||this.ltAlpha<0.01) return;
    const {ctx}=this;
    const pts=this.lightning;
    ctx.save();
    ctx.beginPath(); ctx.moveTo(pts[0][0],pts[0][1]);
    for(const p of pts) ctx.lineTo(p[0],p[1]);
    ctx.strokeStyle=`rgba(200,230,255,${this.ltAlpha*0.95})`; ctx.lineWidth=2.5; ctx.lineCap="round"; ctx.lineJoin="round"; ctx.stroke();
    ctx.strokeStyle=`rgba(220,240,255,${this.ltAlpha*0.4})`; ctx.lineWidth=8; ctx.stroke();
    ctx.restore();
  }

  _drawCoins() {
    if(!this.coins.length) return;
    const {ctx}=this;
    ctx.save();
    for(const c of this.coins) {
      ctx.globalAlpha = c.life;
      ctx.font = "20px Arial";
      ctx.textAlign="center";
      ctx.fillText(c.sym, c.x, c.y);
    }
    ctx.restore();
  }
}

// ─── FEATURE CARD COMPONENT - MOBILE RESPONSIVE ──────────────────────────────
function FeatureCard({ card, visible }) {
  const data = card ? CARDS[card] : null;
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div style={{
      position:"absolute",
      top: isMobile ? "auto" : "clamp(8px, 2vw, 12px)",
      bottom: isMobile ? "36px" : "auto",
      right: isMobile ? "50%" : "clamp(8px, 2vw, 14px)",
      transform: isMobile ? "translateX(50%)" : "none",
      width: isMobile ? "calc(100% - 24px)" : "clamp(200px, 30vw, 230px)",
      maxWidth: isMobile ? "340px" : "none",
      background:"linear-gradient(145deg, rgba(17,26,43,0.95), rgba(12,20,34,0.92))",
      border:`1px solid ${data ? data.color+"66" : "rgba(255,255,255,0.1)"}`,
      borderRadius:"clamp(12px, 3vw, 16px)",
      padding:"clamp(12px, 3vw, 15px) clamp(14px, 3vw, 17px)",
      backdropFilter:"blur(14px)",
      boxShadow:"0 10px 32px rgba(0,0,0,0.35)",
      opacity: visible&&data ? 1 : 0,
      transform: visible&&data
        ? (isMobile ? "translateX(50%) scale(1)" : "translateX(0) scale(1)")
        : (isMobile ? "translateX(50%) scale(0.95)" : "translateX(24px) scale(0.95)"),
      transition: "opacity 0.45s cubic-bezier(0.34,1.4,0.64,1), transform 0.45s cubic-bezier(0.34,1.4,0.64,1)",
      pointerEvents:"none",
      zIndex:10
    }}>
      {data && (<>
        <div style={{
          fontFamily:"monospace",
          fontSize:"clamp(7px, 1.8vw, 9px)",
          letterSpacing:"clamp(1px, 0.5vw, 2px)",
          textTransform:"uppercase",
          color: data.color+"aa",
          marginBottom:"clamp(3px, 1vw, 5px)"
        }}>
          {data.icon} Active Event
        </div>
        <div style={{
          fontFamily:"'Syne',sans-serif",
          fontWeight:800,
          fontSize:"clamp(11px, 2.5vw, 13px)",
          marginBottom:"clamp(5px, 1.5vw, 7px)",
          color:"#fff"
        }}>
          {data.title}
        </div>
        <div style={{
          fontSize:"clamp(9px, 2vw, 11px)",
          color:"rgba(255,255,255,0.52)",
          lineHeight:1.6,
          whiteSpace:"pre-line",
          marginBottom:"clamp(8px, 2vw, 10px)"
        }}>
          {data.body}
        </div>
        <div style={{
          fontFamily:"'Syne',sans-serif",
          fontWeight:800,
          fontSize:"clamp(16px, 4vw, 20px)",
          color:data.color,
          letterSpacing:"-0.5px"
        }}>
          {data.value}
        </div>
      </>)}
    </div>
  );
}

// ─── PHASE PROGRESS BAR - MOBILE RESPONSIVE ─────────────────────────────────
function PhaseBar({ currentIdx }) {
  return (
    <div style={{
      position:"absolute",
      bottom:0,
      left:0,
      right:0,
      height:"clamp(24px, 5vw, 32px)",
      background:"rgba(5,10,18,0.9)",
      borderTop:"1px solid rgba(255,255,255,0.05)",
      display:"flex",
      overflowX:"auto",
      overflowY:"hidden"
    }}>
      {PHASES.map((ph, i) => (
        <div key={ph.id} style={{
          flex:"1 0 auto",
          minWidth:"clamp(60px, 12vw, 100px)",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          fontFamily:"monospace",
          fontSize:"clamp(6px, 1.5vw, 8px)",
          letterSpacing:"clamp(0.3px, 0.8vw, 0.8px)",
          textTransform:"uppercase",
          borderRight:"1px solid rgba(255,255,255,0.04)",
          color: i===currentIdx ? "#F59E0B" : i<currentIdx ? "rgba(255,255,255,0.38)" : "rgba(255,255,255,0.2)",
          position:"relative",
          overflow:"hidden",
          transition:"color 0.4s",
          padding:"0 clamp(4px, 1vw, 8px)"
        }}>
          <div style={{
            position:"absolute",
            bottom:0,
            left:0,
            right:0,
            height:"clamp(1px, 0.5vw, 2px)",
            background: i<currentIdx ? "rgba(245,158,11,0.35)" : i===currentIdx ? "#F59E0B" : "transparent",
            transition:"background 0.4s"
          }}/>
          <span style={{
            whiteSpace:"nowrap",
            overflow:"hidden",
            textOverflow:"ellipsis",
            textAlign:"center"
          }}>
            {ph.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── NARRATIVE BADGE - MOBILE RESPONSIVE ─────────────────────────────────────
function NarrativeBadge({ text, rainLevel, aqiLevel }) {
  return (
    <div style={{
      position:"absolute",
      top:"clamp(8px, 2vw, 12px)",
      left:"50%",
      transform:"translateX(-50%)",
      maxWidth:"calc(100% - 16px)",
      background:"rgba(8,13,23,0.90)",
      border:"1px solid rgba(255,255,255,0.1)",
      borderRadius:"clamp(12px, 3vw, 20px)",
      padding:"clamp(4px, 1vw, 5px) clamp(12px, 3vw, 18px)",
      fontFamily:"monospace",
      fontSize:"clamp(8px, 2vw, 10px)",
      letterSpacing:"clamp(0.2px, 0.5vw, 0.4px)",
      color: rainLevel>0.4 ? "rgba(160,210,255,0.85)" : aqiLevel>0.4 ? "rgba(255,175,50,0.85)" : "rgba(255,255,255,0.62)",
      backdropFilter:"blur(10px)",
      whiteSpace:"nowrap",
      overflow:"hidden",
      textOverflow:"ellipsis",
      transition:"color 0.6s",
    }}>
      {text}
    </div>
  );
}

// ─── CALCULATOR PANEL ────────────────────────────────────────────────────────
function Calculator() {
  const [income, setIncome] = useState(4200);
  const [pd, setPd] = useState(18);
  const [re, setRe] = useState(35);
  const [trust, setTrust] = useState(80);
  const [zu, setZu] = useState(15);
  const fr = 1 - trust/100;
  const EL = income * (pd/100) * (re/100);
  const RL = EL * (fr*0.4 + (zu/100)*0.3 + 0.1*0.3);
  const M = EL * 0.08;
  const tot = Math.min(EL+RL+M, income*0.12);
  const capped = (EL+RL+M) > income*0.12;
  const S = {
    row: {display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,0.05)",fontSize:"12px"},
    lbl: {color:"rgba(255,255,255,0.42)"},
    val: {fontFamily:"monospace",color:"rgba(255,255,255,0.8)"},
    head: {fontFamily:"monospace",fontSize:"9px",color:"#F59E0B",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"5px"},
  };
  const Slider = ({label,id,min,max,step,value,onChange,fmt}) => (
    <div style={{marginBottom:"clamp(14px, 3vw, 18px)"}}>
      <div style={{
        display:"flex",
        justifyContent:"space-between",
        fontSize:"clamp(11px, 2.5vw, 12px)",
        color:"rgba(255,255,255,0.42)",
        marginBottom:"clamp(5px, 1.5vw, 7px)",
        gap:"8px"
      }}>
        <span style={{flex:1}}>{label}</span>
        <span style={{
          fontFamily:"monospace",
          color:"#F59E0B",
          fontWeight:600,
          minWidth:"fit-content"
        }}>
          {fmt(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e=>onChange(+e.target.value)}
        style={{
          width:"100%",
          WebkitAppearance:"none",
          height:"clamp(2px, 0.5vw, 3px)",
          borderRadius:"2px",
          background:`linear-gradient(to right,#F59E0B ${((value-min)/(max-min)*100).toFixed(0)}%,rgba(255,255,255,0.12) 0)`,
          outline:"none",
          cursor:"pointer",
          touchAction:"manipulation"
        }}
      />
    </div>
  );
  return (
    <div style={{
      background:"linear-gradient(155deg, rgba(20,31,52,0.95), rgba(16,26,44,0.92))",
      border:"1px solid rgba(255,255,255,0.12)",
      borderRadius:"clamp(12px, 3vw, 18px)",
      padding:"clamp(16px, 4vw, 32px)",
      marginBottom:"clamp(16px, 3vw, 20px)",
      boxShadow:"0 16px 50px rgba(4,9,18,0.42)"
    }}>
      <div style={{
        fontFamily:"monospace",
        fontSize:"clamp(8px, 2vw, 10px)",
        color:"#F59E0B",
        letterSpacing:"clamp(1.5px, 0.5vw, 2.5px)",
        textTransform:"uppercase",
        marginBottom:"clamp(4px, 1vw, 6px)"
      }}>
        Weekly Premium Engine
      </div>
      <h2 style={{
        fontFamily:"'Syne',sans-serif",
        fontWeight:800,
        fontSize:"clamp(20px, 5vw, 34px)",
        letterSpacing:"clamp(-0.8px, -0.05em, -1px)",
        color:"#fff",
        marginBottom:"clamp(16px, 4vw, 24px)",
        lineHeight:1.2
      }}>
        Dynamic pricing · <span style={{color:"#F59E0B"}}>AI-grounded</span>
      </h2>
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
        gap:"clamp(20px, 4vw, 30px)"
      }}>
        <div>
          <Slider label="Baseline weekly income" min={1500} max={8000} step={100} value={income} onChange={setIncome} fmt={v=>`₹${v.toLocaleString("en-IN")}`}/>
          <Slider label="Disruption probability" min={1} max={55} step={1} value={pd} onChange={setPd} fmt={v=>`${v}%`}/>
          <Slider label="Income impact ratio" min={10} max={80} step={1} value={re} onChange={setRe} fmt={v=>`${v}%`}/>
          <Slider label="Worker trust score" min={10} max={100} step={1} value={trust} onChange={setTrust} fmt={v=>(v/100).toFixed(2)}/>
          <Slider label="Zone uncertainty" min={5} max={40} step={1} value={zu} onChange={setZu} fmt={v=>(v/100).toFixed(2)}/>
          <div style={{
            background:"rgba(245,158,11,0.08)",
            border:"1px solid rgba(245,158,11,0.2)",
            borderRadius:"clamp(8px, 2vw, 10px)",
            padding:"clamp(10px, 2.5vw, 14px)",
            fontFamily:"monospace",
            fontSize:"clamp(10px, 2.2vw, 12px)",
            color:"rgba(255,205,125,0.9)",
            lineHeight:1.8,
            overflowX:"auto"
          }}>
            EL = B × p_d × r_e<br/>RL = EL × (f_r×0.4 + z_u×0.3 + λ×0.3)<br/>P = EL + RL + EL×margin<br/><span style={{opacity:0.45}}>Cap: P ≤ 12% of baseline</span>
          </div>
        </div>
        <div>
          <div style={{
            background:"rgba(20,28,40,0.88)",
            border:"1px solid rgba(255,255,255,0.12)",
            borderRadius:"clamp(10px, 2.5vw, 12px)",
            padding:"clamp(16px, 4vw, 22px)",
            marginBottom:"clamp(12px, 3vw, 14px)"
          }}>
            <div style={S.head}>Weekly Premium</div>
            <div style={{
              fontFamily:"'Syne',sans-serif",
              fontWeight:800,
              fontSize:"clamp(32px, 8vw, 52px)",
              color:"#F59E0B",
              letterSpacing:"clamp(-1.5px, -0.05em, -2px)",
              lineHeight:1,
              wordBreak:"break-all"
            }}>
              ₹{Math.round(tot)}
            </div>
            <div style={{
              fontSize:"clamp(11px, 2.5vw, 13px)",
              color:"rgba(255,255,255,0.62)",
              marginTop:"clamp(5px, 1.5vw, 7px)"
            }}>
              {((tot/income)*100).toFixed(1)}% of income{capped?" · 12% cap":""}
            </div>
          </div>
          <div style={{
            background:"rgba(20,28,40,0.88)",
            border:"1px solid rgba(255,255,255,0.12)",
            borderRadius:"clamp(10px, 2.5vw, 12px)",
            padding:"clamp(12px, 3vw, 18px)"
          }}>
            <div style={S.row}><span style={S.lbl}>Expected Loss (EL)</span><span style={S.val}>₹{Math.round(EL)}</span></div>
            <div style={S.row}><span style={S.lbl}>Risk Load (RL)</span><span style={S.val}>₹{Math.round(RL)}</span></div>
            <div style={S.row}><span style={S.lbl}>Margin (8%)</span><span style={S.val}>₹{Math.round(M)}</span></div>
            <div style={{...S.row,borderBottom:"none",fontWeight:600,color:"#F59E0B"}}><span>Total Premium</span><span style={{fontFamily:"monospace"}}>₹{Math.round(tot)}{capped?" ⌐":""}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FRAUD LAYER - MOBILE RESPONSIVE ────────────────────────────────────────
function FraudLayer({num,title,weight,open,onToggle,children}) {
  return (
    <div style={{
      background:"linear-gradient(160deg, rgba(18,27,45,0.95), rgba(14,22,39,0.92))",
      border:"1px solid rgba(255,255,255,0.11)",
      borderRadius:"clamp(10px, 2.5vw, 12px)",
      overflow:"hidden",
      marginBottom:"clamp(8px, 2vw, 10px)",
      boxShadow:"0 8px 22px rgba(0,0,0,0.22)"
    }}>
      <div style={{
        display:"flex",
        alignItems:"center",
        gap:"clamp(6px, 2vw, 10px)",
        padding:"clamp(10px, 2.5vw, 13px) clamp(12px, 3vw, 16px)",
        cursor:"pointer",
        touchAction:"manipulation"
      }} onClick={onToggle}>
        <span style={{
          fontFamily:"monospace",
          fontSize:"clamp(9px, 2vw, 11px)",
          color:"#F59E0B",
          minWidth:"clamp(18px, 4vw, 20px)"
        }}>
          {num}
        </span>
        <span style={{
          fontSize:"clamp(12px, 3vw, 14px)",
          fontWeight:600,
          flex:1,
          color:"rgba(255,255,255,0.92)",
          lineHeight:1.3
        }}>
          {title}
        </span>
        <span style={{
          fontFamily:"monospace",
          fontSize:"clamp(10px, 2.5vw, 12px)",
          color:"#22d3ee"
        }}>
          {weight}
        </span>
        <span style={{
          color:"rgba(255,255,255,0.3)",
          fontSize:"clamp(8px, 2vw, 10px)",
          marginLeft:"clamp(4px, 1vw, 6px)"
        }}>
          {open?"▲":"▼"}
        </span>
      </div>
      {open&&<div style={{
        padding:"0 clamp(12px, 3vw, 16px) clamp(12px, 3vw, 14px) clamp(32px, 8vw, 44px)",
        fontSize:"clamp(11px, 2.5vw, 13px)",
        color:"rgba(235,241,255,0.72)",
        lineHeight:1.65
      }}>
        {children}
      </div>}
    </div>
  );
}

// ─── ML MODEL CARD - MOBILE RESPONSIVE ───────────────────────────────────────
function ModelCard({type,name,desc,badge}) {
  return (
    <div style={{
      background:"linear-gradient(155deg, rgba(18,27,45,0.95), rgba(14,23,40,0.92))",
      border:"1px solid rgba(255,255,255,0.11)",
      borderRadius:"clamp(10px, 2.5vw, 13px)",
      padding:"clamp(16px, 4vw, 20px)",
      transition:"all 0.3s ease",
      boxShadow:"0 8px 20px rgba(0,0,0,0.18)",
      cursor:"pointer",
      touchAction:"manipulation"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = "rgba(34,211,238,0.4)";
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 12px 28px rgba(34,211,238,0.15)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.11)";
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.18)";
    }}
    >
      <div style={{
        fontFamily:"monospace",
        fontSize:"clamp(8px, 2vw, 10px)",
        color:"#22d3ee",
        letterSpacing:"clamp(1px, 0.3vw, 1.5px)",
        textTransform:"uppercase",
        marginBottom:"clamp(6px, 1.5vw, 8px)"
      }}>
        {type}
      </div>
      <div style={{
        fontFamily:"'Syne',sans-serif",
        fontWeight:700,
        fontSize:"clamp(14px, 3vw, 16px)",
        marginBottom:"clamp(6px, 1.5vw, 8px)",
        color:"#fff",
        lineHeight:1.3
      }}>
        {name}
      </div>
      <div style={{
        fontSize:"clamp(11px, 2.5vw, 13px)",
        color:"rgba(236,243,255,0.73)",
        lineHeight:1.58
      }}>
        {desc}
      </div>
      <div style={{
        display:"inline-block",
        background:"rgba(34,211,238,0.08)",
        border:"1px solid rgba(34,211,238,0.24)",
        color:"#67e8f9",
        fontSize:"clamp(8px, 2vw, 10px)",
        fontFamily:"monospace",
        padding:"clamp(2px, 0.5vw, 2px) clamp(6px, 1.5vw, 8px)",
        borderRadius:"4px",
        marginTop:"clamp(9px, 2vw, 11px)"
      }}>
        {badge}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function MetroBuildIn() {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rafRef = useRef(null);
  const lastRef = useRef(0);
  const phaseRef = useRef(0);
  const phaseStartRef = useRef(0);

  const [phaseIdx, setPhaseIdx] = useState(0);
  const [activeCard, setActiveCard] = useState(null);
  const [narrative, setNarrative] = useState(PHASES[0].narrative);
  const [openLayers, setOpenLayers] = useState([0]);

  const toggleLayer = (i) => setOpenLayers(prev => prev.includes(i) ? prev.filter(x=>x!==i) : [...prev,i]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;

    function setupCanvas() {
      const DPR = Math.min(window.devicePixelRatio||1, 2);
      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      canvas.width = W*DPR; canvas.height = H*DPR;
      const ctx = canvas.getContext("2d");
      ctx.scale(DPR,DPR);
      return { W, H, ctx };
    }

    const { W, H, ctx } = setupCanvas();

    // create scene at logical size
    const scene = new Scene({...canvas, width:W, height:H, getContext:()=>ctx});
    sceneRef.current = scene;

    // Handle window resize
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const { W: newW, H: newH, ctx: newCtx } = setupCanvas();
        scene.W = newW;
        scene.H = newH;
        scene.ctx = newCtx;
        // Recalculate bike position
        const currentPhase = PHASES[phaseRef.current];
        if(currentPhase.id === "payout" || currentPhase.id === "aqipay") {
          scene.bikeTargetX = newW * 0.50;
        } else if(currentPhase.rain > 0.7 || currentPhase.aqi > 0.7) {
          scene.bikeTargetX = newW * 0.30;
        } else {
          scene.bikeTargetX = newW * 0.38;
        }
        scene.bikeX = scene.bikeTargetX;
      }, 150);
    };

    window.addEventListener('resize', handleResize);

    // enter first phase
    scene.setPhase(PHASES[0]);
    let phIdx = 0, phStart = performance.now();
    phaseRef.current = 0;

    function loop(ts) {
      const dt = Math.min(ts - lastRef.current, 50);
      lastRef.current = ts;
      const elapsed = ts - phStart;
      const ph = PHASES[phIdx];
      if(elapsed >= ph.dur) {
        phIdx = (phIdx+1)%PHASES.length;
        phStart = ts;
        scene.setPhase(PHASES[phIdx]);
        phaseRef.current = phIdx;
        setPhaseIdx(phIdx);
        setActiveCard(PHASES[phIdx].card);
        setNarrative(PHASES[phIdx].narrative);
        if(PHASES[phIdx].id==="payout"||PHASES[phIdx].id==="aqipay") {
          setTimeout(()=>scene.spawnCoins(), 600);
        }
      }
      scene.update(dt);
      // logical canvas
      ctx.clearRect(0,0,scene.W,scene.H);
      scene.draw();
      rafRef.current = requestAnimationFrame(loop);
    }
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if(rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const FRAUD_LAYERS = [
    {num:"L1",title:"Device Integrity — Root/Mock Detection",weight:"15%",body:"Hardware-level signals GPS spoofing apps cannot fake. Satellite count=0 and perfect HDOP are physically impossible outdoors. Mock-location flag + root/Magisk detection catch off-the-shelf spoofers instantly.",chips:["Mock-location flag","Satellite count","HDOP quality","Root/Magisk detection","Play Integrity"]},
    {num:"L2",title:"Motion Dynamics — Physical Presence Proof",weight:"20%",body:"Genuine delivery partners show 0.8–3.5g accelerometer variance from bike vibration. A home spoofer shows <0.05g. Single most diagnostic signal — catches majority of home-based spoofers with high confidence.",chips:["Accel variance (0.8–3.5g)","Gyroscope pattern","Trajectory realism","Barometric elevation"]},
    {num:"L3",title:"Network Intelligence — Cell Tower & Wi-Fi",weight:"20%",body:"Cell tower triangulation gives ~200–500m accuracy. A Delhi spoofer's phone connects to Noida towers even with GPS showing Connaught Place. Home Wi-Fi BSSID in scan is highly diagnostic.",chips:["Cell tower match","Wi-Fi BSSID class","VPN/Proxy ASN","Signal handoff rate"]},
    {num:"L4",title:"Platform Activity Traces — Ground Truth",weight:"20%",body:"Highest-confidence signal. If the platform API shows an account as inactive in the claimed zone — near-definitive fraud. No spoofing app can fake what the platform's own servers report.",chips:["Account activity","Order assignment","Route trace quality","Dispatch suppression"]},
    {num:"L5",title:"Environmental Corroboration — Zone-Level",weight:"15%",body:"IMD WRF radar at 3km resolution, AQI station clusters, and municipal alerts confirm the event occurred in the H3 cell. Genuine disruptions create zone-wide signals no spoofer can manufacture.",chips:["IMD WRF radar","AQI station cluster","Municipal alerts","Traffic anomaly"]},
    {num:"L6",title:"Graph / Ring Detection — Coordinated Fraud",weight:"10%",body:"GraphSAGE + Louvain community detection. 500-person Telegram rings: same 11-minute window, same device cluster, same H3 cell, correlated UPI endpoints. Ring probability: 0.93.",chips:["Simultaneous claims","Device clustering","Payout endpoint overlap","Temporal synchrony"]},
  ];

  const ML_MODELS = [
    {type:"XGBoost / LightGBM",name:"Income Estimator",desc:"40+ features: delivery history, zone density, platform tier, seasonality. Derives baseline weekly income band.",badge:"Updates: Weekly"},
    {type:"LSTM + Prophet",name:"Disruption Forecaster",desc:"Zone-specific p_d modeling via seasonal decomposition + 12-week rolling LSTM. Inputs: IMD 5-day forecast, historical patterns.",badge:"Updates: Daily"},
    {type:"Random Forest",name:"Income Impact Predictor",desc:"Estimates r_e ratio from event type, severity, duration, local demand suppression. Feeds payout formula directly.",badge:"Updates: Per event"},
    {type:"Isolation Forest + NN",name:"Fraud Trust Scorer",desc:"40+ telemetry features → Proof-of-Presence Score. Isolation Forest for anomaly detection; NN for complex multi-signal patterns.",badge:"Updates: Per claim"},
    {type:"GraphSAGE + Louvain",name:"Ring Detector",desc:"GNN on claim graph (workers × devices × payouts × time). Community detection surfaces coordinated rings invisible to per-claim analysis.",badge:"Updates: Per batch"},
    {type:"UCB1 Reinforcement Learning",name:"Premium MAB Agent",desc:"Multi-Armed Bandit re-calibrates p_d and r_e against actual loss ratio weekly. UCB1 exploration keeps premium optimal.",badge:"Updates: Weekly"},
  ];

  const currentPhase = PHASES[phaseIdx];

  return (
    <div style={{
      background:"radial-gradient(circle at 8% 0%, #183056 0%, #0f1f38 42%, #0a1424 100%)",
      color:"rgba(245,249,255,0.96)",
      fontFamily:"Manrope,sans-serif",
      fontSize:"clamp(14px, 3vw, 16px)",
      lineHeight:1.7,
      minHeight:"100vh"
    }}>
      {/* NAV - MOBILE RESPONSIVE */}
      <nav style={{
        position:"sticky",
        top:0,
        zIndex:200,
        display:"flex",
        alignItems:"center",
        justifyContent:"space-between",
        padding:"0 clamp(12px, 3vw, 36px)",
        minHeight:"clamp(48px, 10vw, 56px)",
        background:"rgba(11,21,38,0.82)",
        backdropFilter:"blur(14px)",
        borderBottom:"1px solid rgba(255,255,255,0.12)",
        flexWrap:"wrap",
        gap:"clamp(8px, 2vw, 16px)"
      }}>
        <span style={{
          fontFamily:"'Syne',sans-serif",
          fontWeight:800,
          fontSize:"clamp(16px, 4vw, 19px)",
          color:"#fbbf24",
          letterSpacing:"-0.5px"
        }}>
          Metro BuildIn
        </span>

        <div style={{
          display:"flex",
          gap:"clamp(8px, 2vw, 24px)",
          flexWrap:"wrap",
          justifyContent:"center",
          alignItems:"center"
        }}>
          {["Premium","Anti-Fraud","ML Models","Roadmap"].map(l=>(
            <a
              key={l}
              href={`#${l.toLowerCase().replace(" ","").replace("-","")}`}
              style={{
                color:"rgba(236,244,255,0.86)",
                textDecoration:"none",
                fontSize:"clamp(11px, 2.5vw, 13px)",
                fontWeight:600,
                transition:"color 0.3s ease",
                whiteSpace:"nowrap"
              }}
            >
              {l}
            </a>
          ))}
        </div>

        <span style={{
          background:"linear-gradient(135deg,#f59e0b,#facc15)",
          color:"#111827",
          fontSize:"clamp(9px, 2vw, 11px)",
          fontWeight:800,
          padding:"clamp(4px, 1vw, 5px) clamp(8px, 2vw, 12px)",
          borderRadius:"clamp(12px, 3vw, 20px)",
          fontFamily:"monospace",
          whiteSpace:"nowrap"
        }}>
          DEVTrails 2026
        </span>
      </nav>

      {/* CANVAS SCENE - MOBILE RESPONSIVE */}
      <div style={{
        position:"relative",
        width:"100%",
        height:"clamp(320px, 60vh, 540px)",
        overflow:"hidden",
        borderBottom:"1px solid rgba(255,255,255,0.06)"
      }}>
        <canvas ref={canvasRef} style={{
          display:"block",
          width:"100%",
          height:"100%",
          touchAction:"none"
        }}/>
        {/* LIVE badge */}
        <div style={{
          position:"absolute",
          top:"clamp(8px, 2vw, 12px)",
          left:"clamp(8px, 2vw, 16px)",
          display:"flex",
          alignItems:"center",
          gap:"clamp(4px, 1vw, 7px)",
          background:"rgba(8,13,23,0.88)",
          border:"1px solid rgba(255,255,255,0.1)",
          borderRadius:"clamp(12px, 3vw, 20px)",
          padding:"clamp(4px, 1vw, 5px) clamp(8px, 2vw, 12px)",
          fontFamily:"monospace",
          fontSize:"clamp(8px, 2vw, 10px)",
          color:"rgba(255,255,255,0.6)",
          backdropFilter:"blur(10px)"
        }}>
          <div style={{
            width:"clamp(5px, 1.5vw, 7px)",
            height:"clamp(5px, 1.5vw, 7px)",
            borderRadius:"50%",
            background:"#ef4444",
            animation:"blink 1.1s infinite"
          }}/>
          <span style={{display:typeof window !== 'undefined' && window.innerWidth < 480 ? 'none' : 'inline'}}>LIVE SIMULATION</span>
          <span style={{display:typeof window !== 'undefined' && window.innerWidth < 480 ? 'inline' : 'none'}}>LIVE</span>
        </div>
        <NarrativeBadge text={narrative} rainLevel={currentPhase.rain} aqiLevel={currentPhase.aqi}/>
        <FeatureCard card={activeCard} visible={!!activeCard}/>
        <PhaseBar currentIdx={phaseIdx}/>
      </div>

      {/* METRICS ROW - ENHANCED & MOBILE RESPONSIVE */}
      <div className="metrics-grid" style={{
        position:"relative",
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit,minmax(min(100%, 260px),1fr))",
        gap:"2px",
        background:"linear-gradient(135deg, rgba(251,191,36,0.15), rgba(34,211,238,0.15))",
        borderBottom:"2px solid rgba(251,191,36,0.3)",
        boxShadow:"0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
        overflow:"hidden"
      }}>
        {/* Animated background effect */}
        <div style={{
          position:"absolute",
          top:0,left:0,right:0,bottom:0,
          background:"radial-gradient(circle at 30% 50%, rgba(251,191,36,0.08) 0%, transparent 50%)",
          animation:"shimmer 3s ease-in-out infinite",
          pointerEvents:"none"
        }}/>

        {[
          ["10M+","Delivery partners in India"],
          ["27%","Avg income loss per disruption"],
          ["<5 min","Straight-through payout"],
          ["97%+","Fraud ring detection rate"]
        ].map(([v,l], i)=>(
          <div
            key={l}
            className="metric-card"
            style={{
              position:"relative",
              background:"linear-gradient(165deg, rgba(13,24,42,0.95) 0%, rgba(8,16,32,0.98) 100%)",
              padding:"clamp(32px, 5vw, 48px) clamp(20px, 4vw, 36px)",
              animation:`fadeUp 800ms cubic-bezier(0.34, 1.56, 0.64, 1) both`,
              animationDelay:`${200 + i*120}ms`,
              transition:"all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              cursor:"pointer",
              borderTop:"1px solid rgba(251,191,36,0.2)",
              overflow:"hidden",
              touchAction:"manipulation"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
              e.currentTarget.style.background = "linear-gradient(165deg, rgba(251,191,36,0.12) 0%, rgba(13,24,42,0.98) 100%)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(251,191,36,0.25), inset 0 1px 0 rgba(255,255,255,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.background = "linear-gradient(165deg, rgba(13,24,42,0.95) 0%, rgba(8,16,32,0.98) 100%)";
              e.currentTarget.style.boxShadow = "none";
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.transform = "scale(0.98)";
              e.currentTarget.style.background = "linear-gradient(165deg, rgba(251,191,36,0.12) 0%, rgba(13,24,42,0.98) 100%)";
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.background = "linear-gradient(165deg, rgba(13,24,42,0.95) 0%, rgba(8,16,32,0.98) 100%)";
            }}
          >
            {/* Glowing orb effect */}
            <div className="orb-effect" style={{
              position:"absolute",
              top:"-50%",
              right:"-20%",
              width:"clamp(80px, 15vw, 120px)",
              height:"clamp(80px, 15vw, 120px)",
              background:"radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)",
              borderRadius:"50%",
              animation:`float 4s ease-in-out infinite`,
              animationDelay:`${i*0.5}s`,
              pointerEvents:"none"
            }}/>

            {/* Number with gradient and glow */}
            <div style={{
              position:"relative",
              fontFamily:"'Syne',sans-serif",
              fontSize:"clamp(42px, 8vw, 72px)",
              fontWeight:900,
              background:"linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #fbbf24 100%)",
              WebkitBackgroundClip:"text",
              WebkitTextFillColor:"transparent",
              backgroundClip:"text",
              letterSpacing:"clamp(-2px, -0.05em, -3px)",
              lineHeight:1.1,
              filter:"drop-shadow(0 4px 16px rgba(251,191,36,0.5))",
              animation:"glow 2s ease-in-out infinite alternate",
              animationDelay:`${i*0.3}s`,
              marginBottom:"clamp(8px, 2vw, 12px)"
            }}>
              {v}
            </div>

            {/* Label with better typography */}
            <div style={{
              fontSize:"clamp(14px, 3vw, 17px)",
              color:"rgba(236,244,255,0.95)",
              marginTop:"clamp(12px, 2vw, 16px)",
              fontWeight:500,
              letterSpacing:"0.3px",
              lineHeight:1.5,
              textShadow:"0 2px 8px rgba(0,0,0,0.3)"
            }}>
              {l}
            </div>

            {/* Bottom accent line */}
            <div style={{
              position:"absolute",
              bottom:0,
              left:0,
              right:0,
              height:"3px",
              background:`linear-gradient(90deg, transparent 0%, #fbbf24 ${(i+1)*25}%, transparent 100%)`,
              animation:`slideIn 1.2s ease-out both`,
              animationDelay:`${400 + i*120}ms`
            }}/>
          </div>
        ))}
      </div>

      {/* CONTENT - MOBILE RESPONSIVE */}
      <div style={{
        maxWidth:"1160px",
        margin:"0 auto",
        padding:"clamp(12px, 3vw, 14px) clamp(12px, 3vw, 34px) 0"
      }}>

        {/* CALCULATOR - MOBILE RESPONSIVE */}
        <div id="premium" style={{
          paddingTop:"clamp(48px, 10vw, 72px)",
          paddingBottom:"clamp(12px, 3vw, 16px)",
          animation:"fadeUp 750ms ease both"
        }}>
          <Calculator/>
        </div>

        {/* FRAUD DEFENSE - MOBILE RESPONSIVE */}
        <div id="antifraud" style={{
          paddingTop:"clamp(42px, 8vw, 66px)",
          paddingBottom:"clamp(16px, 4vw, 22px)",
          animation:"fadeUp 820ms ease both"
        }}>
          <div style={{
            fontFamily:"monospace",
            fontSize:"clamp(9px, 2vw, 11px)",
            color:"#F59E0B",
            letterSpacing:"clamp(2px, 0.5vw, 3px)",
            textTransform:"uppercase",
            marginBottom:"clamp(6px, 1.5vw, 8px)"
          }}>
            Adversarial Defense
          </div>
          <h2 style={{
            fontFamily:"'Syne',sans-serif",
            fontWeight:800,
            fontSize:"clamp(24px, 6vw, 48px)",
            letterSpacing:"clamp(-1px, -0.05em, -1.2px)",
            lineHeight:1.2,
            marginBottom:"clamp(8px, 2vw, 10px)",
            color:"#fff"
          }}>
            6-layer anti-spoofing.<br/>
            <span style={{color:"#F59E0B"}}>GPS is the least important signal.</span>
          </h2>
          <p style={{
            color:"rgba(236,244,255,0.9)",
            maxWidth:"740px",
            marginTop:"clamp(10px, 2.5vw, 12px)",
            marginBottom:"clamp(24px, 5vw, 32px)",
            fontSize:"clamp(14px, 3.2vw, 17px)",
            lineHeight:1.65
          }}>
            GPS is deliberately de-weighted to just 15%. Motion, network, platform activity, and graph signals carry 60% of the decision weight — none fakeable without physical presence.
          </p>
          {FRAUD_LAYERS.map((l,i)=>(
            <div key={l.num} style={{animation:"fadeUp 700ms ease both", animationDelay:`${120 + i*80}ms`}}>
            <FraudLayer {...l} open={openLayers.includes(i)} onToggle={()=>toggleLayer(i)}>
              <p>{l.body}</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:"6px",marginTop:"9px"}}>
                {l.chips.map(c=>(
                  <span key={c} style={{background:"rgba(236,244,255,0.08)",border:"1px solid rgba(236,244,255,0.18)",borderRadius:"4px",padding:"3px 8px",fontSize:"10px",fontFamily:"monospace",color:"rgba(236,244,255,0.85)"}}>{c}</span>
                ))}
              </div>
            </FraudLayer>
            </div>
          ))}
        </div>

        {/* SIGNAL COMPARISON - MOBILE RESPONSIVE */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(min(100%, 290px),1fr))",
          gap:"clamp(14px, 3vw, 18px)",
          marginTop:"clamp(20px, 4vw, 26px)",
          marginBottom:"clamp(40px, 8vw, 62px)"
        }}>
          {[
            {title:"Genuine Worker",sub:"Ravi Kumar, Kurla",dot:"#10b981",signals:[["Mock-location","OFF ✓","#10b981"],["Satellite count","8 ✓","#10b981"],["Accelerometer","1.4g (bike) ✓","#10b981"],["Cell tower","Kurla match ✓","#10b981"],["Platform","Active in zone ✓","#10b981"],["Ring score","0.02 (clean) ✓","#10b981"]],pps:"0.91",ppsColor:"#10b981",verdict:"APPROVED — ₹385 in 4 min 12 sec"},
            {title:"GPS Spoofer",sub:"Fraudster X, actually Noida",dot:"#ef4444",signals:[["Mock-location","ON ✗","#ef4444"],["Satellite count","0 (impossible) ✗","#ef4444"],["Accelerometer","0.003g (home) ✗","#ef4444"],["Cell tower","Noida (12km off) ✗","#ef4444"],["Platform","Inactive/offline ✗","#ef4444"],["Ring score","0.93 (23-ring) ✗","#ef4444"]],pps:"0.04",ppsColor:"#ef4444",verdict:"BLOCKED — ₹0 · Account suspended"}
          ].map((card, i)=>(
            <div key={card.title} style={{
              background:"linear-gradient(160deg, rgba(18,27,45,0.96), rgba(14,22,39,0.92))",
              border:"1px solid rgba(255,255,255,0.11)",
              borderRadius:"clamp(12px, 3vw, 14px)",
              padding:"clamp(18px, 4vw, 24px)",
              boxShadow:"0 10px 28px rgba(0,0,0,0.2)",
              animation:"fadeUp 760ms ease both",
              animationDelay:`${180 + i*120}ms`
            }}>
              <div style={{
                display:"flex",
                alignItems:"center",
                gap:"clamp(7px, 2vw, 9px)",
                marginBottom:"clamp(14px, 3vw, 18px)"
              }}>
                <div style={{
                  minWidth:"clamp(8px, 2vw, 10px)",
                  width:"clamp(8px, 2vw, 10px)",
                  height:"clamp(8px, 2vw, 10px)",
                  borderRadius:"50%",
                  background:card.dot,
                  boxShadow:`0 0 6px ${card.dot}`
                }}/>
                <div style={{flex:1}}>
                  <div style={{
                    fontWeight:700,
                    fontSize:"clamp(15px, 3.5vw, 18px)",
                    color:"#fff",
                    lineHeight:1.3
                  }}>
                    {card.title}
                  </div>
                  <div style={{
                    fontSize:"clamp(11px, 2.5vw, 13px)",
                    color:"rgba(236,244,255,0.78)"
                  }}>
                    {card.sub}
                  </div>
                </div>
              </div>
              {card.signals.map(([n,v,c])=>(
                <div key={n} style={{
                  display:"flex",
                  justifyContent:"space-between",
                  padding:"clamp(7px, 2vw, 9px) 0",
                  borderBottom:"1px solid rgba(255,255,255,0.07)",
                  fontSize:"clamp(12px, 2.8vw, 14px)",
                  gap:"clamp(8px, 2vw, 12px)"
                }}>
                  <span style={{
                    color:"rgba(236,244,255,0.78)",
                    flex:1
                  }}>
                    {n}
                  </span>
                  <span style={{
                    fontFamily:"monospace",
                    color:c,
                    fontWeight:600,
                    whiteSpace:"nowrap"
                  }}>
                    {v}
                  </span>
                </div>
              ))}
              <div style={{marginTop:"clamp(10px, 2.5vw, 12px)"}}>
                <div style={{
                  display:"flex",
                  justifyContent:"space-between",
                  fontSize:"clamp(11px, 2.5vw, 13px)",
                  marginBottom:"clamp(4px, 1vw, 5px)",
                  gap:"8px"
                }}>
                  <span style={{color:"rgba(236,244,255,0.7)", flex:1}}>Proof-of-Presence Score</span>
                  <span style={{fontFamily:"monospace",color:card.ppsColor, fontWeight:700}}>{card.pps}</span>
                </div>
                <div style={{
                  height:"clamp(4px, 1vw, 5px)",
                  borderRadius:"3px",
                  background:"rgba(255,255,255,0.08)",
                  overflow:"hidden"
                }}>
                  <div style={{
                    height:"100%",
                    width:`${parseFloat(card.pps)*100}%`,
                    background:card.ppsColor,
                    borderRadius:"3px",
                    transition:"width 1s ease"
                  }}/>
                </div>
              </div>
              <div style={{
                marginTop:"clamp(12px, 3vw, 14px)",
                padding:"clamp(10px, 2.5vw, 13px) clamp(12px, 3vw, 14px)",
                borderRadius:"clamp(6px, 1.5vw, 8px)",
                background:card.ppsColor==="#10b981"?"rgba(16,185,129,0.1)":"rgba(239,68,68,0.1)",
                border:`1px solid ${card.ppsColor}33`,
                fontSize:"clamp(12px, 2.8vw, 14px)",
                fontWeight:700,
                color:card.ppsColor,
                lineHeight:1.4
              }}>
                {card.verdict}
              </div>
            </div>
          ))}
        </div>

        {/* ML MODELS - MOBILE RESPONSIVE */}
        <div id="mlmodels" style={{
          paddingTop:"clamp(16px, 4vw, 22px)",
          paddingBottom:"clamp(40px, 8vw, 58px)",
          animation:"fadeUp 820ms ease both"
        }}>
          <div style={{
            fontFamily:"monospace",
            fontSize:"clamp(9px, 2vw, 11px)",
            color:"#F59E0B",
            letterSpacing:"clamp(2px, 0.5vw, 3px)",
            textTransform:"uppercase",
            marginBottom:"clamp(6px, 1.5vw, 8px)"
          }}>
            AI/ML Architecture
          </div>
          <h2 style={{
            fontFamily:"'Syne',sans-serif",
            fontWeight:800,
            fontSize:"clamp(24px, 6vw, 48px)",
            letterSpacing:"clamp(-0.8px, -0.05em, -1px)",
            marginBottom:"clamp(20px, 5vw, 30px)",
            lineHeight:1.2,
            color:"#fff"
          }}>
            Seven models. <span style={{color:"#F59E0B"}}>One platform.</span>
          </h2>
          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fit,minmax(min(100%, 230px),1fr))",
            gap:"clamp(10px, 2.5vw, 12px)"
          }}>
            {ML_MODELS.map((m, i)=><div key={m.name} style={{animation:"fadeUp 720ms ease both",animationDelay:`${120 + i*80}ms`}}><ModelCard {...m}/></div>)}
          </div>
        </div>

        {/* ROADMAP - MOBILE RESPONSIVE */}
        <div id="roadmap" style={{
          paddingBottom:"clamp(48px, 10vw, 72px)",
          animation:"fadeUp 860ms ease both"
        }}>
          <div style={{
            fontFamily:"monospace",
            fontSize:"clamp(9px, 2vw, 11px)",
            color:"#F59E0B",
            letterSpacing:"clamp(2px, 0.5vw, 3px)",
            textTransform:"uppercase",
            marginBottom:"clamp(6px, 1.5vw, 8px)"
          }}>
            Execution Plan
          </div>
          <h2 style={{
            fontFamily:"'Syne',sans-serif",
            fontWeight:800,
            fontSize:"clamp(24px, 6vw, 48px)",
            letterSpacing:"clamp(-0.8px, -0.05em, -1px)",
            marginBottom:"clamp(20px, 5vw, 30px)",
            lineHeight:1.2,
            color:"#fff"
          }}>
            Six weeks. <span style={{color:"#F59E0B"}}>Full platform.</span>
          </h2>
          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fit,minmax(min(100%, 160px),1fr))",
            gap:"clamp(8px, 2vw, 10px)"
          }}>
            {[
              {n:"WK 01",t:"Foundation",items:["Architecture","Data schema","H3 zone setup","README v1"],hi:false},
              {n:"WK 02",t:"Core Modules",items:["Onboarding flow","Policy creation","Premium engine","Mock APIs"],hi:false},
              {n:"WK 03",t:"Automation",items:["Trigger engine","Auto-claims","Payout sim","Notifications"],hi:false},
              {n:"WK 04",t:"Anti-Fraud",items:["Fraud detection","Ring graphs","Soft-flag UX","Trust model"],hi:"#ef4444"},
              {n:"WK 05",t:"Analytics",items:["Dashboard","SHAP views","Threshold tuning","Polish"],hi:false},
              {n:"WK 06",t:"Demo Ready",items:["E2E hardening","Demo scripting","Edge cases","Docs"],hi:"#F59E0B"},
            ].map((w, i)=>(
              <div key={w.n} style={{
                background:"linear-gradient(155deg, rgba(18,27,45,0.95), rgba(14,22,39,0.92))",
                border:`1px solid ${w.hi?w.hi+"66":"rgba(255,255,255,0.12)"}`,
                borderRadius:"clamp(9px, 2vw, 11px)",
                padding:"clamp(12px, 3vw, 16px) clamp(10px, 2.5vw, 13px)",
                animation:"fadeUp 760ms ease both",
                animationDelay:`${140 + i*90}ms`,
                transition:"all 0.3s ease",
                cursor:"pointer",
                touchAction:"manipulation"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 12px 28px ${w.hi ? w.hi+"40" : "rgba(245,158,11,0.2)"}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
              >
                <div style={{
                  fontFamily:"monospace",
                  fontSize:"clamp(8px, 2vw, 10px)",
                  color:w.hi||"#fbbf24",
                  marginBottom:"clamp(4px, 1.5vw, 6px)",
                  fontWeight:700
                }}>
                  {w.n}
                </div>
                <div style={{
                  fontFamily:"'Syne',sans-serif",
                  fontWeight:700,
                  fontSize:"clamp(12px, 3vw, 14px)",
                  marginBottom:"clamp(7px, 2vw, 9px)",
                  color:"#fff"
                }}>
                  {w.t}
                </div>
                <ul style={{listStyle:"none",padding:0,margin:0}}>
                  {w.items.map(it=>(
                    <li key={it} style={{
                      fontSize:"clamp(10px, 2.3vw, 12px)",
                      color:"rgba(236,244,255,0.8)",
                      padding:"clamp(2px, 0.5vw, 3px) 0",
                      borderBottom:"1px solid rgba(255,255,255,0.06)",
                      lineHeight:1.4
                    }}>
                      → {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* FOOTER - MOBILE RESPONSIVE */}
      <div style={{
        borderTop:"1px solid rgba(255,255,255,0.12)",
        padding:"clamp(24px, 6vw, 34px) clamp(16px, 4vw, 20px)",
        textAlign:"center",
        background:"rgba(9,16,29,0.75)"
      }}>
        <div style={{
          fontFamily:"'Syne',sans-serif",
          fontWeight:800,
          color:"#fbbf24",
          fontSize:"clamp(16px, 4vw, 20px)",
          marginBottom:"clamp(4px, 1.5vw, 6px)"
        }}>
          Metro BuildIn
        </div>
        <p style={{
          fontSize:"clamp(11px, 2.5vw, 13px)",
          color:"rgba(236,244,255,0.7)",
          marginBottom:"clamp(2px, 1vw, 3px)"
        }}>
          Guidewire DEVTrails 2026 — Phase 1 · March 20, 2026
        </p>
        <p style={{
          fontSize:"clamp(11px, 2.5vw, 13px)",
          color:"rgba(236,244,255,0.7)",
          marginTop:"clamp(2px, 1vw, 3px)",
          maxWidth:"600px",
          margin:"0 auto",
          lineHeight:1.5
        }}>
          AI-Powered Parametric Income Protection for India's Gig Delivery Workforce
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Manrope:wght@400;500;600;700;800&display=swap');

        * {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }

        html {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        body {
          margin: 0;
          background: radial-gradient(circle at 10% 0%, #183056 0%, #0f1f38 40%, #0a1424 100%);
          color: #f5f9ff;
          font-family: Manrope, -apple-system, BlinkMacSystemFont, sans-serif;
          overflow-x: hidden;
        }

        /* Animations */
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @keyframes shimmer {
          0% { opacity: 0.3; transform: translateX(-100%); }
          50% { opacity: 0.8; }
          100% { opacity: 0.3; transform: translateX(100%); }
        }

        @keyframes glow {
          0% { filter: drop-shadow(0 4px 16px rgba(251,191,36,0.5)); }
          100% { filter: drop-shadow(0 8px 24px rgba(251,191,36,0.8)); }
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(10px, -15px) scale(1.15); }
        }

        @keyframes slideIn {
          0% { transform: scaleX(0); opacity: 0; }
          100% { transform: scaleX(1); opacity: 1; }
        }

        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(32px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes slideInFromRight {
          0% { transform: translateX(100px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        /* Range Input Styling */
        input[type=range] {
          -webkit-appearance: none;
          appearance: none;
          height: clamp(2px, 0.5vw, 3px);
          border-radius: 2px;
          outline: none;
          cursor: pointer;
          touch-action: manipulation;
        }

        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: clamp(14px, 3vw, 16px);
          height: clamp(14px, 3vw, 16px);
          border-radius: 50%;
          background: #F59E0B;
          cursor: pointer;
          border: 2px solid #080d17;
          box-shadow: 0 0 0 2px #F59E0B, 0 2px 8px rgba(245,158,11,0.4);
          transition: all 0.2s ease;
        }

        input[type=range]::-webkit-slider-thumb:hover {
          background: #FBBF24;
          box-shadow: 0 0 0 3px #F59E0B, 0 4px 12px rgba(245,158,11,0.6);
          transform: scale(1.1);
        }

        input[type=range]::-webkit-slider-thumb:active {
          transform: scale(0.95);
        }

        input[type=range]::-moz-range-thumb {
          width: clamp(14px, 3vw, 16px);
          height: clamp(14px, 3vw, 16px);
          border-radius: 50%;
          background: #F59E0B;
          cursor: pointer;
          border: 2px solid #080d17;
          box-shadow: 0 0 0 2px #F59E0B, 0 2px 8px rgba(245,158,11,0.4);
        }

        /* Link Hover */
        a {
          transition: color 0.3s ease;
        }

        a:hover {
          color: #fde68a !important;
        }

        /* Scrollbar Styling */
        ::-webkit-scrollbar {
          width: clamp(4px, 1vw, 6px);
          height: clamp(4px, 1vw, 6px);
        }

        ::-webkit-scrollbar-track {
          background: #080d17;
        }

        ::-webkit-scrollbar-thumb {
          background: #1f2937;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #374151;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 1024px) {
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 680px) {
          nav {
            height: auto !important;
            min-height: 56px !important;
            padding: clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px) !important;
            gap: clamp(6px, 1.5vw, 10px) !important;
            flex-wrap: wrap;
          }

          .metrics-grid {
            grid-template-columns: 1fr !important;
            gap: 1px !important;
          }

          .metric-card {
            padding: clamp(24px, 5vw, 32px) clamp(16px, 4vw, 24px) !important;
          }
        }

        @media (max-width: 480px) {
          body {
            font-size: 14px;
          }

          .orb-effect {
            display: none;
          }
        }

        /* Touch Device Optimizations */
        @media (hover: none) and (pointer: coarse) {
          * {
            -webkit-user-select: none;
            user-select: none;
          }

          button, a, [role="button"] {
            min-height: 44px;
            min-width: 44px;
          }

          input[type=range]::-webkit-slider-thumb {
            width: 20px;
            height: 20px;
          }

          .metric-card:active {
            transform: scale(0.98) !important;
          }
        }

        /* Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Dark Mode Optimization */
        @media (prefers-color-scheme: dark) {
          body {
            background: radial-gradient(circle at 10% 0%, #0f1f38 0%, #0a1424 40%, #050a12 100%);
          }
        }

        /* Print Styles */
        @media print {
          nav,
          .phase-bar,
          .live-badge,
          .narrative-badge {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}