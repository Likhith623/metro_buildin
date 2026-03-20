# Metro BuildIn
### AI-Powered Parametric Income Protection for India's Gig Delivery Workforce
#### Guidewire DEVTrails 2026 — Phase 1 Submission

---

> **Phase 1 Deadline Submission | March 20, 2026**
> Repository: `metro-buildin` | Team: [Team Name]
> Status: **Phase 1 Complete** — Adversarial Defense Update Applied ✓

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Persona Focus & Scenario Walkthroughs](#3-persona-focus--scenario-walkthroughs)
4. [Coverage Scope & Guardrails](#4-coverage-scope--guardrails)
5. [Core Product Workflow](#5-core-product-workflow)
6. [Weekly Premium & Payout Model — Mathematical Framework](#6-weekly-premium--payout-model--mathematical-framework)
7. [Parametric Triggers — Design & Thresholds](#7-parametric-triggers--design--thresholds)
8. [AI/ML Architecture Plan](#8-aiml-architecture-plan)
9. [Adversarial Defense & Anti-Spoofing Strategy](#9-adversarial-defense--anti-spoofing-strategy)
10. [System Architecture & Data Flows](#10-system-architecture--data-flows)
11. [Integration Plan](#11-integration-plan)
12. [Tech Stack](#12-tech-stack)
13. [Why Web First](#13-why-web-first)
14. [Minimal Prototype Scope for Phase 1](#14-minimal-prototype-scope-for-phase-1)
15. [6-Week Execution Plan](#15-6-week-execution-plan)
16. [Risk & Mitigation Snapshot](#16-risk--mitigation-snapshot)
17. [Phase 1 Outcome](#17-phase-1-outcome)

---

## 1. Executive Summary

**Metro BuildIn** is an AI-native, parametric income protection platform built exclusively for Tier-1 city food delivery partners (Swiggy/Zomato ecosystem). It replaces manual, claims-heavy insurance with a fully automated weekly safety net that:

- **Prices risk weekly** in alignment with gig worker earnings cycles using an ensemble ML model
- **Triggers payouts automatically** when verified external disruptions (weather, AQI, curfew, platform downtime) cause measurable income loss — no manual filing required
- **Detects and neutralises coordinated GPS-spoofing fraud rings** using a multi-layer adversarial defense system that goes far beyond basic location validation
- **Protects honest workers** from false positives via a soft-flag progressive trust architecture

**The fundamental insight:** For India's 10M+ delivery partners, the lack of parametric income insurance is not a distribution problem — it is a _design_ problem. Existing products are built for monthly earners with stable risk profiles. Metro BuildIn is the first platform designed from first principles around the weekly economics, geospatial exposure density, and adversarial fraud landscape of Tier-1 city gig work.

---

## 2. Problem Statement

India's delivery ecosystem (Swiggy, Zomato, Zepto, Blinkit, Amazon) employs millions of partners who earn daily and settle weekly. Their income is acutely sensitive to external disruptions:

| Disruption Category | Specific Events | Income Impact |
|---|---|---|
| Extreme Weather | Heavy rainfall (>50mm/hr), heat index >42°C | 25–40% drop in orders |
| Environmental | AQI >300 (Severe+), toxic fog | Forced work stoppage |
| Social/Civic | Curfews, bandhs, emergency restrictions | 100% operational halt |
| Operational | Platform dispatch suppression, zone shutdowns | 20–35% drop in assignments |
| Flood/Waterlogging | Road closures, zone inaccessibility | 30–60% reduction |

**Current gap:**
- No parametric income protection tuned to gig-worker cash-flow timing exists in India
- Existing products require manual filing, have long settlement cycles, and are priced monthly
- Workers absorb the full impact of events entirely outside their control, with zero recourse

**Our solution:** A weekly-priced, event-triggered, AI-adjudicated platform that auto-detects disruption windows, validates worker presence/impact, and initiates payout — all without the worker lifting a finger.

---

## 3. Persona Focus & Scenario Walkthroughs

### Primary Persona: Tier-1 Food Delivery Partner

| Attribute | Detail |
|---|---|
| Platform | Swiggy / Zomato delivery partner |
| City | Delhi, Mumbai, Bangalore, Hyderabad, Chennai |
| Weekly earnings | INR 3,500–6,500 (varies by hours, city, season) |
| Work pattern | 10–12 hrs/day, 5–6 days/week, peak at lunch & dinner |
| Cash dependency | Weekly settlement is primary household income cycle |
| Risk exposure | Outdoor, 2-wheeler, dense urban zones, weather-dependent |
| Tech comfort | WhatsApp-native, UPI-fluent, basic app usage |

**Why this persona first:** High weather exposure + dense delivery zones = strong parametric signal. Weekly cash dependency makes weekly insurance pricing a perfect fit. Low switching cost as no existing product serves this exact need.

---

### Scenario A: Genuine Stranded Worker ✓

**Ravi, Mumbai — July monsoon, 2026**

Monday 00:00 — Ravi's weekly policy activates. His baseline income: INR 4,400/week. Premium charged: INR 310.

Tuesday 15:30 — IMD issues red alert: rainfall 82mm/hr in Bandra, Kurla, Andheri zones. Metro BuildIn's trigger engine cross-references OpenWeather radar + IMD alert API.

15:32 — Ravi's GPS shows him stationary near Kurla station. Platform data confirms no order assignments dispatched to his geofence for 47 minutes. His accelerometer data shows he is seated/stationary (not mid-delivery). Cell tower confirms Kurla location.

15:34 — Trigger validation passes. AI adjudication score: 0.91 (high confidence genuine impact). Income-loss window modeled: 3.5 hrs x estimated hourly rate = INR 392.

15:35 — Claim auto-generated. Payout INR 392 dispatched via UPI. Ravi receives notification: *"Weather alert payout: INR 392 for rain disruption (15:30–19:00). Check your UPI."*

---

### Scenario B: GPS Spoofer — Caught ✓

**Fraudster "X", Delhi — Same monsoon event**

Tuesday 15:30 — Fraudster X is at home in Noida. Uses GPS spoofing app to fake location in Connaught Place (red-alert zone). Claims app open, showing Connaught Place coordinates.

**Red flags detected by Metro BuildIn adversarial engine:**

1. **Mock-location flag active** — Android developer mode on, `android:allowMockLocation=true` detected via SafetyNet Attestation API
2. **Accelerometer data flat** — No movement vibration consistent with a seated-on-bike delivery partner. Signal variance = 0.003g (vs typical 0.8–2.1g for a parked bike)
3. **Cell tower mismatch** — Device connected to Noida cell tower BSSID, inconsistent with claimed CP location (12km discrepancy)
4. **Wi-Fi BSSID** — Home router BSSID in device network scan, not consistent with outdoor CP location
5. **No platform activity traces** — Zero order assignment attempts in CP zone for this device in the last 4 hours; platform API shows account as "inactive" in that window
6. **Behavioral velocity** — Account was in Noida zone 45 minutes ago (last legitimate GPS ping before spoof activated); physically impossible transit to CP in that time
7. **Ring graph signal** — 23 other accounts with same device manufacturer and similar anomaly profiles filed claims in the same 12-minute window (coordinated ring pattern)

**Outcome:** Claim flagged as HIGH CONFIDENCE FRAUD (score: 0.07). Account suspended pending investigation. Ring pattern reported. No payout issued. Honest workers in CP not affected.

---

### Scenario C: Genuine Worker with Network Drop — Protected ✓

**Priya, Bangalore — Severe AQI event**

Wednesday 11:00 — AQI in Whitefield reaches 318 (Severe). Metro BuildIn trigger fires for Whitefield zone.

Priya's phone has intermittent connectivity (bad weather + congested towers). GPS data has 8-minute gap. No accelerometer sync for 12 minutes.

**System response:**
- Gap detected → soft-flag triggered (not hard rejection)
- Progressive trust score: Priya has 14 weeks of clean history. Trust multiplier applied: 0.85 confidence threshold reduced to 0.70 for her
- Last known location was Whitefield (within trigger zone) ✓
- Platform data: 2 order assignments cancelled by platform in her area ✓
- Claim moves to **Pending/Soft-Review** state (not rejected)
- Provisional partial payout (60%) dispatched within 2 hours: INR 220
- Full payout reconciled at 4:00 PM when connectivity resumes and full data validated: remaining INR 147 sent

**Worker experience:** "Your claim is being reviewed. We've sent INR 220 as an advance. Full amount by 4 PM."

---

## 4. Coverage Scope & Guardrails

**This platform covers ONE thing: loss of income caused by verified external disruptions.**

| ✅ Covered | ❌ Explicitly Excluded |
|---|---|
| Income lost during verified weather disruption window | Health insurance |
| Income lost during AQI shutdown periods | Life insurance |
| Income lost during verified curfew/civic closure | Accident/medical claims |
| Income lost during confirmed platform outage | Vehicle repair or damage |
| Partial income loss from zone-level demand suppression | Personal property loss |
| | Any income loss with manipulated/unverifiable signals |

**Policy guardrails:**
- Payout = `min(weekly_coverage_cap, modeled_income_loss_during_trigger_window)`
- Maximum 1 major event payout window per calendar day (prevents event-stacking abuse)
- Weekly policy cap enforced: no single week's payout can exceed the selected coverage band
- Minimum disruption duration: 45 minutes (prevents micro-trigger gaming)
- Geographic precision: H3 resolution-8 hexagonal cells (~0.74 km² each) for fine-grained zone mapping

---

## 5. Core Product Workflow

### A. Onboarding

```
Mobile OTP / WhatsApp verification
        ↓
KYC-Lite: name, city, delivery segment, payout method
        ↓
Platform linkage (simulated API token OR earnings proof upload)
        ↓
Baseline income computation:
  • 8–12 weeks history → ML-derived band
  • Cold-start: city-segment median + zone risk prior
        ↓
Weekly plan recommendation with:
  • Transparent premium breakdown
  • Coverage scenarios
  • Plain-language trigger conditions
        ↓
Consent: parametric terms, data use, payout authorisation
        ↓
Policy ready for Monday 00:00 activation
```

**Cold-start handling:** New workers with no earnings history are assigned a conservative city-segment median baseline (e.g., Mumbai food delivery median: INR 4,100/week). Coverage caps are reduced by 20% for first 4 weeks. Trust score starts at 0.5 (neutral). After 4 clean claim-free weeks, cap restores and trust normalises.

---

### B. Policy Creation

Weekly policy parameters:

| Parameter | Detail |
|---|---|
| Coverage bands | INR 1,500 / INR 2,500 / INR 4,000 / INR 6,000 |
| Policy window | Monday 00:00 – Sunday 23:59 local time (or rolling 7-day) |
| Premium payment | Auto-debit from UPI-linked account on policy start |
| Max weekly payout | = selected coverage band |
| Partial payouts | Allowed; prorated to trigger duration |
| Multiple triggers/week | Allowed up to weekly cap |

---

### C. Parametric Trigger Monitoring

```
Event Feed Ingestion (Weather + AQI + Civic + Platform + Traffic)
        ↓
Signal Normalisation & Deduplication
        ↓
H3-Grid Zone Assignment (resolution-8, ~0.74km² cells)
        ↓
Severity Threshold Evaluation (per trigger type)
        ↓
Eligible Worker Identification (active policy + last known location in zone)
        ↓
Activity Validation (platform data + telemetry check)
        ↓
Anti-Fraud Scoring (multi-signal adversarial defense)
        ↓
Adjudication Decision:
  • Score ≥ 0.80 → Straight-through payout
  • 0.45–0.79 → Soft review queue
  • Score < 0.45 → Hard block + investigation flag
```

---

### D. Claim & Payout Automation

- **Zero manual filing** for scores ≥ 0.80
- System auto-generates claim packet with evidence bundle: trigger event ID, worker location trail, platform activity log, fraud score, income-loss model output
- **Payout rails:** UPI instant transfer (primary), IMPS bank transfer (fallback), wallet credit (secondary)
- **SLA commitments:**
  - Straight-through: < 5 minutes from trigger validation
  - Soft-review: < 4 hours with provisional partial payout
  - Hard-block investigation: < 24 hours with clear reason code

---

## 6. Weekly Premium & Payout Model — Mathematical Framework

### 6.1 Premium Computation

Let the following notation apply:

```
B     = baseline_weekly_income (INR, ML-estimated)
p_d   = disruption_probability this week (zone-specific forecast, 0–1)
r_e   = expected income impact ratio given disruption occurs (0–1)
f_r   = fraud_risk_factor (0–1, from trust score model)
z_u   = zone_uncertainty_factor (0–1, based on historical signal quality)
m     = platform margin (fixed %)
λ     = loss loading coefficient (regulatory + capital buffer)
```

**Expected Loss (EL):**
```
EL = B × p_d × r_e
```

**Risk Load (RL):**
```
RL = EL × (f_r × 0.4 + z_u × 0.3 + λ × 0.3)
```

**Weekly Premium:**
```
P = EL + RL + (EL × m)
  = EL × (1 + risk_load_multiplier + m)
```

**Illustrative example — Mumbai Bandra monsoon week:**

| Variable | Value | Source |
|---|---|---|
| Baseline weekly income (B) | INR 4,400 | ML estimate (8-week history) |
| Disruption probability (p_d) | 0.22 | 5-day weather forecast + historical |
| Expected impact ratio (r_e) | 0.38 | Zone-specific historical data |
| Fraud risk factor (f_r) | 0.12 | Trust score = 0.88 |
| Zone uncertainty (z_u) | 0.15 | Bandra: dense, well-mapped zone |
| Platform margin (m) | 0.08 | Fixed |
| Lambda (λ) | 0.10 | Capital buffer |

```
EL = 4400 × 0.22 × 0.38 = INR 367.7
RL = 367.7 × (0.12×0.4 + 0.15×0.3 + 0.10×0.3)
   = 367.7 × (0.048 + 0.045 + 0.030)
   = 367.7 × 0.123 = INR 45.2
P  = 367.7 + 45.2 + (367.7 × 0.08)
   = 367.7 + 45.2 + 29.4 = INR 442.3 → rounded to INR 445/week
```

**Coverage band selected:** INR 2,500 (worker pays INR 445 for up to INR 2,500 weekly protection)

---

### 6.2 Dynamic Premium Adjustment — Reinforcement Learning Layer

Beyond static formula pricing, a **Multi-Armed Bandit (MAB)** RL agent continuously re-calibrates `p_d` and `r_e` coefficients:

- **State:** current week's weather forecast score, platform activity index, historical disruption frequency for the zone
- **Action:** select from 5 pre-computed premium adjustment bands (−15%, −7%, 0%, +7%, +15%)
- **Reward:** actual vs. modeled loss ratio over 4-week rolling window
- **Algorithm:** Upper Confidence Bound (UCB1) to balance exploration/exploitation
- **Constraint:** premium cannot exceed 12% of baseline weekly income for any worker

This prevents both chronic over-pricing (kills adoption) and systematic under-pricing (destroys loss ratio).

---

### 6.3 Payout Logic

```
triggered_payout = min(
    weekly_coverage_cap,
    B × (disruption_hours / 40) × r_e × adjudication_confidence
)
```

Where `adjudication_confidence` is the AI score (0–1), scaling payout proportionally for borderline cases rather than binary approve/reject.

**Partial payout example:**
- 3-hour disruption window, 40-hour work week modeled
- B = INR 4,400, r_e = 0.38, adjudication score = 0.87
- `payout = min(2500, 4400 × (3/40) × 0.38 × 0.87)` = min(2500, INR 109) = INR 109

---

### 6.4 Actuarial Performance Targets

| Metric | Target | Notes |
|---|---|---|
| Loss Ratio | 55–70% | (Claims paid / Premiums earned) |
| Combined Ratio | < 95% | (Loss + expense ratio) |
| Claim Frequency | 8–15% per week | Zone/season dependent |
| Average Payout | INR 180–420 | Per triggered event |
| Fraud Rate (post-detection) | < 1.5% | After adversarial controls |
| Auto-Straight-Through Rate | > 75% | Minimise manual review load |

---

## 7. Parametric Triggers — Design & Thresholds

### Design Principles

Every trigger must satisfy three properties:
1. **Observable:** Measurable from trusted, tamper-resistant external sources
2. **Non-manipulable:** Cannot be triggered or faked by any single user
3. **Income-correlated:** Demonstrably linked to delivery income loss in that geography

---

### Trigger Table (v1)

| Trigger | Threshold | Duration | Data Source | Geofence |
|---|---|---|---|---|
| Rainfall — Heavy | > 50 mm/hr | ≥ 45 min | IMD API + OpenWeather radar | H3-res-8 cell |
| Rainfall — Extreme | > 80 mm/hr | ≥ 20 min | IMD API | H3-res-8 cell |
| Heat Index | > 45°C "Feels Like" | ≥ 2 hrs | OpenWeather + IMD | City district |
| Flood/Waterlogging | Level 2 or 3 municipal alert | Active | Municipal OpenData / NDMA | Road segment cluster |
| AQI — Very Poor | > 300 AQI | ≥ 90 min | OpenAQ + CPCB | City zone |
| AQI — Severe | > 400 AQI | ≥ 30 min | OpenAQ + CPCB | City zone |
| Civic Curfew | Government-issued restriction | Active | PIB / State DM alerts | District |
| Local Strike (Bandh) | Verified by 2+ civic sources | ≥ 4 hrs | News + municipal data | District |
| Zone Closure | Official notification + platform suppression corroboration | Active | Admin API + platform API | H3-res-7 |
| Platform Outage | Dispatch volume drop > 70% for zone | ≥ 30 min | Platform simulated webhook | Zone |

---

### Trigger Confidence Scoring

Each trigger carries a **signal confidence score** (SCS) based on source quality and corroboration:

```
SCS = (primary_source_weight × 0.5) + (corroborating_sources × 0.3) + (platform_corroboration × 0.2)
```

Payouts are multiplied by SCS if SCS < 0.75 (partial certainty scenario). Full payout if SCS ≥ 0.75.

---

## 8. AI/ML Architecture Plan

### 8.1 Model Inventory

| Model | Type | Inputs | Output | Update Frequency |
|---|---|---|---|---|
| Weekly Income Estimator | Gradient Boosted Trees (XGBoost) | Delivery hours, zone, platform, seasonality, 8-wk history | Baseline income band | Weekly |
| Disruption Probability Forecaster | LSTM + Prophet ensemble | Zone weather history, seasonal patterns, 5-day forecast | p_d per zone per week | Daily |
| Income Impact Predictor | Random Forest | Event type, severity, duration, local demand index, worker profile | r_e ratio | Per event |
| Fraud Trust Scorer | Isolation Forest + Neural Network ensemble | 40+ behavioral/telemetry features | Trust score (0–1) | Per claim |
| Ring Detection | Graph Neural Network (GraphSAGE) | Claim graph (workers × events × devices × payout endpoints) | Ring probability per cluster | Per claim batch |
| Adjudication Engine | Gradient Boosted + Rule hybrid | All fraud signals + trigger confidence | Approve / Review / Reject | Per claim |
| Premium MAB Agent | UCB1 Reinforcement Learning | Zone risk state, historical loss ratio | Premium adjustment factor | Weekly |

---

### 8.2 Income Estimator — Feature Engineering

The baseline income estimator ingests:

```python
features = {
    # Work pattern features
    "avg_weekly_hours": float,          # Rolling 8-week average active hours
    "delivery_session_count": int,       # Number of logged-on sessions per week
    "peak_hour_ratio": float,            # % of hours during 12–14, 19–21 slots
    "work_consistency_score": float,     # Coefficient of variation of weekly hours (inverted)

    # Zone features
    "zone_order_density_index": float,   # H3-cell order volume index
    "zone_competition_score": float,     # Number of active partners per km²
    "zone_weather_volatility_ytd": float,# Historical disruption days in zone

    # Platform features
    "platform_tier": str,                # Gold/Silver/Bronze delivery tier
    "acceptance_rate_30d": float,        # Order acceptance rate
    "cancellation_rate_30d": float,

    # Seasonal/calendar
    "week_of_year": int,
    "is_festival_week": bool,            # Diwali, Holi, etc.
    "monsoon_risk_percentile": float,

    # City
    "city_id": str,
    "delivery_segment": str              # food / grocery / ecomm
}
```

---

### 8.3 Disruption Probability Forecaster — LSTM + Prophet Ensemble

For each H3-res-7 zone, we maintain a time-series disruption model:

```
Model 1 (Facebook Prophet):
  - Seasonal decomposition: annual monsoon cycle, weekly demand patterns
  - Holiday effects: festival weeks, republic day, etc.
  - Regressors: 5-day IMD forecast confidence, long-range AQI trend

Model 2 (LSTM):
  - Input: 12-week rolling window of {rainfall, AQI, civic events, disruption_flag}
  - Architecture: 2-layer LSTM (64 hidden units each) → Dense(1) → Sigmoid
  - Trained per city-cluster (not per zone — avoids data sparsity)

Ensemble:
  p_d = 0.55 × Prophet_forecast + 0.45 × LSTM_forecast
  Confidence interval maintained for premium sensitivity analysis
```

---

### 8.4 Explainability — SHAP Values

All ML model decisions exposed via SHAP (SHapley Additive exPlanations):

- Workers receiving a Review or Reject decision see a plain-language reason derived from the top-3 SHAP contributors
- Operations dashboard shows feature importance drift over time (early signal of model degradation or new fraud patterns)
- Regulatory compliance: every payout decision has a traceable, human-readable explanation logged

**Example SHAP reason code for a rejected claim:**
> *"Your claim was flagged because: (1) Device mock-location was enabled [high impact], (2) Movement pattern was inconsistent with outdoor activity [moderate impact], (3) Network location didn't match GPS [moderate impact]. If you believe this is an error, tap 'Dispute' for a human review within 2 hours."*

---

### 8.5 Federated Learning — Privacy-Preserving Model Updates

For telemetry and behavioral models, we implement a federated learning approach:

- **On-device:** Lightweight model inference runs locally; no raw GPS/telemetry data leaves the device
- **Aggregation:** Only gradient updates (model weight deltas) are transmitted to central server
- **Privacy guarantee:** Differential privacy noise added to gradients (ε = 0.5, δ = 10⁻⁵) before upload
- **Benefit:** Workers' granular movement data never centralised; GDPR/PDPB-compliant by design
- **Phase 1:** Simulated via server-side synthetic data; federated architecture documented for Phase 2

---

## 9. Adversarial Defense & Anti-Spoofing Strategy

> **⚠️ Critical Section — 24-Hour Update (March 19–20, 2026)**
> 
> In response to the simulated threat scenario: 500 delivery workers coordinating via Telegram to GPS-spoof locations into red-alert weather zones. Simple GPS verification is obsolete. This section documents Metro BuildIn's multi-layer adversarial defense architecture.

---

### 9.1 The Differentiation: Genuine Stranded Worker vs. GPS Spoofer

**Core insight:** A GPS coordinate is a single, easily forged data point. Reality is not.

We define **Location Truth** as a composite of N independent signals that together make physical presence either overwhelmingly probable or overwhelmingly improbable. A genuine stranded worker in a monsoon event will naturally produce coherent signals across all layers. A spoofer can fake GPS; they cannot simultaneously fake accelerometer dynamics, cell tower geolocation, network inference, behavioral patterns, and platform activity without detectable artifacts.

**Proof-of-Presence Score (PPS):**

```
PPS = w₁×GPS_validity + w₂×Motion_consistency + w₃×Network_coherence +
      w₄×Platform_activity + w₅×Environmental_corroboration + w₆×Behavioral_realism

Weights (w₁–w₆): [0.15, 0.20, 0.20, 0.20, 0.15, 0.10]
(GPS intentionally de-weighted; motion + network + platform carry 60% of signal)
```

**Decision boundary:**
- PPS ≥ 0.80 → Genuine (straight-through)
- PPS 0.45–0.79 → Ambiguous (soft-review + progressive trust applied)
- PPS < 0.45 → Spoofed/fraudulent (hard block)

---

### 9.2 The Data: Beyond GPS — 40+ Signal Features

#### Layer 1: Device Integrity (cannot be faked without root access)

| Signal | How It Detects Spoofers | Source |
|---|---|---|
| Mock Location Flag | Android `android:allowMockLocation` active = direct spoofing indicator | SafetyNet / Play Integrity API |
| Developer Mode Status | Enabled = suspicious if combined with other signals | System APIs |
| Emulator/Root Detection | Frida hook detection, Magisk/root presence | SafetyNet Attestation |
| Device Fingerprint Consistency | Same physical device across claims; device farm detection | Device ID hashing |
| App Integrity Check | Tampered APK or modded app = high fraud signal | Play Integrity |
| GPS Hardware vs. Software | Hardware GPS signal strength + NMEA sentence validity vs. software-injected coordinates | GPS metadata |
| Satellite Count & HDOP | Real outdoor GPS: 6–12 satellites, HDOP < 2.0. Spoofed: 0 satellites, perfect coordinates | GPS NMEA data |

**GPS spoofing apps inject coordinates at the software layer; they cannot fake satellite count, HDOP, or NMEA sentence quality. This alone catches most off-the-shelf spoofers.**

---

#### Layer 2: Motion Dynamics (cannot be faked without real physical movement)

| Signal | Genuine Worker Profile | Spoofer Profile |
|---|---|---|
| Accelerometer variance | 0.8–3.5g (bike vibration, road bumps, body movement) | < 0.05g (stationary at home) |
| Gyroscope signature | Regular rotation patterns from bike maneuvering | Flat or artificially noisy |
| Barometric pressure | Consistent with claimed floor/elevation level | Inconsistent or absent |
| Step count (pedometer) | Zero or very low (on bike) | May show walking pattern at home |
| Movement trajectory realism | Plausible road segments, real-world speed (10–40 km/hr) | Static or physically impossible jumps |
| Pre-event movement | Active delivery patterns in the hour before disruption | No prior movement in that zone |

**Implementation:** Lightweight on-device sensor sampling at 2Hz during claim window. Raw features fed to Isolation Forest model trained on genuine-vs-synthetic motion datasets.

---

#### Layer 3: Network Intelligence (hard to fake, especially in combination)

| Signal | Genuine Worker | Spoofer at Home |
|---|---|---|
| Cell tower location | Consistent with claimed GPS coordinates (within 500m) | Home cell tower (often 5–20km from claimed location) |
| Wi-Fi BSSID scan | Outdoor / commercial BSSIDs or absent | Home router BSSID in scan list |
| Network type | Often 4G outdoor (high handoff rate) | Stable home Wi-Fi or indoor 4G |
| VPN/Proxy detection | Rare for genuine workers | Common in organised fraud rings |
| ASN/IP pattern | Mobile carrier IP | VPN provider IP or static ISP |
| Signal strength variance | High (moving outdoors) | Low and stable (stationary home) |

**Cell tower triangulation alone provides ~200–500m accuracy — sufficient to detect home-vs-claimed-zone discrepancies for coordinated rings.**

---

#### Layer 4: Platform Activity Traces (requires actual platform engagement)

| Signal | Genuine Disruption | Fraud Scenario |
|---|---|---|
| Order assignment attempts | Multiple attempts dispatched + rejected by platform (no couriers accepting = disruption confirmed) | Account shows "inactive" or "logged out" in platform API |
| Last platform activity | Active within last 60 minutes in claimed zone | No activity in zone for hours |
| Route trace quality | Meaningful route segments leading to current location | No route history; teleported to location |
| Order completion history today | 2–8 completed deliveries before disruption | Zero completions or zero logins |
| Dispatch suppression signal | Platform confirms order volume drop > 40% in zone | Not corroborated by platform |

**Platform webhook integration provides the single highest-confidence signal. If the platform itself shows no activity for a claimed "stranded" worker, that is near-definitive fraud.**

---

#### Layer 5: Environmental Corroboration (zone-level, not user-level)

| Signal | Use |
|---|---|
| Hyperlocal weather radar grid | IMD WRF model at 3km resolution — confirms rainfall/temperature in claimed H3 cell |
| AQI station cluster | Average of 3 nearest CPCB/OpenAQ stations in a 5km radius |
| Traffic anomaly index | Google Maps API / HERE traffic congestion score for claimed zone |
| Municipal flood/closure alerts | Official MCGM / BBMP / NMMC alert APIs |
| Social media volume spike | Twitter/X API anomaly detection for flood/curfew keywords in claimed geofence (weak signal, corroborating only) |

---

#### Layer 6: Graph / Ring Detection (coordinated fraud at scale)

This is what defeats Telegram-coordinated rings. Individual signals can be borderline; coordinated patterns are unmistakable.

**Graph construction:**
```
Nodes: Workers | Devices | Payout Endpoints (UPI IDs) | Telegram Groups (if detectable) | H3 Cells
Edges: Shared device | Shared UPI | Claims in same 10-minute window | Same device manufacturer + model + OS version cluster
```

**Graph Neural Network (GraphSAGE) outputs ring probability:**
```python
# Community detection via Louvain algorithm
communities = louvain_communities(claim_graph)

# For each community, compute:
ring_score = (
    0.35 × simultaneous_claim_rate     +  # % of community claiming in same 10-min window
    0.25 × shared_device_features      +  # Suspiciously similar hardware profiles
    0.20 × geographic_clustering        +  # All claims in exact same H3 cell
    0.15 × payout_endpoint_overlap      +  # UPI IDs resolving to same bank account cluster
    0.05 × temporal_synchrony          # Claim timestamps too perfectly spaced
)
```

**Detection example:**
- 500-person ring: if 80% of claims arrive in a 15-minute window, all from the same H3 cell, with similar device profiles → ring_score = 0.93 → mass block + investigation
- Individual legitimate claims in same zone: distributed over 2–4 hours, diverse device profiles, diverse locations within zone → ring_score = 0.04 → pass

---

### 9.3 Zero-Knowledge Proof Concept (Phase 2 Road Item)

For Phase 2, we propose integrating **ZKP-based location attestation**:

- Worker's phone generates a ZK proof that it is physically present within a geographic boundary without revealing exact coordinates
- Proof verified on-chain or via secure enclave — server confirms "worker is in flood zone" without storing their precise GPS trail
- Eliminates privacy concerns while maintaining fraud resistance
- **Phase 1:** Documented as architecture direction; not implemented in prototype

---

### 9.4 The UX Balance: Protecting Honest Workers from False Positives

**The core promise:** Our anti-fraud system must never punish genuine workers experiencing genuinely bad network conditions during precisely the weather events that make conditions bad. This requires asymmetric caution.

**Progressive Trust Architecture:**

```
Trust Score (T) ∈ [0, 1]

Initial value: T = 0.50 (neutral, cold-start)

Trust increases on:
  + Clean claim history: +0.03 per clean week (max +0.12/month)
  + Consistent location data quality: +0.02 per clean week
  + Long tenure: +0.01 per month (max +0.10)

Trust decreases on:
  - Fraud-flagged claim: −0.25 (immediate)
  - Data gap during claim: −0.05 (recoverable)
  - Device integrity failure: −0.20

Threshold adjustment:
  Adjudication threshold = max(0.45, 0.80 − (T − 0.5) × 0.40)
  
  Example:
    T = 0.90 (14 weeks clean history) → threshold = 0.64 (generous)
    T = 0.50 (new user)               → threshold = 0.80 (standard)
    T = 0.20 (prior flags)             → threshold = 0.92 (strict)
```

**Soft-Flag Workflow (not instant denial):**

```
Ambiguous claim detected
        ↓
Claim enters PENDING state (NOT rejected)
        ↓
Provisional partial payout issued (60% of modeled amount) within 30 minutes
        ↓
Background re-validation: delayed GPS sync, platform data refresh, manual review queue
        ↓
Resolution within 4 hours:
  • Validated → remaining 40% payout released
  • Not validated → provisional amount NOT clawed back (goodwill for trusted users)
                  → future trust score adjusted
```

**Worker communication:**

Rather than "FRAUD DETECTED" (hostile, accusatory), genuine ambiguous cases receive:

> *"We're verifying your claim — your network signal was intermittent during the event. We've sent INR [X] as an advance. We'll complete your payment by [time]. No action needed from you."*

**Dispute path:**
- One-tap "Dispute" button in app
- Human reviewer contacts worker within 2 hours via WhatsApp
- Worker can share recent delivery screenshot as alternate proof
- Resolution SLA: 4 hours (working hours), 8 hours (overnight)

---

### 9.5 Specific Response to the Telegram Ring Attack Scenario

500 workers using GPS spoofing apps on Telegram groups:

| Attack Vector | Our Defense | Confidence |
|---|---|---|
| GPS spoof app active | Mock-location flag + satellite count = 0 | Very High |
| Coordinated timing | Louvain ring detection on claim graph | Very High |
| Same zone fake claims | Cell tower mismatch (all towers in Noida, not claimed Delhi zone) | High |
| Organised via Telegram | Shared device characteristics + synchronized timing | High |
| No real platform activity | Platform API shows accounts inactive | Very High |
| Multiple accounts per device | Device fingerprint deduplication | Medium-High |

**Expected outcome for this attack:** > 97% of fraudulent claims blocked within the first 3 minutes of the claim wave. Genuine workers in the actual red-alert zone are unaffected — their signals all pass independently.

---

## 10. System Architecture & Data Flows

### Event-Driven Architecture with CQRS

```
┌─────────────────────────────────────────────────────────────┐
│                    COMMAND SIDE (Write)                      │
│  Policy Service → Claim Service → Payout Service            │
│  All mutations emit domain events to Event Bus              │
└─────────────────────────────────────────────────────────────┘
                              │
                         Event Bus
                         (Redis Streams)
                              │
┌─────────────────────────────────────────────────────────────┐
│                    QUERY SIDE (Read)                         │
│  Analytics Store → Dashboard API → Worker App API          │
│  Read models updated by event handlers                      │
└─────────────────────────────────────────────────────────────┘
```

### Core Domain Events

```
PolicyActivated { policy_id, worker_id, zone_id, coverage_band, week_start }
TriggerDetected { trigger_id, trigger_type, zone_id, severity, confidence, timestamp }
ClaimInitiated  { claim_id, policy_id, trigger_id, modeled_loss }
FraudScored     { claim_id, pps_score, flags[], ring_probability }
ClaimDecided    { claim_id, decision, payout_amount, reason_codes[] }
PayoutDispatched{ claim_id, amount, rail, upi_ref, timestamp }
PayoutSettled   { claim_id, settlement_timestamp, status }
```

### Circuit Breaker Pattern

External API calls (weather, AQI, platform) wrapped in circuit breakers:
- **Closed:** Normal operation
- **Open:** API failing → use cached/last-known data + increase SCS uncertainty
- **Half-open:** Probe recovery after 30s timeout
- **Worker impact:** Claim processing continues using degraded signals; payouts provisioned conservatively

---

## 11. Integration Plan

| Integration | Tool | Phase 1 Status | Production Path |
|---|---|---|---|
| Weather (rainfall, temperature) | OpenWeatherMap API (free tier) | Live / mocked fallback | IMD API (paid) |
| AQI | OpenAQ public API | Live | CPCB official API |
| Civic/curfew alerts | Mocked admin JSON feed | Mocked | PIB / State DM alert APIs |
| Flood/waterlogging | Mocked municipal feed | Mocked | NDMA, Municipal OpenData |
| Delivery platform events | Simulated webhook stream | Simulated | Swiggy/Zomato partner API |
| Payment rail | RazorpayX sandbox | Sandbox | RazorpayX / PhonePe Business |
| Device integrity | SafetyNet mock | Mocked | Play Integrity API (production) |
| Cell tower data | Mocked BSSID/tower feed | Mocked | OpenCelliD / telco API |
| Graph analytics | NetworkX (Phase 1) | Prototype | Neo4j AuraDB (Phase 2) |

---

## 12. Tech Stack

### Frontend
- **React + TypeScript** — mobile-first web app (PWA-ready)
- **TailwindCSS** — styling
- **React Query** — server state management
- **Framer Motion** — micro-interactions
- **Recharts + D3.js** — analytics dashboard

### Backend
- **Python FastAPI** — primary API server + ML inference endpoints
- **Celery + Redis** — async task queue for trigger monitoring + claim processing
- **Node.js (Express)** — event simulation service (mock webhooks)

### Data & Storage
- **PostgreSQL** — policy, claims, payouts, worker profiles
- **Redis** — event buffering, trigger windows, session cache
- **TimescaleDB** (PostgreSQL extension) — time-series storage for sensor/event data
- **MinIO** (local S3-compatible) — audit artifacts, claim evidence bundles

### AI/ML
- **XGBoost / LightGBM** — risk scoring, income estimation
- **scikit-learn** — anomaly detection (Isolation Forest), preprocessing pipelines
- **PyTorch** — LSTM time-series models, GraphSAGE fraud ring detection
- **Prophet (Meta)** — seasonal disruption forecasting
- **SHAP** — model explainability layer
- **NetworkX** — Phase 1 graph analysis; Neo4j migration path documented

### DevOps & Observability
- **Docker + docker-compose** — containerised local development
- **GitHub Actions** — CI/CD pipeline
- **Grafana + Prometheus** — metrics dashboard (prototype)
- **Sentry** — error tracking

### External APIs
- OpenWeatherMap, OpenAQ, RazorpayX sandbox (as documented in §11)

---

## 13. Why Web First

| Criterion | Web-First | Native Mobile |
|---|---|---|
| Prototype speed | ✅ 2–3 days for full flow | ❌ 1–2 weeks for equivalent |
| Demo accessibility for judges | ✅ Single URL, any device | ❌ APK install required |
| Dashboard integration | ✅ Same surface as worker app | ❌ Separate dashboard app needed |
| PWA capability | ✅ "Add to home screen" works | — |
| Rich telemetry | ❌ Limited sensor access | ✅ Full accelerometer, GPS, SafetyNet |
| Offline resilience | ❌ Limited | ✅ Native background sync |

**Decision:** Web-first for Phase 1 prototype + demo. Native Android documented as Phase 2 target specifically for richer telemetry access (accelerometer at 10Hz+, SafetyNet Attestation, background GPS sync), which is needed for production-grade fraud detection.

---

## 14. Minimal Prototype Scope for Phase 1

The Phase 1 prototype will demonstrate, end-to-end:

1. **Persona onboarding** — OTP, KYC-lite, income baseline computation, policy recommendation
2. **Weekly policy creation** — Coverage band selection, dynamic premium calculation with formula display, policy activation
3. **Parametric trigger simulation** — Admin panel to fire mock trigger events (heavy rain, AQI spike, curfew) with configurable severity + zone
4. **Auto-claim generation** — System detects eligible workers in triggered zone, initiates claim automatically
5. **Fraud scoring demo** — Demonstrate one GPS-spoofing scenario (mock-location flag + cell tower mismatch) that gets hard-blocked; one genuine worker with network drop that goes through soft-review path
6. **Payout simulation** — Approved: UPI success animation; Pending: partial + review state; Blocked: reason code display
7. **Analytics dashboard** — Active policies, trigger events timeline, claims approved/flagged/rejected, payout turnaround, fraud detection metrics, trust score distribution

---

## 15. 6-Week Execution Plan

| Week | Milestone | Deliverable |
|---|---|---|
| **Week 1** | Foundation | Architecture, schema, README v1, trigger parameter research |
| **Week 2** | Core modules | Onboarding flow, policy creation, weekly premium engine v1, mock API integrations |
| **Week 3** | Automation | Trigger engine, claim auto-generation, payout simulation, notification workflow |
| **Week 4** | Adversarial defense | Fraud detection v1 (anomaly + mock-location + motion), ring-pattern graph heuristics, soft-flag UX |
| **Week 5** | Analytics + polish | Dashboard, SHAP explainability views, threshold tuning, progressive trust model |
| **Week 6** | Hardening | End-to-end test, demo scripting, edge case handling, documentation complete |

---

## 16. Risk & Mitigation Snapshot

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| False positives blocking honest workers | Medium | High (trust damage) | Progressive trust, soft-flag, fast SLA, provisional payout |
| Sparse data for new users | High | Medium | City-segment priors, cold-start caps, 4-week trust warmup |
| Fraud ring evolves tactics | Medium | High | Graph-based detection is topology-agnostic; pattern-agnostic anomaly models |
| External API downtime | Medium | Medium | Circuit breakers, cached data, degraded-mode claims processing |
| Premium model over/under-pricing | Medium | High | MAB RL agent; actuarial targets with weekly recalibration |
| Regulatory approval (IRDAI) | Low (Phase 1) | High (Phase 3) | Explicitly designed for IRDAI sandbox compliance path |
| Worker digital literacy | Medium | Medium | WhatsApp-native UX, local language support, audio notifications |

---

## 17. Phase 1 Outcome

By end of Phase 1, Metro BuildIn has delivered:

✅ A resilient, actuarially-grounded architecture for weekly-priced parametric income protection
✅ A multi-layer adversarial defense system that defeats GPS spoofing, coordinated ring fraud, and device manipulation
✅ A progressive trust model that protects honest workers from false positive harm
✅ A mathematically-specified premium model with RL-based dynamic adjustment
✅ A complete 6-week execution plan with clear prototype scope

**This platform is intentionally designed to be:**
- Persona-specific (Tier-1 food delivery; expansion-ready)
- Weekly-economics aligned (pricing, payout, settlement)
- Automation-first (zero-filing claims, auto-adjudication)
- Fraud-resilient under coordinated adversarial conditions
- Honest-worker-safe (progressive trust, soft-flag, fast resolution)
- Privacy-preserving (federated learning path, minimal data centralisation)
- Regulatorily legible (SHAP explainability on every decision)

---

*Metro BuildIn — DEVTrails 2026 Phase 1 | Guidewire | March 20, 2026*
