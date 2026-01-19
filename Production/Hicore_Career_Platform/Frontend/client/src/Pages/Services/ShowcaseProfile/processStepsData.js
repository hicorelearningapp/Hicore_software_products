import {
  PiVideoCamera,
  PiPencilSimpleLine,
  PiMonitorPlay,
  PiCheckSquare,
} from "react-icons/pi";

const processStepsData = [
  {
    step: "Step 1",
    title: "Choose Your Option",
    icon: PiVideoCamera,
    description: ["Record Now (Live Recording)", "Upload a Video File"],
    bgColor: "bg-yellow-50",
  },
  {
    step: "Step 2",
    title: "Add a Title & Short Description",
    icon: PiPencilSimpleLine,
    description:
      "Give your video a clear, catchy title and a 1–2 line summary.",
    bgColor: "bg-yellow-50",
  },
  {
    step: "Step 3",
    title: "Preview",
    icon: PiMonitorPlay,
    description:
      "Review your video to ensure quality. Edit the title or description if needed.",
    bgColor: "bg-yellow-50",
  },
  {
    step: "Step 4",
    title: "Submit",
    icon: PiCheckSquare,
    description:
      "After the review, submit the video to showcase in your profile.",
    bgColor: "bg-yellow-50",
  },
];

export default processStepsData;
