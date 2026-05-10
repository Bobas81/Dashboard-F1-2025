from __future__ import annotations

import math
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from statistics import median
from typing import Any
from urllib.parse import urljoin

import requests


BASE_URL = "https://www.f1laps.com"
EA_SOURCE_URL = "https://help.ea.com/en/articles/f1/f1-25/car-setups-guide/"
TRACK_SLUGS = {
    "melbourne": "australia",
    "shanghai": "china",
    "suzuka": "japan",
    "bahrain": "bahrain",
    "jeddah": "saudi_arabia",
    "miami": "miami",
    "imola": "imola",
    "monaco": "monaco",
    "catalunya": "spain",
    "montreal": "canada",
    "spielberg": "austria",
    "silverstone": "silverstone",
    "spa": "spa",
    "hungaroring": "hungary",
    "zandvoort": "netherlands",
    "monza": "monza",
    "baku": "azerbaijan",
    "singapore": "singapore",
    "cota": "usa",
    "mexico": "mexico",
    "interlagos": "brazil",
    "vegas": "las_vegas",
    "lusail": "qatar",
    "yasmarina": "abudhabi",
}

LISTING_FILTERS = (
    ("controller=2&session=5", "carrera+volante"),
    ("session=5", "carrera"),
    ("controller=2", "volante"),
    ("", "general"),
)


@dataclass
class SampleSet:
    values: dict[str, float]
    count: int
    source: str
    source_url: str


DETAIL_PATTERN = re.compile(
    r'<dt class="w-10/12 sm:w-6/12 text-sm">\s*([^<]+?)\s*</dt>.*?'
    r'<dd class="w-2/12 sm:w-2/12 text-right text-base[^"]*">\s*([^<]+?)\s*</dd>',
    re.S,
)

LABEL_MAP = {
    "Front Wing": ("aero", "frontWing"),
    "Rear Wing": ("aero", "rearWing"),
    "Differential Adjustment On Throttle": ("transmission", "differentialOn"),
    "Differential Adjustment Off Throttle": ("transmission", "differentialOff"),
    "Engine Braking": ("transmission", "engineBraking"),
    "Front Camber": ("suspensionGeometry", "frontCamber"),
    "Rear Camber": ("suspensionGeometry", "rearCamber"),
    "Front Toe": ("suspensionGeometry", "frontToe"),
    "Rear Toe": ("suspensionGeometry", "rearToe"),
    "Front Suspension": ("suspension", "frontSuspension"),
    "Rear Suspension": ("suspension", "rearSuspension"),
    "Front Anti-Roll Bar": ("suspension", "frontAntiRoll"),
    "Rear Anti-Roll Bar": ("suspension", "rearAntiRoll"),
    "Front Ride Height": ("suspension", "frontRideHeight"),
    "Rear Ride Height": ("suspension", "rearRideHeight"),
    "Brake Pressure": ("brakes", "pressure"),
    "Break Pressure": ("brakes", "pressure"),
    "Front Brake Bias": ("brakes", "bias"),
    "Front Break Bias": ("brakes", "bias"),
    "Front Left Tyre Pressure": ("tyres", "frontLeft"),
    "Front Right Tyre Pressure": ("tyres", "frontRight"),
    "Rear Left Tyre Pressure": ("tyres", "rearLeft"),
    "Rear Right Tyre Pressure": ("tyres", "rearRight"),
}

ROUNDING = {
    ("aero", "frontWing"): 0,
    ("aero", "rearWing"): 0,
    ("transmission", "differentialOn"): 0,
    ("transmission", "differentialOff"): 0,
    ("transmission", "engineBraking"): 0,
    ("suspensionGeometry", "frontCamber"): 2,
    ("suspensionGeometry", "rearCamber"): 2,
    ("suspensionGeometry", "frontToe"): 2,
    ("suspensionGeometry", "rearToe"): 2,
    ("suspension", "frontSuspension"): 0,
    ("suspension", "rearSuspension"): 0,
    ("suspension", "frontAntiRoll"): 0,
    ("suspension", "rearAntiRoll"): 0,
    ("suspension", "frontRideHeight"): 0,
    ("suspension", "rearRideHeight"): 0,
    ("brakes", "pressure"): 0,
    ("brakes", "bias"): 0,
    ("tyres", "frontLeft"): 1,
    ("tyres", "frontRight"): 1,
    ("tyres", "rearLeft"): 1,
    ("tyres", "rearRight"): 1,
}

SETUP_KEYS = list(ROUNDING.keys())


def clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(maximum, value))


def parse_number(raw: str) -> float:
    normalized = raw.replace("%", "").replace("psi", "").replace("˚", "").replace("°", "").strip()
    return float(normalized)


def request_html(url: str) -> str:
    response = requests.get(url, timeout=20)
    response.raise_for_status()
    return response.text


def extract_setup_values(html: str) -> dict[tuple[str, str], float]:
    pairs = {" ".join(label.split()): " ".join(value.split()) for label, value in DETAIL_PATTERN.findall(html)}
    result: dict[tuple[str, str], float] = {}
    for label, target in LABEL_MAP.items():
        if label not in pairs:
            continue
        result[target] = parse_number(pairs[label])
    return result


def collect_top_links(slug: str, wet: bool) -> tuple[list[str], str]:
    suffix = "wet/" if wet else ""
    page_root = f"{BASE_URL}/f1-25/setups/{slug}/{suffix}"
    for query, source in LISTING_FILTERS:
        url = f"{page_root}?{query}" if query else page_root
        html = request_html(url)
        links: list[str] = []
        for path in re.findall(rf'href="(/f1-25/setups/{re.escape(slug)}/[0-9a-f\-]+/)"', html):
            if path not in links:
                links.append(path)
            if len(links) >= 5:
                break
        if links:
            return links, f"{source} {'mojado' if wet else 'seco'}"
    return [], f"fallback {'mojado' if wet else 'seco'}"


def collect_samples(slug: str, wet: bool) -> SampleSet | None:
    links, source = collect_top_links(slug, wet)
    if not links:
        return None

    samples: list[dict[tuple[str, str], float]] = []
    for path in links:
        html = request_html(urljoin(BASE_URL, path))
        values = extract_setup_values(html)
        if len(values) >= 18:
            samples.append(values)

    if not samples:
        return None

    merged: dict[str, float] = {}
    for key in SETUP_KEYS:
        values = [sample[key] for sample in samples if key in sample]
        if not values:
            continue
        merged[".".join(key)] = float(median(values))

    listing_url = f"{BASE_URL}/f1-25/setups/{slug}/{'wet/' if wet else ''}?controller=2&session=5"
    return SampleSet(values=merged, count=len(samples), source=source, source_url=listing_url)


def set_value(target: dict[str, Any], dotted_key: str, value: float) -> None:
    group, field = dotted_key.split(".")
    target[group][field] = value


def round_value(group: str, field: str, value: float) -> float | int:
    digits = ROUNDING[(group, field)]
    if digits == 0:
      return int(round(value))
    return round(value, digits)


def build_setup(sample: SampleSet) -> dict[str, Any]:
    setup = {
        "aero": {"frontWing": 0, "rearWing": 0},
        "transmission": {"differentialOn": 0, "differentialOff": 0, "engineBraking": 60},
        "suspensionGeometry": {"frontCamber": -3.5, "rearCamber": -2.0, "frontToe": 0.0, "rearToe": 0.1},
        "suspension": {
            "frontSuspension": 20,
            "rearSuspension": 8,
            "frontAntiRoll": 10,
            "rearAntiRoll": 8,
            "frontRideHeight": 20,
            "rearRideHeight": 50,
        },
        "brakes": {"pressure": 100, "bias": 54},
        "tyres": {"frontLeft": 24.0, "frontRight": 24.0, "rearLeft": 21.0, "rearRight": 21.0},
    }
    for dotted_key, value in sample.values.items():
        group, field = dotted_key.split(".")
        set_value(setup, dotted_key, round_value(group, field, value))
    return setup


def derive_wet_from_dry(dry: dict[str, Any]) -> dict[str, Any]:
    wet = {
        key: {inner_key: inner_value for inner_key, inner_value in group.items()}
        for key, group in dry.items()
    }
    wet["aero"]["frontWing"] = int(clamp(wet["aero"]["frontWing"] + 6, 0, 50))
    wet["aero"]["rearWing"] = int(clamp(wet["aero"]["rearWing"] + 8, 0, 50))
    wet["transmission"]["differentialOn"] = int(clamp(wet["transmission"]["differentialOn"] - 10, 10, 100))
    wet["transmission"]["differentialOff"] = int(clamp(wet["transmission"]["differentialOff"] - 5, 10, 100))
    wet["transmission"]["engineBraking"] = int(clamp(wet["transmission"]["engineBraking"] + 4, 0, 100))
    wet["suspension"]["frontSuspension"] = int(clamp(wet["suspension"]["frontSuspension"] - 4, 1, 41))
    wet["suspension"]["rearSuspension"] = int(clamp(wet["suspension"]["rearSuspension"] - 3, 1, 41))
    wet["suspension"]["frontAntiRoll"] = int(clamp(wet["suspension"]["frontAntiRoll"] - 3, 1, 21))
    wet["suspension"]["rearAntiRoll"] = int(clamp(wet["suspension"]["rearAntiRoll"] - 3, 1, 21))
    wet["suspension"]["frontRideHeight"] = int(clamp(wet["suspension"]["frontRideHeight"] + 3, 20, 50))
    wet["suspension"]["rearRideHeight"] = int(clamp(wet["suspension"]["rearRideHeight"] + 4, 40, 80))
    wet["brakes"]["pressure"] = int(clamp(wet["brakes"]["pressure"] - 3, 80, 100))
    wet["brakes"]["bias"] = int(clamp(wet["brakes"]["bias"] - 1, 50, 70))
    wet["tyres"]["frontLeft"] = round(clamp(wet["tyres"]["frontLeft"] - 0.5, 20.0, 30.0), 1)
    wet["tyres"]["frontRight"] = round(clamp(wet["tyres"]["frontRight"] - 0.5, 20.0, 30.0), 1)
    wet["tyres"]["rearLeft"] = round(clamp(wet["tyres"]["rearLeft"] - 0.4, 18.0, 27.5), 1)
    wet["tyres"]["rearRight"] = round(clamp(wet["tyres"]["rearRight"] - 0.4, 18.0, 27.5), 1)
    return wet


def blend_setups(dry: dict[str, Any], wet: dict[str, Any], wet_weight: float) -> dict[str, Any]:
    blended = {
        "aero": {},
        "transmission": {},
        "suspensionGeometry": {},
        "suspension": {},
        "brakes": {},
        "tyres": {},
    }
    for group, field in SETUP_KEYS:
        mixed = dry[group][field] * (1 - wet_weight) + wet[group][field] * wet_weight
        blended[group][field] = round_value(group, field, mixed)
    return blended


def setup_to_ts(setup: dict[str, Any], source: str, source_url: str) -> str:
    return (
        "{\n"
        f"      source: {source!r},\n"
        f"      sourceUrl: {source_url!r},\n"
        "      notes: [],\n"
        f"      aero: {{ frontWing: {setup['aero']['frontWing']}, rearWing: {setup['aero']['rearWing']} }},\n"
        "      transmission: {\n"
        f"        differentialOn: {setup['transmission']['differentialOn']},\n"
        f"        differentialOff: {setup['transmission']['differentialOff']},\n"
        f"        engineBraking: {setup['transmission']['engineBraking']},\n"
        "      },\n"
        "      suspensionGeometry: {\n"
        f"        frontCamber: {setup['suspensionGeometry']['frontCamber']},\n"
        f"        rearCamber: {setup['suspensionGeometry']['rearCamber']},\n"
        f"        frontToe: {setup['suspensionGeometry']['frontToe']},\n"
        f"        rearToe: {setup['suspensionGeometry']['rearToe']},\n"
        "      },\n"
        "      suspension: {\n"
        f"        frontSuspension: {setup['suspension']['frontSuspension']},\n"
        f"        rearSuspension: {setup['suspension']['rearSuspension']},\n"
        f"        frontAntiRoll: {setup['suspension']['frontAntiRoll']},\n"
        f"        rearAntiRoll: {setup['suspension']['rearAntiRoll']},\n"
        f"        frontRideHeight: {setup['suspension']['frontRideHeight']},\n"
        f"        rearRideHeight: {setup['suspension']['rearRideHeight']},\n"
        "      },\n"
        f"      brakes: {{ pressure: {setup['brakes']['pressure']}, bias: {setup['brakes']['bias']} }},\n"
        "      tyres: {\n"
        f"        frontLeft: {setup['tyres']['frontLeft']},\n"
        f"        frontRight: {setup['tyres']['frontRight']},\n"
        f"        rearLeft: {setup['tyres']['rearLeft']},\n"
        f"        rearRight: {setup['tyres']['rearRight']},\n"
        "      },\n"
        "    }"
    )


def main() -> None:
    fetched_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
    entries: list[str] = []
    for track_id, slug in TRACK_SLUGS.items():
        dry_sample = collect_samples(slug, wet=False)
        wet_sample = collect_samples(slug, wet=True)
        if dry_sample is None:
            raise RuntimeError(f"No dry setup samples found for {track_id} ({slug})")

        dry_setup = build_setup(dry_sample)
        if wet_sample is not None:
            wet_setup = build_setup(wet_sample)
            wet_source = f"F1Laps top {wet_sample.count} {wet_sample.source} - {fetched_at[:10]}"
            wet_source_url = wet_sample.source_url
        else:
            wet_setup = derive_wet_from_dry(dry_setup)
            wet_source = f"Derivado desde seco con ajustes EA F1 25 - {fetched_at[:10]}"
            wet_source_url = EA_SOURCE_URL

        intermediate_setup = blend_setups(dry_setup, wet_setup, 0.42)
        dry_source = f"F1Laps top {dry_sample.count} {dry_sample.source} - {fetched_at[:10]}"
        intermediate_source = f"Interpolado desde F1Laps seco/mojado + guia EA F1 25 - {fetched_at[:10]}"

        entries.append(
            f"  {track_id!r}: {{\n"
            f"    dry: {setup_to_ts(dry_setup, dry_source, dry_sample.source_url)},\n"
            f"    intermediate: {setup_to_ts(intermediate_setup, intermediate_source, EA_SOURCE_URL)},\n"
            f"    wet: {setup_to_ts(wet_setup, wet_source, wet_source_url)},\n"
            "  },"
        )

    output = (
        "import type { SetupPreset, WeatherMode } from './types';\n\n"
        "export const setupLibraryFetchedAt = "
        + repr(fetched_at)
        + ";\n\n"
        "export const curatedSetupLibrary: Record<string, Record<WeatherMode, SetupPreset>> = {\n"
        + "\n".join(entries)
        + "\n};\n"
    )

    target = Path(__file__).resolve().parents[1] / "src" / "data" / "setupLibrary.ts"
    target.write_text(output, encoding="utf-8")
    print(f"Wrote {target}")


if __name__ == "__main__":
    main()
