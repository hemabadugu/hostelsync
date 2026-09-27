"""
Room Allocation Tool — Filters and extracts vacant room features and occupant profiles.
"""

def filter_vacant_rooms(vacant_rooms: list, target_floor: int = None) -> list:
    """Filters rooms that have at least one vacant bed."""
    available = []
    for rm in vacant_rooms:
        capacity = rm.get("capacity", 2)
        occupied = rm.get("occupiedBeds", 0)
        if occupied < capacity:
            available.append(rm)
    
    if target_floor is not None:
        floor_filtered = [r for r in available if r.get("floor") == target_floor]
        if floor_filtered:
            return floor_filtered

    return available
