// File: src/Routes/HomeConfig.jsx
import React from 'react';
import LaunchCareerSection from '../Components/LaunchCareerSection';
import AboutHiCoreSection from '../Components/AboutHiCoreSection';
import ShareableProfileSection from '../Components/ShareableProfileSection';
import CertificationSection from '../Components/CertificationSection';
import ReadyToLaunchSection from '../Components/ReadyToLaunchSection';
import BannerPage from '../Components/BannerPage';
import ProgramsPage from '../Components/ProgramsPage';
import CareerChoose from '../Components/CareerChoose';

export const homeRoutes = {
  label: "Home",
  path: "/",
  layoutConfig: [
    { component: BannerPage },
    { component: LaunchCareerSection },
    { component: AboutHiCoreSection },
    { component: CareerChoose },
    { component: ShareableProfileSection },
    { component: CertificationSection },
    { component: ProgramsPage },
    { component: ReadyToLaunchSection },
  ],
};
