from typing import Any


class Event:
    def __init__(self, event_data: dict[str, Any]):
        # TODO: validate event_data
        self.component_id: str = event_data["componentId"]
        self.component_type: str = event_data["componentType"]
        self.event_type: str = event_data["eventType"]
        self.event_data: dict[str, Any] = event_data["eventData"]
