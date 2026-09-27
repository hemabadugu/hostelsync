"""
Antigravity Complaint Agent — Categorizes, prioritizes, and assigns SLA hours to free-text complaints.
"""

from tools.complaint_tool import SEVERITY_MAPPING

def triage_complaint(payload: dict) -> dict:
    """
    Input: { "description": "Water heater leaking in B-204 bathroom" }
    Output: {
      "category": "Plumbing",
      "priority": "HIGH",
      "estimatedSLAHours": 24,
      "responsibleDepartment": "Plumbing Maintenance Dept",
      "aiReasoning": "Free-text parsed: Water leak detected -> High priority SLA assigned"
    }
    """
    description = payload.get("description", "").lower()

    category = "General"
    priority = "MEDIUM"
    sla = 36
    department = "Facilities Management"
    reasoning = "General hostel maintenance ticket"

    for cat_name, info in SEVERITY_MAPPING.items():
        # Check if description matches any keywords
        if any(kw in description for kw in info["keywords"]):
            category = info["category"]
            department = info["department"]

            # Check if any high severity keyword matches
            if any(hkw in description for hkw in info["high_keywords"]):
                priority = "HIGH"
                sla = info["high_sla"]
                reasoning = f"Urgent safety/hazard keyword detected in {category} ticket."
            else:
                priority = "MEDIUM"
                sla = info["default_sla"]
                reasoning = f"Standard {category} maintenance request categorized by AI."
            break

    return {
        "category": category,
        "priority": priority,
        "estimatedSLAHours": sla,
        "responsibleDepartment": department,
        "aiReasoning": reasoning
    }
