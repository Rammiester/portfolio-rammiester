export const portfolioData = {
  name: "Ramit Kr. Gupta",
  title: "Frontend Engineer specializing in React performance and scalable UI systems",
  email: "ramitg0@gmail.com",
  phone: "7007754972",
  location: "Bangalore, India",
  bio: "Frontend Engineer with 1.5 years of experience building scalable UIs using React, Next.js, Redux, and TailwindCSS. Passionate about performance optimization, systems thinking, and crafting memorable user experiences.",
  skills: [
    "ReactJS", "Next.js", "Redux", "TailwindCSS", "Node.js", "JavaScript (ES6+)", "SQL (Postgres)", "REST APIs", "Material-UI", "Context API", "Redux Toolkit", "Git"
  ],
  achievements: [
    "Architected ReferenceDataContext, reducing redundant API calls by 90%.",
    "Improved application load times by 90% through efficient state management.",
    "Streamlined payment workflows, reducing user friction by 25%.",
    "Built and shipped a Chrome Extension utilizing the Gemini API."
  ],
  caseStudy: {
    title: "API Optimization via ReferenceDataContext",
    problem: "The application was making redundant API calls for reference data across multiple components, leading to slow load times and unnecessary server load.",
    architectureBefore: "Components individually fetched reference data on mount, resulting in duplicate requests for the same data (e.g., countries, currencies) across the application.",
    architectureAfter: "Implemented a centralized `ReferenceDataContext` using React Context and custom hooks. The context fetches data once, caches it, and provides it to any component that needs it.",
    performanceResult: "Reduced API calls for reference data by 90% and improved overall page load times by 90%, significantly enhancing the user experience."
  },
  experience: [
    {
      company: "Edstellar",
      role: "Software Engineer",
      period: "Aug 2024 – Present",
      description: "Architected ReferenceDataContext solution reducing API calls by 90%. Developed and optimized responsive user interfaces with Next.js and TailwindCSS."
    },
    {
      company: "Volopay",
      role: "Front-end Developer Intern",
      period: "Feb 2024 – May 2024",
      description: "Streamlined payment workflows in the Payment Squad, reducing user friction by 25%. Built reusable React components and integrated payment APIs."
    },
    {
      company: "Freelance",
      role: "Software Engineer",
      period: "Mar 2023 – Jan 2024",
      description: "Built Stock Ninja Shopify app. Designed React-based app for autistic children. Developed ERP system with Laravel."
    }
  ],
  projects: [
    {
      title: "Smart Summarizer",
      description: "Chrome Extension that summarizes web content via Gemini API. Features modular tabs and dark mode.",
      tech: ["Vanilla JS", "Gemini API", "Chrome Extensions"],
      link: "https://github.com/Rammiester/smart-summarizer",
      demo: "https://github.com/Rammiester/smart-summarizer",
      image: "https://picsum.photos/seed/smart-summarizer/800/600"
    },
    {
      title: "Stock Ninja",
      description: "Shopify app for inventory management and tracking.",
      tech: ["React", "Node.js", "Shopify API"],
      link: "https://github.com/Rammiester",
      demo: "#",
      image: "https://picsum.photos/seed/stock-ninja/800/600"
    }
  ],
  socials: {
    github: "https://github.com/Rammiester",
    linkedin: "https://linkedin.com/in/rammiester22",
    twitter: "https://twitter.com"
  },
  pictures: [
    "/images/slide1.jpg",
    "/images/slide2.jpg",
    "/images/slide3.jpg",
    "/images/slide4.jpg",
    "/images/slide5.jpg",
    "/images/slide6.jpg",
    "/images/slide7.jpg",
    "/images/slide8.jpg",
    "/images/slide9.jpg"
  ]
};
