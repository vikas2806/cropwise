#!/usr/bin/env python
"""
Integration test script for CropWise AI backend + proxy + frontend.
Run this to verify all services are connected properly.

Usage:
    python integration_test.py
"""

import sys
import time
import requests
from urllib.parse import urljoin

# Configuration
BACKEND_URL = "http://localhost:8000"
PROXY_URL = "http://localhost:4000"
FRONTEND_URL = "http://localhost:5173"

# ANSI Colors for terminal output
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
RESET = "\033[0m"


def print_header(text):
    print(f"\n{BLUE}{'=' * 70}{RESET}")
    print(f"{BLUE}{text:^70}{RESET}")
    print(f"{BLUE}{'=' * 70}{RESET}\n")


def print_ok(text):
    print(f"{GREEN}✓ {text}{RESET}")


def print_fail(text):
    print(f"{RED}✗ {text}{RESET}")


def print_warn(text):
    print(f"{YELLOW}⚠ {text}{RESET}")


def print_info(text):
    print(f"{BLUE}ℹ {text}{RESET}")


def check_url(url, timeout=3, headers=None):
    """Check if a URL is reachable and return status + response."""
    try:
        response = requests.get(url, timeout=timeout, headers=headers)
        return True, response.status_code, response.json()
    except requests.exceptions.ConnectionError:
        return False, None, {"error": "Connection refused"}
    except requests.exceptions.Timeout:
        return False, None, {"error": "Request timeout"}
    except Exception as e:
        return False, None, {"error": str(e)}


def main():
    print(f"{BLUE}{'*' * 70}{RESET}")
    print(f"{BLUE}  CropWise AI — Integration Test{RESET}")
    print(f"{BLUE}  Testing: Backend → Proxy → Frontend{RESET}")
    print(f"{BLUE}{'*' * 70}{RESET}\n")

    all_ok = True

    # =========================================================================
    # Test 1: Backend Health
    # =========================================================================
    print_header("1. Backend Health Check")
    print_info(f"Testing: {BACKEND_URL}/health")
    ok, status, data = check_url(urljoin(BACKEND_URL, "/health"))
    if ok and status == 200:
        print_ok(f"Backend responding on port 8000")
        print_info(f"Status: {data.get('status', 'unknown')}")
        print_info(f"GEE Ready: {data.get('gee_ready', 'unknown')}")
    else:
        print_fail(f"Backend NOT responding (status: {status})")
        print_warn("Ensure: cd cropwise-backend && uvicorn main:app --reload --port 8000")
        all_ok = False

    # =========================================================================
    # Test 2: Proxy Health
    # =========================================================================
    print_header("2. Proxy Server Health Check")
    print_info(f"Testing: {PROXY_URL}/health")
    ok, status, data = check_url(urljoin(PROXY_URL, "/health"))
    if ok and status == 200:
        print_ok(f"Proxy responding on port 4000")
        print_info(f"Status: {data.get('status', 'unknown')}")
    else:
        print_fail(f"Proxy NOT responding (status: {status})")
        print_warn("Ensure: cd cropwise-ui/proxy-server && npm start")
        all_ok = False

    # =========================================================================
    # Test 3: Frontend Reachability
    # =========================================================================
    print_header("3. Frontend Reachability Check")
    print_info(f"Testing: {FRONTEND_URL}")
    ok, status, data = check_url(urljoin(FRONTEND_URL, "/"))
    if ok and status == 200:
        print_ok(f"Frontend responding on port 5173")
    else:
        print_fail(f"Frontend NOT responding (status: {status})")
        print_warn("Ensure: cd cropwise-ui && npm run dev")
        all_ok = False

    # =========================================================================
    # Test 4: Proxy → Backend Routing (tiles endpoint)
    # =========================================================================
    print_header("4. Proxy → Backend Routing Test")
    print_info("Testing: GET /api/tiles/crop-type (through proxy)")

    # Get API key from environment or default
    import os
    api_key = os.getenv("INTERNAL_API_KEY", "replace_with_long_random_string")

    headers = {"X-Internal-Key": api_key}
    ok, status, data = check_url(urljoin(PROXY_URL, "/api/tiles/crop-type"), headers=headers)

    if ok and status == 200:
        print_ok(f"Proxy correctly routed to backend (status: {status})")
        print_info(f"Response: {data.get('layer_name', 'unknown')}")
        print_info(f"Is Mock: {data.get('is_mock', 'unknown')}")
        if "tile_url" in data:
            print_info(f"Tile URL starts with: {data['tile_url'][:50]}...")
    else:
        print_fail(f"Routing failed (status: {status})")
        if status == 403:
            print_warn("X-Internal-Key header missing or incorrect")
            print_warn(f"Ensure INTERNAL_API_KEY matches in both .env files")
        all_ok = False

    # =========================================================================
    # Test 5: Backend Fields Endpoint
    # =========================================================================
    print_header("5. Backend Fields Endpoint Test")
    print_info("Testing: GET /api/fields/1/advisory")

    ok, status, data = check_url(urljoin(PROXY_URL, "/api/fields/1/advisory"), headers=headers)

    if ok and status == 200:
        print_ok(f"Fields endpoint responding (status: {status})")
        print_info(f"Field: {data.get('zone_name', 'unknown')}")
        print_info(f"Advisory: {data.get('advisory_status', 'unknown')}")
        print_info(f"Risk Level: {data.get('risk_level', 'unknown')}")
    elif status == 404:
        print_fail(f"Field 1 not found (status: 404)")
        print_warn("Ensure backend seeded fields on startup")
    else:
        print_fail(f"Fields endpoint failed (status: {status})")
        all_ok = False

    # =========================================================================
    # Test 6: Alerts Endpoint
    # =========================================================================
    print_header("6. Backend Alerts Endpoint Test")
    print_info("Testing: GET /api/alerts")

    ok, status, data = check_url(urljoin(PROXY_URL, "/api/alerts"), headers=headers)

    if ok and status == 200:
        print_ok(f"Alerts endpoint responding (status: {status})")
        print_info(f"Alert count: {len(data)}")
        if len(data) > 0:
            print_info(f"Sample alert: {data[0].get('zone_name', 'unknown')} - {data[0].get('risk_level', 'unknown')}")
    else:
        print_fail(f"Alerts endpoint failed (status: {status})")
        all_ok = False

    # =========================================================================
    # Summary
    # =========================================================================
    print_header("Integration Test Summary")

    if all_ok:
        print(f"{GREEN}{'✓' * 70}{RESET}")
        print(f"{GREEN}All tests PASSED! The stack is ready.{RESET}")
        print(f"{GREEN}{'✓' * 70}{RESET}")
        print_info("You can now:")
        print_info("  1. Open http://localhost:5173 in your browser")
        print_info("  2. Navigate to 'Map Explorer'")
        print_info("  3. Click fields to see advisories")
        print_info("  4. Check 'Alerts' tab for critical notifications")
        return 0
    else:
        print(f"{RED}{'✗' * 70}{RESET}")
        print(f"{RED}Some tests FAILED. See above for details.{RESET}")
        print(f"{RED}{'✗' * 70}{RESET}")
        print_info("Common issues:")
        print_info("  1. Backend not running → cd cropwise-backend && uvicorn main:app --reload --port 8000")
        print_info("  2. Proxy not running → cd cropwise-ui/proxy-server && npm start")
        print_info("  3. API key mismatch → ensure INTERNAL_API_KEY is same in both .env files")
        print_info("  4. Database not set up → check DATABASE_URL in cropwise-backend/.env")
        return 1


if __name__ == "__main__":
    sys.exit(main())
