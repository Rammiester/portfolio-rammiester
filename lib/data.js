export const portfolioData = {
  name: "Ramit Kr. Gupta",
  title: "Full-Stack / AI Software Engineer specializing in LLM agents and scalable backend systems",
  email: "ramitg0@gmail.com",
  phone: "7007754972",
  location: "Bengaluru, India",
  bio: "Full-Stack / AI Software Engineer with 3.5+ years of experience, including 2+ years building production LLM and agentic systems. Shipped an inbound AI voice agent and a 7-agent Claude Code SDLC pipeline, alongside performance-critical full-stack work in React, Next.js, and Node.js.",
  skills: [
    "LLM / Agents (Claude, Anthropic API)", "Tool Calling", "Twilio Voice", "ReactJS", "Next.js", "Node.js", "NestJS", "TypeScript", "JavaScript (ES6+)", "SQL (Postgres)", "REST APIs", "Redux", "TailwindCSS", "Docker", "AWS", "Vitest", "Git"
  ],
  achievements: [
    "Built an inbound AI voice agent (Twilio + Anthropic Claude) with tool calling, supervisor controls, and automated lead assignment.",
    "Designed and orchestrated a 7-agent Claude Code SDLC pipeline (product, dev, QA, PR review, security, requirement grader) with human-in-the-loop merge gates — caught a critical NestJS DI auth bug static checks missed.",
    "Engineered a SELECT FOR UPDATE row-locked billing engine to prevent concurrent double-billing.",
    "Cut frontend-to-backend API calls 90% (47 → 5 per session) and form load time from 2.1s to 200ms via React Context + useReducer.",
    "Shipped 130 Vitest tests and deployed to Docker on AWS Linux."
  ],
  caseStudies: [
    {
      title: "API Optimization via ReferenceDataContext",
      problem: "The application was making redundant API calls for reference data across multiple components, leading to slow load times and unnecessary server load — up to 47 calls per session.",
      architectureBefore: "Components individually fetched reference data on mount, resulting in duplicate requests for the same data (e.g., countries, currencies) across the application.",
      architectureAfter: "Implemented a centralized `ReferenceDataContext` using React Context and `useReducer`. The context fetches data once, caches it, and provides it to any component that needs it.",
      performanceResult: "Cut API calls per session from 47 to 5 (a 90% reduction) and dropped form load time from 2.1s to 200ms, significantly enhancing the user experience.",
      image: "/images/slide3.jpg"
    },
    {
      title: "Inbound AI Voice Agent",
      problem: "Inbound sales/support calls required a human to be available around the clock to qualify leads, answer routine questions, and route calls to the right owner.",
      architectureBefore: "All inbound calls went straight to a human queue, with no automated triage, context gathering, or after-hours coverage.",
      architectureAfter: "Built a Twilio + Anthropic Claude voice agent with tool calling for live data lookups, supervisor escalation controls for edge cases, and automated lead assignment based on call content.",
      performanceResult: "Automated first-line call handling around the clock, with tool-calling accuracy and supervisor controls that kept a human in the loop for anything the agent wasn't confident about."
    },
    {
      title: "7-Agent Claude Code SDLC Pipeline",
      problem: "Manual code review and QA couldn't keep pace with delivery speed, and static checks alone had already let at least one critical bug through to review.",
      architectureBefore: "A single reviewer (or a generic linter/CI pass) was the only gate between a PR and merge, with no structured security or requirement-coverage check.",
      architectureAfter: "Designed and orchestrated 7 specialized Claude Code agents — product, dev, QA, PR review, security, and requirement grader — with human-in-the-loop merge gates between each stage.",
      performanceResult: "Caught a critical NestJS dependency-injection auth bug that static analysis and a first-pass human review had both missed, before it reached production.",
      image: "/images/slide4.jpg"
    },
    {
      title: "Concurrency-Safe Billing Engine",
      problem: "Simultaneous billing requests for the same account could race past each other and double-charge a customer under load.",
      architectureBefore: "Billing updates read-then-wrote account state without any locking, leaving a window where two concurrent requests could both pass validation.",
      architectureAfter: "Engineered a `SELECT FOR UPDATE` row-locked billing flow so concurrent requests for the same account serialize instead of racing.",
      performanceResult: "Eliminated concurrent double-billing under load while keeping normal (non-conflicting) requests unaffected."
    },
    {
      title: "Payment Workflow Reliability",
      problem: "Payment workflows on the Volopay Payment Squad had friction points that slowed users down and put integration uptime at risk.",
      architectureBefore: "Workflow steps and API integrations hadn't been tuned for the friction points users were actually hitting.",
      architectureAfter: "Streamlined the payment workflow's components and API integration points directly in the Payment Squad.",
      performanceResult: "Cut measurable user friction by 25% while maintaining 99.9% payment API integration uptime.",
      image: "/images/slide5.jpg"
    }
  ],
  experience: [
    {
      company: "Edstellar",
      role: "Software Development Engineer I (promoted from Junior Software Engineer, Aug 2025)",
      period: "Aug 2025 – Oct 2026",
      description: "Built an inbound AI voice agent (Twilio + Anthropic Claude) with tool calling and automated lead assignment. Orchestrated a 7-agent Claude Code SDLC pipeline with human-in-the-loop merge gates. Engineered a row-locked billing engine to prevent concurrent double-billing. Cut API calls 90% and shipped 130 Vitest tests; deployed on Docker/AWS."
    },
    {
      company: "Volopay",
      role: "Front-end Developer",
      period: "Feb 2025 – May 2025",
      description: "Streamlined payment workflows in the Payment Squad, reducing user friction by 25%. Built reusable React components and integrated payment APIs."
    },
    {
      company: "Nexlerate",
      role: "Software Engineer",
      period: "Mar 2023 – Jan 2025",
      description: "Built Stock Ninja Shopify app. Designed React-based app for autistic children. Developed ERP system with Laravel."
    }
  ],
  projects: [
    {
      title: "CaloraAI",
      description: "Health-tracking bot combining n8n automation, Telegram, and Supabase for logging and insights.",
      tech: ["n8n", "Telegram API", "Supabase"],
      link: "https://github.com/Rammiester",
      demo: "#",
      image: "https://picsum.photos/seed/calora-ai/800/600"
    },
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
