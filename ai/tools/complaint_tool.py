"""
Complaint Tool — Severity keywords dictionary & SLA resolution windows.
"""

SEVERITY_MAPPING = {
    "plumbing": {
        "keywords": ["leak", "water", "pipe", "tap", "bathroom", "geyser", "drain", "flush"],
        "category": "Plumbing",
        "high_keywords": ["leak", "geyser", "overflow", "burst"],
        "default_sla": 24,
        "high_sla": 12,
        "department": "Plumbing Maintenance Dept"
    },
    "electrical": {
        "keywords": ["fan", "light", "spark", "socket", "power", "switch", "short", "wire", "ac"],
        "category": "Electrical",
        "high_keywords": ["spark", "short", "smoke", "fire", "shock"],
        "default_sla": 24,
        "high_sla": 6,
        "department": "Electrical Maintenance Dept"
    },
    "network": {
        "keywords": ["wifi", "net", "internet", "router", "signal", "connect", "lan"],
        "category": "Network",
        "high_keywords": ["outage", "entire floor"],
        "default_sla": 48,
        "high_sla": 24,
        "department": "Campus IT Network Dept"
    }
}
