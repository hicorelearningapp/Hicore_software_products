from app.core.logger import logger
from fastapi import APIRouter, Form, UploadFile, File, HTTPException, Body
from typing import List, Union, Optional
from fastapi.responses import JSONResponse

from app.modules.freshers_interview.services import services
from app.modules.freshers_interview.schemas.schemas import WeekDataOut,MessageOut

router = APIRouter(prefix="/freshers", tags=["Freshers Interview Program"])


@router.post("/week", response_model=MessageOut)
async def create_week(
    weekName: str = Form(...),
    nextWeek: Optional[str] = Form(None),
    previousWeek: Optional[str] = Form(None),
    heading: str = Form(...),
    subHeading: str = Form(...),
    paragraph: str = Form(...),
    bannerImage: UploadFile = File(...),
    card_titles: Union[List[str], str] = Form(...),
    card_descriptions: Union[List[str], str] = Form(...),
    card_bgcolors: Union[List[str], str] = Form(...),
    card_topicIds: Union[List[str], str] = Form(...),
    card_icons: List[UploadFile] = File(...),
    card_files: List[UploadFile] = File(...)
):
    try:
        # Normalize potential comma-separated lists
        def norm(v):
            if isinstance(v, list):
                if len(v) == 1 and "," in v[0]:
                    return [x.strip() for x in v[0].split(",") if x.strip()]
                return v
            return [x.strip() for x in str(v).split(",") if x.strip()]

        titles = norm(card_titles)
        descs = norm(card_descriptions)
        colors = norm(card_bgcolors)
        tids = norm(card_topicIds)

        week_data = await services.create_or_update_week(
            weekName=weekName,
            heading=heading,
            subHeading=subHeading,
            paragraph=paragraph,
            bannerImage=bannerImage,
            card_titles=titles,
            card_descriptions=descs,
            card_bgcolors=colors,
            card_topicIds=tids,
            card_icons=card_icons,
            card_files=card_files,
            nextWeek=nextWeek,
            previousWeek=previousWeek
        )
        return JSONResponse({"message": f" Week '{weekName}' created/updated successfully!", "data": week_data})
    except HTTPException as he:
        raise he
    except Exception:
        logger.exception("Unhandled error in create_week")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/week/{week_name}", response_model=WeekDataOut)
def read_week(week_name: str):
    try:
        return services.get_week(week_name)
    except HTTPException:
        raise
    except Exception:
        logger.exception("Unhandled error in read_week")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/weeks")
def read_weeks():
    try:
        return services.get_all_weeks()
    except Exception:
        logger.exception("Unhandled error in read_weeks")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.patch("/week/{week_name}")
def patch_week(week_name: str, update_fields: dict = Body(...)):
    try:
        updated = services.update_week_partial(week_name, update_fields)
        return {"message": f" Week '{week_name}' updated", "data": updated}
    except HTTPException:
        raise
    except Exception:
        logger.exception("Unhandled error in patch_week")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.delete("/week/{week_name}")
def remove_week(week_name: str):
    try:
        services.delete_week(week_name)
        return {"message": f"🗑️ Week '{week_name}' deleted successfully!"}
    except HTTPException:
        raise
    except Exception:
        logger.exception("Unhandled error in remove_week")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/week/{week_name}/card/{topic_id}")
def get_card(week_name: str, topic_id: str):
    try:
        data = services.get_card_json(week_name, topic_id)
        return data
    except HTTPException:
        raise
    except Exception:
        logger.exception("Unhandled error in get_card")
        raise HTTPException(status_code=500, detail="Internal server error")

