#!/usr/bin/env python3
"""Dependency-free branded report artifacts for Standard agency intelligence."""

from __future__ import annotations

import html
import math
import re
import textwrap
import zipfile
from datetime import datetime
from pathlib import Path
from typing import Any


BRAND_BLUE = "#0071E3"
BRAND_BLUE_DARK = "#0058B0"
BRAND_BLUE_PALE = "#EAF3FC"
BRAND_INK = "#0E0E0E"
BRAND_MUTED = "#5A5A5A"
BRAND_RULE = "#E3E3E3"
BRAND_PAPER = "#FFFFFF"

ARTIFACT_NAMES = {
    "OWNER-REPORT.html",
    "OWNER-REPORT.pdf",
    "ACTION-LIST.xlsx",
}

SKILL_TITLES = {
    "agency-quote-conversion": "Quote Conversion Review",
    "agency-retention-rescue": "Retention Rescue Review",
    "agency-commission-audit": "Commission Audit Review",
    "agency-owner-review": "Agency Owner Review",
    "agency-cross-sell": "Cross-Sell Opportunity Review",
}

SKILL_SUBTITLES = {
    "agency-quote-conversion": "Quote volume, conversion signals, and a prioritized local follow-up queue.",
    "agency-retention-rescue": "Termination patterns and a reason-based local review queue.",
    "agency-commission-audit": "Policy-level reconciliation and exceptions requiring human verification.",
    "agency-owner-review": "A concise operating picture for book health, production, retention, and premium.",
    "agency-cross-sell": "Provisional bundle opportunities requiring full household verification.",
}


def _money(value: Any) -> str:
    if value is None or value == "":
        return "Unavailable"
    return f"${float(value):,.2f}"


def _count(value: Any) -> str:
    if value is None or value == "":
        return "Unavailable"
    return f"{int(float(value)):,}"


def _percent(value: Any) -> str:
    if value is None or value == "":
        return "Unavailable"
    return f"{float(value) * 100:.2f}%"


def _reported_percent(value: Any) -> str:
    if value is None or value == "":
        return "Unavailable"
    return f"{float(value):.2f}%"


def _metric(summary: dict[str, Any], section: str, metric: str) -> Any:
    for row in summary.get("business_metrics", []):
        if row.get("section") == section and row.get("metric") == metric:
            return row.get("total")
    return None


def _category_count(summary: dict[str, Any], label: str) -> int:
    for row in summary.get("category_counts", []):
        if row.get("label") == label:
            return int(row.get("count", 0))
    return 0


def _kpi(label: str, display: str, raw: Any = None) -> dict[str, Any]:
    return {"label": label, "display": display, "raw": raw}


def _breakdown_row(label: str, value: float, display: str) -> dict[str, Any]:
    return {"label": label or "(blank)", "value": float(value), "display": display}


def build_report_model(
    mode: str,
    summary: dict[str, Any],
    actions: list[dict[str, Any]],
) -> dict[str, Any]:
    """Build a PII-free presentation model from the analysis summary."""
    title = SKILL_TITLES[mode]
    subtitle = SKILL_SUBTITLES[mode]
    kpis: list[dict[str, Any]] = []
    breakdown_title = "Key breakdown"
    breakdown: list[dict[str, Any]] = []
    findings: list[str] = []
    next_actions: list[str] = []

    if mode == "agency-quote-conversion":
        conversion_available = bool(summary.get("conversion_available"))
        kpis = [
            _kpi("Unique quotes", _count(summary.get("serious_quotes")), summary.get("serious_quotes")),
            _kpi("Conversion rate", _percent(summary.get("conversion_rate")) if conversion_available else "Unavailable", summary.get("conversion_rate")),
            _kpi("Bound quotes", _count(summary.get("bound_quotes")) if conversion_available else "Unavailable", summary.get("bound_quotes")),
            _kpi("Unbound queue", _count(summary.get("unbound_quotes")) if conversion_available else "Unavailable", summary.get("unbound_quotes")),
            _kpi("Quoted premium", _money(summary.get("quoted_premium")), summary.get("quoted_premium")),
        ]
        breakdown_title = "Product participation"
        for row in summary.get("by_product", [])[:8]:
            conversion = row.get("conversion_rate")
            detail = f"{_count(row.get('quotes'))} quotes"
            if conversion_available:
                detail += f" | {_percent(conversion)} conversion"
            breakdown.append(_breakdown_row(row.get("label", ""), row.get("quotes", 0), detail))
        if conversion_available:
            findings.append(
                f"{_count(summary.get('bound_quotes'))} of {_count(summary.get('serious_quotes'))} unique quotes show a bound signal in the supplied export."
            )
            findings.append(
                f"The local follow-up workbook contains {_count(len(actions))} unique unbound quotes, ordered by quoted premium."
            )
        else:
            findings.append(
                "The export does not contain usable bound signals, so the report intentionally leaves conversion and the follow-up queue unavailable."
            )
        findings.append("Quoted premium is opportunity volume, not revenue or expected commission.")
        next_actions = [
            "Review the highest-value unbound quotes with the licensed team when conversion signals are available.",
            "Compare product and producer participation only after checking sample size and the report date window.",
            "Use a conversion-capable export with populated issued-policy or quote-status signals when conversion is unavailable.",
        ]

    elif mode == "agency-retention-rescue":
        payment = _category_count(summary, "Payment rescue")
        price = _category_count(summary, "Price conversation")
        owner = _category_count(summary, "Owner review")
        kpis = [
            _kpi("Terminations", _count(summary.get("terminations")), summary.get("terminations")),
            _kpi("Premium represented", _money(summary.get("premium_new")), summary.get("premium_new")),
            _kpi("Payment rescue", _count(payment), payment),
            _kpi("Price conversations", _count(price), price),
            _kpi("Phone + email", _count(summary.get("with_phone_and_email")), summary.get("with_phone_and_email")),
        ]
        breakdown_title = "Reason-based review queue"
        for row in summary.get("category_counts", [])[:8]:
            breakdown.append(_breakdown_row(row.get("label", ""), row.get("count", 0), _count(row.get("count"))))
        findings = [
            f"Payment-rescue cases represent {payment:,} records and should be separated from the {price:,} explicit price conversations.",
            f"{owner:,} records remain in owner review because the reason does not support an automatic save classification.",
            "Premium represented in the audit is not guaranteed saved premium or agency revenue.",
        ]
        next_actions = [
            "Route payment-rescue cases for licensed-team review first.",
            "Coach explicit price conversations separately without promising a rate or recommending a coverage reduction as fact.",
            "Review owner-review and likely non-saveable records before deciding whether any contact is appropriate.",
        ]

    elif mode == "agency-commission-audit":
        kpis = [
            _kpi("Policy rows", _count(summary.get("policy_rows")), summary.get("policy_rows")),
            _kpi("Total commission", _money(summary.get("total_commission")), summary.get("total_commission")),
            _kpi("Effective rate", _percent(summary.get("effective_commission_rate")), summary.get("effective_commission_rate")),
            _kpi("Exception rows", _count(len(actions)), len(actions)),
            _kpi("Negative rows", _count(summary.get("negative_commission_rows")), summary.get("negative_commission_rows")),
        ]
        breakdown_title = "Commission by product"
        for row in summary.get("by_product", [])[:8]:
            breakdown.append(_breakdown_row(row.get("label", ""), abs(float(row.get("amount", 0))), _money(row.get("amount"))))
        findings = [
            f"The review workbook contains {_count(len(actions))} unique exception rows; one row can trigger more than one rule.",
            f"{_count(summary.get('negative_commission_rows'))} rows contain negative total commission or chargeback signals.",
            "An exception is not proof of underpayment; expected payment requires the applicable carrier schedule and adjustment rules.",
        ]
        next_actions = [
            "Reconcile negative and zero-commission rows against the carrier statement and accounting period.",
            "Review broad rate exceptions using the correct carrier schedule, product, agent type, and adjustment rules.",
            "Document verified explanations without changing producer compensation or accounting records from this report.",
        ]

    elif mode == "agency-owner-review":
        new_business = summary.get("new_business") or {}
        current_pif = _metric(summary, "Policies in Force", "Current Month")
        retention = _metric(summary, "Policy Retention", "Current Month")
        current_premium = _metric(summary, "Written and Advanced Premium", "Current Month - Total")
        ytd_premium = _metric(summary, "Written and Advanced Premium", "YTD - Total")
        if current_pif is not None:
            kpis.append(_kpi("Policies in force", _count(current_pif), current_pif))
        if retention is not None:
            kpis.append(_kpi("Policy retention", _reported_percent(retention), retention))
        if current_premium is not None:
            kpis.append(_kpi("Current-month premium", _money(current_premium), current_premium))
        if ytd_premium is not None:
            kpis.append(_kpi("YTD premium", _money(ytd_premium), ytd_premium))
        if new_business:
            kpis.extend(
                [
                    _kpi("New-business premium", _money(new_business.get("written_premium")), new_business.get("written_premium")),
                    _kpi("Unique new policies", _count(new_business.get("unique_policies")), new_business.get("unique_policies")),
                ]
            )
        kpis = kpis[:6]
        breakdown_title = "New-business product mix" if new_business else "Reported operating metrics"
        if new_business:
            for row in new_business.get("by_product", [])[:8]:
                breakdown.append(_breakdown_row(row.get("label", ""), abs(float(row.get("amount", 0))), _money(row.get("amount"))))
        else:
            for row in summary.get("business_metrics", [])[:8]:
                breakdown.append(_breakdown_row(f"{row.get('section')} | {row.get('metric')}", abs(float(row.get("total", 0))), f"{float(row.get('total', 0)):,.2f}"))
        findings = []
        pif_pye = _metric(summary, "Policies in Force", "PYE")
        if current_pif is not None and pif_pye is not None:
            findings.append(f"Policies in force are {_count(current_pif - pif_pye)} above the report's PYE value.")
        retention_prior = _metric(summary, "Policy Retention", "Prior Year")
        if retention is not None and retention_prior is not None:
            findings.append(f"Policy retention is {float(retention) - float(retention_prior):.2f} points above the report's prior-year comparison.")
        if new_business:
            findings.append(
                f"New-business activity includes {_count(new_business.get('new_policy_rows'))} new-policy rows and {_count(new_business.get('add_item_rows'))} add-item rows."
            )
        if not findings:
            findings.append("The report preserves the source periods and labels without inventing goals or carrier thresholds.")
        next_actions = [
            "Identify the operating metric that weakened most within the report-defined comparison period.",
            "Review retention by tenure and production mix before assigning coaching actions.",
            "Use the product and producer rollups as management questions, not as invented performance standards.",
        ]

    elif mode == "agency-cross-sell":
        kpis = [
            _kpi("Commission rows", _count(summary.get("commission_rows")), summary.get("commission_rows")),
            _kpi("Monoline candidates", _count(summary.get("monoline_candidates")), summary.get("monoline_candidates")),
            _kpi("New-business rows", _count(summary.get("new_business_rows")), summary.get("new_business_rows")),
            _kpi("Add-item rows", _count(summary.get("new_business_add_item_rows")), summary.get("new_business_add_item_rows")),
            _kpi("Local review queue", _count(len(actions)), len(actions)),
        ]
        if summary.get("bundle_type_counts"):
            breakdown_title = "Bundle-type mix"
            for row in summary.get("bundle_type_counts", [])[:8]:
                breakdown.append(_breakdown_row(row.get("label", ""), row.get("count", 0), _count(row.get("count"))))
        else:
            breakdown_title = "New-business product mix"
            for row in summary.get("new_business_by_product", [])[:8]:
                breakdown.append(_breakdown_row(row.get("label", ""), abs(float(row.get("amount", 0))), _money(row.get("amount"))))
        findings = [
            f"{_count(summary.get('monoline_candidates'))} policy rows are provisional monoline candidates in the supplied commission export.",
            f"The new-business file contains {_count(summary.get('new_business_add_item_rows'))} add-item rows.",
            "A monthly commission export is not a complete household view; every candidate requires current in-force verification.",
        ]
        next_actions = [
            "Verify every provisional candidate against the full household and current in-force policy view.",
            "Group verified opportunities by current product and state for licensed-team review.",
            "Do not create outreach or recommend coverage amounts until the household review is complete and explicitly approved.",
        ]

    if not kpis:
        kpis = [_kpi("Action rows", _count(len(actions)), len(actions))]
    return {
        "title": title,
        "subtitle": subtitle,
        "kpis": kpis,
        "breakdown_title": breakdown_title,
        "breakdown": breakdown,
        "findings": findings,
        "next_actions": next_actions,
        "guardrail": summary.get("interpretation_guardrail", "Use this report as a local review aid."),
        "action_rows": len(actions),
    }


def _html_report(
    model: dict[str, Any],
    sources: list[dict[str, Any]],
    generated_at: str,
    pack_version: str,
) -> str:
    generated = datetime.fromisoformat(generated_at.replace("Z", "+00:00")).strftime("%B %d, %Y at %H:%M UTC")
    source_names = ", ".join(source.get("file", "") for source in sources)
    max_value = max((abs(row["value"]) for row in model["breakdown"]), default=1) or 1
    kpis = "".join(
        f'<article class="kpi"><span>{html.escape(item["label"])}</span><strong>{html.escape(item["display"])}</strong></article>'
        for item in model["kpis"]
    )
    bars = "".join(
        '<div class="bar-row">'
        f'<div class="bar-copy"><span>{html.escape(row["label"])}</span><strong>{html.escape(row["display"])}</strong></div>'
        f'<div class="track" aria-hidden="true"><i style="width:{max(2, min(100, abs(row["value"]) / max_value * 100)):.1f}%"></i></div>'
        '</div>'
        for row in model["breakdown"]
    ) or '<p class="empty">No aggregate breakdown is available from this report.</p>'
    findings = "".join(f"<li>{html.escape(value)}</li>" for value in model["findings"])
    actions = "".join(
        f'<li><span>{index:02d}</span><p>{html.escape(value)}</p></li>'
        for index, value in enumerate(model["next_actions"], start=1)
    )
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(model['title'])} | Standard Playbook</title>
<style>
:root{{--blue:{BRAND_BLUE};--blue-dark:{BRAND_BLUE_DARK};--blue-pale:{BRAND_BLUE_PALE};--ink:{BRAND_INK};--muted:{BRAND_MUTED};--rule:{BRAND_RULE};--paper:{BRAND_PAPER};}}
*{{box-sizing:border-box}} body{{margin:0;background:#f6f8fa;color:var(--ink);font-family:Inter,-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;line-height:1.5}}
.page{{width:min(calc(100% - 40px),1180px);margin:32px auto;background:var(--paper);border:1px solid var(--rule);box-shadow:0 24px 70px rgba(14,14,14,.08)}}
.top-rule{{height:8px;background:var(--blue)}} header{{padding:44px 48px 34px;border-bottom:1px solid var(--rule)}}
.eyebrow{{margin:0 0 16px;color:var(--blue);font-size:11px;font-weight:800;letter-spacing:.16em;text-transform:uppercase}}
h1{{max-width:900px;margin:0;font-size:clamp(38px,6vw,72px);font-weight:800;letter-spacing:-.045em;line-height:.96}} .lede{{max-width:760px;margin:20px 0 0;color:var(--muted);font-size:18px}}
.meta{{display:flex;flex-wrap:wrap;gap:10px 24px;margin-top:28px;color:var(--muted);font-size:12px}} .meta b{{color:var(--ink)}}
main{{padding:38px 48px 50px}} .kpis{{display:grid;grid-template-columns:repeat(auto-fit,minmax(175px,1fr));gap:12px}}
.kpi{{min-height:126px;padding:22px;border:1px solid #cfe3f7;background:linear-gradient(145deg,#fff 0%,var(--blue-pale) 100%)}}
.kpi span{{display:block;color:var(--muted);font-size:11px;font-weight:800;letter-spacing:.09em;text-transform:uppercase}} .kpi strong{{display:block;margin-top:22px;color:var(--blue-dark);font-size:clamp(25px,3vw,36px);letter-spacing:-.035em;line-height:1}}
.grid{{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(300px,.7fr);gap:32px;margin-top:42px}} section{{min-width:0}} h2{{margin:0 0 18px;font-size:22px;letter-spacing:-.02em}}
.bar-row{{padding:14px 0;border-top:1px solid var(--rule)}} .bar-copy{{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;font-size:13px}} .bar-copy span{{max-width:70%;font-weight:650}} .bar-copy strong{{white-space:nowrap;color:var(--muted);font-size:12px}}
.track{{height:7px;margin-top:9px;overflow:hidden;background:#edf0f3}} .track i{{display:block;height:100%;background:var(--blue)}}
.findings{{margin:0;padding:0;list-style:none;border-top:1px solid var(--ink)}} .findings li{{padding:17px 0 17px 22px;border-bottom:1px solid var(--rule);position:relative;font-size:14px}} .findings li:before{{content:"";position:absolute;left:0;top:23px;width:7px;height:7px;background:var(--blue)}}
.next{{margin-top:44px;padding-top:30px;border-top:2px solid var(--ink)}} .next ol{{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:0;padding:0;list-style:none}} .next li{{min-height:178px;padding:22px;border:1px solid var(--ink)}} .next li span{{color:var(--blue);font-size:24px;font-weight:800}} .next li p{{margin:28px 0 0;font-size:14px}}
.guardrail{{margin-top:26px;padding:20px 22px;border-left:5px solid var(--blue);background:var(--blue-pale);font-size:13px}} .guardrail b{{display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.08em;font-size:10px}}
footer{{display:flex;justify-content:space-between;gap:20px;padding:20px 48px;border-top:1px solid var(--rule);color:var(--muted);font-size:11px}} footer a{{color:var(--blue-dark);font-weight:700;text-decoration:none}}
.empty{{color:var(--muted)}}
@media(max-width:800px){{.page{{width:100%;margin:0;border:0}}header,main{{padding-left:24px;padding-right:24px}}.grid{{grid-template-columns:1fr}}.next ol{{grid-template-columns:1fr}}footer{{padding:20px 24px;flex-direction:column}}}}
@media print{{@page{{size:letter;margin:.45in}}body{{background:#fff}}.page{{width:100%;margin:0;border:0;box-shadow:none}}header{{padding:20px 0}}main{{padding:24px 0}}footer{{padding:15px 0}}.kpi,.bar-row,.next li,.guardrail{{break-inside:avoid}}a{{color:inherit}}}}
</style>
</head>
<body>
<article class="page">
<div class="top-rule"></div>
<header>
<p class="eyebrow">Standard Playbook / Agency Intelligence</p>
<h1>{html.escape(model['title'])}</h1>
<p class="lede">{html.escape(model['subtitle'])}</p>
<div class="meta"><span><b>Generated</b> {html.escape(generated)}</span><span><b>Source files</b> {len(sources)}</span><span><b>Action rows</b> {model['action_rows']:,}</span><span><b>Pack</b> {html.escape(pack_version)}</span></div>
</header>
<main>
<section class="kpis" aria-label="Key performance indicators">{kpis}</section>
<div class="grid">
<section><h2>{html.escape(model['breakdown_title'])}</h2>{bars}</section>
<section><h2>What deserves attention</h2><ul class="findings">{findings}</ul></section>
</div>
<section class="next"><h2>Recommended next actions</h2><ol>{actions}</ol></section>
<aside class="guardrail"><b>Interpretation guardrail</b>{html.escape(model['guardrail'])}</aside>
</main>
<footer><span>Sources: {html.escape(source_names)}</span><span><a href="ACTION-LIST.xlsx">Open formatted action workbook</a> &nbsp; / &nbsp; <a href="action-list.csv">Open CSV</a></span></footer>
</article>
</body>
</html>
"""


def _pdf_safe(value: Any) -> str:
    rendered = str(value).replace("\u2014", "-").replace("\u2013", "-").replace("\u2011", "-").replace("\u2022", "-")
    return rendered.encode("latin-1", "replace").decode("latin-1")


def _pdf_escape(value: Any) -> str:
    return _pdf_safe(value).replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


class _PdfBuilder:
    width = 612.0
    height = 792.0
    margin = 46.0

    def __init__(self, title: str, pack_version: str) -> None:
        self.title = title
        self.pack_version = pack_version
        self.pages: list[list[str]] = []
        self.commands: list[str] = []
        self.y = 0.0
        self.page_number = 0
        self.new_page(first=True)

    def _rgb(self, color: str) -> tuple[float, float, float]:
        color = color.lstrip("#")
        return tuple(int(color[index:index + 2], 16) / 255 for index in (0, 2, 4))

    def new_page(self, first: bool = False) -> None:
        if self.commands:
            self._footer()
            self.pages.append(self.commands)
        self.commands = []
        self.page_number += 1
        self.rect(0, 0, self.width, 7, BRAND_BLUE)
        self.y = 38 if first else 45
        if not first:
            self.text("STANDARD PLAYBOOK / AGENCY INTELLIGENCE", self.margin, self.y, 8, bold=True, color=BRAND_BLUE)
            self.y += 18
            self.text(self.title, self.margin, self.y, 16, bold=True)
            self.y += 26

    def _footer(self) -> None:
        self.line(self.margin, self.height - 38, self.width - self.margin, self.height - 38, BRAND_RULE)
        self.text(f"Standard Agency Intelligence Pack {self.pack_version}", self.margin, self.height - 22, 7.5, color=BRAND_MUTED)
        self.text(str(self.page_number), self.width - self.margin - 8, self.height - 22, 7.5, color=BRAND_MUTED)

    def ensure(self, height: float) -> None:
        if self.y + height > self.height - 58:
            self.new_page()

    def text(self, value: Any, x: float, top: float, size: float = 10, bold: bool = False, color: str = BRAND_INK) -> None:
        r, g, b = self._rgb(color)
        font = "F2" if bold else "F1"
        y = self.height - top
        self.commands.append(f"BT /{font} {size:.2f} Tf {r:.4f} {g:.4f} {b:.4f} rg {x:.2f} {y:.2f} Td ({_pdf_escape(value)}) Tj ET")

    def rect(self, x: float, top: float, width: float, height: float, color: str) -> None:
        r, g, b = self._rgb(color)
        y = self.height - top - height
        self.commands.append(f"q {r:.4f} {g:.4f} {b:.4f} rg {x:.2f} {y:.2f} {width:.2f} {height:.2f} re f Q")

    def line(self, x1: float, top1: float, x2: float, top2: float, color: str, width: float = 0.7) -> None:
        r, g, b = self._rgb(color)
        y1 = self.height - top1
        y2 = self.height - top2
        self.commands.append(f"q {r:.4f} {g:.4f} {b:.4f} RG {width:.2f} w {x1:.2f} {y1:.2f} m {x2:.2f} {y2:.2f} l S Q")

    def wrapped(self, value: str, x: float, width: float, size: float = 9.5, bold: bool = False, color: str = BRAND_INK, leading: float | None = None) -> float:
        leading = leading or size * 1.35
        max_chars = max(18, int(width / (size * 0.52)))
        lines = textwrap.wrap(_pdf_safe(value), width=max_chars, break_long_words=False, break_on_hyphens=False) or [""]
        for line in lines:
            self.text(line, x, self.y, size, bold=bold, color=color)
            self.y += leading
        return len(lines) * leading

    def heading(self, value: str) -> None:
        self.ensure(34)
        self.y += 8
        self.text(value, self.margin, self.y, 13, bold=True)
        self.y += 21

    def bullet(self, value: str) -> None:
        self.ensure(42)
        self.rect(self.margin, self.y - 5, 6, 6, BRAND_BLUE)
        start = self.y
        self.wrapped(value, self.margin + 16, self.width - (self.margin * 2) - 16, size=9.2)
        self.y = max(self.y, start + 18) + 6

    def finish(self) -> list[list[str]]:
        self._footer()
        self.pages.append(self.commands)
        return self.pages


def _compile_pdf(pages: list[list[str]]) -> bytes:
    objects: dict[int, bytes] = {}
    objects[1] = b"<< /Type /Catalog /Pages 2 0 R >>"
    objects[3] = b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
    objects[4] = b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"
    page_ids: list[int] = []
    for index, commands in enumerate(pages):
        content_id = 5 + index * 2
        page_id = 6 + index * 2
        page_ids.append(page_id)
        stream = ("\n".join(commands) + "\n").encode("latin-1", "replace")
        objects[content_id] = b"<< /Length " + str(len(stream)).encode("ascii") + b" >>\nstream\n" + stream + b"endstream"
        objects[page_id] = (
            f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents {content_id} 0 R >>".encode("ascii")
        )
    kids = " ".join(f"{page_id} 0 R" for page_id in page_ids)
    objects[2] = f"<< /Type /Pages /Kids [{kids}] /Count {len(page_ids)} >>".encode("ascii")
    max_id = max(objects)
    output = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
    offsets = [0] * (max_id + 1)
    for object_id in range(1, max_id + 1):
        offsets[object_id] = len(output)
        output.extend(f"{object_id} 0 obj\n".encode("ascii"))
        output.extend(objects[object_id])
        output.extend(b"\nendobj\n")
    xref = len(output)
    output.extend(f"xref\n0 {max_id + 1}\n".encode("ascii"))
    output.extend(b"0000000000 65535 f \n")
    for object_id in range(1, max_id + 1):
        output.extend(f"{offsets[object_id]:010d} 00000 n \n".encode("ascii"))
    output.extend(f"trailer\n<< /Size {max_id + 1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF\n".encode("ascii"))
    return bytes(output)


def _pdf_report(
    model: dict[str, Any],
    sources: list[dict[str, Any]],
    generated_at: str,
    pack_version: str,
) -> bytes:
    builder = _PdfBuilder(model["title"], pack_version)
    builder.text("STANDARD PLAYBOOK / AGENCY INTELLIGENCE", builder.margin, builder.y, 8, bold=True, color=BRAND_BLUE)
    builder.y += 28
    builder.wrapped(model["title"], builder.margin, builder.width - builder.margin * 2, size=23, bold=True, leading=25)
    builder.y += 5
    builder.wrapped(model["subtitle"], builder.margin, 440, size=10.5, color=BRAND_MUTED)
    generated = datetime.fromisoformat(generated_at.replace("Z", "+00:00")).strftime("%B %d, %Y | %H:%M UTC")
    builder.y += 5
    builder.text(f"Generated {generated} | {len(sources)} source file(s) | {model['action_rows']:,} action row(s)", builder.margin, builder.y, 8, color=BRAND_MUTED)
    builder.y += 28

    card_gap = 10
    card_width = (builder.width - builder.margin * 2 - card_gap) / 2
    for index in range(0, len(model["kpis"]), 2):
        builder.ensure(68)
        row = model["kpis"][index:index + 2]
        top = builder.y
        for column, item in enumerate(row):
            x = builder.margin + column * (card_width + card_gap)
            builder.rect(x, top, card_width, 58, BRAND_BLUE_PALE)
            builder.text(item["label"].upper(), x + 13, top + 17, 7.5, bold=True, color=BRAND_MUTED)
            builder.text(item["display"], x + 13, top + 42, 16, bold=True, color=BRAND_BLUE_DARK)
        builder.y += 68

    builder.heading(model["breakdown_title"])
    max_value = max((abs(row["value"]) for row in model["breakdown"]), default=1) or 1
    for row in model["breakdown"][:8]:
        builder.ensure(31)
        builder.text(textwrap.shorten(_pdf_safe(row["label"]), width=54, placeholder="..."), builder.margin, builder.y, 8.5, bold=True)
        builder.text(row["display"], builder.width - builder.margin - 90, builder.y, 8, color=BRAND_MUTED)
        builder.y += 8
        builder.rect(builder.margin, builder.y, builder.width - builder.margin * 2, 5, "#EDF0F3")
        builder.rect(builder.margin, builder.y, max(5, (builder.width - builder.margin * 2) * abs(row["value"]) / max_value), 5, BRAND_BLUE)
        builder.y += 18

    builder.heading("What deserves attention")
    for finding in model["findings"]:
        builder.bullet(finding)

    builder.ensure(150)
    builder.heading("Recommended next actions")
    for index, action in enumerate(model["next_actions"], start=1):
        builder.ensure(44)
        builder.text(f"{index:02d}", builder.margin, builder.y, 13, bold=True, color=BRAND_BLUE)
        start = builder.y
        builder.wrapped(action, builder.margin + 35, builder.width - builder.margin * 2 - 35, size=9.2)
        builder.y = max(builder.y, start + 20) + 8

    builder.ensure(72)
    builder.rect(builder.margin, builder.y, builder.width - builder.margin * 2, 58, BRAND_BLUE_PALE)
    builder.text("INTERPRETATION GUARDRAIL", builder.margin + 14, builder.y + 17, 7.3, bold=True, color=BRAND_BLUE_DARK)
    builder.y += 31
    builder.wrapped(model["guardrail"], builder.margin + 14, builder.width - builder.margin * 2 - 28, size=8.4)
    return _compile_pdf(builder.finish())


def _column_name(index: int) -> str:
    value = index + 1
    result = ""
    while value:
        value, remainder = divmod(value - 1, 26)
        result = chr(65 + remainder) + result
    return result


def _xml_text(value: Any) -> str:
    return html.escape(str(value), quote=False)


def _xlsx_cell(reference: str, value: Any, style: int = 0, force_text: bool = False) -> str:
    if value is None:
        value = ""
    if isinstance(value, bool):
        value = "Yes" if value else "No"
    if isinstance(value, (int, float)) and not force_text and math.isfinite(float(value)):
        return f'<c r="{reference}" s="{style}" t="n"><v>{value}</v></c>'
    return f'<c r="{reference}" s="{style}" t="inlineStr"><is><t xml:space="preserve">{_xml_text(value)}</t></is></c>'


def _xlsx_row(index: int, cells: list[str], height: float | None = None) -> str:
    custom = f' ht="{height}" customHeight="1"' if height else ""
    return f'<row r="{index}"{custom}>{"".join(cells)}</row>'


def _dashboard_sheet(model: dict[str, Any], sources: list[dict[str, Any]], generated_at: str) -> str:
    rows: list[str] = []
    merges = ["A1:H1", "A2:H2", "A3:H3", "A4:H4"]
    rows.append(_xlsx_row(1, [_xlsx_cell("A1", "STANDARD PLAYBOOK / AGENCY INTELLIGENCE", 2, True)], 22))
    rows.append(_xlsx_row(2, [_xlsx_cell("A2", model["title"], 1, True)], 34))
    rows.append(_xlsx_row(3, [_xlsx_cell("A3", model["subtitle"], 3, True)], 28))
    generated = datetime.fromisoformat(generated_at.replace("Z", "+00:00")).strftime("%Y-%m-%d %H:%M UTC")
    source_names = ", ".join(source.get("file", "") for source in sources)
    rows.append(_xlsx_row(4, [_xlsx_cell("A4", f"Generated {generated} | {len(sources)} source file(s) | {model['action_rows']:,} action row(s) | Sources: {source_names}", 3, True)], 26))

    start = 6
    kpi_rows: dict[int, list[str]] = {}
    for index, item in enumerate(model["kpis"]):
        group = index % 4
        band = index // 4
        col = group * 2
        label_row = start + band * 3
        value_row = label_row + 1
        left = _column_name(col)
        right = _column_name(col + 1)
        merges.extend([f"{left}{label_row}:{right}{label_row}", f"{left}{value_row}:{right}{value_row}"])
        kpi_rows.setdefault(label_row, []).append(
            _xlsx_cell(f"{left}{label_row}", item["label"].upper(), 4, True)
        )
        kpi_rows.setdefault(value_row, []).append(
            _xlsx_cell(f"{left}{value_row}", item["display"], 5, True)
        )
    for row_index in sorted(kpi_rows):
        rows.append(
            _xlsx_row(
                row_index,
                kpi_rows[row_index],
                20 if (row_index - start) % 3 == 0 else 31,
            )
        )

    section_row = start + math.ceil(len(model["kpis"]) / 4) * 3 + 1
    rows.append(_xlsx_row(section_row, [_xlsx_cell(f"A{section_row}", model["breakdown_title"], 6, True), _xlsx_cell(f"E{section_row}", "WHAT DESERVES ATTENTION", 6, True)], 24))
    merges.extend([f"A{section_row}:D{section_row}", f"E{section_row}:H{section_row}"])
    breakdown_start = section_row + 1
    max_breakdown = max(len(model["breakdown"]), len(model["findings"]), 1)
    max_value = max((abs(row["value"]) for row in model["breakdown"]), default=1) or 1
    data_bar_start = None
    data_bar_end = None
    for offset in range(max_breakdown):
        row_index = breakdown_start + offset
        cells: list[str] = []
        if offset < len(model["breakdown"]):
            item = model["breakdown"][offset]
            cells.extend([
                _xlsx_cell(f"A{row_index}", item["label"], 8, True),
                _xlsx_cell(f"B{row_index}", item["value"], 9),
                _xlsx_cell(f"C{row_index}", item["display"], 8, True),
            ])
            merges.append(f"C{row_index}:D{row_index}")
            data_bar_start = data_bar_start or row_index
            data_bar_end = row_index
        if offset < len(model["findings"]):
            cells.append(_xlsx_cell(f"E{row_index}", f"• {model['findings'][offset]}", 17, True))
            merges.append(f"E{row_index}:H{row_index}")
        rows.append(_xlsx_row(row_index, cells, 33))

    next_row = breakdown_start + max_breakdown + 2
    rows.append(_xlsx_row(next_row, [_xlsx_cell(f"A{next_row}", "RECOMMENDED NEXT ACTIONS", 6, True)], 24))
    merges.append(f"A{next_row}:H{next_row}")
    for offset, action in enumerate(model["next_actions"], start=1):
        row_index = next_row + offset
        rows.append(_xlsx_row(row_index, [_xlsx_cell(f"A{row_index}", f"{offset:02d}", 2, True), _xlsx_cell(f"B{row_index}", action, 17, True)], 34))
        merges.append(f"B{row_index}:H{row_index}")
    guardrail_row = next_row + len(model["next_actions"]) + 2
    rows.append(_xlsx_row(guardrail_row, [_xlsx_cell(f"A{guardrail_row}", f"INTERPRETATION GUARDRAIL | {model['guardrail']}", 17, True)], 38))
    merges.append(f"A{guardrail_row}:H{guardrail_row}")

    conditional = ""
    if data_bar_start and data_bar_end:
        conditional = f'<conditionalFormatting sqref="B{data_bar_start}:B{data_bar_end}"><cfRule type="dataBar" priority="1"><dataBar><cfvo type="min"/><cfvo type="max"/><color rgb="FF0071E3"/></dataBar></cfRule></conditionalFormatting>'
    dimension_end = guardrail_row
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<dimension ref="A1:H{dimension_end}"/><sheetViews><sheetView showGridLines="0" workbookViewId="0"><pane ySplit="4" topLeftCell="A5" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>
<sheetFormatPr defaultRowHeight="18"/><cols><col min="1" max="1" width="30" customWidth="1"/><col min="2" max="2" width="15" customWidth="1"/><col min="3" max="4" width="18" customWidth="1"/><col min="5" max="8" width="18" customWidth="1"/></cols>
<sheetData>{''.join(rows)}</sheetData><mergeCells count="{len(merges)}">{''.join(f'<mergeCell ref="{value}"/>' for value in merges)}</mergeCells>{conditional}
<pageMargins left="0.35" right="0.35" top="0.5" bottom="0.5" header="0.2" footer="0.2"/><pageSetup orientation="landscape" fitToWidth="1" fitToHeight="0" paperSize="1"/>
</worksheet>'''


def _action_style(
    header: str, value: Any, record: dict[str, Any] | None = None
) -> int:
    normalized = re.sub(r"[^a-z0-9]+", "_", header.lower()).strip("_")
    if normalized == "priority":
        return {"high": 13, "medium": 14, "standard": 15, "low": 16}.get(str(value).lower(), 8)
    if isinstance(value, (int, float)):
        if normalized == "reported_total" and record:
            section = str(record.get("section", "")).lower()
            metric = str(record.get("metric", "")).lower()
            if (
                "retention" in section
                or "loss ratio" in metric
                or "%" in metric
                or "variance" in metric and "point" in metric
            ):
                return 19
            if (
                "premium" in section
                or "premium" in metric
                or "losses" in metric
            ):
                return 10
        if "rate" in normalized or "pct" in normalized or "percent" in normalized:
            return 11
        if any(word in normalized for word in ("premium", "commission", "amount")):
            return 10
        return 9
    if str(value).lstrip().startswith(("=", "+", "-", "@")):
        return 18
    return 8


def _action_sheet(actions: list[dict[str, Any]], title: str) -> str:
    headers: list[str] = []
    for row in actions:
        for key in row:
            if key not in headers:
                headers.append(key)
    if not headers:
        headers = ["status"]
        actions = [{"status": "No action rows generated from the supplied reports."}]
    last_col = _column_name(len(headers) - 1)
    rows = [
        _xlsx_row(1, [_xlsx_cell("A1", title, 1, True)], 32),
        _xlsx_row(2, [_xlsx_cell("A2", "Local working file. Review every row before outreach, policy action, accounting change, or external sharing.", 17, True)], 34),
        _xlsx_row(4, [_xlsx_cell(f"{_column_name(index)}4", header.replace("_", " ").title(), 7, True) for index, header in enumerate(headers)], 28),
    ]
    for row_offset, record in enumerate(actions, start=5):
        cells = []
        for column_index, header in enumerate(headers):
            value = record.get(header, "")
            style = _action_style(header, value, record)
            cells.append(_xlsx_cell(f"{_column_name(column_index)}{row_offset}", value, style, not isinstance(value, (int, float))))
        rows.append(_xlsx_row(row_offset, cells, 24))
    widths = []
    for index, header in enumerate(headers):
        values = [str(record.get(header, "")) for record in actions[:250]]
        width = min(42, max(12, len(header) + 2, *(min(42, len(value) + 2) for value in values)))
        widths.append(f'<col min="{index + 1}" max="{index + 1}" width="{width}" customWidth="1"/>')
    merges = [f"A1:{last_col}1", f"A2:{last_col}2"] if len(headers) > 1 else []
    last_row = 4 + len(actions)
    merge_xml = f'<mergeCells count="{len(merges)}">{"".join(f"<mergeCell ref=\"{value}\"/>" for value in merges)}</mergeCells>' if merges else ""
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<dimension ref="A1:{last_col}{last_row}"/><sheetViews><sheetView showGridLines="0" workbookViewId="0"><pane ySplit="4" topLeftCell="A5" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>
<sheetFormatPr defaultRowHeight="18"/><cols>{''.join(widths)}</cols><sheetData>{''.join(rows)}</sheetData>{merge_xml}
<autoFilter ref="A4:{last_col}{last_row}"/><pageMargins left="0.25" right="0.25" top="0.5" bottom="0.5" header="0.2" footer="0.2"/><pageSetup orientation="landscape" fitToWidth="1" fitToHeight="0" paperSize="1"/>
</worksheet>'''


def _styles_xml() -> str:
    return '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<numFmts count="3"><numFmt numFmtId="164" formatCode="$#,##0.00;[Red]-$#,##0.00"/><numFmt numFmtId="165" formatCode="0.00%"/><numFmt numFmtId="166" formatCode="0.00&quot;%&quot;"/></numFmts>
<fonts count="7">
<font><sz val="10"/><name val="Arial"/><family val="2"/></font>
<font><b/><sz val="22"/><color rgb="FF0E0E0E"/><name val="Arial"/><family val="2"/></font>
<font><b/><sz val="9"/><color rgb="FF0071E3"/><name val="Arial"/><family val="2"/></font>
<font><sz val="10"/><color rgb="FF5A5A5A"/><name val="Arial"/><family val="2"/></font>
<font><b/><sz val="9"/><color rgb="FF5A5A5A"/><name val="Arial"/><family val="2"/></font>
<font><b/><sz val="18"/><color rgb="FF0058B0"/><name val="Arial"/><family val="2"/></font>
<font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Arial"/><family val="2"/></font>
</fonts>
<fills count="9"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF0071E3"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFEAF3FC"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FF0E0E0E"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF6F8FA"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFFE7E7"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFFF4D6"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFFFFFF"/><bgColor indexed="64"/></patternFill></fill></fills>
<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color rgb="FFE3E3E3"/></left><right style="thin"><color rgb="FFE3E3E3"/></right><top style="thin"><color rgb="FFE3E3E3"/></top><bottom style="thin"><color rgb="FFE3E3E3"/></bottom><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="20">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="center"/></xf>
<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="center"/></xf>
<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="4" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>
<xf numFmtId="0" fontId="5" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>
<xf numFmtId="0" fontId="6" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center"/></xf>
<xf numFmtId="0" fontId="6" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="0" fillId="8" borderId="1" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
<xf numFmtId="3" fontId="0" fillId="8" borderId="1" xfId="0" applyNumberFormat="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>
<xf numFmtId="164" fontId="0" fillId="8" borderId="1" xfId="0" applyNumberFormat="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>
<xf numFmtId="165" fontId="0" fillId="8" borderId="1" xfId="0" applyNumberFormat="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>
<xf numFmtId="14" fontId="0" fillId="8" borderId="1" xfId="0" applyNumberFormat="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center"/></xf>
<xf numFmtId="0" fontId="0" fillId="6" borderId="1" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="0" fillId="7" borderId="1" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="0" fillId="3" borderId="1" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="3" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="0" fillId="3" borderId="1" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="0" fillId="8" borderId="1" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1" quotePrefix="1"><alignment vertical="center" wrapText="1"/></xf>
<xf numFmtId="166" fontId="0" fillId="8" borderId="1" xfId="0" applyNumberFormat="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>
</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles><dxfs count="0"/><tableStyles count="0" defaultTableStyle="TableStyleMedium2" defaultPivotStyle="PivotStyleLight16"/>
</styleSheet>'''


def _write_action_xlsx(
    path: Path,
    model: dict[str, Any],
    actions: list[dict[str, Any]],
    sources: list[dict[str, Any]],
    generated_at: str,
) -> None:
    dashboard = _dashboard_sheet(model, sources, generated_at)
    action_sheet = _action_sheet(actions, model["title"] + " - Action List")
    content_types = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>'''
    root_rels = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>'''
    workbook = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><bookViews><workbookView activeTab="0"/></bookViews><sheets><sheet name="Dashboard" sheetId="1" r:id="rId1"/><sheet name="Action List" sheetId="2" r:id="rId2"/></sheets><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>'''
    workbook_rels = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'''
    created = generated_at.replace("+00:00", "Z")
    core = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>{_xml_text(model['title'])}</dc:title><dc:creator>Standard Playbook</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">{created}</dcterms:created></cp:coreProperties>'''
    app = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Standard Playbook Agency Intelligence</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop><HeadingPairs><vt:vector size="2" baseType="variant"><vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant><vt:variant><vt:i4>2</vt:i4></vt:variant></vt:vector></HeadingPairs><TitlesOfParts><vt:vector size="2" baseType="lpstr"><vt:lpstr>Dashboard</vt:lpstr><vt:lpstr>Action List</vt:lpstr></vt:vector></TitlesOfParts></Properties>'''
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("[Content_Types].xml", content_types)
        archive.writestr("_rels/.rels", root_rels)
        archive.writestr("docProps/core.xml", core)
        archive.writestr("docProps/app.xml", app)
        archive.writestr("xl/workbook.xml", workbook)
        archive.writestr("xl/_rels/workbook.xml.rels", workbook_rels)
        archive.writestr("xl/styles.xml", _styles_xml())
        archive.writestr("xl/worksheets/sheet1.xml", dashboard)
        archive.writestr("xl/worksheets/sheet2.xml", action_sheet)


def write_presentation_artifacts(
    mode: str,
    summary: dict[str, Any],
    actions: list[dict[str, Any]],
    sources: list[dict[str, Any]],
    output: Path,
    generated_at: str,
    pack_version: str,
) -> None:
    model = build_report_model(mode, summary, actions)
    (output / "OWNER-REPORT.html").write_text(
        _html_report(model, sources, generated_at, pack_version),
        encoding="utf-8",
    )
    (output / "OWNER-REPORT.pdf").write_bytes(
        _pdf_report(model, sources, generated_at, pack_version)
    )
    _write_action_xlsx(
        output / "ACTION-LIST.xlsx", model, actions, sources, generated_at
    )
