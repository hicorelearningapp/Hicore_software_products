# app/models/schemas.py
from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional


# ---------------------------------------------------------
# HOMEPAGE.JSON SCHEMA
# ---------------------------------------------------------

class ExamItem(BaseModel):
    id: str
    label: str


class ExamCategory(BaseModel):
    name: str
    exams: List[ExamItem]


class HomepageSection(BaseModel):
    title: str
    categories: List[ExamCategory]


class HomepageModel(BaseModel):
    School: HomepageSection
    Govt: Optional[HomepageSection] = None
    Professional: Optional[HomepageSection] = None


# ---------------------------------------------------------
# EXAM DETAIL (GLOBAL examDetail.json)
# ---------------------------------------------------------

class InfoBox(BaseModel):
    subjects: str
    duration: str
    target: str
    questions: str


class FeatureSection(BaseModel):
    title: str
    subtitle: str


class FeatureItem(BaseModel):
    id: int
    icon: str
    ribbon: str
    title: str
    benefit: str
    why: str
    buttonText: str


class BottomBanner(BaseModel):
    title: str
    subtitle: str
    buttonText: str


class ExamDetailModel(BaseModel):
    examName: str
    heading: str
    subHeading: str
    quickIntro: str
    infoBox: InfoBox
    featuresSection: FeatureSection
    examFeatures: List[FeatureItem]
    bottomBanner: BottomBanner


# ---------------------------------------------------------
# ROADMAP.JSON SCHEMA
# ---------------------------------------------------------

class OverviewItem(BaseModel):
    label: str
    text: str


class OverviewBlock(BaseModel):
    id: int
    title: str
    items: List[OverviewItem]


class SyllabusClass(BaseModel):
    name: str
    chapters: List[str]


class SyllabusSubject(BaseModel):
    id: str
    title: str
    classes: List[SyllabusClass]


class SyllabusData(BaseModel):
    id: int
    title: str
    subjects: List[SyllabusSubject]


class RoadmapModel(BaseModel):
    overviewData: List[OverviewBlock]
    syllabusData: SyllabusData


# ---------------------------------------------------------
# LEARN.JSON SCHEMA
# ---------------------------------------------------------

class Note(BaseModel):
    title: str
    points: List[str]


class Formula(BaseModel):
    title: str
    formula: str
    explanation: str


class RealWorld(BaseModel):
    title: str
    concept: str
    description: str


class Topic(BaseModel):
    name: str
    notes: List[Note]
    formulas: List[Formula]
    realworld: List[RealWorld]


class LearnUnit(BaseModel):
    id: int
    class_: str = Field(..., alias="class")
    chapterName: str
    title: str
    topics: List[Topic]


class LearnModel(BaseModel):
    sub: List[LearnUnit]


# ---------------------------------------------------------
# PRACTICE.JSON SCHEMA
# ---------------------------------------------------------

class QuestionText(BaseModel):
    type: str
    value: str
    difficulty: Optional[str]


class OptionItem(BaseModel):
    type: str
    value: str


class Option(BaseModel):
    label: str
    items: List[OptionItem]


class ExplanationItem(BaseModel):
    type: str
    value: str


class PracticeQuestion(BaseModel):
    id: int
    question: List[QuestionText]
    options: List[Option]
    answer: str
    explanation: List[ExplanationItem]


class PracticeSet(BaseModel):
    name: str
    questions: List[PracticeQuestion]


class PracticeUnit(BaseModel):
    id: int
    unit: str
    practiceSets: List[PracticeSet]


class PracticeModel(BaseModel):
    __root__: Dict[str, Dict[str, List[PracticeUnit]]]


# ---------------------------------------------------------
# TEST.JSON SCHEMA
# ---------------------------------------------------------

class TestQuestion(BaseModel):
    id: int
    question: List[QuestionText]
    options: List[Option]
    answer: str
    explanation: List[ExplanationItem]


class TestUnit(BaseModel):
    unit: str
    questions: List[TestQuestion]


class TestModel(BaseModel):
    __root__: Dict[str, Dict[str, List[TestUnit]]]
