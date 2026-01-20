import React from 'react'
import Navbar from '../Components/Navbar'
import RoleCards from '../Components/RoleCards'
import Medicinenetwork from '../Components/Medicinenetwork'
import WhyChooseus from '../Components/WhyChooseus'
import HowItworks from '../Components/HowItworks'
import Stackholder from '../Components/Stackholder'
import MedicineCategories from '../Components/MedicineCategories'
import AIFeatures from '../Components/AIFeatures'
import Bottombanner from '../Components/Bottombanner'

const Home = () => {
  return (
    <div>
      <Navbar />

      <div id="Medicinenetwork">
        <Medicinenetwork />
      </div>

      <div id="RoleCards">
        <RoleCards />
      </div>

      <div id="WhyChooseus">
        <WhyChooseus />
      </div>

      <div id="HowItWorks">
        <HowItworks />
      </div>

      <div id="Stakeholder">
        <Stackholder />
      </div>

      <div id="Medicines">
        <MedicineCategories />
      </div>

      <div id="AIFeatures">
        <AIFeatures />
      </div>

      <Bottombanner />
    </div>
  );
}

export default Home;
