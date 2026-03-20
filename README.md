# Metro BuildIn

Guidewire DEVTrails 2026 - Phase 1 Idea Document  
Theme: AI-Powered Parametric Income Protection for India's Gig Delivery Workforce

## Phase 1 Submission Snapshot (Judge-Ready)

### Strategy
1. Build for one clear persona first: Tier-1 food delivery partners with high outdoor exposure.
2. Cover only one outcome: loss of income caused by external disruptions.
3. Use parametric automation: event-based triggers and auto-initiated claims.
4. Keep pricing weekly to match worker earnings cycles.
5. Make anti-fraud core to architecture, not an afterthought.

### Plan of Execution (Weeks 1-2)
1. Finalize disruption parameters and thresholds by city-zone:
	- Weather (rainfall, heat, flood)
	- Environmental (AQI)
	- Social/operational (curfew, platform downtime)
2. Implement weekly premium logic:
	- Baseline weekly income estimation
	- Risk-adjusted weekly premium calculation
	- Weekly coverage cap and payout boundaries
3. Build the end-to-end flow:
	- Onboarding -> Policy Creation -> Trigger Monitoring -> Auto-Claim -> Payout
4. Deploy adversarial controls:
	- Multi-signal anti-spoofing checks
	- Anomaly and ring-fraud detection heuristics
5. Add fairness and trust controls:
	- Soft-flag review path
	- Fast resolution SLA for flagged claims
	- Clear user reason codes for decisions

### Minimal Prototype Scope for This Phase
1. Persona onboarding flow with consent, profile, and payout setup.
2. Weekly policy creation with dynamic premium simulation.
3. Parametric trigger simulator using mocked real-time events.
4. Automatic claim initiation when trigger + eligibility criteria are satisfied.
5. Fraud scoring that demonstrates at least one GPS-spoofing scenario.
6. Payout simulation via UPI/bank sandbox states (approved/pending/blocked).
7. Analytics dashboard with:
	- Active weekly policies
	- Triggered events
	- Claims approved vs flagged
	- Average payout turnaround time

### What Judges Should Be Able to See in Demo
- A worker can onboard and buy weekly income protection in minutes.
- A disruption event can trigger automated income-loss claim logic without manual filing.
- Fraudulent spoof behavior is detected and isolated without blocking honest workers.
- Payout outcomes and platform performance are visible in a clear operations dashboard.

## Idea Document Requirement Coverage


1. Requirement with persona-based scenarios and workflow:
	- See [2. Persona Focus](README.md#2-persona-focus)
	- See [4. Core Product Workflow](README.md#4-core-product-workflow)
2. Weekly premium model, parametric triggers, and Web/Mobile justification:
	- See [5. Weekly Premium and Payout Model](README.md#5-weekly-premium-and-payout-model)
	- See [6. Parametric Triggers (Indicative v1)](README.md#6-parametric-triggers-indicative-v1)
	- See [11. Why Web First (vs Mobile Native) in Phase 1](README.md#11-why-web-first-vs-mobile-native-in-phase-1)
3. AI/ML integration plan (premium, fraud detection, decisioning):
	- See [7. AI/ML Architecture Plan](README.md#7-aiml-architecture-plan)
	- See [8. Adversarial Defense & Anti-Spoofing Strategy](README.md#8-adversarial-defense--anti-spoofing-strategy)
4. Tech stack and development plan:
	- See [10. Tech Stack (Proposed)](README.md#10-tech-stack-proposed)
	- See [13. 6-Week Execution Plan](README.md#13-6-week-execution-plan)
5. Additional relevant details:
	- See [9. Integration Plan (Phase 1 Scope)](README.md#9-integration-plan-phase-1-scope)
	- See [12. Minimal Prototype Scope for Phase 1](README.md#12-minimal-prototype-scope-for-phase-1)
	- See [14. Risk and Mitigation Snapshot](README.md#14-risk-and-mitigation-snapshot)

## 1. Problem Statement Explained

India's delivery ecosystem (food, grocery, e-commerce) depends on workers who earn daily and settle expenses weekly. Their income is highly sensitive to external disruptions such as heavy rain, heat waves, floods, severe AQI, unplanned curfews, and temporary zone shutdowns.

When these events occur:
- Orders drop or are suspended.
- Delivery partners cannot safely or legally operate.
- Weekly earnings can decline by 20-30%.

Current gap:
- There is no reliable, automated income-protection mechanism for these uncontrollable disruptions.
- Existing products are often claims-heavy, slow, and not tuned to gig-worker cash-flow patterns.

Our solution:
- Build an AI-enabled parametric insurance platform that covers only loss of income caused by predefined external triggers.
- Price and settle on a weekly model.
- Auto-detect trigger events and automate payout flow.
- Embed anti-fraud intelligence from day one.

## 2. Persona Focus

Primary persona: Tier-1 city Food Delivery Partner (Swiggy/Zomato-like workflow).

Why this persona first:
- High weather exposure (outdoor riding, peak-hour dependence).
- Dense delivery zones enable strong parametric signal modeling.
- Frequent weekly cash dependency makes weekly insurance pricing highly relevant.

Expansion-ready:
- Architecture supports future adaptation to grocery and e-commerce delivery profiles by changing risk and trigger weights.

## 3. Coverage Scope and Guardrails

This platform covers only income loss due to external disruptions.

Explicitly excluded:
- Health insurance
- Life insurance
- Accident or medical claims
- Vehicle damage/repair
- Personal property loss

Policy guardrails:
- Payouts are linked to lost earning potential from verified disruption windows.
- No indemnity for repairs or non-income expenses.

## 4. Core Product Workflow

### A. Onboarding (optimized for low-friction usage)
1. Mobile number OTP and consent.
2. KYC-lite profile (name, city, delivery segment, preferred payout method).
3. Platform linkage (simulated API token or upload historical weekly earnings proof).
4. Baseline weekly income band creation (AI-derived from 8-12 weeks of history where available, fallback to city-segment median).
5. Weekly plan recommendation with transparent premium and trigger conditions.

### B. Policy Creation (weekly model)
1. User selects weekly coverage band (for example: INR 1,500 / INR 2,500 / INR 4,000 weekly income protection cap).
2. AI risk engine computes weekly premium based on:
	- Zone weather volatility index
	- Historical disruption frequency
	- Work pattern consistency
	- Recent fraud-risk posture
3. Policy activates every Monday 00:00 local time (or rolling 7-day cycle).

### C. Parametric Trigger Monitoring
1. Ingest real-time signals (weather + AQI + civic alerts + platform downtime + traffic anomaly).
2. Trigger engine detects event windows by geofence and severity threshold.
3. Eligible users in active zones are auto-marked as potentially impacted.
4. Activity validation and anti-fraud checks run before payout decision.

### D. Claim and Payout Automation
1. No manual claim filing required for most cases.
2. System generates claim packet automatically when trigger + impact criteria are met.
3. AI adjudication score determines:
	- Straight-through payout
	- Soft-review queue
	- Hard-block and investigation
4. Instant payout via UPI/bank transfer (sandbox in prototype).

## 5. Weekly Premium and Payout Model

### Pricing Formula (weekly)
Let:
- Expected weekly loss = baseline_weekly_income x disruption_probability x expected_impact_ratio
- Risk load = fraud_risk_factor + zone_uncertainty_factor
- Platform margin = fixed percentage

Then:

weekly_premium = expected_weekly_loss + risk_load + platform_margin

### Example
- Baseline weekly income: INR 4,200
- Disruption probability this week: 18%
- Expected impact ratio when disrupted: 35%
- Expected weekly loss = 4,200 x 0.18 x 0.35 = INR 264.6
- Add risk load + margin (say INR 60)
- Indicative premium: INR 325/week (rounded)

### Payout Logic (income loss only)
- Triggered payout = min(weekly_coverage_cap, modeled_lost_income_during_trigger_window)
- Partial payouts allowed for shorter disruption windows.
- Max one major event payout window per day to reduce event stacking abuse.

## 6. Parametric Triggers (Indicative v1)

Weather and environmental:
- Rainfall above threshold for continuous duration in service geofence
- Heat index above threshold for defined hours
- Flood warning and road closure markers
- AQI beyond severe threshold for sustained interval

Social and access:
- Official curfew or emergency restriction notifications
- Verified local zone closure events

Operational:
- Confirmed platform outage or severe dispatch suppression (simulated integration in Phase 1)

Trigger design principles:
- Observable from trusted external signals
- Non-manipulable by single user
- Mapped to expected income impact in that geography/time band

## 7. AI/ML Architecture Plan

### A. Risk Assessment Models
- Weekly premium scorer:
  - Inputs: historical earnings, delivery hours, zone risk index, weather forecast risk, behavioral consistency
  - Output: recommended weekly premium and coverage tier
- Income impact predictor:
  - Inputs: event type, severity, duration, local order-demand pattern, historical worker performance
  - Output: modeled lost income amount

### B. Fraud Detection Models
- Anomaly detection on claim context and movement patterns
- Graph-based ring detection for coordinated claims in same geo/time cluster
- Device and telemetry trust scoring to detect spoofing or scripted behavior

### C. Decisioning Layer
- Rule + ML hybrid for explainability
- Three-way outcomes: approve, review, reject
- Confidence thresholds tuned to minimize false negatives without harming honest users

## 8. Adversarial Defense & Anti-Spoofing Strategy

### 8.1 The Differentiation
How we separate genuinely stranded workers from GPS spoofers:

1. Multi-signal truth, not single GPS truth:
	- Claim eligibility requires consistency across GPS, device motion, network metadata, route feasibility, and platform activity traces.
2. Temporal behavior realism:
	- Real stranded workers show plausible pre-event and during-event trajectories (order pickup attempts, slowdown, stop patterns).
	- Spoofers often show static or physically impossible jumps with low contextual activity.
3. Regional cohort consistency:
	- If a disruption is real, neighboring legitimate workers and platform data should show correlated impact.
	- Isolated high-claim pockets with weak external corroboration are flagged.

### 8.2 The Data Beyond Basic GPS
We will evaluate:
- Device telemetry:
  - Accelerometer and gyroscope signatures (movement realism)
  - Mock-location flags, developer mode indicators, app integrity checks
  - Device fingerprint and emulator/root/jailbreak signals
- Network intelligence:
  - Cell tower and Wi-Fi BSSID consistency with claimed location
  - Sudden ASN/IP pattern changes or repeated VPN/proxy usage during claim windows
- Platform and operations signals:
  - Delivery app order assignment/acceptance/drop logs
  - Attempted route traces and ETA drift
  - Nearby courier activity and order density
- Environmental corroboration:
  - Hyperlocal weather radar grid, AQI station cluster, municipal alerts, road closure feeds
- Graph signals:
  - Repeated co-occurrence of same claimant groups, devices, payout endpoints, and time windows

### 8.3 UX Balance for Honest Workers
We avoid punishing genuine users during bad network/weather conditions:

1. Soft-flag first, deny later:
	- Ambiguous cases move to pending state, not instant rejection.
2. Progressive trust model:
	- Historically clean users receive higher tolerance for transient signal gaps.
3. Alternate proof channels:
	- Lightweight in-app prompts for optional corroboration (recent order screen, passive background re-check, delayed sync).
4. Time-bounded review SLA:
	- Flagged claims resolved quickly (for example, within 2-6 hours in production target) with provisional partial payout option.
5. Transparent explanation:
	- User sees clear reason code (for example, location mismatch confidence low) and next step.

## 9. Integration Plan (Phase 1 Scope)

Real or mock integrations:
- Weather API: OpenWeather/WeatherAPI (free tier or mocked JSON)
- AQI feed: Open AQ-style public feed (or mocked)
- Traffic and closure signals: mocked admin feed
- Delivery platform events: simulated webhook stream
- Payment rail: RazorpayX/UPI sandbox simulation

Integration architecture:
- Event Ingestion -> Normalization -> Trigger Engine -> Risk/Fraud Scoring -> Decision Service -> Payout Service -> Analytics

## 10. Tech Stack (Proposed)

Frontend:
- Mobile-first Web app (React + TypeScript) for fastest Phase 1 iteration and demo accessibility

Backend:
- Python FastAPI (API and ML inference endpoints)
- Node.js worker (optional) for event processing simulation

Data and storage:
- PostgreSQL for policy, claims, payouts
- Redis for event buffering and trigger windows
- Object store for audit artifacts (simulated locally)

AI/ML:
- Scikit-learn/XGBoost for baseline risk and anomaly models
- Graph analytics using NetworkX or Neo4j prototype layer

Observability:
- Basic logging + dashboard metrics via Metabase/Superset/Grafana-like setup (prototype level)

## 11. Why Web First (vs Mobile Native) in Phase 1

Decision: Web first, mobile-optimized.

Rationale:
- Faster prototyping in 6-week challenge timeline.
- Single deployable surface for judges and mentors.
- Easier dashboard + policy + claim simulation in one interface.
- Can be wrapped into PWA for near-app experience.

Future:
- Native Android app can follow in later phases for richer telemetry and offline workflows.

## 12. Minimal Prototype Scope for Phase 1

Must demonstrate:
1. Persona onboarding flow.
2. Weekly policy creation with dynamic premium simulation.
3. Parametric trigger simulation (weather/event feed).
4. Auto-claim generation for eligible workers.
5. Fraud scoring with at least one spoofing scenario.
6. Payout simulation (success/pending/blocked).
7. Analytics dashboard:
	- Active policies
	- Trigger events
	- Approved vs flagged claims
	- Average payout time
	- Fraud detection precision indicators (prototype metrics)

## 13. 6-Week Execution Plan

Week 1:
- Persona research and trigger finalization
- Data schema and architecture draft
- README and workflow definition

Week 2:
- Onboarding and policy modules
- Weekly premium engine v1
- Mock integrations for weather and platform events

Week 3:
- Trigger engine and claim automation
- Payout simulation and notification workflow

Week 4:
- Fraud detection v1 (anomaly + spoof checks)
- Ring-pattern graph heuristics

Week 5:
- Analytics dashboard and explainability views
- Tuning thresholds and fairness checks

Week 6:
- End-to-end hardening, demo scripting, documentation, and polish

## 14. Risk and Mitigation Snapshot

Key risk: false positives in fraud detection hurting trust.

Mitigation:
- Hybrid rule + ML explainability
- Soft review path and fast resolution
- Human-in-loop override for edge cases

Key risk: sparse data for new users.

Mitigation:
- City-segment priors and conservative coverage caps until trust increases

## 15. Phase 1 Outcome

By Phase 1 submission, this repository documents a resilient architecture for weekly-priced, AI-powered parametric income protection for delivery workers, with explicit anti-spoofing defenses designed for coordinated fraud attacks.

This design is intentionally built to be:
- Persona-specific
- Weekly-economics aligned
- Automation-first
- Fraud-resilient under adversarial conditions
- Focused strictly on income loss protection