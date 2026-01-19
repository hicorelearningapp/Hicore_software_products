import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";

import Home from "./Pages/Home";
import CoursePage from "./Pages/Courses/CoursePage";
import Coursepage from "./Pages/CareerChoosePage/Careercoursepage";
import EnrollPage from "./Pages/Courses/EnrollPage";
import CourseItems from "./Pages/Courses/CourseItems";
import InternshipProjects from "./Pages/Services/InternshipProjects";
import Semiconductors from "./Pages/Domain/Semiconductors";
import ApplyForJobs from "./Pages/Services/ApplyForJobs/ApplyForJobs";
import QuickApplyjobs from "./Pages/Services/ApplyForJobs/QuickApplyjobs";
import QuickFitCheckjobs from "./Pages/Services/ApplyForJobs/QuickFitCheckjobs";
import TechQuizzes from "./Pages/Services/TechQuizzes";
import LoginNew from "./Pages/Auth/LoginNew";
import InterviewPlanGenerator from "./Pages/JdAnalyzer/InterviewPlanGenerator";
import GenerateInterviewPlan from "./Pages/JdAnalyzer/GenerateInterviewPlan";
import ShareableProfileSection from "./Components/ShareableProfileSection";
import Profile from "./Pages/ProfilePage/Profile";
import CreateProfile from "./Pages/ProfilePage/CreateProfile";
import Courses from "./Pages/FooterPages/Courses";
import Services from "./Components/Services";
import ProjectWizard from "./Pages/Services/ProjectWizard";
import ResumeBanner from "./Pages/Services/ResumeBuilder/ResumeBanner";
import AIResumeEditor from "./Pages/Services/ResumeBuilder/AIResumeEditor";
import Footer from "./Components/Footer";
import InternshipOpportunities from "./Pages/Services/Internship Opportunities/InternshipOpportunities";
import OpenInternships from "./Pages/Services/Internship Opportunities/OpenInternship";
import QuickApply from "./Pages/Services/Internship Opportunities/QuickApply";
import QuickFitCheck from "./Pages/Services/Internship Opportunities/QuickFitCheck";
import ScrollToTop from "./Components/ScrollToTop";
import AICareerAssistant from "./Pages/Services/AICareerAssistant/AICareerAssistant";
import ViewMyLearningRoadmap from "./Pages/Services/AICareerAssistant/ViewMyLearningRoadmap";
import GACertification from "./Pages/Services/GlobalCertification/GACertification";
import ExploreMyRoleMatches from "./Pages/Services/AICareerAssistant/ExploreMyRoleMatches";
import StartmyMockInterview from "./Pages/Services/AICareerAssistant/StartmyMockInterview/StartmyMockInteview";
import FreshersInterview from "./Pages/Services/FreshersInterview/FreshersInterview";
import ShowMySkillGaps from "./Pages/Services/AICareerAssistant/ShowMySkillGaps";
import AboutHiCoreSection from "./Components/AboutHiCoreSection";
import WeekTemplate from "./Pages/Services/FreshersInterview/WeekTemplate";
import Intro from "./Pages/Services/Freelance Projects for Students/Intro";
import SmartGigBanner from "./Pages/Services/Freelance Projects for Students/SmartGigBanner";
import MentorLandingPage from "./Pages/Services/MentorConnect/MentorLandingPage";
import AllMentorsPage from "./Pages/Services/MentorConnect/AllMentorsPage";
import BecomeMentorPage from "./Pages/Services/MentorConnect/BecomeMentorPage";
import ContentPage from "./Pages/Services/FreshersInterview/ContentPage";
import ApplyGigForm from "./Pages/Services/Freelance Projects for Students/ApplyGigForm";
import MentorApplicationForm from "./Pages/Services/MentorConnect/MentorApplicationForm";
import StudentsProfile from "./Pages/Services/ViewProfile/StudentsProfile";
import JobSeekerProfile from "./Pages/Services/ViewProfile/jobSeekersprofile/JobSeekerProfile";
import InterviewLanding from "./Pages/Services/InterviewPreparation/InterviewLanding";
import VideoUploadPage from "./Pages/Services/ShowcaseProfile/VideoUploadPage";
import ShowcaseProfile from "./Pages/Services/ShowcaseProfile/ShowcaseProfile";
import StartPage from "./Pages/Services/InterviewPreparation/StartPage";
import Hicoreglobal from "./Pages/Services/HicoreGlobal/Hicoreglobal";
import StudyAbroad from "./Pages/Services/HicoreGlobal/StudyAbroad";
import Reviewquiz from "./Pages/Services/InterviewPreparation/Reviewquiz";
import PostJob from "./Pages/Services/EmployersSection/PostJobsInternships/PostJob";
import PostJobMain from "./Pages/Services/EmployersSection/PostJobsInternships/PostJobMain";
import CandidateProfile from "./Pages/Services/EmployersSection/CandidateProfile/CandidateProfile";
import ViewProfile from "./Pages/Services/EmployersSection/CandidateProfile/Viewprofile";
import Exploretalentpool from "./Pages/Services/EmployersSection/CandidateProfile/Exploretalentpool";
import AiAssistance from "./Pages/Services/EmployersSection/PostJobsInternships/AiAssistance";
import PaymentPage from "./Pages/Auth/PaymentPage";
import SuccessPage from "./Pages/Auth/SuccessPage";
import LandingPage from "./Pages/Services/EmployersSection/ManageApplications/LandingPage";
import JobPostSuccess from "./Pages/Services/EmployersSection/PostJobsInternships/JobPostSuccess";
import ViewTopTalent from "./Pages/Services/ViewTopTalent/ViewTopTalent";
import Viewtopprofile from "./Pages/Services/ViewTopTalent/Viewtopprofile";
import BrowseTopTalent from "./Pages/Services/ViewTopTalent/BrowseTopTalent";
import ManageApplications from "./Pages/Services/EmployersSection/ManageApplications/ManageApplications";
import JDBasedHome from "./Pages/Services/AiBasedJDShortlisting/JDBasedHome";
import HiringPage from "./Pages/Services/AiBasedJDShortlisting/HiringPage";
import AIShortlistingPage from "./Pages/Services/AiBasedJDShortlisting/AIShortlistingPage";
import AiAssistantPage from "./Pages/Services/AiBasedJDShortlisting/AiAssistantPage";
import Finalyearproject from "./Pages/Services/MentorSection/Guidefinalyearprojects/Finalyearproject";
import HostInterviewHome from "./Pages/Services/MentorSection/HostMockInterview/HostInterviewHome";
import MockInterviewSetupPage from "./Pages/Services/MentorSection/HostMockInterview/MockInterviewSetupPage";
import Mentoringprojects from "./Pages/Services/MentorSection/Guidefinalyearprojects/Mentoringprojects";
import ViewMockInterviewRequests from "./Pages/Services/MentorSection/HostMockInterview/ViewMockInterviewRequests";
import MockInterviewRequestDetails from "./Pages/Services/MentorSection/HostMockInterview/MockInterviewRequestDetails";
import ReviewLandingPage from "./Pages/Services/MentorSection/ReviewStudentProjects/ReviewLandingPage";
import ViewPopup from "./Pages/Services/MentorSection/Guidefinalyearprojects/ViewPopup";
import Reviewproject from "./Pages/Services/MentorSection/ReviewStudentProjects/Reviewproject";
import EarnRecognitionAndBadges from "./Pages/Services/EarnRecogAndBadges/EarnRecognitionAndBadges";
import StartBadgesPage from "./Pages/Services/EarnRecogAndBadges/StartBadgesPage";
import BecomeMentor from "./Pages/Services/MentorSection/BecomeMentor.jsx/BecomeMentor";
import MentorApplication from "./Pages/Services/MentorSection/BecomeMentor.jsx/MentorApplication";
import StudentDashboard from "./Pages/Dashboard/Student/StudentDashboard";
import Coursedashboard from "./Pages/Dashboard/Student/Coursedashboard";
import FullTimeJobDashboard from "./Pages/Dashboard/Student/FullTimeJobDashboard";
import PartTimeJobsDashboard from "./Pages/Dashboard/Student/PartTimeJobsDashboard";
import FreelanceDashboard from "./Pages/Dashboard/Student/FreelanceDashboard";
import Dashboard from "./Pages/Dashboard/Student/Dashboard/Dashboard";
import InternshipCertification from "./Pages/Dashboard/Student/Certifications/InternshipCertification/InternshipCertification";
import Freshers from "./Pages/Dashboard/Student/Interview/FreshersInterview/Freshers";
import Higherstudy from "./Pages/Dashboard/Student/Certifications/HigherStudies/Higherstudy";
import Freelance from "./Pages/Dashboard/Student/Freelance/Freelance";
import AboutHiCorePage from "./Pages/Dashboard/About/AboutHicorePage";
import InterProject from "./Pages/Dashboard/Student/IntershipProjects/InterProject";
import FinalYear from "./Pages/Dashboard/Student/FinalYearProject/FinalYear";
import SmartRoleSuggestionsDashboard from "./Pages/Dashboard/Student/AITools/CareerAssistance/SmartRoleSuggestionsDashboard";
import SkillGapAnalysisDashboard from "./Pages/Dashboard/Student/AITools/CareerAssistance/SkillGapAnalysisDashboard";
import ViewMyLearningRoadmapDashboard from "./Pages/Dashboard/Student/AITools/CareerAssistance/ViewMyLearningRoadmapDashboard";
import CareerAssistanceLayout from "./Pages/Dashboard/Student/AITools/CareerAssistance/CareerAssistanceLayout";
import StartmyMockInterviewDashboard from "./Pages/Dashboard/Student/AITools/CareerAssistance/StartmyMockInterview/StartmyMockInteviewDashboard";
import SettingsPage from "./Pages/Dashboard/Settings/SettingsPage";
import ResumeBuilder from "./Pages/Dashboard/Student/ResumeBuilder/ResumeBuilder";
import Help from "./Pages/Dashboard/Help/Help";
import Logout from "./Pages/Dashboard/Logout/Logout";
import SubmitInnovation from "./Pages/Dashboard/Student/Innovation/SubmitInnovation";
import GlobalProjects from "./Pages/Dashboard/Student/Innovation/GlobalProjects";
import IndustryCertificate from "./Pages/Dashboard/Student/Certifications/IndustryCertification/IndustryCertificate";
import Subscriptions from "./Pages/Dashboard/Subscription/Subscriptions";
import FlashcardActivityDashboard from "./Pages/Dashboard/Student/Interview/Flashcards/FlashcardActivityDashboard";
import TechQuizDashboard from "./Pages/Dashboard/Student/Interview/Quiz/TechQuizDashboard";
import MockInterviewDashboard from "./Pages/Dashboard/Student/Interview/MockInterview/MockInterviewDashboard";
import MyCareer from "./Pages/Dashboard/Student/MycareerStudio/MyCareer";
import MentorDashboard from "./Pages/Dashboard/Mentor/MentorDashboard";
import DashboardMentor from "./Pages/Dashboard/Mentor/Dashboard/DashboardMentor";
import DomainCourseDashboard from "./Pages/Dashboard/Student/DomainCourseDashboard";
import MentorProjectsPage from "./Pages/Dashboard/Mentor/Projects/MentorProjectsPage";
import JobSeekerDashboard from "./Pages/Dashboard/JobSeeker/JobSeekerDashboard";
import JobSeekerDashboardPage from "./Pages/Dashboard/JobSeeker/JobSeekerDashboardPage";
import MenteeDashboard from "./Pages/Dashboard/Mentor/MenteeDashboard/MenteeDashboard";
import MyCareerJobSeeker from "./Pages/Dashboard/JobSeeker/MyCarrerStudio/MyCareerJobSeeker";
import JobSeekerCourse from "./Pages/Dashboard/JobSeeker/Learn/JobSeekerCourse";
import JoseekerDomainPage from "./Pages/Dashboard/JobSeeker/Learn/JoseekerDomainPage";
import InternshipJobseeker from "./Pages/Dashboard/JobSeeker/Certifications/IntershipCertifications/InternshipJobseeker";
import HigherstudyJobseeker from "./Pages/Dashboard/JobSeeker/Certifications/HigherStudies/HigherStudyJoobseeker";
import IndustryCertifications from "./Pages/Dashboard/JobSeeker/Certifications/IndustryCertification/IndustryCertifications";
import FlashcardActivityJSDashboard from "./Pages/Dashboard/JobSeeker/Interview/Flashcards/FlashcardActivityJSDashboard";
import TechQuizJSDashboard from "./Pages/Dashboard/JobSeeker/Interview/Quiz/TechQuizJSDashboard";
import MockInterviewJSDashboard from "./Pages/Dashboard/JobSeeker/Interview/MockInterview/MockInterviewJSDashboard";
import FreshersJSDashboard from "./Pages/Dashboard/JobSeeker/Interview/FreshersInterview/FreshersJSDashboard";
import FullTimeJSDashboard from "./Pages/Dashboard/JobSeeker/Jobs/FullTimeJSDashboard";
import InterbshipPage from "./Pages/Dashboard/JobSeeker/Projects/Internship/InterbshipPage";
import FinalYearPage from "./Pages/Dashboard/JobSeeker/Projects/FinalYear/FinalYearPage";
import FreelancePage from "./Pages/Dashboard/JobSeeker/Projects/Freelance/FreelancePage";
import CareerAssistance from "./Pages/Dashboard/JobSeeker/AITools/CareerAssistance/CareerAssistance";
import JobSeekerResumebuilder from "./Pages/Dashboard/JobSeeker/AITools/ResumeBuilder/JobSeekerResumebuilder";
import SubmitInnovations from "./Pages/Dashboard/JobSeeker/Innovations/SubmitInnovations";
import JobSeekerGlobalProjects from "./Pages/Dashboard/JobSeeker/Innovations/JobSeekerGlobalProjects";
import SessionsPage from "./Pages/Dashboard/Mentor/Sessions/SessionsPage";
import AchievementsPage from "./Pages/Dashboard/Mentor/Achievements/AchievementsPage";
import Earninghome from "./Pages/Dashboard/Mentor/Earnings/Earninghome";
import EmployeerDashboard from "./Pages/Dashboard/Employeer/EmployeerDashboard";
import DashboardEmployeer from "./Pages/Dashboard/Employeer/Dashboard/DashboardEmployeer";
import Jobposts from "./Pages/Dashboard/Employeer/JobPosts/Jobposts";
import ApplicationsPage from "./Pages/Dashboard/Employeer/EmployerApplication/ApplicationsPage";
import ShortlistedSection from "./Pages/Dashboard/Employeer/EmployerApplication/ShortlistedSection";
import TopTalent from "./Pages/Dashboard/Employeer/TopTalent/TopTalent";
import Hackathon from "./Pages/Dashboard/Employeer/HackathonHub/Hackathon";
import Shortlisting from "./Pages/Dashboard/Employeer/AI Shortlisting/Shortlisting";
import Insights from "./Pages/Dashboard/Employeer/Insights&Analytics/Insights";
import Performance from "./Pages/Dashboard/Mentor/Performance/Performance";
import SavedTopTalent from "./Pages/Dashboard/Employeer/SavedTopTalent/SavedTopTalent";
import Topbar from "./Pages/CareerChoosePage/Topbar";
import Coursetabs from "./Components/Coursetabs";
import CertificationQuiz from "./Pages/Certificationquiz";
import ProjectDescription from "./Pages/ProfilePage/ProjectDescription";
import BeginnerQuestions from "./Components/BeginnerQuestions";
import ViewStudentProfile from "./Pages/Services/ViewProfile/ViewStudentProfile";
import ViewJobSeekerProfile from "./Pages/Services/ViewProfile/jobSeekersprofile/ViewJobSeekerProfile";
import MiniProjects from "./Pages/Services/Projects/MiniProjects/MiniProjects";
import FinalYearProjects from "./Pages/Services/Projects/FinalYearProjects/FinalYearProjects";
import MajorProjects from "./Pages/Services/Projects/MajorProjects/MajorProjects";
import FloatingSidebar from "./Components/FloatingSidebar";
import MiniProject from "./Pages/Dashboard/Student/MiniProject/MiniProject";
import ContactSection from "./Components/ContactSection";
import InternshipDashboard from "./Pages/Dashboard/JobSeeker/Jobs/InternshipDashboard";
import CareerGoal from "./Pages/CareerChoosePage/CareerGoal";
import CareercourseItems from "./Pages/CareerChoosePage/CareercourseItems";
import Careercoursepage from "./Pages/CareerChoosePage/Careercoursepage";

const App = () => {
  const location = useLocation();

  const unimplementedPaths = [];

  //  Hide Navbar & Footer for all `/student-dashboard` and nested routes
  const hideLayout =
    location.pathname.startsWith("/student-dashboard") ||
    location.pathname.startsWith("/mentor-dashboard") ||
    location.pathname.startsWith("/jobseeker-dashboard") ||
    location.pathname.startsWith("/employer-dashboard");

  return (
    <>
      <ScrollToTop />
      {!hideLayout && <Navbar unimplementedPaths={unimplementedPaths} />}
      <FloatingSidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/beginner" element={<BeginnerQuestions />} />
        <Route path="/course" element={<Coursetabs />} />
        <Route path="/aboutus" element={<AboutHiCoreSection />} />
        <Route path="/contact-us" element={<ContactSection />} />
        <Route path="/courses/:courseId" element={<CoursePage />} />
        <Route path="/courses/:courseId/enroll" element={<EnrollPage />} />
        <Route path="/courses/:courseId/:topicId" element={<CourseItems />} />
        <Route path="/find-my-courses/:courseId" element={<Coursepage />} />
          <Route path="/career-goal" element={<CareerGoal />} />
          <Route path="/find-my-courses/:courseId/:topicId" element={<CareercourseItems />} />
        <Route path="/find-my-courses/:courseId/enroll" element={<EnrollPage />} />
        <Route path="/find-my-courses/:courseId" element={<Careercoursepage />} />
        <Route path="/certification-quiz" element={<CertificationQuiz />} />
        <Route path="/internship-project" element={<InternshipProjects />} />
        <Route
          path="/internship-project/:projectId/project-wizard"
          element={<ProjectWizard />}
        />
        <Route path="/mini-project" element={<MiniProjects />} />
        <Route path="/final-year-project" element={<FinalYearProjects />} />
        <Route path="/major-projects" element={<MajorProjects />} />
        <Route path="/domain/semiconductors" element={<Semiconductors />} />
        <Route path="/applyforjobs" element={<ApplyForJobs />} />
        <Route path="/applyforjobs/quick-apply" element={<QuickApplyjobs />} />
        <Route path="/applyforjobs/quick-fit-check" element={<QuickFitCheckjobs />} />
        <Route path="/generate-interview" element={<GenerateInterviewPlan />} />
        <Route path="/jd-analyzer" element={<InterviewPlanGenerator />} />
        <Route path="/jd-analyzer/plan" element={<GenerateInterviewPlan />} />
        <Route path="/share-profile" element={<ShareableProfileSection />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/viewstudentprofile/:userId" element={<ViewStudentProfile />} />
        <Route path="/viewjobseekerprofile/:userId" element={<ViewJobSeekerProfile />} />
        <Route path="/viewstudentprofile/project-description" element={<ProjectDescription />} />
        <Route path="/viewjobseekerprofile/project-description" element={<ProjectDescription />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route
          path="/profile/project-description"
          element={<ProjectDescription />}
        />
        <Route path="/tech-quizzes" element={<TechQuizzes />} />
        <Route path="/login" element={<LoginNew />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/services" element={<Services />} />
        <Route path="/resume-builder" element={<ResumeBanner />} />
        <Route path="/resume-editor" element={<AIResumeEditor />} />
        <Route
          path="/internship-opportunities"
          element={<InternshipOpportunities />}
        />
        <Route path="/browse-open-internships" element={<OpenInternships />} />
        <Route path="/quick-apply" element={<QuickApply />} />
        <Route path="/quick-fit-check" element={<QuickFitCheck />} />
        <Route path="/ai-carrer-assistant" element={<AICareerAssistant />} />
        <Route
          path="/ai-career-assistant/learning-roadmap"
          element={<ViewMyLearningRoadmap />}
        />
        <Route
          path="/ai-career-assistant/role-suggestions"
          element={<ExploreMyRoleMatches />}
        />
        <Route
          path="/ai-career-assistant/skill-gap-analysis"
          element={<ShowMySkillGaps />}
        />
        <Route
          path="/ai-career-assistant/mock-interview"
          element={<StartmyMockInterview />}
        />
        <Route
          path="/globally-accepted-certifications"
          element={<GACertification />}
        />
        <Route path="/freelance-projects-students" element={<Intro />} />
        <Route path="/freelance-projects" element={<SmartGigBanner />} />
        <Route path="/freelance/apply" element={<ApplyGigForm />} />
        <Route
          path="/fresher-interview-success-program"
          element={<FreshersInterview />}
        />
        <Route
          path="/fresher-interview-success-program/:weekId"
          element={<WeekTemplate />}
        />
        <Route
          path="/fresher-interview-success-program/:weekId/:topicId"
          element={<ContentPage />}
        />
        <Route path="/mentor-connect" element={<MentorLandingPage />} />
        <Route path="/all-mentors" element={<AllMentorsPage />} />
        <Route path="/become-a-mentor" element={<BecomeMentorPage />} />
        <Route path="/apply-as-mentor" element={<MentorApplicationForm />} />
        <Route path="/student-profile" element={<StudentsProfile />} />
        <Route path="/job-seeker-profile" element={<JobSeekerProfile />} />
        <Route path="/interview-preparation" element={<InterviewLanding />} />
        <Route path="/practice-section" element={<StartPage />} />
        <Route path="/review" element={<Reviewquiz />} />
        <Route path="/showcase-video-profile" element={<ShowcaseProfile />} />
        <Route path="/upload" element={<VideoUploadPage />} />
        <Route path="/hicore-global-edconnect" element={<Hicoreglobal />} />
        <Route
          path="/hicore-global-edconnect/study-abroad-plan"
          element={<StudyAbroad />}
        />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/post-jobs" element={<PostJob />} />
        <Route path="/post-jobs/internships" element={<PostJobMain />} />
        <Route path="/employer/job-post-success" element={<JobPostSuccess />} />
        <Route path="/ai-assistance" element={<AiAssistance />} />
        <Route path="/candidate-profile" element={<CandidateProfile />} />
        <Route path="/candidate-profile/project-description" element={<ProjectDescription />} />
        <Route path="/candidate-profile/:userId" element={<ViewProfile />} />
        <Route
          path="/candidate-profile/exploretalentpool"
          element={<Exploretalentpool />}
        />
        <Route path="/view-top-talent" element={<ViewTopTalent />} />
        <Route path="/view-top-talent/:userId" element={<Viewtopprofile />} />
        <Route path="/browse-top-talent" element={<BrowseTopTalent />} />
        <Route path="/manage-applications" element={<LandingPage />} />
        <Route path="/manage-applications/manage" element={<ManageApplications />} />
        <Route path="/ai-based-shortlisting" element={<JDBasedHome />} />
        <Route path="/hiring" element={<HiringPage />} />
        <Route path="/ai-shortlisting" element={<AIShortlistingPage />} />
        <Route path="/ai-assistant" element={<AiAssistantPage />} />
        <Route path="/mock-interview" element={<HostInterviewHome />} />
        <Route
          path="/mock-interview-setup"
          element={<MockInterviewSetupPage />}
        />
        <Route
          path="/view-mock-interview-setup"
          element={<ViewMockInterviewRequests />}
        />
        <Route
          path="/mock-interview-requests/:id"
          element={<MockInterviewRequestDetails />}
        />
        <Route
          path="/guide-final-year-projects"
          element={<Finalyearproject />}
        />
        <Route
          path="/guide-final-year-projects/mentoringprojects"
          element={<Mentoringprojects />}
        />
        <Route
          path="/guide-final-year-projects/mentoringprojects/reviewsummary"
          element={<ViewPopup />}
        />
        <Route path="/student-review" element={<ReviewLandingPage />} />
        <Route
          path="/student-review/review-project"
          element={<Reviewproject />}
        />
        <Route
          path="/earn-recognition"
          element={<EarnRecognitionAndBadges />}
        />
        <Route path="/start-badges" element={<StartBadgesPage />} />
        <Route path="/become-mentor" element={<BecomeMentor />} />
        <Route path="/apply-mentor" element={<MentorApplication />} />

        <Route path="/steps-career" element={<Topbar />} />

        {/* Student Dashboard (Navbar & Footer Hidden) */}
        <Route path="/student-dashboard" element={<StudentDashboard />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="post-jobs" element={<PostJobMain />} />
          <Route path="apply-mentor" element={<MentorApplication />} />
          <Route path="learn/courses" element={<Coursedashboard />} />
          <Route
            path="jobs/full-time-jobs"
            element={<FullTimeJobDashboard />}
          />
          <Route
            path="/student-dashboard/jobs/internship"
            element={<PartTimeJobsDashboard />}
          />
          <Route path="jobs/freelance" element={<FreelanceDashboard />} />
          <Route
            path="certifications/internship"
            element={<InternshipCertification />}
          />
          <Route
            path="certifications/higher-studies"
            element={<Higherstudy />}
          />
          <Route
            path="/student-dashboard/interview/freshers"
            element={<Freshers />}
          />
          <Route path="projects/mini-project" element={<MiniProject />} />
          <Route path="projects/inter-project" element={<InterProject />} />
          <Route path="projects/final-year-project" element={<FinalYear />} />
          <Route path="projects/freelance-projects" element={<Freelance />} />
          <Route path="about-hicore" element={<AboutHiCorePage />} />

          <Route
            path="student-dashboard/ai-tools/career-assistant"
            element={<CareerAssistanceLayout />}
          />
          <Route
            path="student-dashboard/ai-tools/career-assistance/smart-role-suggestions"
            element={<SmartRoleSuggestionsDashboard />}
          />
          <Route
            path="student-dashboard/ai-tools/career-assistance/skill-gap-analysis"
            element={<SkillGapAnalysisDashboard />}
          />
          <Route
            path="student-dashboard/ai-tools/career-assistance/view-learning-roadmap"
            element={<ViewMyLearningRoadmapDashboard />}
          />
          <Route
            path="student-dashboard/ai-tools/career-assistance/interview-readiness"
            element={<StartmyMockInterviewDashboard />}
          />

          <Route
            path="student-dashboard/resume-builder"
            element={<ResumeBuilder />}
          />

          <Route
            path="student-dashboard/interview/flashcard-activity"
            element={<FlashcardActivityDashboard />}
          />
          <Route
            path="student-dashboard/interview/quiz"
            element={<TechQuizDashboard />}
          />
          <Route
            path="student-dashboard/interview/mock-interview"
            element={<MockInterviewDashboard />}
          />

          <Route path="student-dashboard/settings" element={<SettingsPage />} />

          <Route path="student-dashboard/help" element={<Help />} />

          <Route
            path="student-dashboard/subscription"
            element={<Subscriptions />}
          />
          <Route path="student-dashboard/logout" element={<Logout />} />
          <Route
            path="student-dashboard/innovations/submit"
            element={<SubmitInnovation />}
          />
          <Route
            path="student-dashboard/innovations/global-projects"
            element={<GlobalProjects />}
          />
          <Route
            path="/student-dashboard/certifications/industry"
            element={<IndustryCertificate />}
          />
          <Route
            path="/student-dashboard/carrer-studio"
            element={<MyCareer />}
          />
          <Route
            path="/student-dashboard/learn/domain-courses"
            element={<DomainCourseDashboard />}
          />
        </Route>

        <Route path="/mentor-dashboard" element={<MentorDashboard />}>
          <Route index element={<DashboardMentor />} />
          <Route
            path="/mentor-dashboard/dashboard"
            element={<DashboardMentor />}
          />
          <Route
            path="/mentor-dashboard/projects"
            element={<MentorProjectsPage />}
          />
          <Route
            path="/mentor-dashboard/mentees"
            element={<MenteeDashboard />}
          />
          <Route path="/mentor-dashboard/sessions" element={<SessionsPage />} />
          <Route
            path="/mentor-dashboard/achievements"
            element={<AchievementsPage />}
          />
          <Route path="/mentor-dashboard/earnings" element={<Earninghome />} />
          <Route
            path="/mentor-dashboard/performance"
            element={<Performance />}
          />
          <Route path="about-hicore" element={<AboutHiCorePage />} />
          <Route
            path="mentor-dashboard/subscription"
            element={<Subscriptions />}
          />
          <Route path="mentor-dashboard/settings" element={<SettingsPage />} />
          <Route path="mentor-dashboard/help" element={<Help />} />
          <Route path="mentor-dashboard/logout" element={<Logout />} />
        </Route>

        <Route path="/jobseeker-dashboard" element={<JobSeekerDashboard />}>
          <Route index element={<JobSeekerDashboardPage />} />
          <Route
            path="/jobseeker-dashboard/dashboard"
            element={<JobSeekerDashboardPage />}
          />
          <Route
            path="/jobseeker-dashboard/carrer-studio"
            element={<MyCareerJobSeeker />}
          />
          <Route
            path="/jobseeker-dashboard/learn/course"
            element={<JobSeekerCourse />}
          />
          <Route
            path="/jobseeker-dashboard/learn/domain-course"
            element={<JoseekerDomainPage />}
          />
          <Route
            path="/jobseeker-dashboard/certifications/internship"
            element={<InternshipJobseeker />}
          />
          <Route
            path="/jobseeker-dashboard/certifications/higher-studies"
            element={<HigherstudyJobseeker />}
          />
          <Route
            path="/jobseeker-dashboard/certifications/industry"
            element={<IndustryCertifications />}
          />
          <Route
            path="/jobseeker-dashboard/interview/freshers"
            element={<FreshersJSDashboard />}
          />
          <Route
            path="jobseeker-dashboard/interview/flashcard-activity"
            element={<FlashcardActivityJSDashboard />}
          />
          <Route
            path="jobseeker-dashboard/interview/quiz"
            element={<TechQuizJSDashboard />}
          />
          <Route
            path="jobseeker-dashboard/interview/mock-interview"
            element={<MockInterviewJSDashboard />}
          />
          <Route
            path="/jobseeker-dashboard/jobs/full-time-jobs"
            element={<FullTimeJSDashboard />}
          />
          <Route
            path="/jobseeker-dashboard/jobs/internships"
            element={<InternshipDashboard />}
          />
          <Route
            path="/jobseeker-dashboard/projects/inter-project"
            element={<InterbshipPage />}
          />
          <Route
            path="/jobseeker-dashboard/projects/final-year-project"
            element={<FinalYearPage />}
          />
          <Route
            path="/jobseeker-dashboard/projects/freelance-projects"
            element={<FreelancePage />}
          />
          <Route
            path="jobseeker-dashboard/ai-tools/career-assistant"
            element={<CareerAssistance />}
          />
          <Route
            path="jobseeker-dashboard/resume-builder"
            element={<JobSeekerResumebuilder />}
          />
          <Route
            path="jobseeker-dashboard/innovations/submit"
            element={<SubmitInnovations />}
          />
          <Route
            path="jobseeker-dashboard/innovations/global-projects"
            element={<JobSeekerGlobalProjects />}
          />
          <Route path="about-hicore" element={<AboutHiCorePage />} />
          <Route
            path="jobseeker-dashboard/subscription"
            element={<Subscriptions />}
          />
          <Route
            path="jobseeker-dashboard/settings"
            element={<SettingsPage />}
          />
          <Route path="jobseeker-dashboard/help" element={<Help />} />
          <Route path="jobseeker-dashboard/logout" element={<Logout />} />
        </Route>

        <Route path="/employer-dashboard" element={<EmployeerDashboard />}>
          <Route index element={<DashboardEmployeer />} />
          <Route path="dashboard" element={<DashboardEmployeer />} />

          <Route path="/employer-dashboard/job-posts" element={<Jobposts />} />

          <Route
            path="/employer-dashboard/applications"
            element={<ApplicationsPage />}
          />
          <Route
            path="/employer-dashboard/shortlist-application"
            element={<ShortlistedSection />}
          />
          <Route
            path="/employer-dashboard/top-talent"
            element={<TopTalent />}
          />

          <Route
            path="/employer-dashboard/hackathon-hub"
            element={<Hackathon />}
          />

          <Route
            path="/employer-dashboard/ai-shortlisting"
            element={<Shortlisting />}
          />

          <Route path="/employer-dashboard/insights" element={<Insights />} />
          <Route path="/employer-dashboard/save" element={<SavedTopTalent />} />

          <Route path="about-hicore" element={<AboutHiCorePage />} />
          <Route
            path="employer-dashboard/subscription"
            element={<Subscriptions />}
          />
          <Route
            path="employer-dashboard/settings"
            element={<SettingsPage />}
          />
          <Route path="employer-dashboard/help" element={<Help />} />
          <Route path="employer-dashboard/logout" element={<Logout />} />
        </Route>
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
};

export default App;
