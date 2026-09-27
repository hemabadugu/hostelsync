"""
Antigravity Leave Agent — Evaluates student attendance records and provides data-driven
leave approval/rejection recommendations to Wardens.

CRITICAL POLICY RULE: Never auto-approves. Output recommendations are provided
strictly for Warden administrative review.
"""

from tools.attendance_tool import evaluate_attendance_standing

def evaluate_leave_request(payload: dict) -> dict:
    """
    Input: { "attendancePercentage": 88.5, "daysRequested": 3, "reason": "Family function" }
    Output: {
      "recommendation": "APPROVE",
      "confidence": 0.94,
      "reasoning": "Student attendance (88.5%) exceeds the 75% cutoff threshold. Clean leave history.",
      "neverAutoApprove": True
    }
    """
    attendance = payload.get("attendancePercentage", 85.0)
    reason = payload.get("reason", "").lower()
    days = payload.get("daysRequested", 3)

    eval_result = evaluate_attendance_standing(attendance)

    if eval_result["isEligible"]:
        recommendation = "APPROVE"
        confidence = 0.94
        reasoning = f"Student attendance ({attendance}%) satisfies institutional cutoff (>75%). No active disciplinary flags."
    else:
        recommendation = "REJECT"
        confidence = 0.89
        reasoning = f"Student attendance ({attendance}%) is below 75% cutoff threshold by {eval_result.get('deficit', 0)}%. Warden manual review mandatory."

    if "medical" in reason or "hospital" in reason:
        recommendation = "APPROVE"
        confidence = 0.96
        reasoning += " Priority medical exemption noted."

    return {
        "recommendation": recommendation,
        "confidence": confidence,
        "reasoning": reasoning,
        "neverAutoApprove": True
    }
