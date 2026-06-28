# POC Plan — Career Readiness Intelligence Platform for Universities

> **ประเภทเอกสาร:** validation-first POC plan สำหรับข้อเสนอขอทุน (ไม่ใช่ full build spec)
> **หลักการกำกับ:** ทุกโมดูลต้องเป็น "เครื่องทดสอบสมมติฐานที่ฆ่าโปรเจกต์ได้" ไม่ใช่แค่ feature
> **สไตล์:** ไทย + technical English · มี [ASSUMPTION] กำกับจุดเสี่ยง · จัดลำดับ MUST / SHOULD / NICE / CUT
> **เวอร์ชัน:** POC v1 (รวมข้อสรุปจากการ sandbox + การออกแบบ agent/Resilience ทั้งหมด)

---

## 1. Executive Summary

POC นี้ **ไม่ใช่ AI resume builder** — เป็น **evidence-based career readiness loop**: นักศึกษาปี 3–4 → สกัดทักษะ/หลักฐาน → วิเคราะห์ gap + resilience → แผน proof-of-work 2–4 สัปดาห์ → advisor review → cohort insight → university intervention

POC พิสูจน์ 3 อย่างต่อกรรมการทุน: (1) นักศึกษามี pain ที่เครื่องมือแก้ได้จริง (2) **ทำได้จริงโดยไม่ scrape เว็บงานและไม่เทรนโมเดลหนัก** (3) มหา'ลัยได้คุณค่า (cohort insight) ที่ยอมจ่ายต่อหลังทุน

**ขอบเขต POC = 5 โมดูล** เท่านั้น (ดูข้อ 6) ที่เหลือเป็น future roadmap หรือ mock

---

## 2. Final POC Verdict (จาก sandbox)

**46/70 = เหลือง → ยื่นได้ ถ้าปิด 2 must-fix** (เขียว = 53, เป้าสบาย = 60)

| Must-fix | ทำอะไร |
|---|---|
| **#1 Time feasibility** | ทุน 1 ปี **เคลม employment ไม่ได้** → 15 เดือน หรือ ปีแรกวัด **leading indicator** เท่านั้น (readiness ก่อน-หลัง, หลักฐานแข็งขึ้น, target role ชัด, proof-of-work เสร็จ, action plan ผ่าน advisor, cohort insight, intervention launched) |
| **#2 Employer trust** | **เอา employer readiness score ออกจาก MVP** — employer feedback เป็น optional data ทีหลัง ไม่ใช่แกน |

**เส้นทาง 46→60 (สรุป):** ปิด 2 must-fix (+3) · de-risk หก "3" ด้วยข้อผูกมัด LOI/จดหมาย (+6) · พิสูจน์ four "4" ด้วย POC/สเปก (+5) — **แต้มมาจากเปลี่ยน "คำกล่าวอ้าง" เป็น "ข้อผูกมัด/หลักฐาน" ไม่ใช่แก้สไลด์**

---

## 3. Top 10 Killer Assumptions → POC Test Design (สไตล์: assumption-first)

POC ถูกออกแบบให้ทดสอบ 10 ข้อนี้ตรง ๆ ถ้าข้อไหนพังคือสัญญาณให้หยุด/แก้ก่อนลงทุนเต็ม

| # | สมมติฐาน (ถ้าผิด = ตาย) | ทดสอบตรง ๆ | สัญญาณผ่าน | โมดูลที่ทดสอบ |
|---|---|---|---|---|
| 1 | มีคนใน ม. เป็นเจ้าของ insight แล้วลงมือต่อ | ล็อก named owner ก่อน build + รันเดโม cohort กับเขา | owner เซ็นรับ + เลือก workshop 1 เรื่อง | M5 |
| 2 | เด็กใช้ต่อเมื่อ embed ไม่ใช่ optional | embed ใน 1 วิชาบังคับ เทียบ completion กับ voluntary | ฝัง > voluntary ชัด | flow + M4 |
| 3 | **AI แยก 6 สถานะหลักฐานได้จริง** (หัวใจ) | advisor label N โปรไฟล์ → วัด kappa กับ AI + เคส gaming | kappa ≥ 0.7 + จับ fake | M2 |
| 4 | durability defensible ผ่าน ESCO/O*NET + panel | ครอสวอล์ค 1 cluster + 2–3 ผู้เชี่ยวชาญวัด kappa | kappa ≥ 0.7 | M3 |
| 5 | แผน proof-of-work 2–4 สัปดาห์ ทำได้จริง | รันกับเด็กจริง 5–10 คน | ≥60% เสร็จ + ได้ artifact | M4 |
| 6 | ลดเวลา diagnosis advisor + advisor เชื่อ/override เหมาะ | advisor วินิจฉัย มี/ไม่มีเครื่องมือ | ลดเวลา + override สมเหตุผล | M5 + HITL |
| 7 | **open data พอ ไม่ต้อง scrape/MOU** | role-skill matrix จาก open data + ผู้เชี่ยวชาญตัด | gap analysis actionable | M3 + taxonomy |
| 8 | เด็กมี pain จริง + ลงมือเมื่อมีคนนำ | Mom-test อดีต + completion pilot | พฤติกรรมยืนยัน | flow + M4 |
| 9 | guardrail จับ hallucination/fake/bias ได้ | red-team set (gaming/resume แย่/ไทย-อังกฤษคู่) | hallucination ต่ำ + ไม่มี bias ภาษา | Critic agent |
| 10 | หลังทุน ม. ยอมรับช่วง maintenance | ขอ written willingness-to-sustain + วัด intervention จริง | สัญญาณ WTP + intervention launched | M5 + proposal |

---

## 4. Product Positioning

**"Career Readiness Intelligence Platform for Universities"** — resume เป็นแค่ input/output artifact หนึ่ง ไม่ใช่ตัวสินค้า

ตัวสินค้าจริง = **evidence loop**: profile → skill/evidence extraction → gap → resilience → action plan → proof-of-work → advisor review → cohort insight → intervention

ไม่ใช่: AI resume builder · job marketplace · LMS · job board

---

## 5. Core User Personas

| Persona | บทบาท | ต้องการ | หมายเหตุ |
|---|---|---|---|
| นักศึกษาปี 3–4 | end user + แหล่งข้อมูล | รู้ gap จริง + แผนทำได้ใน 2–4 สัปดาห์ | wedge: อยู่ในสถาบัน + ใกล้ตลาด + ข้อมูลมีค่าสุด · motivation ไม่สม่ำเสมอ |
| อาจารย์แนะแนว / advisor | **Human-in-the-Loop** | วินิจฉัยเร็วขึ้น + override ได้ | เป็นทั้งผู้ตรวจและผู้ให้ ground truth |
| career center officer | **owner ของ insight** | รู้ gap by cohort + จัด intervention | สมมติฐาน #1 — ถ้าไม่มี owner = ตาย |
| program director / curriculum committee | ผู้ตัดสินหลักสูตร | หลักฐานปรับหลักสูตร (ไม่ใช่ survey) | คนจ่าย/รับไปใช้ต่อ |
| admin | จัดการ taxonomy/role/audit | คุม versioning + audit | |

---

## 6. MVP Scope vs Cut Scope

**MUST-HAVE — 5 โมดูลเท่านั้น**

| # | โมดูล | ทดสอบสมมติฐาน |
|---|---|---|
| M1 | Student Profile + Resume/Portfolio Upload | 8 |
| M2 | AI Skill & Evidence Analyzer | **3, 9** |
| M3 | Target Role Gap + Resilience Score | **4, 7** |
| M4 | 2–4 Week Proof-of-Work Learning Path | **5, 8** |
| M5 | Career Center / Advisor / Cohort Insight Dashboard | **1, 6, 10** |

**SHOULD-HAVE:** resume bullet improvement (evidence-backed), advisor override UI, before/after readiness
**NICE-TO-HAVE:** chat (secondary), portfolio page generator, export report
**CUT FROM MVP:** employer readiness score · job marketplace · real-time job scraping · full LMS · curriculum redesign system · payment · mobile app · certificate · social features · employment guarantee · "AI replaces advisor"

---

## 7. Core POC Hypotheses (mapped to tests)

| | สมมติฐาน | ทดสอบด้วย |
|---|---|---|
| A | student profile + target role → useful gaps + realistic short-term plan | M1–M4 + assumption 5 |
| B | ระบบแยก verified/weak/unverified/missing/transferable/low-durability ได้ | M2 + assumption 3 (kappa) |
| C | aggregated gap → ช่วย ม. ตัดสิน intervention | M5 + assumption 1/10 |
| D | ระบบ work เมื่อ embed ใน workflow เท่านั้น | flow + assumption 2 |

---

## 8. UX Flow

**Student flow:** consent → basic profile → upload (resume/transcript/portfolio/project) → select target role → AI analysis progress rail → readiness dashboard → gap breakdown → evidence table → resilience/transferable view → 2–4 week action plan → proof-of-work submission → advisor review status → before/after readiness

**Advisor / Career Center flow:** cohort dashboard → student risk list → gap by major/program → evidence gap by role → suggested workshop/intervention → advisor review queue → human override/comment → exportable report

**หลักสำคัญ:** student flow **ต้องถูกเรียกจากภายในวิชา/advisor checkpoint** ไม่ใช่ standalone app (สมมติฐาน 2)

---

## 9. Key Screens + Trust UI + AI Progress Rail

**Key screens (POC):** consent · profile · upload · target role select · **AI progress rail** · readiness dashboard · gap+evidence table · resilience view · action plan · proof submission · advisor queue · cohort dashboard · before/after

**AI progress rail (สร้างความเชื่อใจ — ไม่ใช่ spinner):**
1. กำลังอ่านโปรไฟล์ → แสดงว่าอ่านไฟล์อะไรบ้าง
2. สกัดทักษะ → แสดงทักษะที่เจอเป็น chip
3. ตรวจหลักฐาน → แสดงว่าทักษะไหน verified/weak/unverified (ความโปร่งใส)
4. แมตช์ target role → แสดง role requirement ที่เทียบ
5. คำนวณ gap → แสดง gap หลัก 2–3 ตัว
6. คำนวณ resilience → แสดงว่าอิง ESCO/O*NET (ความ defensible)
7. สร้างแผน → แสดง task แรก
8. **Critic check** → แสดงว่ากำลังตรวจ overclaim/hallucination (สำคัญต่อความน่าเชื่อถือ)
9. สรุปสำหรับ advisor

**Trust UI:** ทุกคะแนนคลิกดู "ทำไม" (XAI trace) · ทักษะ unverified ติดป้ายชัด · low-confidence result มี badge + ส่งเข้า advisor queue อัตโนมัติ

**Empty/error/low-confidence states:** ไม่มีไฟล์ → ให้กรอกมือ · parse ล้มเหลว → ขอ re-upload + ใช้ self-report (ติดป้าย unverified) · low-confidence → ไม่โชว์ตัวเลขมั่น ๆ แต่ flag ให้คนตรวจ

---

## 10. AI Agent Workflow

**สถาปัตยกรรม = hybrid:** pipeline (deterministic, LLM-centric) เป็นโครง + **จุดต่อรองเดียว** ที่ Role Fit/Action Plan + **Critic guardrail** ครอบ — **ไม่ over-build MAS** (ปี 2026 ไม่เทรนโมเดล ใช้ LLM structured output + RAG + rule-based scoring)

> **หมายเหตุ proposal:** ถ้าเอกสารทุนใช้โครง 6 agent หน้าบ้าน สามารถ map 8 agent ข้างล่างเป็น sub-component ได้ (เช่น Evidence Verifier + Skill Gap = ไส้ใน "Skill Gap Analyzer", Resilience = กลไกของ Resilience Score, Role Fit + Action Plan = ไส้ใน "Career Pathway" ที่ negotiation core อยู่)

| Agent | Input | Output | Logic | Failure case | Guardrail | HITL | Data stored |
|---|---|---|---|---|---|---|---|
| 1 Profile Analyzer | resume/transcript/portfolio/profile | structured skills/exp/edu/projects/tools/claims | LLM structured output (JSON) | parse ผิด ไทย-อังกฤษปน | schema validation | — | parsed_profile |
| 2 Evidence Verifier | parsed skills + แหล่งหลักฐาน | สถานะต่อทักษะ (verified/partial/weak/unverified) + แยก skill_gap vs evidence_gap | rule + LLM: เช็คว่าทักษะมี project/transcript/cert/sample หนุนไหม | เชื่อ resume wording ตรง ๆ | ต้องมี evidence object ถึงจะ verified | advisor override สถานะได้ | student_skill_evidence |
| 3 Role Fit | profile + 1–2 target roles | role-fit + requirement ที่ขาด | เทียบกับ role_skill_requirements | role ไม่ชัด | fallback occupation-level (O*NET) | advisor ปรับ role | assessments |
| 4 Skill Gap Analyzer | role requirement vs profile | missing/weak skills จัดลำดับ | gap = required − verified, ถ่วงความสำคัญ | แนะเยอะเกินจนเด็กไม่ทำ | จำกัด top gaps + จัด priority | — | gap_results |
| 5 Resilience | skills + taxonomy | durability/transferability score | **ESCO reusability + O*NET breadth + automation-exposure** (ไม่ใช้ demand-slope/ไม่ scrape) | เดาอนาคตมั่ว | cap น้ำหนัก + แสดง CI + panel kappa | panel validate cluster | skills.durability |
| 6 Action Plan | gaps + เวลา | แผน 2–4 สัปดาห์ + proof-of-work | template + LLM, task เล็กทำได้จริง | task ใหญ่/abstract | ผูกทุก task กับ gap + ขนาดจำกัด | advisor approve/edit | action_plans, action_items |
| 7 Critic / Guardrail | output ของทุก agent | flag/แก้ | เช็ค hallucination, overclaim, fake-skill, bias, unrealistic | ปล่อยของปลอมผ่าน | veto + ส่ง low-confidence เข้า HITL | สิ่งที่ flag ไป advisor | llm_runs (flags) |
| 8 Institution Insight | student gaps หลายคน | cohort insight + recommended action | aggregate + สถิติข้าม cohort (แยกโครงสร้าง vs เห่อ) | dashboard สวยไม่บอก action | ต้องมี recommended next action เสมอ | career center validate ก่อน intervention | cohort_insights |

**Negotiation note:** จุดที่ trade-off จริง (Role Fit + Action Plan) ถ่วง 5 เสียง — demand · fit · feasibility · locality · **durability** — fix 3 รอบ + Critic veto + fallback ranking · trace = XAI

---

## 11. Scoring Framework (5 scores — ไม่ over-complicate)

| Score | ความหมาย | input | logic (ง่าย) | อธิบายเด็ก | ห้ามเคลม |
|---|---|---|---|---|---|
| Role Readiness | ใกล้ role เป้าหมายแค่ไหน | verified skills vs requirement | % requirement ที่ verified (ถ่วงความสำคัญ) | "คุณมี X% ของสิ่งที่ role ต้องการ ที่*พิสูจน์ได้*" | ไม่ใช่การพยากรณ์ได้งาน |
| Evidence Strength | หลักฐานแข็งแค่ไหน | สถานะหลักฐานต่อทักษะ | สัดส่วน verified/partial เทียบ claim ทั้งหมด | "ทักษะที่คุณพิสูจน์ได้ vs ที่แค่เขียน" | ไม่ตัดสินความเก่งจริง |
| Skill Gap Severity | ขาดหนักแค่ไหน | required − verified | ถ่วงความสำคัญ × ความขาด | "ตัวที่ควรปิดก่อน" | — |
| **Resilience Score** | ทักษะทนอนาคตแค่ไหน | durability ต่อทักษะ + diversification + adaptive behavior | durability-weighted coverage + pathway diversification + adaptive-capacity | "ทักษะคุณยืดหยุ่นต่อการเปลี่ยนแค่ไหน" อิง ESCO/O*NET | **ไม่พยากรณ์ได้งาน** · เป็น forecast แสดงพร้อม CI |
| Actionability | แผนทำได้จริงแค่ไหน | ขนาด/เวลา task | % task ที่ทำได้ใน 2–4 สัปดาห์ | "แผนนี้ทำได้จริงในเวลาที่มี" | — |

**กฎรวม:** ไม่มี score ไหนเคลมว่าทำนายการมีงานทำ · นิยามสำเร็จ = **skill-match ไม่ใช่ degree-match** · attrition honesty (baseline วันแรก 100%)

---

## 12. Skill Evidence Logic (หัวใจ — สมมติฐาน 3)

แยก 8 สถานะ:

| สถานะ | เงื่อนไข | ตัวอย่าง |
|---|---|---|
| verified_skill | มีหลักฐานชัด (project/cert/transcript/work sample/advisor) | นำเสนอ + นำโปรเจกต์ → communication = verified |
| partial_skill | มีหลักฐานบางส่วน | Excel dashboard → data partial |
| weak_evidence | อ้างถึงแต่หลักฐานอ่อน | "ทำ data analysis" แต่มีแค่บรรทัดเดียวใน resume |
| unverified_claim | อ้าง แต่ไม่มีหลักฐานเลย | "Python, SQL, AI expert" ไม่มี project/cert |
| skill_gap | role ต้องการ แต่ไม่มีเลย | role ต้อง SQL, เด็กไม่มี |
| evidence_gap | "มี" ทักษะแต่พิสูจน์ไม่ได้ | เคยทำ แต่ไม่มีชิ้นงานโชว์ |
| transferable_skill | ทักษะถ่ายโอนได้ (ESCO transversal/cross-sectoral) | dashboard ทำให้ data reasoning ถ่ายไป BA ได้ |
| low_durability_skill | demand อาจสูงแต่เสี่ยงล้าสมัย | ทักษะเครื่องมือเฉพาะเวอร์ชัน |

**กฎตัวอย่าง:** อ้าง SQL + ไม่มี project/transcript/cert/sample → `unverified_claim` หรือ `evidence_gap` · มี Excel dashboard ไม่มี SQL → `transferable partial` · communication ผ่านการนำเสนอ/นำทีม → `verified`/`partial` ตามรายละเอียด

**ทำไมสำคัญ:** นี่คือสิ่งที่ทำให้ "evidence engine" ≠ resume builder — และเป็นเกราะกัน scenario gaming (สมมติฐาน 3/9)

---

## 13. Learning Path / Proof-of-Work Design

ไม่ใช่ลิสต์คอร์สยาว — เป็น **action plan สั้นที่มี proof จริง** ทุก task map กลับไป ≥1 skill gap

**ตัวอย่างแผน 2 สัปดาห์ (BA):**
- สัปดาห์ 1: วิเคราะห์ public dataset 1 ชุด → dashboard screenshot 1 · เขียน business insight 1 หน้า
- สัปดาห์ 2: แปลงงานเป็น resume bullet · ทำ mini portfolio page · ส่ง advisor review

**Proof-of-work types:** mini dashboard · 1-page insight · requirement doc · UX research note · campaign report · SQL notebook · GitHub mini project · deck · case study

**Checkpoint:** advisor review → resume bullet conversion (evidence-backed) → portfolio artifact → before/after assessment

---

## 14. Resume Feature (supporting ไม่ใช่ core)

parse resume → สกัด claim → ชี้ weak evidence → แนะ bullet ที่แข็งขึ้น → **ติดป้าย bullet ไหน evidence-backed** → ส่ง advisor review · **ห้าม AI สร้างประสบการณ์ปลอม** (guardrail แข็ง)

---

## 15. Chat Feature Decision

**มี แต่เป็น secondary interface เท่านั้น** — dashboard เป็นหลัก · chat ตอบคำถามเช่น "ทำไมหลักฐานอ่อน" "ทำ proof อะไรได้ใน 2 สัปดาห์" "เปลี่ยนจาก marketing เป็น BA ได้ไหม" "ปรับ bullet นี้ยังไงไม่โกหก" · chat ต้องผ่าน Critic guardrail เดียวกัน

---

## 16. Data Model (practical — อ่านเข้าใจได้สำหรับ BA)

| ตาราง | purpose | key fields | ใช้โดย |
|---|---|---|---|
| institutions | สถาบัน | id, name | ทุกโมดูล |
| programs | หลักสูตร/คณะ | id, institution_id, name | M5 |
| cohorts | รุ่น | id, program_id, year | M5 |
| students | นักศึกษา | id, cohort_id, anon_id | M1–M5 |
| consent_records | ความยินยอม PDPA | id, student_id, purpose, scope, ts | ทุกโมดูล (gate) |
| documents | ไฟล์อัปโหลด | id, student_id, type, uri | M1 |
| parsed_profile | โปรไฟล์สกัดแล้ว | id, student_id, json | M1/M2 |
| skills | taxonomy ทักษะ | id, label, esco_id, onet_id, durability, version | M2/M3 |
| student_skill_evidence | สถานะหลักฐานต่อทักษะ | id, student_id, skill_id, status, evidence_ref | **M2 (หัวใจ)** |
| target_roles | role เป้าหมาย | id, label, onet_soc | M3 |
| role_skill_requirements | role ต้องการทักษะอะไร | role_id, skill_id, importance | M3 |
| assessments | ผลประเมินรอบหนึ่ง | id, student_id, role_id, scores_json, ts | M3 |
| gap_results | ผล gap | id, assessment_id, skill_id, gap_type, severity | M3 |
| action_plans | แผน | id, assessment_id, weeks | M4 |
| action_items | task ในแผน | id, plan_id, skill_id, proof_type | M4 |
| proof_submissions | ชิ้นงานที่ส่ง | id, action_item_id, uri, status | M4 |
| advisor_reviews | การตรวจของ advisor | id, target_ref, advisor_id, decision, comment | HITL |
| cohort_insights | insight ระดับรุ่น | id, cohort_id, insight, recommended_action | M5 |
| llm_runs | log การรัน AI + flags | id, agent, input_ref, output_ref, confidence, flags | audit/eval |
| audit_logs | audit ทั่วไป | id, actor, action, ts | PDPA/security |

*(pgvector optional สำหรับ semantic search ของ skill/role — NICE-to-have)*

---

## 17. Data Sources & Taxonomy Layer

**Tier 1 (MVP ต้อง work ด้วยตัวนี้):** ESCO-style skill taxonomy + O*NET-style occupation/skill mapping + **public occupation-level data (data.go.th / catalog.doe.go.th open-data API — ฟรี legal)** + curriculum/course data + student evidence

**Tier 2 (เสริม ถ้า MOU มา):** employer JD examples · internship postings · employer feedback · micro-skill patterns

**[ASSUMPTION 7] MVP ต้อง work แม้ Tier-2 ล่าช้า** — ออกแบบ:
- **open-data fallback** (occupation-level demand/durability ไม่ต้อง per-JD)
- **manual seed taxonomy** + role-skill matrix (2–3 role ก่อน)
- **ห้าม scrape เว็บหางาน** (robots block + เสี่ยงการเมืองทุนรัฐ)
- consent-aware collection · human review ของ taxonomy · **versioning** ของ skill taxonomy
- durability = **ESCO reusability + O*NET breadth + automation-exposure** (ไม่ใช้ demand-slope) · validate panel ไทย วัด kappa ≥ 0.7 ระดับ cluster

---

## 18. Architecture (POC)

```
[Next.js/React frontend] ──> [API: FastAPI/NestJS] ──> [PostgreSQL (+pgvector)]
                                      │                      
                                      ├─> [File storage: S3-compatible]
                                      └─> [AI orchestration]
                                            ├─ Profile Analyzer (LLM structured output)
                                            ├─ Evidence Verifier (rule + LLM)
                                            ├─ Role Fit / Skill Gap (RAG + rule scoring)
                                            ├─ Resilience (taxonomy lookup: ESCO/O*NET)
                                            ├─ Action Plan (template + LLM)
                                            ├─ Critic/Guardrail (veto + flag)
                                            └─ Institution Insight (aggregate/stats)
                                      
[Taxonomy/RAG KB: skills, roles, ESCO/O*NET crosswalk, curriculum]  (grounding source)
```

**Component responsibilities:** frontend = dashboard + flows · API = orchestration + scoring + RBAC · DB = state + audit · AI = structured-output + RAG + rule-based scoring (ไม่เทรนโมเดล)

**AI orchestration flow:** Profile → Evidence → Role Fit → Skill Gap → Resilience → Action Plan → **Critic (veto/flag)** → Institution Insight (batch)

**Security/privacy flow:** consent gate ก่อนทุก AI run · RBAC (student/advisor/career-center/admin) · anonymized cohort · audit log ทุก action · low-confidence → HITL

**Deployment:** cloud หรือ university test server · auth = email login (POC), SSO ทีหลัง

**Mock ได้ใน POC:** SSO · employer data (Tier-2) · large-scale cohort (ใช้ seed) · บาง integration

---

## 19. API Plan (key endpoints)

**Student:** `POST /profile` · `POST /documents` · `POST /documents/{id}/parse` · `POST /assessments {role}` · `GET /assessments/{id}` · `GET /assessments/{id}/action-plan` · `POST /proof` · `POST /chat`
**Advisor:** `GET /students` · `GET /students/{id}/assessment` · `POST /reviews {decision,comment}` · `POST /assessments/{id}/override`
**Institution:** `GET /cohorts/{id}/dashboard` · `GET /cohorts/{id}/gap-by-program` · `GET /cohorts/{id}/interventions` · `GET /cohorts/{id}/report`
**Admin:** `GET/POST /taxonomy` · `GET/POST /target-roles` · `GET /llm-runs` (audit)

*(แต่ละ endpoint: purpose ตามชื่อ · input/output เป็น JSON ตรงกับ data model ข้อ 16)*

---

## 20. PDPA / Privacy / Consent

consent screen (ระบุ purpose: AI processing / research use / advisor sharing) · **employer sharing = opt-in OFF by default** · anonymized cohort dashboard · data retention policy + deletion request · audit logs · **RBAC** · low-confidence/sensitive result flagged

---

## 21. Human-in-the-Loop

| จุด | ใคร |
|---|---|
| approve/edit action plan | advisor |
| override AI assessment | advisor |
| validate cohort insight ก่อน intervention | career center |
| ตัดสินว่า insight กระทบหลักสูตรไหม | curriculum committee |
| review taxonomy changes | admin |
| low-confidence result → ต้องคนตรวจ | advisor (auto-flag) |

---

## 22. Evaluation Plan (leading indicators — ไม่ใช้ employment ปีแรก)

**Student:** profile completion · target role selected · assessment completed · action plan accepted · proof-of-work submitted · **resume evidence improved** · **readiness score before/after** · perceived clarity
**Advisor/career center:** students reviewed · **time saved in diagnosis** · cohort insights generated · **interventions launched** · advisor satisfaction · **willingness-to-pay signal** · continued-use intent
**AI quality:** skill extraction accuracy (F1) · **evidence classification accuracy (kappa)** · hallucination rate · advisor override rate · low-confidence rate · traceability completeness

---

## 23. Black-Box Stress Tests (15 — risk / system response / residual / test in POC)

| # | Risk | ระบบต้องทำ | residual | ทดสอบใน POC |
|---|---|---|---|---|
| 1 | resume แย่ แต่เด็กเก่ง | self-assessment + transcript + advisor override | bias resume ช่วงต้น | เคสคู่ resume อ่อน/เก่งจริง |
| 2 | ใส่ skill ปลอม | ติดป้าย unverified + ต้องมี proof | gaming low-effort | scenario gaming |
| 3 | JD/role กำกวม | fallback occupation-level + ยืนยัน role | precision ลด | role กำกวม |
| 4 | job data อ่อน | open-data aggregate ทำงานได้ | micro-skill จำกัด | ทดสอบ granularity |
| 5 | hallucination | grounding + Critic veto + XAI | หลุดนาน ๆ ครั้ง | red-team set |
| 6 | bias ภาษาอังกฤษ | ให้คะแนนหลักฐาน ไม่ใช่ความเนียนภาษา + audit | ต้อง audit ต่อ | โปรไฟล์ไทย-อังกฤษคู่ |
| 7 | เด็กไม่กลับมา | embed + advisor nudge | บังคับ motivation ไม่ได้ | completion ฝัง vs voluntary |
| 8 | dashboard ไม่มี owner | บังคับมี named owner ก่อน deploy | external risk สูง | สมมติฐาน 1 |
| 9 | career center ไม่ adopt | ผูก ritual รายเทอม | สูง | pilot |
| 10 | employer ไม่เชื่อ score | **ออกนอก MVP** | จำกัด B2B | — |
| 11 | MOU ล่าช้า | open-data fallback | granularity | สมมติฐาน 7 |
| 12 | consent friction | consent ชัด + ค่อยขอ scope | drop บางส่วน | วัด consent rate |
| 13 | advisor ไม่เห็นด้วยกับ AI | override + log (เป็น feedback) | — | override rate |
| 14 | เปลี่ยนสายเพ้อฝัน | feasibility + durability voice + advisor | — | scenario เปลี่ยนสาย |
| 15 | curriculum data เก่า | versioning + flag stale | — | ตรวจ freshness |

---

## 24. Roadmap (12 vs 15 เดือน)

**Phases (ใช้ร่วมกันทั้งสองเวอร์ชัน):**

| Phase | objective | deliverable | success criteria | risk | เวลา | owner |
|---|---|---|---|---|---|---|
| 0 Validation design | ล็อกสมมติฐาน + named owner + consent | test plan, owner LOI, consent flow | owner เซ็น (สมมติฐาน 1) | owner หาไม่ได้ | 1 ด. | PM + career center |
| 1 Clickable prototype | flow ครบ (mock) | Figma/clickable | advisor เข้าใจ flow | — | 1 ด. | UX |
| 2 Data model + mock assessment | schema + role-skill matrix + taxonomy seed | DB + 2–3 role + crosswalk 1 cluster | kappa cluster ≥ 0.7 (สมมติฐาน 4) | taxonomy ช้า | 1.5 ด. | BA + HR panel |
| 3 AI assessment vertical slice | M1–M3 end-to-end | parse→evidence→gap→resilience | kappa evidence ≥ 0.7 + จับ fake (สมมติฐาน 3/9) | accuracy ต่ำ | 3 ด. | eng + AI |
| 4 Advisor dashboard + action plan | M4 + advisor HITL | plan + review queue | proof completion ≥60% (สมมติฐาน 5) | task ใหญ่ไป | 2 ด. | eng + advisor |
| 5 Cohort insight | M5 | dashboard + recommended action + report | owner จัด intervention (สมมติฐาน 1/10) | dashboard ไม่ actionable | 2 ด. | eng + career center |
| 6 Pilot readiness | embed 1 วิชา/คณะ | pilot run + eval | leading indicators ขยับ + WTP signal | adoption | 1.5 ด.+ | ทุกฝ่าย |

**12 เดือน:** โฟกัส leading indicators (Phase 0–6, pilot สั้น) — **ไม่เคลม employment**
**15 เดือน:** เพิ่ม post-intervention follow-up (วัด durable skill-match + การปรับตัวในงานแรกกับ comparison group) — **เป็นเวอร์ชันที่ตอบ must-fix #1 ได้เต็ม**

---

## 25. Demo Script (3 ฉาก)

1. **Y4 Business → Junior BA:** upload resume → ระบบชี้ "ไม่ไกลจาก BA จุดอ่อนไม่ใช่ความรู้ธุรกิจ แต่คือ *หลักฐาน*ด้าน data/requirement/outcome storytelling อ่อน" → แผน 2 สัปดาห์ (dashboard + insight + portfolio + advisor)
2. **Gaming:** เด็กใส่ "Python/SQL/AI/DS/PM expert" → ระบบ "ตรวจพบ แต่ส่วนใหญ่ unverified — ไม่มี portfolio/transcript/cert/project/advisor validation" → **โชว์ว่า AI ไม่เชื่อ resume ตรง ๆ**
3. **Career center:** "58% ของ Business ปี 4 มี data evidence gap" → recommended: "จัด Data Portfolio Sprint 2 สัปดาห์ก่อนฤดูสมัครงาน" → **dashboard แนะ action ไม่ใช่แค่กราฟสวย**

---

## 26. Risks & how this lifts 46 → 60

| มิติ sandbox | ขยับด้วยอะไรใน POC นี้ |
|---|---|
| Time 2→4 | roadmap 15 เดือน + leading indicators (ข้อ 22/24) |
| Employer 2→3 | ตัดออก MVP + employer LOI เป็น optional data |
| Data 3→4 | open-data Tier-1 POC ที่รันได้ + LOI กรมจัดหางาน |
| Operational 3→4 | named owner + ritual (Phase 0) |
| Adoption 3→4 | embed 1 วิชาบังคับ (สมมติฐาน 2) |
| Sustainability 3→4 | WTP signal + intervention launched (สมมติฐาน 10) |
| Resilience 4→5 | สเปก Resilience Score + ครอสวอล์ค ESCO/O*NET + kappa |
| Solution/Technical 4→5 | vertical slice POC + evidence kappa + ground-truth set |
| University value 4→5 | Curriculum Insight Report + จดหมายคณะ |

---

## 27. Proposal Narrative

- ทักษะเปลี่ยนเร็วกว่าหลักสูตรปรับตาม → ต้องมีเครื่องมือวินิจฉัยต้นน้ำ
- นักศึกษาต้องการ readiness diagnosis รายคนก่อนจบ
- มหา'ลัยต้องการ **evidence loop ไม่ใช่ survey**
- AI personalize ได้สเกล แต่ต้อง **grounded + explainable + human-reviewed**
- **Resilience Score** ทำให้ future-proof กว่า job-matching
- คุณค่าฝั่ง ม. = cohort insight + intervention planning
- **ผลปีแรก = leading indicators ไม่ใช่การรับประกันงาน**

---

## 28. Final Recommendation

**เดินหน้า POC — แต่ Phase 0 ต้องผ่านก่อนลงเงิน Phase 3+:** ถ้าหา named owner (สมมติฐาน 1) และ embed ในวิชา (สมมติฐาน 2) ไม่ได้ภายใน Phase 0 → หยุด/แก้ก่อน เพราะสองตัวนี้คือ external risk ที่เทคโนโลยีแก้ไม่ได้ · ส่วนหัวใจเทคนิค (สมมติฐาน 3 evidence kappa) ต้องผ่านใน Phase 3 ก่อนสร้างต่อ

## 29. Open Questions (ต้องตัดสินใจ)

1. โครงสร้างผู้ขอทุน: ม. เป็นเจ้าภาพ (Riverpark รับจ้าง) vs Riverpark ขอเอง + MOU + **กรรมสิทธิ์ taxonomy/dataset (= moat)**
2. 12 vs 15 เดือน (must-fix #1)
3. คณะนำร่อง + จำนวน n + comparison group
4. named owner ที่ career center คือใคร (สมมติฐาน 1)
5. สถานะ LOI กรมจัดหางาน + รายการ open-data ที่จะดึง
6. license ของ Thai Skill Taxonomy (open ระดับไหน)
