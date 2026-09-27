"""
HostelSync Antigravity AI Orchestrator Layer
Routes incoming AI requests to specialized agents:
1. Room Allocation Agent
2. Complaint Triage Agent
3. Leave Approval Agent
4. Safety Assistant Agent
"""

import sys
import os
from typing import Dict, Any

class AIOrchestrator:
    def __init__(self):
        print("🤖 [Antigravity AI Orchestrator] Engine Active")

    def route_request(self, agent_name: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Routes payload to requested agent module."""
        if agent_name == "room_allocation":
            from agents.room_agent import evaluate_room_allocation
            return evaluate_room_allocation(payload)
        elif agent_name == "complaint_triage":
            from agents.complaint_agent import triage_complaint
            return triage_complaint(payload)
        elif agent_name == "leave_approval":
            from agents.leave_agent import evaluate_leave_request
            return evaluate_leave_request(payload)
        elif agent_name == "safety_assistant":
            from agents.safety_agent import answer_safety_faq
            return answer_safety_faq(payload)
        else:
            return {"error": f"Unknown agent: {agent_name}"}

if __name__ == "__main__":
    orchestrator = AIOrchestrator()
    sample_leave_test = {
        "attendancePercentage": 88.5,
        "daysRequested": 4,
        "reason": "Family function"
    }
    result = orchestrator.route_request("leave_approval", sample_leave_test)
    print("Orchestrator Evaluation Test Output:", result)
