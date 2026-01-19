from fastapi import APIRouter, Body, HTTPException
from ..schemas.resume_schemas import ResumeSuggestRequest,ResumeSuggestResponse
from app.modules.ai_resume_builder.services.resume_suggestion_service import generate_resume_suggestion

router = APIRouter(prefix="/ai", tags=["Resume Builder"])



@router.post("/suggest", response_model=ResumeSuggestResponse)
async def suggest_resume_content(
    body: ResumeSuggestRequest = Body(...)
):
    """
    Generate polished AI suggestions for resume sections.
    """

    try:
        suggestion = await generate_resume_suggestion(
            section=body.section,
            content=body.content
        )

        return ResumeSuggestResponse(
            section=body.section,
            original=body.content,
            suggestion=suggestion
        )

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Resume Suggestion Failed: {e}"
        )
