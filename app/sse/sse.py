from dataclasses import dataclass
from email.message import Message
from quart import Response

# based on https://pgjones.gitlab.io/quart/how_to_guides/server_sent_events.html
@dataclass
class ServerSentEvent:
    data: str
    event: None
    id: None
    retry: None

    def encode(self) -> bytes:
        message = f"data: {self.data}"
        if self.event is not None:
            message = f"{message}\nevent: {self.event}"
        if self.id is not None:
            message = f"{message}\nid: {self.id}"
        if self.retry is not None:
            message = f"{message}\nretry: {self.retry}"
        message = f"{message}\r\n\r\n"
        return message.encode('utf-8')