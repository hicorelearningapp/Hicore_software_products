import React, { useEffect, useRef, useState } from 'react';
import DynamicTopicRender from '../../Components/DynamicTopicRender';
import {
  Step1, Step2, Step3, Step4, Step5,
  Step6, Step7, Step8, Step9, Step10,
  Step11, Step12, Step13,
} from '../../../data/SemiConductor/Step';

const topTabs = ['Introduction', 'Software', 'Mechanical', 'Electrical', 'Process Engineer'];

const tabSidebarData = {
  Introduction: {
    steps: [
      Step1, Step2, Step3, Step4, Step5,
      Step6, Step7, Step8, Step9, Step10,
      Step11, Step12, Step13,
    ],
    titles: [
      'Silicon Ingot Growth Content',
      'Wafer Slicing and Polishing',
      'Wafer Cleaning',
      'Thermal Oxidation',
      'Photolithography',
      'Etching',
      'Ion Implantation',
      'Thin Film Deposition',
      'Chemical Mechanical Planarization (CMP)',
      'Metallization',
      'Wafer Testing (Probe Test)',
      'Dicing',
      'Packaging and Final Testing',
    ]
  },
  Software: {
    steps: [
      [
        { type: "heading", text: "Software Role in Semiconductors" },
        { type: "paragraph", text: "Handles automation, EDA tools, simulation, and testing." }
      ],
      [
        { type: "heading", text: "Tools Used" },
        { type: "paragraph", text: "Common tools include Cadence, Synopsys, and Mentor Graphics." }
      ]
    ],
    titles: ['Overview', 'Tools Used']
  },
  Mechanical: {
    steps: [
      [
        { type: "heading", text: "Mechanical Engineering" },
        { type: "paragraph", text: "Focuses on fabrication equipment and precision mechanics." }
      ],
      [
        { type: "heading", text: "Thermal and Structural Analysis" },
        { type: "paragraph", text: "Ensures materials withstand fab conditions." }
      ]
    ],
    titles: ['Overview', 'Thermal and Structural Analysis']
  },
  Electrical: {
    steps: [
      [
        { type: "heading", text: "Electrical Engineering" },
        { type: "paragraph", text: "Handles power delivery, circuit design, and device behavior." }
      ],
      [
        { type: "heading", text: "Analog & Digital Design" },
        { type: "paragraph", text: "Engineers design logic gates, amplifiers, and ADCs." }
      ]
    ],
    titles: ['Overview', 'Analog & Digital Design']
  },
  'Process Engineer': {
    steps: [
      [
        { type: "heading", text: "Process Engineering" },
        { type: "paragraph", text: "Focuses on optimizing each manufacturing stage for yield and efficiency." }
      ],
      [
        { type: "heading", text: "Statistical Process Control (SPC)" },
        { type: "paragraph", text: "Used to monitor and control the semiconductor process." }
      ]
    ],
    titles: ['Overview', 'Statistical Process Control']
  },
};

const Semiconductors = () => {
  const [selectedTab, setSelectedTab] = useState('Introduction');
  const [activeStep, setActiveStep] = useState(0);
  const sidebarRef = useRef(null);
  const contentRef = useRef(null);

  const { steps, titles } = tabSidebarData[selectedTab];

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#step-')) {
      const stepNum = parseInt(hash.replace('#step-', ''));
      if (stepNum >= 1 && stepNum <= steps.length) {
        setActiveStep(stepNum - 1);
      }
    }
  }, [selectedTab]);

  useEffect(() => {
    window.history.replaceState(null, '', `#step-${activeStep + 1}`);
  }, [activeStep]);

  useEffect(() => {
    if (sidebarRef.current && contentRef.current) {
      contentRef.current.style.maxHeight = `${sidebarRef.current.offsetHeight}px`;
    }
  }, [activeStep, selectedTab]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Tab Navigation Bar */}
      <div className="bg-white border-b px-4 py-2 flex items-center space-x-4 font-medium">
        <span className="text-gray-700 mr-4 font-semibold">Semiconductor:</span>
        {topTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setSelectedTab(tab);
              setActiveStep(0);
            }}
            className={`px-3 py-1 rounded ${
              selectedTab === tab ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Sidebar + Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          className="w-60 border-r bg-gray-50 p-4"
        >
          <h2 className="text-lg font-semibold mb-4">{selectedTab}</h2>
          <div className="space-y-2">
            {titles.map((title, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`block w-full text-left px-3 py-1 rounded ${
                  activeStep === index
                    ? 'bg-blue-600 text-white font-medium'
                    : 'hover:bg-gray-200'
                }`}
              >
                {title}
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main
          ref={contentRef}
          className="flex-1 p-6 overflow-y-auto"
          style={{ height: '100%', boxSizing: 'border-box' }}
        >
          <h1 className="text-2xl font-bold mb-4">{titles[activeStep]}</h1>
          <DynamicTopicRender content={steps[activeStep]} />
        </main>
      </div>
    </div>
  );
};

export default Semiconductors;
