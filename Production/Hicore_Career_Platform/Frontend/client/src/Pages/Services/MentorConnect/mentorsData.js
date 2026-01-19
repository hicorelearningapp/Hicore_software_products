import aishwaryaImg from "../../../assets/MentorPage/image-one.jpg";
import rajivImg from "../../../assets/MentorPage/image-two.jpg";
import abhinavImg from "../../../assets/MentorPage/image-three.jpg";
import snehaImg from "../../../assets/MentorPage/image-four.jpg";

const baseMentors = [
  {
    id: "aishwarya",
    name: "Aishwarya R",
    title: "UI/UX Designer at LearnNext EdTech",
    image: aishwaryaImg,
    rating: 4.8,
    reviews: 15,
    duration: "30 mins/session",
    experience: "3 Years",
    availability: "Mon - Fri | 4 PM - 8 PM",
    tags: ["UI/UX", "Portfolio Review", "Career Guidance"],
  },
  {
    id: "rajiv",
    name: "Rajiv Mehta",
    title: "Full Stack Engineer at Zoho Corp",
    image: rajivImg,
    rating: 5.0,
    reviews: 15,
    duration: "30 mins/session",
    experience: "5 Years",
    availability: "Weekends | 10 AM - 6 PM",
    tags: ["Frontend", "Backend", "System Design"],
  },
  {
    id: "abhinav",
    name: "Abhinav Suri",
    title: "Frontend Tech Lead at Flipkart",
    image: abhinavImg,
    rating: 4.8,
    reviews: 15,
    duration: "30 mins/session",
    experience: "6 Years",
    availability: "Mon - Sat | 2 PM - 9 PM",
    tags: ["React", "UI/UX", "Project Planning"],
  },
  {
    id: "sneha",
    name: "Sneha Varun",
    title: "Data Scientist at TCS Digital Labs",
    image: snehaImg,
    rating: 4.8,
    reviews: 15,
    duration: "30 mins/session",
    experience: "4 Years",
    availability: "Tue - Thu | 5 PM - 8 PM",
    tags: ["Data Science", "ML", "Resume Review"],
  },
];

// Generate more dummy mentors for a longer list
const mentorsData = Array.from({ length: 3 }, (_, i) =>
  baseMentors.map((mentor) => ({
    ...mentor,
    id: `${mentor.id}-${i + 1}`,
  }))
).flat();

export default mentorsData;
