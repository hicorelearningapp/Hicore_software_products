from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.services.db_service import DBService
from app.modules.find_my_career.models.course_model import Find_my_course


class CourseService(DBService):
    """
    Service layer for managing course CRUD operations
    using your DBService + SQLManager architecture.
    """

    def __init__(self, session: Optional[AsyncSession] = None):
        super().__init__(Find_my_course, session)

    # ---------------------------------------------------------
    async def get_by_domain_and_months(self, domain: str, months: int):
        """Fetch an existing course by domain + duration."""
        try:
            async with self.get_manager() as manager:
                return await manager.get_by_attrs(
                    domain=domain,
                    duration_months=months
                )
        except Exception as e:
            raise RuntimeError(f"DB error (get_by_domain_and_months): {e}")

    # ---------------------------------------------------------
    async def get_by_course_id(self, course_id: str):
        """Fetch a course by its course_id."""
        try:
            async with self.get_manager() as manager:
                return await manager.get_by_attrs(course_id=course_id)
        except Exception as e:
            raise RuntimeError(f"DB error (get_by_course_id): {e}")

    # ---------------------------------------------------------
    async def upsert_course(
        self,
        *,
        course_id: str,
        domain: str,
        months: int,
        title: str,
        description1: str,
        highlight: str,
        description2: str,
        closing: str,
        rating: float,
        price: float,
        offer_price: float,
        image_file_path: str,
        background_file_path: str,
        module_path: str,
        full_path: str
    ):
        """
        Upsert logic:
            - If a course exists with same domain+months → UPDATE
            - Else → CREATE new course
        """

        course_data = {
            "course_id": course_id,
            "domain": domain,
            "duration_months": months,
            "title": title,
            "description1": description1,
            "highlight": highlight,
            "description2": description2,
            "closing": closing,
            "rating": rating,
            "price": price,
            "offer_price": offer_price,
            "image_file_path": image_file_path,
            "background_file_path": background_file_path,
            "module_file_path": module_path,
            "full_file_path": full_path,
        }

        try:
            async with self.get_manager() as manager:

                # Check if course exists
                existing = await manager.get_by_attrs(
                    domain=domain,
                    duration_months=months
                )

                # -------------------------------
                # UPDATE Existing Course
                # -------------------------------
                if existing:
                    return await manager.update_by_attrs(
                        filters={"id": existing.id},
                        data=course_data
                    )

                # -------------------------------
                # CREATE New Course
                # -------------------------------
                return await manager.create(course_data)

        except Exception as e:
            raise RuntimeError(f"DB error (upsert_course): {e}")
