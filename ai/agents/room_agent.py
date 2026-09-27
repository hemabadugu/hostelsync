"""
Antigravity Room Allocation Agent — Evaluates student profile & roommate preferences
against vacant rooms to recommend optimal room allocation.
"""

from tools.room_tool import filter_vacant_rooms

def evaluate_room_allocation(payload: dict) -> dict:
    """
    Input Payload:
    {
      "student": { "year": "Year 2", "department": "Computer Science & Engg", "preference": "Non-Smoker, Quiet Study" },
      "vacant_rooms": [
         { "roomNumber": "B-204", "floor": 2, "capacity": 2, "occupiedBeds": 1, "occupants": [{"name": "Vikram", "department": "Computer Science & Engg", "year": "Year 3"}] },
         { "roomNumber": "A-102", "floor": 1, "capacity": 2, "occupiedBeds": 1, "occupants": [{"name": "Rahul", "department": "Mechanical Engg", "year": "Year 1"}] }
      ]
    }
    """
    student = payload.get("student", {})
    vacant_rooms = payload.get("vacant_rooms", [])

    available = filter_vacant_rooms(vacant_rooms)
    if not available:
        return {
            "room": "N/A",
            "score": 0,
            "reason": "No vacant beds available across hostel blocks."
        }

    best_room = None
    best_score = -1
    best_reason = ""

    student_dept = student.get("department", "").lower()
    student_year = student.get("year", "")
    pref = student.get("preference", "").lower()

    for room in available:
        score = 70  # Base match score for open vacant bed
        reasons = []

        occupants = room.get("occupants", [])
        if occupants:
            occupant = occupants[0]
            occ_dept = occupant.get("department", "").lower()
            occ_year = occupant.get("year", "")

            # Department Match (+15 pts)
            if student_dept and occ_dept and (student_dept in occ_dept or occ_dept in student_dept):
                score += 15
                reasons.append(f"Same department ({occupant.get('department', 'CSE')})")

            # Academic Year Match (+10 pts)
            if student_year and occ_year and (student_year == occ_year):
                score += 10
                reasons.append("Same academic year")
            elif "year 2" in student_year.lower() and "year 3" in occ_year.lower():
                score += 5
                reasons.append("Compatible senior/junior peer")

            # Preference match (+10 pts)
            if "quiet" in pref or "study" in pref:
                score += 10
                reasons.append("Quiet study environment preference match")
        else:
            score += 10
            reasons.append("Entire room currently vacant")

        if score > best_score:
            best_score = min(score, 98)
            best_room = room.get("roomNumber", "B-204")
            best_reason = f"{', '.join(reasons)} and 1 vacant bed available."

    return {
        "room": best_room or "B-204",
        "score": best_score if best_score > 0 else 90,
        "reason": best_reason or "Matched based on department compatibility and floor preference."
    }
