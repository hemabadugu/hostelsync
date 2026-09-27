"""
Attendance Tool — Evaluates student attendance percentage against institutional policy thresholds.
"""

ATTENDANCE_CUTOFF = 75.0

def evaluate_attendance_standing(attendance_percentage: float) -> dict:
    """Evaluates attendance score standing."""
    if attendance_percentage >= ATTENDANCE_CUTOFF:
        return {
            "isEligible": True,
            "margin": round(attendance_percentage - ATTENDANCE_CUTOFF, 1),
            "status": "Good Standing"
        }
    else:
        return {
            "isEligible": False,
            "deficit": round(ATTENDANCE_CUTOFF - attendance_percentage, 1),
            "status": "Attendance Deficit"
        }
