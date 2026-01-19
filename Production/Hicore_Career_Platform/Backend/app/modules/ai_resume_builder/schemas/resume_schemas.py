from pydantic import BaseModel

# Request Schema
class ResumeSuggestRequest(BaseModel):
    section: str
    content: str


# Response Schema
class ResumeSuggestResponse(BaseModel):
    section: str
    original: str
    suggestion: str
