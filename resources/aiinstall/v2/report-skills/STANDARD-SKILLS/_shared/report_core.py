#!/usr/bin/env python3
"""Local, dependency-free analyzers for Standard agency report skills."""

from __future__ import annotations

import argparse
import ast
import csv
import hashlib
import json
import re
import sys
import tempfile
import zipfile
from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Iterable
from xml.etree import ElementTree as ET

from report_artifacts import ARTIFACT_NAMES, SKILL_TITLES, write_presentation_artifacts

PACK_VERSION = "1.2.0"
MODES = {
    "agency-quote-conversion",
    "agency-retention-rescue",
    "agency-commission-audit",
    "agency-owner-review",
    "agency-cross-sell",
}

ALIASES = {
    "agentnumber": "agent_number",
    "agent": "agent_number",
    "subproducer": "sub_producer",
    "subproducername": "sub_producer_name",
    "quotecontrolnumber": "quote_control_number",
    "customerfirstname": "customer_first_name",
    "customerlastname": "customer_last_name",
    "customername": "customer_name",
    "customerstreetaddress": "customer_street_address",
    "customercity": "customer_city",
    "customerstate": "customer_state",
    "customerzipcode": "customer_zip",
    "productiondate": "production_date",
    "product": "product",
    "quoteditemcount": "quoted_item_count",
    "quotedpremium": "quoted_premium",
    "issuedpolicy": "issued_policy_number",
    "issuedpolicynumber": "issued_policy_number",
    "issuedpolicyno": "issued_policy_number",
    "boundpolicy": "issued_policy_number",
    "boundpolicynumber": "issued_policy_number",
    "quotesstatus": "quote_status",
    "quotestatus": "quote_status",
    "scenarioname": "scenario_name",
    "policynumber": "policy_number",
    "policyno": "policy_number",
    "primaryinsured": "primary_insured",
    "policybundletype": "policy_bundle_type",
    "writtenpremium": "written_premium",
    "premiumretained": "premium_retained_pct",
    "commissionablepremium": "commissionable_premium",
    "basecommissionamount": "base_commission",
    "vcpremium": "vc_premium",
    "vcamount": "vc_commission",
    "totalcommission": "total_commission",
    "origeffdate": "original_effective_date",
    "state": "state",
    "agenttype": "agent_type",
    "indicator": "indicator",
    "insuredfirstname": "insured_first_name",
    "insuredlastname": "insured_last_name",
    "phonenumber": "phone",
    "email": "email",
    "renewaleffectivedate": "renewal_effective_date",
    "linecode": "line_code",
    "originalyear": "original_year",
    "terminationeffectivedate": "termination_effective_date",
    "terminationreason": "termination_reason",
    "premiumnew": "premium_new",
    "premiumold": "premium_old",
    "numberofitems": "number_of_items",
    "policytype": "policy_type",
    "issueddate": "issued_date",
    "datewritten": "date_written",
    "linegroup": "line_group",
    "productdescription": "product_description",
    "package": "package",
    "transactiontype": "transaction_type",
    "itemcount": "item_count",
    "dispositioncode": "disposition_code",
    "businessmetrics": "business_metrics",
    "totalpersonallines": "total_personal_lines",
    "totalpropertycasualty": "total_property_casualty",
}

BUILTIN_XLSX_DATE_FORMAT_IDS = {
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    45,
    46,
    47,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
}
FORMULA_PREFIXES = ("=", "+", "-", "@")
OUTPUT_NAMES = {
    "summary.json",
    "action-list.csv",
    "run-manifest.json",
    *ARTIFACT_NAMES,
}

SCHEMAS = {
    "quote": {
        "required": {"production_date", "product", "quoted_premium"},
        "signals": {
            "quote_control_number",
            "issued_policy_number",
            "quote_status",
            "quoted_item_count",
        },
    },
    "termination": {
        "required": {"policy_number", "termination_reason", "termination_effective_date"},
        "signals": {"premium_new", "premium_old", "phone", "email"},
    },
    "commission": {
        "required": {"policy_number", "commissionable_premium", "total_commission"},
        "signals": {"base_commission", "vc_commission", "policy_bundle_type"},
    },
    "new_business": {
        "required": {"policy_number", "issued_date", "written_premium"},
        "signals": {"disposition_code", "transaction_type", "item_count"},
    },
    "business_metrics": {
        "required": {"business_metrics"},
        "signals": {"total_personal_lines", "total_property_casualty"},
    },
}


def normalize(value: Any) -> str:
    return re.sub(r"[^a-z0-9]+", "", text(value).lower())


def canonical_header(value: Any) -> str:
    normalized = normalize(value)
    return ALIASES.get(normalized, normalized or "blank")


def text(value: Any) -> str:
    if value is None:
        return ""
    return str(value).strip()


def number(value: Any) -> float:
    if value is None or value == "":
        return 0.0
    if isinstance(value, (int, float)):
        return float(value)
    raw = text(value)
    negative = raw.startswith("(") and raw.endswith(")")
    cleaned = re.sub(r"[$,%(),\s]", "", raw)
    try:
        parsed = float(cleaned)
    except ValueError:
        return 0.0
    return -parsed if negative else parsed


def rounded(value: float, digits: int = 2) -> float:
    return round(float(value), digits)


def file_hash(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def column_index(reference: str) -> int:
    letters = re.match(r"[A-Z]+", reference.upper())
    if not letters:
        return 0
    result = 0
    for char in letters.group(0):
        result = result * 26 + ord(char) - 64
    return result - 1


def xlsx_shared_strings(archive: zipfile.ZipFile) -> list[str]:
    try:
        root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
    except KeyError:
        return []
    values: list[str] = []
    for item in root.findall("{*}si"):
        values.append("".join(node.text or "" for node in item.findall(".//{*}t")))
    return values


def xlsx_sheet_paths(archive: zipfile.ZipFile) -> list[tuple[str, str]]:
    workbook = ET.fromstring(archive.read("xl/workbook.xml"))
    relationships = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
    targets = {
        rel.attrib["Id"]: rel.attrib["Target"]
        for rel in relationships.findall("{*}Relationship")
    }
    result: list[tuple[str, str]] = []
    for sheet in workbook.findall(".//{*}sheet"):
        relation_id = sheet.attrib.get(
            "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id",
            "",
        )
        target = targets.get(relation_id, "")
        if not target:
            continue
        if target.startswith("/"):
            path = target.lstrip("/")
        elif target.startswith("xl/"):
            path = target
        else:
            path = f"xl/{target.lstrip('/')}"
        result.append((sheet.attrib.get("name", "Sheet"), path))
    return result


def xlsx_uses_1904_dates(archive: zipfile.ZipFile) -> bool:
    workbook = ET.fromstring(archive.read("xl/workbook.xml"))
    properties = workbook.find("{*}workbookPr")
    if properties is None:
        return False
    return properties.attrib.get("date1904", "").strip().lower() in {"1", "true"}


def xlsx_number_format_is_date(format_code: str) -> bool:
    cleaned = re.sub(r'"[^"]*"', "", format_code.lower())
    cleaned = re.sub(r"\\.", "", cleaned)
    cleaned = re.sub(r"_.|\*.", "", cleaned)
    cleaned = re.sub(r"\[(?!h+\]|m+\]|s+\])[^]]*\]", "", cleaned)
    return bool(re.search(r"(?:y+|d+|h+|s+|am/pm|a/p)", cleaned))


def xlsx_date_style_indexes(archive: zipfile.ZipFile) -> set[int]:
    try:
        root = ET.fromstring(archive.read("xl/styles.xml"))
    except KeyError:
        return set()
    custom_formats: dict[int, str] = {}
    for node in root.findall(".//{*}numFmts/{*}numFmt"):
        try:
            custom_formats[int(node.attrib["numFmtId"])] = node.attrib.get("formatCode", "")
        except (KeyError, ValueError):
            continue
    result: set[int] = set()
    cell_formats = root.find("{*}cellXfs")
    if cell_formats is None:
        return result
    for index, cell_format in enumerate(cell_formats.findall("{*}xf")):
        try:
            format_id = int(cell_format.attrib.get("numFmtId", "0"))
        except ValueError:
            continue
        if format_id in BUILTIN_XLSX_DATE_FORMAT_IDS or xlsx_number_format_is_date(
            custom_formats.get(format_id, "")
        ):
            result.add(index)
    return result


def excel_serial_to_iso(value: float, date_1904: bool) -> str:
    if date_1904:
        converted = datetime(1904, 1, 1) + timedelta(days=value)
    else:
        whole_days = int(value)
        if whole_days == 60:
            fraction = value - whole_days
            if fraction == 0:
                return "1900-02-29"
            seconds = round(fraction * 86400)
            hours, remainder = divmod(seconds, 3600)
            minutes, seconds = divmod(remainder, 60)
            return f"1900-02-29T{hours:02d}:{minutes:02d}:{seconds:02d}"
        adjusted = value - (1 if value >= 60 else 0)
        converted = datetime(1899, 12, 31) + timedelta(days=adjusted)
    if converted.time() == datetime.min.time():
        return converted.date().isoformat()
    return converted.isoformat(timespec="seconds")


def xlsx_cell_value(
    cell: ET.Element,
    shared_strings: list[str],
    date_style_indexes: set[int],
    date_1904: bool,
) -> Any:
    cell_type = cell.attrib.get("t", "")
    if cell_type == "inlineStr":
        return "".join(node.text or "" for node in cell.findall(".//{*}t"))
    value_node = cell.find("{*}v")
    if value_node is None or value_node.text is None:
        return ""
    raw = value_node.text
    if cell_type == "s":
        try:
            return shared_strings[int(raw)]
        except (ValueError, IndexError):
            return raw
    if cell_type in {"str", "e"}:
        return raw
    if cell_type == "b":
        return raw == "1"
    try:
        parsed = float(raw)
        try:
            style_index = int(cell.attrib.get("s", "0"))
        except ValueError:
            style_index = 0
        if style_index in date_style_indexes:
            return excel_serial_to_iso(parsed, date_1904)
        return int(parsed) if parsed.is_integer() else parsed
    except ValueError:
        return raw


def load_xlsx(path: Path) -> list[dict[str, Any]]:
    sheets: list[dict[str, Any]] = []
    with zipfile.ZipFile(path) as archive:
        shared_strings = xlsx_shared_strings(archive)
        date_style_indexes = xlsx_date_style_indexes(archive)
        date_1904 = xlsx_uses_1904_dates(archive)
        for sheet_name, sheet_path in xlsx_sheet_paths(archive):
            try:
                root = ET.fromstring(archive.read(sheet_path))
            except KeyError:
                continue
            rows: list[list[Any]] = []
            for row_node in root.findall(".//{*}sheetData/{*}row"):
                values: list[Any] = []
                for cell in row_node.findall("{*}c"):
                    index = column_index(cell.attrib.get("r", "A1"))
                    if len(values) <= index:
                        values.extend([""] * (index + 1 - len(values)))
                    values[index] = xlsx_cell_value(
                        cell,
                        shared_strings,
                        date_style_indexes,
                        date_1904,
                    )
                rows.append(values)
            sheets.append({"name": sheet_name, "rows": rows})
    return sheets


def load_delimited(path: Path) -> list[dict[str, Any]]:
    delimiter = "\t" if path.suffix.lower() == ".tsv" else ","
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        sample = handle.read(4096)
        handle.seek(0)
        try:
            delimiter = csv.Sniffer().sniff(sample, delimiters=",\t;|").delimiter
        except csv.Error:
            pass
        rows = [list(row) for row in csv.reader(handle, delimiter=delimiter)]
    return [{"name": path.stem, "rows": rows}]


def load_sheets(path: Path) -> list[dict[str, Any]]:
    suffix = path.suffix.lower()
    if suffix == ".xlsx":
        return load_xlsx(path)
    if suffix in {".csv", ".tsv"}:
        return load_delimited(path)
    raise ValueError(f"Unsupported report format: {path.name}. Use .xlsx, .csv, or .tsv.")


def detect_schema(headers: list[str]) -> tuple[str | None, int]:
    present = set(headers)
    best_type: str | None = None
    best_score = 0
    for report_type, schema in SCHEMAS.items():
        if not schema["required"].issubset(present):
            continue
        score = len(schema["required"]) * 10 + len(schema["signals"] & present)
        if score > best_score:
            best_type = report_type
            best_score = score
    return best_type, best_score


def extract_tables(path: Path) -> list[dict[str, Any]]:
    tables: list[dict[str, Any]] = []
    for sheet in load_sheets(path):
        best: dict[str, Any] | None = None
        for index, row in enumerate(sheet["rows"][:40]):
            headers = [canonical_header(value) for value in row]
            report_type, score = detect_schema(headers)
            if report_type and (best is None or score > best["score"]):
                best = {
                    "report_type": report_type,
                    "score": score,
                    "header_index": index,
                    "headers": headers,
                    "raw_headers": [text(value) for value in row],
                }
        if best is None:
            continue
        records: list[dict[str, Any]] = []
        for raw_row in sheet["rows"][best["header_index"] + 1 :]:
            record: dict[str, Any] = {}
            for column, header in enumerate(best["headers"]):
                if header == "blank" or header in record:
                    continue
                record[header] = raw_row[column] if column < len(raw_row) else ""
            if any(text(value) for value in record.values()):
                records.append(record)
        tables.append(
            {
                "source": path,
                "sheet": sheet["name"],
                "header_row": best["header_index"] + 1,
                "report_type": best["report_type"],
                "available_fields": [
                    header for header in best["headers"] if header != "blank"
                ],
                "records": records,
            }
        )
    return tables


def top_counts(values: Iterable[str], limit: int = 12) -> list[dict[str, Any]]:
    counter = Counter(value or "(blank)" for value in values)
    return [{"label": label, "count": count} for label, count in counter.most_common(limit)]


def distinct_text(records: list[dict[str, Any]], field: str) -> list[str]:
    return list(dict.fromkeys(value for record in records if (value := text(record.get(field)))))


def group_quote_records(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    grouped: dict[tuple[str, str], dict[str, Any]] = {}
    for row_index, record in enumerate(records, start=1):
        quote_id = text(record.get("quote_control_number"))
        key = ("quote", quote_id) if quote_id else ("row-fallback", str(row_index))
        if key not in grouped:
            grouped[key] = {
                "quote_control_number": quote_id,
                "used_row_fallback": not bool(quote_id),
                "records": [],
            }
        grouped[key]["records"].append(record)
    for group in grouped.values():
        group["bound"] = any(quote_record_is_bound(record) for record in group["records"])
        group["quoted_items"] = sum(
            number(record.get("quoted_item_count")) for record in group["records"]
        )
        group["quoted_premium"] = sum(
            number(record.get("quoted_premium")) for record in group["records"]
        )
    return list(grouped.values())


def quote_record_is_bound(record: dict[str, Any]) -> bool:
    if text(record.get("issued_policy_number")):
        return True
    status_words = set(
        re.sub(r"[^a-z0-9]+", " ", text(record.get("quote_status")).lower()).split()
    )
    return bool(status_words & {"bound", "issued"}) and "unbound" not in status_words


def quote_scorecard(
    quote_groups: list[dict[str, Any]],
    field: str,
    conversion_available: bool,
) -> list[dict[str, Any]]:
    scorecard: dict[str, dict[str, float]] = defaultdict(
        lambda: {"quotes": 0, "bound": 0, "quoted_items": 0, "quoted_premium": 0}
    )
    for quote_group in quote_groups:
        records = quote_group["records"]
        labels = distinct_text(records, field) or ["(blank)"]
        for label in labels:
            matching = [
                record
                for record in records
                if (text(record.get(field)) or "(blank)") == label
            ]
            values = scorecard[label]
            values["quotes"] += 1
            values["bound"] += 1 if quote_group["bound"] else 0
            values["quoted_items"] += sum(
                number(record.get("quoted_item_count")) for record in matching
            )
            values["quoted_premium"] += sum(
                number(record.get("quoted_premium")) for record in matching
            )
    result: list[dict[str, Any]] = []
    for label, values in scorecard.items():
        quotes = int(values["quotes"])
        bound = int(values["bound"]) if conversion_available else None
        result.append(
            {
                "label": label,
                "quotes": quotes,
                "bound": bound,
                "conversion_rate": (
                    rounded(values["bound"] / quotes, 4)
                    if conversion_available and quotes
                    else None
                ),
                "quoted_items": int(values["quoted_items"]),
                "quoted_premium": rounded(values["quoted_premium"]),
            }
        )
    return sorted(result, key=lambda item: (-item["quotes"], item["label"]))


def joined_quote_context(records: list[dict[str, Any]], field: str) -> str:
    return " | ".join(distinct_text(records, field))


def analyze_quote(tables: list[dict[str, Any]]) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    quote_tables = [table for table in tables if table["report_type"] == "quote"]
    records = [record for table in quote_tables for record in table["records"]]
    if not records:
        raise ValueError("No quote-detail table was recognized in the supplied files.")
    records = [record for record in records if text(record.get("product"))]
    quote_groups = group_quote_records(records)
    bound_fields = {"issued_policy_number", "quote_status"}
    bound_field_present = all(
        bool(bound_fields & set(table.get("available_fields", []))) for table in quote_tables
    )
    bound_signal_values_observed = any(
        text(record.get(field))
        for record in records
        for field in bound_fields
    )
    conversion_available = bound_field_present and bound_signal_values_observed
    bound_groups = [group for group in quote_groups if group["bound"]]
    open_groups = [group for group in quote_groups if not group["bound"]]
    actions: list[dict[str, Any]] = []
    if conversion_available:
        for quote_group in open_groups:
            premium = quote_group["quoted_premium"]
            priority = "High" if premium >= 2000 else "Medium" if premium >= 1000 else "Standard"
            grouped_records = quote_group["records"]
            actions.append(
                {
                    "priority": priority,
                    "producer": joined_quote_context(grouped_records, "sub_producer"),
                    "customer_first_name": joined_quote_context(
                        grouped_records, "customer_first_name"
                    ),
                    "customer_last_name": joined_quote_context(
                        grouped_records, "customer_last_name"
                    ),
                    "production_date": joined_quote_context(grouped_records, "production_date"),
                    "product": joined_quote_context(grouped_records, "product"),
                    "product_count": len(distinct_text(grouped_records, "product")),
                    "quoted_items": int(quote_group["quoted_items"]),
                    "quoted_premium": rounded(premium),
                    "quote_control_number": quote_group["quote_control_number"],
                    "quote_identity": (
                        "Quote Control Number"
                        if not quote_group["used_row_fallback"]
                        else "Row-level fallback; Quote Control Number missing"
                    ),
                    "city": joined_quote_context(grouped_records, "customer_city"),
                    "state": joined_quote_context(grouped_records, "customer_state"),
                    "status": "Unbound in supplied export",
                }
            )
        actions.sort(key=lambda item: (-item["quoted_premium"], item["production_date"]))
    missing_ids = sum(1 for group in quote_groups if group["used_row_fallback"])
    limitations: list[str] = []
    if missing_ids:
        limitations.append(
            f"{missing_ids} row(s) lacked Quote Control Number and were counted individually using the documented row-level fallback."
        )
    if not bound_field_present:
        limitations.append(
            "No Issued Policy # or equivalent bound field was present in every quote table. "
            "Bound count, unbound count, conversion rate, unbound premium, and the follow-up queue are unavailable; use a conversion-capable export."
        )
    elif not bound_signal_values_observed:
        limitations.append(
            "The supplied bound field contained no usable values, so a true 0% conversion cannot be distinguished from a nonpopulated export. "
            "Bound count, unbound count, conversion rate, unbound premium, and the follow-up queue are unavailable; use an export with populated issued-policy or quote-status signals."
        )
    summary = {
        "quote_rows": len(records),
        "serious_quotes": len(quote_groups),
        "unique_quote_control_numbers": len(quote_groups) - missing_ids,
        "missing_quote_control_number_rows": missing_ids,
        "quote_count_method": "Unique Quote Control Number; each missing ID row is a separate fallback quote.",
        "bound_signal_field_present": bound_field_present,
        "bound_signal_values_observed": bound_signal_values_observed,
        "conversion_available": conversion_available,
        "bound_quotes": len(bound_groups) if conversion_available else None,
        "unbound_quotes": len(open_groups) if conversion_available else None,
        "conversion_rate": (
            rounded(len(bound_groups) / len(quote_groups), 4)
            if conversion_available and quote_groups
            else None
        ),
        "quoted_items": int(sum(group["quoted_items"] for group in quote_groups)),
        "quoted_premium": rounded(sum(group["quoted_premium"] for group in quote_groups)),
        "unbound_quoted_premium": (
            rounded(sum(group["quoted_premium"] for group in open_groups))
            if conversion_available
            else None
        ),
        "by_producer": quote_scorecard(
            quote_groups, "sub_producer", conversion_available
        ),
        "by_product": quote_scorecard(quote_groups, "product", conversion_available),
        "product_scorecard_basis": (
            "Product participation by unique quote. A multi-product quote appears once in each product it includes, "
            "and is bound for every included product when any row in that quote has an issued-policy signal. "
            "Product quote counts therefore may exceed and need not sum to the overall unique-quote count."
        ),
        "limitations": limitations,
        "interpretation_guardrail": "Quoted premium is opportunity volume, not expected revenue.",
    }
    return summary, actions


def cancellation_category(reason: str) -> str:
    phrase = re.sub(r"[^a-z0-9]+", " ", reason.lower()).strip()
    words = set(phrase.split())
    if (
        re.search(r"\bnon\s+pay(?:ment)?\b", phrase)
        or "payment" in words
        or re.search(r"\bnon\s+sufficient\s+funds\b", phrase)
    ):
        return "Payment rescue"
    explicit_price_word = bool(words & {"price", "pricing", "rate", "rates"})
    premium_increase = bool(re.search(r"\bpremium(?: amount)?\s+increas(?:e|ed|es|ing)\b", phrase))
    premium_dissatisfaction = "premium" in words and any(
        word.startswith("dissatisf") for word in words
    )
    if explicit_price_word or premium_increase or premium_dissatisfaction:
        return "Price conversation"
    if "sold" in words or "deceased" in words or re.search(
        r"\bmoving\s+out\s+of\s+state\b", phrase
    ):
        return "Likely non-saveable"
    return "Owner review"


def analyze_retention(tables: list[dict[str, Any]]) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    records = [record for table in tables if table["report_type"] == "termination" for record in table["records"]]
    if not records:
        raise ValueError("No termination-audit table was recognized in the supplied files.")
    records = [record for record in records if text(record.get("policy_number"))]
    actions: list[dict[str, Any]] = []
    categories: list[str] = []
    for record in records:
        reason = text(record.get("termination_reason"))
        category = cancellation_category(reason)
        categories.append(category)
        premium = number(record.get("premium_new"))
        contactable = bool(text(record.get("phone")) or text(record.get("email")))
        if category in {"Payment rescue", "Price conversation"} and contactable:
            priority = "High" if premium >= 2000 else "Medium"
        elif category == "Likely non-saveable":
            priority = "Low"
        else:
            priority = "Standard"
        actions.append(
            {
                "priority": priority,
                "category": category,
                "insured_first_name": text(record.get("insured_first_name")),
                "insured_last_name": text(record.get("insured_last_name")),
                "phone": text(record.get("phone")),
                "email": text(record.get("email")),
                "policy_number": text(record.get("policy_number")),
                "line_code": text(record.get("line_code")),
                "termination_effective_date": text(record.get("termination_effective_date")),
                "termination_reason": reason,
                "premium_new": rounded(premium),
                "premium_old": rounded(number(record.get("premium_old"))),
                "premium_change": rounded(premium - number(record.get("premium_old"))),
                "contactable": "Yes" if contactable else "No",
            }
        )
    priority_rank = {"High": 0, "Medium": 1, "Standard": 2, "Low": 3}
    actions.sort(key=lambda item: (priority_rank[item["priority"]], -item["premium_new"]))
    premium_new = sum(number(record.get("premium_new")) for record in records)
    premium_old = sum(number(record.get("premium_old")) for record in records)
    summary = {
        "terminations": len(records),
        "premium_new": rounded(premium_new),
        "premium_old": rounded(premium_old),
        "premium_change": rounded(premium_new - premium_old),
        "category_counts": top_counts(categories),
        "top_reasons": top_counts((text(record.get("termination_reason")) for record in records), 20),
        "line_counts": top_counts((text(record.get("line_code")) for record in records), 15),
        "with_phone_and_email": sum(
            1 for record in records if text(record.get("phone")) and text(record.get("email"))
        ),
        "interpretation_guardrail": "This is a review queue, not permission to contact customers or confirm coverage.",
    }
    return summary, actions


def money_group(records: list[dict[str, Any]], field: str, value_field: str) -> list[dict[str, Any]]:
    groups: dict[str, dict[str, float]] = defaultdict(lambda: {"rows": 0, "amount": 0})
    for record in records:
        key = text(record.get(field)) or "(blank)"
        groups[key]["rows"] += 1
        groups[key]["amount"] += number(record.get(value_field))
    return sorted(
        [
            {"label": label, "rows": int(values["rows"]), "amount": rounded(values["amount"])}
            for label, values in groups.items()
        ],
        key=lambda item: (-item["amount"], item["label"]),
    )


def analyze_commission(tables: list[dict[str, Any]]) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    records = [record for table in tables if table["report_type"] == "commission" for record in table["records"]]
    if not records:
        raise ValueError("No policy-level commission table was recognized in the supplied files.")
    records = [record for record in records if text(record.get("policy_number")) and not text(record.get("policy_number")).lower().startswith("total")]
    actions: list[dict[str, Any]] = []
    negative_rows = 0
    zero_review_rows = 0
    rate_review_rows = 0
    for record in records:
        written = number(record.get("written_premium"))
        commissionable = number(record.get("commissionable_premium"))
        total = number(record.get("total_commission"))
        effective_rate = total / commissionable if commissionable else None
        flags: list[str] = []
        if total < 0:
            flags.append("Negative commission or chargeback review")
            negative_rows += 1
        if written != 0 and total == 0:
            flags.append("Nonzero written premium with zero total commission")
            zero_review_rows += 1
        if effective_rate is not None and abs(effective_rate) > 0.20:
            flags.append("Effective commission rate outside 20% review threshold")
            rate_review_rows += 1
        if not flags:
            continue
        actions.append(
            {
                "review_reason": "; ".join(flags),
                "policy_number": text(record.get("policy_number")),
                "primary_insured": text(record.get("primary_insured")),
                "product": text(record.get("product")),
                "bundle_type": text(record.get("policy_bundle_type")),
                "written_premium": rounded(written),
                "commissionable_premium": rounded(commissionable),
                "base_commission": rounded(number(record.get("base_commission"))),
                "vc_commission": rounded(number(record.get("vc_commission"))),
                "total_commission": rounded(total),
                "effective_commission_rate": rounded(effective_rate, 4) if effective_rate is not None else "",
                "indicator": text(record.get("indicator")),
            }
        )
    actions.sort(key=lambda item: (-abs(number(item["total_commission"])), item["policy_number"]))
    written_total = sum(number(record.get("written_premium")) for record in records)
    commissionable_total = sum(number(record.get("commissionable_premium")) for record in records)
    commission_total = sum(number(record.get("total_commission")) for record in records)
    summary = {
        "policy_rows": len(records),
        "written_premium": rounded(written_total),
        "commissionable_premium": rounded(commissionable_total),
        "base_commission": rounded(sum(number(record.get("base_commission")) for record in records)),
        "vc_commission": rounded(sum(number(record.get("vc_commission")) for record in records)),
        "total_commission": rounded(commission_total),
        "effective_commission_rate": rounded(commission_total / commissionable_total, 4) if commissionable_total else 0,
        "negative_commission_rows": negative_rows,
        "nonzero_premium_zero_commission_rows": zero_review_rows,
        "rate_review_rows": rate_review_rows,
        "by_product": money_group(records, "product", "total_commission")[:20],
        "by_bundle_type": money_group(records, "policy_bundle_type", "total_commission")[:12],
        "interpretation_guardrail": "Exceptions require the agency's carrier schedules before concluding that a payment is wrong.",
    }
    return summary, actions


METRIC_SECTIONS = {
    "cappeditemsinforce": "Capped Items in Force",
    "policiesinforce": "Policies in Force",
    "policyretention": "Policy Retention",
    "tenureretention": "Tenure Retention",
    "writtenandadvancedpremium": "Written and Advanced Premium",
    "writtenandadvancepremium12mm": "Written and Advance Premium - 12MM",
    "adjustedpaidlossratio": "Adjusted Paid Loss Ratio",
}


def business_metric_records(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    section = "General"
    result: list[dict[str, Any]] = []
    for record in records:
        label = text(record.get("business_metrics"))
        normalized = normalize(label)
        if normalized in METRIC_SECTIONS:
            section = METRIC_SECTIONS[normalized]
            continue
        if not label:
            continue
        total = record.get("total_property_casualty")
        if total in {None, ""}:
            total = record.get("total_personal_lines")
        if total in {None, ""}:
            continue
        result.append({"section": section, "metric": label, "total": rounded(number(total), 4)})
    return result


def analyze_owner(tables: list[dict[str, Any]]) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    metric_rows = [record for table in tables if table["report_type"] == "business_metrics" for record in table["records"]]
    new_business = [record for table in tables if table["report_type"] == "new_business" for record in table["records"]]
    if not metric_rows and not new_business:
        raise ValueError("No business-metrics or new-business table was recognized in the supplied files.")
    metrics = business_metric_records(metric_rows)
    summary: dict[str, Any] = {
        "business_metrics": metrics,
        "interpretation_guardrail": "Use report-defined periods and labels; do not infer goals or carrier thresholds that were not supplied.",
    }
    if new_business:
        valid = [record for record in new_business if text(record.get("policy_number"))]
        summary["new_business"] = {
            "rows": len(valid),
            "unique_policies": len({text(record.get("policy_number")) for record in valid}),
            "items": int(sum(number(record.get("item_count")) for record in valid)),
            "written_premium": rounded(sum(number(record.get("written_premium")) for record in valid)),
            "new_policy_rows": sum(1 for record in valid if "new policy" in text(record.get("disposition_code")).lower()),
            "add_item_rows": sum(1 for record in valid if "add item" in text(record.get("disposition_code")).lower()),
            "by_product": money_group(valid, "product", "written_premium")[:15],
            "by_producer": money_group(valid, "sub_producer_name", "written_premium")[:15],
        }
    actions = [
        {"section": item["section"], "metric": item["metric"], "reported_total": item["total"]}
        for item in metrics
    ]
    return summary, actions


def analyze_cross_sell(tables: list[dict[str, Any]]) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    commission = [record for table in tables if table["report_type"] == "commission" for record in table["records"]]
    new_business = [record for table in tables if table["report_type"] == "new_business" for record in table["records"]]
    if not commission and not new_business:
        raise ValueError("No commission or new-business table was recognized in the supplied files.")
    commission = [
        record
        for record in commission
        if text(record.get("policy_number")) and not text(record.get("policy_number")).lower().startswith("total")
    ]
    monoline = [
        record
        for record in commission
        if text(record.get("policy_bundle_type")).lower() == "monoline"
    ]
    actions = [
        {
            "confidence": "Candidate—verify against full in-force household data",
            "primary_insured": text(record.get("primary_insured")),
            "policy_number": text(record.get("policy_number")),
            "current_product": text(record.get("product")),
            "bundle_type": text(record.get("policy_bundle_type")),
            "written_premium": rounded(number(record.get("written_premium"))),
            "state": text(record.get("state")),
            "review_note": "Confirm all household policies before outreach.",
        }
        for record in monoline
    ]
    actions.sort(key=lambda item: (-abs(item["written_premium"]), item["primary_insured"]))
    valid_new_business = [record for record in new_business if text(record.get("policy_number"))]
    summary = {
        "commission_rows": len(commission),
        "monoline_candidates": len(monoline),
        "bundle_type_counts": top_counts(text(record.get("policy_bundle_type")) for record in commission),
        "new_business_rows": len(valid_new_business),
        "new_business_add_item_rows": sum(
            1 for record in valid_new_business if "add item" in text(record.get("disposition_code")).lower()
        ),
        "new_business_by_product": money_group(valid_new_business, "product", "written_premium")[:15],
        "interpretation_guardrail": "A monthly commission export is not a complete household view. Verify every candidate against full in-force data before outreach.",
    }
    return summary, actions


ANALYZERS = {
    "agency-quote-conversion": analyze_quote,
    "agency-retention-rescue": analyze_retention,
    "agency-commission-audit": analyze_commission,
    "agency-owner-review": analyze_owner,
    "agency-cross-sell": analyze_cross_sell,
}


def csv_safe_value(value: Any) -> Any:
    if value is None or isinstance(value, (int, float, bool)):
        return value
    rendered = str(value)
    if rendered.lstrip().startswith(FORMULA_PREFIXES):
        return "'" + rendered
    return rendered


def write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    if not rows:
        path.write_text("status\nNo action rows generated from the supplied reports.\n", encoding="utf-8")
        return
    headers: list[str] = []
    for row in rows:
        for key in row:
            if key not in headers:
                headers.append(key)
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=headers)
        writer.writeheader()
        writer.writerows(
            {key: csv_safe_value(value) for key, value in row.items()} for row in rows
        )


def requested_output_file(output: Path, name: str) -> Path:
    if name not in OUTPUT_NAMES:
        raise ValueError(f"Undocumented output requested: {name}")
    resolved_output = output.resolve()
    candidate = (resolved_output / name).resolve()
    if candidate.parent != resolved_output:
        raise ValueError(f"Output escaped the requested directory: {candidate}")
    return candidate


def analyze(mode: str, inputs: list[Path], output: Path) -> dict[str, Any]:
    if mode not in MODES:
        raise ValueError(f"Unsupported analysis mode: {mode}")
    tables: list[dict[str, Any]] = []
    sources: list[dict[str, Any]] = []
    source_hashes: dict[Path, str] = {}
    for path in inputs:
        if not path.exists() or not path.is_file():
            raise ValueError(f"Report not found: {path}")
        source_hashes[path] = file_hash(path)
        extracted = extract_tables(path)
        tables.extend(extracted)
        sources.append(
            {
                "file": path.name,
                "sha256": source_hashes[path],
                "recognized_tables": [
                    {
                        "sheet": table["sheet"],
                        "header_row": table["header_row"],
                        "report_type": table["report_type"],
                        "rows": len(table["records"]),
                        "available_fields": table["available_fields"],
                    }
                    for table in extracted
                ],
            }
        )
    summary, actions = ANALYZERS[mode](tables)
    output = output.resolve()
    output.mkdir(parents=True, exist_ok=True)
    generated_at = datetime.now(timezone.utc).isoformat()
    summary_payload = {
        "skill": mode,
        "pack_version": PACK_VERSION,
        "generated_at": generated_at,
        "summary": summary,
    }
    requested_output_file(output, "summary.json").write_text(
        json.dumps(summary_payload, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    write_csv(requested_output_file(output, "action-list.csv"), actions)
    write_presentation_artifacts(
        mode,
        summary,
        actions,
        sources,
        output,
        generated_at,
        PACK_VERSION,
    )
    manifest = {
        "skill": mode,
        "pack_version": PACK_VERSION,
        "generated_at": generated_at,
        "sources": sources,
        "outputs": [
            "OWNER-REPORT.html",
            "OWNER-REPORT.pdf",
            "ACTION-LIST.xlsx",
            "summary.json",
            "action-list.csv",
            "run-manifest.json",
        ],
        "write_scope": str(output),
        "privacy": "All processing and outputs remain local unless the user explicitly moves or sends them.",
    }
    requested_output_file(output, "run-manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    changed_sources = [str(path) for path, digest in source_hashes.items() if file_hash(path) != digest]
    if changed_sources:
        raise RuntimeError(f"Source reports changed during analysis: {changed_sources}")
    return {"output": str(output), "summary": summary, "action_rows": len(actions)}


def default_output(mode: str, inputs: list[Path]) -> Path:
    now = datetime.now()
    return inputs[0].parent / "standard-analysis-runs" / now.strftime("%Y-%m-%d") / f"{mode}-{now.strftime('%H%M%S')}"


def write_fixture(path: Path, headers: list[str], rows: list[list[Any]]) -> None:
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(headers)
        writer.writerows(rows)


def worksheet_column_name(index: int) -> str:
    result = ""
    value = index + 1
    while value:
        value, remainder = divmod(value - 1, 26)
        result = chr(65 + remainder) + result
    return result


def write_xlsx_fixture(
    path: Path,
    headers: list[str],
    rows: list[list[Any]],
    date_cells: set[tuple[int, int]] | None = None,
    date_1904: bool = False,
) -> None:
    spreadsheet_namespace = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
    relationship_namespace = (
        "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
    )
    ET.register_namespace("", spreadsheet_namespace)
    ET.register_namespace("r", relationship_namespace)
    worksheet = ET.Element(f"{{{spreadsheet_namespace}}}worksheet")
    sheet_data = ET.SubElement(worksheet, f"{{{spreadsheet_namespace}}}sheetData")
    for row_number, values in enumerate([headers, *rows], start=1):
        row_node = ET.SubElement(
            sheet_data, f"{{{spreadsheet_namespace}}}row", {"r": str(row_number)}
        )
        for column, value in enumerate(values):
            attributes = {"r": f"{worksheet_column_name(column)}{row_number}"}
            if date_cells and (row_number, column) in date_cells:
                attributes["s"] = "1"
            cell = ET.SubElement(row_node, f"{{{spreadsheet_namespace}}}c", attributes)
            if isinstance(value, (int, float)) and not isinstance(value, bool):
                ET.SubElement(cell, f"{{{spreadsheet_namespace}}}v").text = str(value)
            else:
                cell.attrib["t"] = "inlineStr"
                inline = ET.SubElement(cell, f"{{{spreadsheet_namespace}}}is")
                ET.SubElement(inline, f"{{{spreadsheet_namespace}}}t").text = str(value)

    workbook_properties = ' date1904="1"' if date_1904 else ""
    workbook_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        f'<workbook xmlns="{spreadsheet_namespace}" xmlns:r="{relationship_namespace}">'
        f"<workbookPr{workbook_properties}/><sheets>"
        '<sheet name="Report" sheetId="1" r:id="rId1"/></sheets></workbook>'
    )
    styles_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        f'<styleSheet xmlns="{spreadsheet_namespace}">'
        '<fonts count="1"><font/></fonts><fills count="1"><fill/></fills>'
        '<borders count="1"><border/></borders>'
        '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
        '<cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'
        '<xf numFmtId="14" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs>'
        "</styleSheet>"
    )
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as archive:
        archive.writestr(
            "[Content_Types].xml",
            '<?xml version="1.0" encoding="UTF-8"?>'
            '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
            '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
            '<Default Extension="xml" ContentType="application/xml"/>'
            '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
            '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
            '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
            "</Types>",
        )
        archive.writestr(
            "_rels/.rels",
            '<?xml version="1.0" encoding="UTF-8"?>'
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
            "</Relationships>",
        )
        archive.writestr("xl/workbook.xml", workbook_xml)
        archive.writestr(
            "xl/_rels/workbook.xml.rels",
            '<?xml version="1.0" encoding="UTF-8"?>'
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>'
            '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
            "</Relationships>",
        )
        archive.writestr("xl/styles.xml", styles_xml)
        archive.writestr(
            "xl/worksheets/sheet1.xml",
            ET.tostring(worksheet, encoding="utf-8", xml_declaration=True),
        )


def require_invariant(
    skill: str, invariant: str, condition: bool, detail: str = ""
) -> None:
    if not condition:
        suffix = f": {detail}" if detail else ""
        raise AssertionError(f"{skill} invariant failed — {invariant}{suffix}")


def require_error(
    skill: str,
    invariant: str,
    expected: tuple[type[BaseException], ...],
    expected_text: str,
    operation: Any,
) -> None:
    try:
        operation()
    except expected as error:
        require_invariant(skill, invariant, expected_text in str(error), str(error))
        return
    except BaseException as error:
        raise AssertionError(
            f"{skill} invariant failed — {invariant}: unexpected {type(error).__name__}: {error}"
        ) from error
    raise AssertionError(f"{skill} invariant failed — {invariant}: expected an error")


def read_action_rows(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def self_test() -> None:
    with tempfile.TemporaryDirectory(prefix="standard-agency-skills-") as temp:
        root = Path(temp)
        inputs_root = root / "inputs"
        outputs_root = root / "requested-outputs"
        inputs_root.mkdir()
        quote = inputs_root / "quotes.csv"
        quote_tsv = inputs_root / "quotes.tsv"
        quote_xlsx = inputs_root / "quotes-date.xlsx"
        quote_xlsx_1904 = inputs_root / "quotes-date-1904.xlsx"
        quote_without_bound = inputs_root / "quotes-no-bound.csv"
        quote_with_blank_bound = inputs_root / "quotes-blank-bound.csv"
        termination = inputs_root / "terminations.csv"
        commission = inputs_root / "commissions.csv"
        metrics = inputs_root / "metrics.csv"
        new_business = inputs_root / "new-business.csv"
        quote_headers = [
            "Agent Number",
            "Sub Producer",
            "Quote Control Number",
            "Customer First Name",
            "Customer Last Name",
            "Production Date",
            "Product",
            "Quoted Item Count",
            "Quoted Premium($)",
            "Issued Policy #",
        ]
        quote_rows = [
            ["A1", "101-TEST", "Q1", "A", "Client", "2026-08-01", "Standard Auto", 1, 1500, ""],
            ["A1", "101-TEST", "Q1", "A", "Client", "2026-08-01", "Homeowners", 1, 1000, "P1"],
            ["A1", "102-TEST", "Q2", "B", "Client", "2026-08-27", "Renters", 1, 200, ""],
            ["A1", "103-TEST", "", "C", "Client", "2026-08-04", "Umbrella", 1, 300, ""],
        ]
        write_fixture(
            quote,
            quote_headers,
            quote_rows,
        )
        with quote_tsv.open("w", encoding="utf-8", newline="") as handle:
            writer = csv.writer(handle, delimiter="\t")
            writer.writerow(quote_headers)
            writer.writerows(quote_rows)
        xlsx_rows = [list(row) for row in quote_rows]
        xlsx_rows[2][5] = 46261
        write_xlsx_fixture(
            quote_xlsx,
            quote_headers,
            xlsx_rows,
            date_cells={(4, 5)},
        )
        serial_1904 = (datetime(2026, 8, 27) - datetime(1904, 1, 1)).days
        quote_status_headers = [*quote_headers, "Quote Status"]
        xlsx_1904_rows = [["A1", "104-TEST", "Q1904", "D", "Client", serial_1904, "Condo", 1, 46261, "", "Unbound"]]
        write_xlsx_fixture(
            quote_xlsx_1904,
            quote_status_headers,
            xlsx_1904_rows,
            date_cells={(2, 5)},
            date_1904=True,
        )
        write_fixture(
            quote_without_bound,
            quote_headers[:-1],
            [
                ["A1", "101-TEST", "QX", "A", "Client", "2026-08-01", "Auto", 1, 100],
                ["A1", "101-TEST", "QX", "A", "Client", "2026-08-01", "Home", 1, 200],
                ["A1", "102-TEST", "QY", "B", "Client", "2026-08-02", "Renters", 1, 300],
            ],
        )
        write_fixture(
            quote_with_blank_bound,
            quote_headers,
            [
                ["A1", "101-TEST", "QB1", "A", "Client", "2026-08-01", "Auto", 1, 100, ""],
                ["A1", "102-TEST", "QB2", "B", "Client", "2026-08-02", "Home", 1, 200, ""],
            ],
        )
        write_fixture(
            termination,
            ["Agent Number", "Insured First Name", "Insured Last Name", "Phone Number", "Email", "Policy Number", "Line Code", "Termination Effective Date", "Termination Reason", "Premium New($)", "Premium Old($)"],
            [
                ["A1", "=SUM(1,1)", "Client", "555-0100", "a@example.com", "P1", "Auto", "2026-08-31", "Insured dissatisfied with rate", 2100, 1800],
                ["A1", "+CMD", "Client", "555-0101", "b@example.com", "P2", "Home", "2026-08-31", "Insured dissatisfied with premium amount charged", 900, 800],
                ["A1", "-CMD", "Client", "555-0102", "c@example.com", "P3", "Auto", "2026-08-31", "Customer requested separate policies", 500, 450],
                ["A1", "@CMD", "Client", "555-0103", "d@example.com", "P4", "Home", "2026-08-31", "Separate household account", 400, 350],
            ],
        )
        write_fixture(
            commission,
            ["Product", "Policy Number", "Primary Insured", "Policy Bundle Type", "Written Premium", "Commissionable Premium($)", "Base Commission Amount($)", "VC Amount($)", "Total Commission($)"],
            [["Standard Auto", "P1", "A Client", "Monoline", 1000, 999, 0, 0, 0], ["Homeowners", "P2", "B Client", "Bundled", -200, -190, -10, 0, -10]],
        )
        write_fixture(
            metrics,
            ["Business Metrics", "Total Personal Lines", "Total Property & Casualty"],
            [["Policies in Force", "", ""], ["Current Month", 100, 100], ["PYE", 95, 95]],
        )
        write_fixture(
            new_business,
            ["Agent Number", "Sub-Producer Name", "Policy No", "Issued Date", "Product", "Transaction Type", "Item Count", "Written Premium", "Disposition Code"],
            [
                ["A1", "TEST PRODUCER", "P3", "2026-08-01", "Standard Auto", "New Issued Transaction - First Term", 1, 1200, "New Policy Issued"],
                ["A1", "TEST PRODUCER", "P3", "2026-08-02", "Renters", "Add Item", 1, 200, "Add Item Issued"],
            ],
        )
        cases = {
            "agency-quote-conversion": [quote],
            "agency-retention-rescue": [termination],
            "agency-commission-audit": [commission],
            "agency-owner-review": [metrics, new_business],
            "agency-cross-sell": [commission, new_business],
        }
        results: dict[str, dict[str, Any]] = {}
        for mode, inputs in cases.items():
            hashes_before = {path: file_hash(path) for path in inputs}
            output = outputs_root / mode
            result = analyze(mode, inputs, output)
            results[mode] = result
            require_invariant(
                mode,
                "all six documented outputs",
                {path.name for path in output.iterdir()} == OUTPUT_NAMES,
            )
            manifest = json.loads(
                (output / "run-manifest.json").read_text(encoding="utf-8")
            )
            require_invariant(
                mode,
                "run manifest lists all outputs",
                set(manifest["outputs"]) == OUTPUT_NAMES,
            )
            require_invariant(
                mode,
                "writes stay inside requested output directory",
                all(path.parent == output for path in output.iterdir())
                and Path(manifest["write_scope"]) == output.resolve(),
            )
            require_invariant(
                mode,
                "source-file hashes unchanged",
                all(file_hash(path) == digest for path, digest in hashes_before.items()),
            )
            html_report = (output / "OWNER-REPORT.html").read_text(encoding="utf-8")
            require_invariant(
                mode,
                "branded HTML owner report",
                SKILL_TITLES[mode] in html_report
                and "#0071E3" in html_report
                and "STANDARD PLAYBOOK / AGENCY INTELLIGENCE" in html_report.upper()
                and "<img" not in html_report,
            )
            pdf_report = (output / "OWNER-REPORT.pdf").read_bytes()
            require_invariant(
                mode,
                "printable PDF owner report",
                pdf_report.startswith(b"%PDF-1.4")
                and b"Standard Agency Intelligence Pack" in pdf_report
                and pdf_report.rstrip().endswith(b"%%EOF"),
            )
            with zipfile.ZipFile(output / "ACTION-LIST.xlsx") as action_workbook:
                workbook_names = set(action_workbook.namelist())
                action_sheet_xml = action_workbook.read(
                    "xl/worksheets/sheet2.xml"
                ).decode("utf-8")
            require_invariant(
                mode,
                "formatted XLSX dashboard and action list",
                {
                    "xl/worksheets/sheet1.xml",
                    "xl/worksheets/sheet2.xml",
                    "xl/styles.xml",
                }.issubset(workbook_names)
                and "<autoFilter" in action_sheet_xml
                and "<pane ySplit=\"4\"" in action_sheet_xml
                and "<f>" not in action_sheet_xml,
            )

        quote_summary = results["agency-quote-conversion"]["summary"]
        require_invariant("agency-quote-conversion", "unique serious quote count", quote_summary["serious_quotes"] == 3)
        require_invariant("agency-quote-conversion", "duplicate quote bound by any row", quote_summary["bound_quotes"] == 1)
        require_invariant("agency-quote-conversion", "unique unbound quote count", quote_summary["unbound_quotes"] == 2)
        require_invariant("agency-quote-conversion", "unique quote conversion rate", quote_summary["conversion_rate"] == 0.3333)
        require_invariant("agency-quote-conversion", "quoted premium calculation", quote_summary["quoted_premium"] == 3000.0)
        require_invariant("agency-quote-conversion", "unbound premium calculation", quote_summary["unbound_quoted_premium"] == 500.0)
        require_invariant("agency-quote-conversion", "one action per unique unbound quote", results["agency-quote-conversion"]["action_rows"] == 2)
        require_invariant("agency-quote-conversion", "missing-ID row fallback reported", quote_summary["missing_quote_control_number_rows"] == 1 and bool(quote_summary["limitations"]))
        require_invariant("agency-quote-conversion", "multi-product scorecard participation documented", sum(item["quotes"] for item in quote_summary["by_product"]) == 4 and "need not sum" in quote_summary["product_scorecard_basis"])

        retention_summary = results["agency-retention-rescue"]["summary"]
        require_invariant("agency-retention-rescue", "termination count", retention_summary["terminations"] == 4)
        require_invariant("agency-retention-rescue", "retention premium totals", retention_summary["premium_new"] == 3900.0 and retention_summary["premium_old"] == 3400.0 and retention_summary["premium_change"] == 500.0)
        require_invariant("agency-retention-rescue", "rate word boundary positive", cancellation_category("Insured dissatisfied with rate") == "Price conversation")
        require_invariant("agency-retention-rescue", "premium dissatisfaction positive", cancellation_category("Insured dissatisfied with premium amount charged") == "Price conversation")
        require_invariant("agency-retention-rescue", "separate policies negative", cancellation_category("Customer requested separate policies") != "Price conversation")
        require_invariant("agency-retention-rescue", "separate household negative", cancellation_category("Separate household account") != "Price conversation")

        commission_summary = results["agency-commission-audit"]["summary"]
        require_invariant("agency-commission-audit", "policy and monetary calculations", commission_summary["policy_rows"] == 2 and commission_summary["written_premium"] == 800.0 and commission_summary["commissionable_premium"] == 809.0 and commission_summary["total_commission"] == -10.0)
        require_invariant("agency-commission-audit", "commission exception counts", commission_summary["negative_commission_rows"] == 1 and commission_summary["nonzero_premium_zero_commission_rows"] == 1 and commission_summary["rate_review_rows"] == 0)
        require_invariant("agency-commission-audit", "effective commission rate", commission_summary["effective_commission_rate"] == -0.0124)

        owner_summary = results["agency-owner-review"]["summary"]
        require_invariant("agency-owner-review", "business metric calculations", owner_summary["business_metrics"] == [{"section": "Policies in Force", "metric": "Current Month", "total": 100.0}, {"section": "Policies in Force", "metric": "PYE", "total": 95.0}])
        require_invariant("agency-owner-review", "new-business calculations", owner_summary["new_business"]["rows"] == 2 and owner_summary["new_business"]["unique_policies"] == 1 and owner_summary["new_business"]["items"] == 2 and owner_summary["new_business"]["written_premium"] == 1400.0 and owner_summary["new_business"]["new_policy_rows"] == 1 and owner_summary["new_business"]["add_item_rows"] == 1)

        cross_sell_summary = results["agency-cross-sell"]["summary"]
        require_invariant("agency-cross-sell", "cross-sell calculations", cross_sell_summary["commission_rows"] == 2 and cross_sell_summary["monoline_candidates"] == 1 and cross_sell_summary["new_business_rows"] == 2 and cross_sell_summary["new_business_add_item_rows"] == 1)

        injected_rows = read_action_rows(outputs_root / "agency-retention-rescue" / "action-list.csv")
        injected_names = {row["insured_first_name"] for row in injected_rows}
        require_invariant("agency-retention-rescue", "CSV formula prefixes neutralized", injected_names == {"'=SUM(1,1)", "'+CMD", "'-CMD", "'@CMD"})
        require_invariant("agency-retention-rescue", "CSV strings open as text", all(not value.startswith(FORMULA_PREFIXES) for value in injected_names))
        commission_actions = read_action_rows(outputs_root / "agency-commission-audit" / "action-list.csv")
        negative_numeric = next(row["total_commission"] for row in commission_actions if float(row["total_commission"]) < 0)
        require_invariant("agency-commission-audit", "negative numeric CSV values remain numeric", negative_numeric.startswith("-") and not negative_numeric.startswith("'-") and float(negative_numeric) == -10.0)

        tsv_result = analyze("agency-quote-conversion", [quote_tsv], outputs_root / "quote-tsv")
        require_invariant("agency-quote-conversion", "TSV input calculations", tsv_result["summary"]["serious_quotes"] == 3 and tsv_result["summary"]["conversion_rate"] == 0.3333)
        xlsx_result = analyze("agency-quote-conversion", [quote_xlsx], outputs_root / "quote-xlsx")
        xlsx_actions = read_action_rows(outputs_root / "quote-xlsx" / "action-list.csv")
        q2_action = next(row for row in xlsx_actions if row["quote_control_number"] == "Q2")
        require_invariant("agency-quote-conversion", "XLSX 1900 date conversion", q2_action["production_date"] == "2026-08-27" and q2_action["production_date"] != "46261")
        xlsx_1904_result = analyze("agency-quote-conversion", [quote_xlsx_1904], outputs_root / "quote-xlsx-1904")
        xlsx_1904_actions = read_action_rows(outputs_root / "quote-xlsx-1904" / "action-list.csv")
        require_invariant("agency-quote-conversion", "XLSX 1904 date conversion", xlsx_1904_actions[0]["production_date"] == "2026-08-27")
        require_invariant("agency-quote-conversion", "ordinary numeric cell not date-converted", xlsx_1904_result["summary"]["quoted_premium"] == 46261.0)
        require_invariant("agency-quote-conversion", "CSV input recognized", bool(results["agency-quote-conversion"]["summary"]))
        require_invariant("agency-quote-conversion", "XLSX input recognized", xlsx_result["summary"]["serious_quotes"] == 3)

        no_bound_result = analyze("agency-quote-conversion", [quote_without_bound], outputs_root / "quote-no-bound")
        no_bound_summary = no_bound_result["summary"]
        require_invariant("agency-quote-conversion", "bound-signal absence stays unavailable", no_bound_summary["serious_quotes"] == 2 and no_bound_summary["quoted_premium"] == 600.0 and no_bound_summary["bound_quotes"] is None and no_bound_summary["unbound_quotes"] is None and no_bound_summary["conversion_rate"] is None and no_bound_summary["unbound_quoted_premium"] is None and no_bound_result["action_rows"] == 0)
        require_invariant("agency-quote-conversion", "conversion-capable export limitation", any("conversion-capable export" in value for value in no_bound_summary["limitations"]))
        empty_csv = (outputs_root / "quote-no-bound" / "action-list.csv").read_text(encoding="utf-8")
        require_invariant("agency-quote-conversion", "empty action-list behavior", empty_csv == "status\nNo action rows generated from the supplied reports.\n")
        blank_bound_result = analyze(
            "agency-quote-conversion",
            [quote_with_blank_bound],
            outputs_root / "quote-blank-bound",
        )
        require_invariant(
            "agency-quote-conversion",
            "nonpopulated bound field cannot create false 0% conversion",
            blank_bound_result["summary"]["bound_signal_field_present"] is True
            and blank_bound_result["summary"]["bound_signal_values_observed"] is False
            and blank_bound_result["summary"]["conversion_rate"] is None
            and blank_bound_result["action_rows"] == 0,
        )

        missing = inputs_root / "missing.csv"
        require_error("agency-quote-conversion", "missing input error", (ValueError,), "Report not found", lambda: analyze("agency-quote-conversion", [missing], outputs_root / "missing"))
        unsupported = inputs_root / "unsupported.txt"
        unsupported.write_text("not a supported report", encoding="utf-8")
        require_error("agency-quote-conversion", "unsupported extension error", (ValueError,), "Unsupported report format", lambda: analyze("agency-quote-conversion", [unsupported], outputs_root / "unsupported"))
        malformed = inputs_root / "malformed.xlsx"
        malformed.write_bytes(b"not an xlsx archive")
        require_error("agency-quote-conversion", "malformed XLSX error", (zipfile.BadZipFile,), "File is not a zip file", lambda: analyze("agency-quote-conversion", [malformed], outputs_root / "malformed"))
        unknown = inputs_root / "unknown.csv"
        unknown.write_text("alpha,beta\n1,2\n", encoding="utf-8")
        require_error("agency-quote-conversion", "unrecognized report structure", (ValueError,), "No quote-detail table was recognized", lambda: analyze("agency-quote-conversion", [unknown], outputs_root / "unknown"))
        recognized_manifest = json.loads((outputs_root / "agency-quote-conversion" / "run-manifest.json").read_text(encoding="utf-8"))
        require_invariant("agency-quote-conversion", "recognized report structure recorded", recognized_manifest["sources"][0]["recognized_tables"][0]["report_type"] == "quote")

        source_trees = [
            ast.parse(Path(__file__).read_text(encoding="utf-8")),
            ast.parse(
                Path(__file__).with_name("report_artifacts.py").read_text(
                    encoding="utf-8"
                )
            ),
        ]
        imported_roots = {
            alias.name.split(".", 1)[0]
            for source_tree in source_trees
            for node in ast.walk(source_tree)
            if isinstance(node, ast.Import)
            for alias in node.names
        } | {
            (node.module or "").split(".", 1)[0]
            for source_tree in source_trees
            for node in ast.walk(source_tree)
            if isinstance(node, ast.ImportFrom)
        }
        forbidden_integrations = {
            "http",
            "requests",
            "smtplib",
            "socket",
            "subprocess",
            "urllib",
        }
        for mode in MODES:
            require_invariant(mode, "no network, email, messaging, CRM, carrier-system, policy, coverage, rate, binding, pricing, commission, or compensation mutation integrations", not bool(imported_roots & forbidden_integrations), str(sorted(imported_roots & forbidden_integrations)))
    print("Standard Agency Intelligence behavioral self-tests passed: 5/5")


def main(fixed_mode: str | None = None) -> None:
    parser = argparse.ArgumentParser(description="Run a Standard agency report skill locally.")
    if fixed_mode is None:
        parser.add_argument("--mode", choices=sorted(MODES))
    parser.add_argument("--input", action="append", default=[], help="Path to an .xlsx, .csv, or .tsv report. Repeat for multiple files.")
    parser.add_argument("--output", help="Local output directory. Defaults inside standard-analysis-runs beside the first report.")
    parser.add_argument("--self-test", action="store_true", help="Run dependency-free synthetic smoke tests.")
    args = parser.parse_args()
    if args.self_test:
        self_test()
        return
    mode = fixed_mode or args.mode
    if not mode:
        parser.error("--mode is required")
    if not args.input:
        parser.error("At least one --input report is required")
    inputs = [Path(value).expanduser().resolve() for value in args.input]
    output = Path(args.output).expanduser().resolve() if args.output else default_output(mode, inputs)
    result = analyze(mode, inputs, output)
    print(json.dumps(result, indent=2, ensure_ascii=False))


def cli(fixed_mode: str | None = None) -> None:
    try:
        main(fixed_mode)
    except (RuntimeError, ValueError, zipfile.BadZipFile, ET.ParseError) as error:
        print(f"ERROR: {error}", file=sys.stderr)
        raise SystemExit(2)


if __name__ == "__main__":
    cli()
