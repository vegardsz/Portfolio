import { Suspense, lazy, useEffect, useRef, useState, useSyncExternalStore } from "react";

function usePrefersReducedMotion() {
  const getSnapshot = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const getServerSnapshot = () => false;
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    getSnapshot,
    getServerSnapshot
  );
}

const ProjectSegmentSection = lazy(() => import("./components/ProjectSegmentSection"));

const projects = [
  {
    slug: "eudi-wallet",
    title: "Envisioned a sovereign European digital infrastructure",
    intro:
      "My master's thesis from AHO, developed with Hans Jacob Wernersen, explores how a Big Tech shaped digital landscape affects wellbeing and control. Through three concepts and tangible artifacts, we present a realistic EU-based alternative designed to put people first.",
    landingIntro:
      "My master's thesis from AHO explores how Big Tech shapes wellbeing and control, and proposes a more human, EU-based digital alternative through speculative concepts and artifacts.",
    services: "Research, UX/UI Design, Product Strategy",
    year: "2025",
    client: "Public Sector Innovation Lab",
    format: "portrait",
    image: "/img/sovereign-img.png",
    tags: ["Student project", "Public sector"],
    contributions: ["Speculative Design", "Systems Thinking", "Concept Development", "Artifact Prototyping"],
    context:
      "The project was sparked by Norway’s 2024 digitalization strategy, aiming to become the “most digitalized country in the world” — prompting us to question why not the “best.” As people increasingly try to manage hyperconnectivity on their own, we asked whether digital wellbeing should really be an individual responsibility, or a shared one across platforms and providers. The thesis therefore investigates how a shift in power dynamics could reshape our relationship with digital services.",
    deliveryText:
      "To explore this, we developed a set of tangible artifacts within a speculative, yet realistic, EU-based scenario where innovation is more democratised and bounded. These artifacts act as representations of an alternative digital ecosystem, designed to put people’s wellbeing and values first, and serve as tools to provoke reflection and discussion.",
    delivery: {
      eyebrow: "Delivery",
      intro:
        "A structured delivery process ensured that service requirements, interface behavior, and implementation constraints stayed aligned.",
      segments: [
        {
          id: "scenario",
          label: "Scenario",
          title: "Shaped a wellbeing centered internet",
          image: "/img/scenario.svg",
          backgroundImage: "/img/scenario_backdrop.png",
          description:
            "Using EU as a basis for speculation, we use real signal and trends to shape a wellbeing-centered digital infrastructure. Here, the goal is to ensure transparency and access through all levels, allowing users to reach levels beyond just themselves and thereby offer greater control."
        },
        {
          id: "concept",
          label: "Concept",
          title: "Made the scenario tangible",
          image: "/img/concept.svg?v=2",
          backgroundImage: "/img/concept_backdrop.png",
          description:
            "To make this scenario tangible, we make low-fidelity concepts. Here we envision what services that could arise, given that the infrastructure is implemented and enforced by the EU. This allows us to get closer to the felt experience of our speculations. For instance, what happens if all citizens get their own “digital identity hub”, that gives them full overview of their digital footprint and personal data?"
        },
        {
          id: "artifact",
          label: "Artifact",
          title: "What this felt like",
          image: "/img/artifact.png?v=2",
          backgroundImage: "/img/artifact_backdrop.png",
          description:
            "If this concept existed, what would everyday digital interactions feel like? Could we for instance have direct control of our own algorithms?"
        }
      ]
    }
  },
  {
    slug: "privacy-pass",
    title: "Explored the realization of a city life initiative",
    intro:
      "Designing an application portal for Oslo Kommune’s Levende gater initiative, simplifying citizen applications and enabling efficient municipal processing.",
    services: "Service Design, Interaction Design",
    year: "2023",
    client: "Oslo Kommune (Plan -og bygningsetaten)",
    format: "landscape",
    image: "/img/levende-gater.png",
    tags: ["Client project", "Public sector"],
    contributions: ["Service Blueprinting", "Stakeholder Alignment", "Flow Prototyping", "Public Sector UX"],
    context:
      "Designing an application portal for Oslo Kommune’s Levende gater initiative meant simplifying citizen applications while supporting efficient municipal processing. Creating a clear application flow required understanding the underlying system, where multiple departments and strict constraints are involved. We used prototypes early to align stakeholders and uncover edge cases, shifting the project from a simple digital form to a broader service and system design effort.",
    deliveryText:
      "The final delivery consisted of two interconnected components, that demonstrate how upfront systemic planning can simplify both the user experience and administrative workflows.",
    delivery: {
      eyebrow: "Delivery",
      intro:
        "The delivery model focused on clarity across teams, with iterative checkpoints that kept design intent and technical scope synchronized.",
      immersiveBackgroundMap: {
        system: "/img/lg_backdrop.png",
        prototype: "/img/prototype_backdrop.png"
      },
      segments: [
        {
          id: "system",
          label: "System",
          title: "System alignment across municipal workflows",
          image: "/img/system_backdrop.png",
          description:
            "Mapped process dependencies and operational constraints across departments to ensure the service concept could work in real municipal conditions."
        },
        {
          id: "prototype",
          label: "Prototype",
          title: "Prototype flow for citizen applications",
          images: [
            "/img/Logg inn.png",
            "/img/Sammenkomst.png",
            "/img/Logg inn-1.png",
            "/img/Velg dato.png",
            "/img/Velg utstyr.png",
            "/img/Bekreft gate.png"
          ],
          description:
            "An interactive prototype translated service principles into a practical application journey, making it easier to validate usability and processing readiness with stakeholders."
        }
      ]
    }
  },
  {
    slug: "road-work-applications",
    title: "Optimized processing of road work applications",
    intro:
      "On this project, I worked as a UX designer on an AI-solution, aimed to provide case workers an efficient way to look up rules and regulations.",
    landingIntro:
      "On this project, I worked as a UX designer on an AI-solution, aimed to provide case workers an efficient way to look up rules and regulations.",
    services: "UX Design, UI, Front-end development",
    year: "2024",
    client: "Public sector",
    format: "landscape",
    image: "/img/kibok.png",
    tags: ["Client project", "Public sector"],
    contributions: ["UX Research", "AI Service Design", "Interface Design", "Front-end Development"],
    context:
      "In the current situation, case workers have to plow through several long PDFs to find the right rules when dealing with an application. The solution fetches all of that data into an AI automated chatbot, allowing users to simply prompt for a specific rule, rather than performing long tedious searches.",
    deliveryText:
      "I focused on enhancing the interface and usability by conducting regular user testing, sketching designs in Figma, and collaborating closely with developers to identify and implement improvements.",
    delivery: {
      eyebrow: "Delivery",
      intro:
        "Iterative UX work, user proximity, and supporting materials so caseworkers could use the AI tool with confidence.",
      segments: [
        {
          id: "road-ux",
          label: "UX",
          title: "UX",
          layoutMode: "compact",
          beforeAfterFrameScale: 505,
          backgroundImage: "/img/ux_backdrop.png",
          beforeImage: "/img/kibok_pre.png",
          afterImage: "/img/kibbok_post.png",
          description:
            "As a UX designer, I focused on making the experience seamless and effective, but also easy to understand. Since AI is still unfamiliar to many users, it was important to clearly communicate the value of the solution and how to use it effectively in practice, through the interface itself."
        },
        {
          id: "road-front-end",
          label: "Front-end",
          title: "Front-end",
          image: "/img/brukerveiledningsside.png",
          backgroundImage: "/img/ux_backdrop.png",
          description:
            "To help onboard new users, we also created a dedicated user guide. It was designed in collaboration with developers and grounded in an understanding of what felt unfamiliar to users. I also contributed to bringing the site into production through front-end development."
        }
      ]
    }
  },
  {
    slug: "democratizing-eye-health",
    title: "Democratized eye health",
    intro:
      "The project involved consolidating two existing resource platforms for eye health practitioners into a single, enhanced platform that adds additional value.",
    landingIntro:
      "The project involved consolidating two existing resource platforms for eye health practitioners into a single, enhanced platform that adds additional value.",
    services: "UX Design, Service design, User research",
    year: "2023",
    client: "Eye health sector",
    format: "compact",
    tags: ["Client project", "Private sector"],
    contributions: ["User Research", "Platform Analysis", "UX Architecture", "Wireframing"],
    context:
      "The project set out to rethink an existing learning platform that, despite having a lot of content, wasn't truly working for its users. Finding relevant information took too many steps, and much of the content didn't translate well into day-to-day practice. We then needed to rethink this; how can we improve on this, and what is valuable to add?",
    deliveryText:
      "As a UX/Service designer on the project, I worked hands-on from early user insight to concrete product direction. I ran user interviews to understand how professionals actually learn and make decisions in practice—what they need in the moment, what slows them down, and what keeps them engaged. From there, we distilled patterns into a set of mindsets and use cases that grounded the whole project. Instead of becoming abstract outputs, these directly shaped the MVP for the platform. By creating early prototypes and sketches, we could define how the platform should be structured and what it should contain early in the process. This was important, as the time dedicated for development was pretty short. I then translated this into wireframes (which a graphic designer polished up) of the entire platform, laying the groundwork for how the platform should be structured both on page and site level.",
    delivery: {
      eyebrow: "Delivery",
      intro:
        "From interviews and mindsets through to wireframes that aligned design and development.",
      segments: [
        {
          id: "eye-mindsets",
          label: "Mindsets",
          title: "Mindsets",
          description: "Content to be placed later."
        },
        {
          id: "eye-use-cases",
          label: "Use cases",
          title: "Use cases",
          description: "Content to be placed later."
        },
        {
          id: "eye-wireframes",
          label: "Wireframes",
          title: "Wireframes",
          description: "Content to be placed later."
        }
      ]
    }
  },
  {
    slug: "nrk-dock",
    title: "Connected NRK's offering through new interaction explorations",
    intro:
      "How can NRK compete with commercial competitors in grasping peoples attention? And how can NRK be a trustworthy actor that keeps people up to date while still allowing people to consume digital media in a preferred pace? The NRK DOCK explores how a dock mode can be utilised as distraction free zone, where the user can get informed and entertained in their own preferred way, pace and rythm. The project was done in collaboration with NRK.",
    landingIntro:
      "How NRK's offering was connected across experiences, with hands-on exploration of new interaction directions.",
    services: "Service Design, UX Design",
    year: "2024",
    client: "NRK",
    format: "landscape",
    image: "/img/nrk_header.png",
    tags: ["Client project", "Media"],
    contributions: ["Discovery", "UX Strategy", "Concept Design", "Interaction Design"],
    context: "",
    deliveryText:
      "The delivery was a semi-functional prototype, aimed to both test the docking concept in itself, but also explore how NRK content could be interacted with in various ways.",
    delivery: {
      eyebrow: "Delivery",
      intro:
        "Initial structure in place; segment content and media can be added progressively without changing the shared layout.",
      segments: [
        {
          id: "nrk-content",
          label: "Content",
          title: "Content",
          image: "/img/nrk_2.png",
          backgroundImage: "/img/content_nrk.png",
          description:
            "Through a thorough analysis of NRK's content library, we discovered the diverse ways in which users engage with and interact with their offerings. This insight led us to create a series of content \"modules\" that delve into different methods of engaging with NRK's material."
        },
        {
          id: "nrk-surface",
          label: "Surface",
          title: "Surface",
          image: "/img/nrk_3.png",
          backgroundImage: "/img/surface_nrk_2.png",
          description:
            "Content can be manifested in various ways on the media surface. It can engage users with various depth of interactions, such as reading a news article, or to simply be an informational display, triggered by a simple click."
        },
        {
          id: "nrk-use-cases",
          label: "Use cases",
          title: "Use cases",
          video: "https://youtu.be/fADnQqy_gqE",
          backgroundImage: "/img/use_cases_nrk.png",
          description: "Through prototyping (both in Figma and Code), we explore various use cases of this concept."
        }
      ]
    }
  }
];

const HIDDEN_PROJECT_SLUGS = new Set(["democratizing-eye-health"]);
const PROJECT_DISPLAY_ORDER = ["road-work-applications", "privacy-pass", "nrk-dock", "eudi-wallet"];
const visibleProjects = projects
  .filter((project) => !HIDDEN_PROJECT_SLUGS.has(project.slug))
  .sort((a, b) => PROJECT_DISPLAY_ORDER.indexOf(a.slug) - PROJECT_DISPLAY_ORDER.indexOf(b.slug));

const experience = [
  {
    period: "2025 - Present",
    title: "Accenture Song",
    text: "Currently working as a Service/UX designer at Accenture Song."
  },
  {
    period: "2023 June - 2023 Dec",
    title: "Oslo Kommune",
    text: "Previously worked as a designer at PBE, applying new solutions at city level initiatives."
  },
  {
    period: "2020 - 2025",
    title: "AHO",
    text: "Masters degree in Design at Oslo School of Architecture and Design."
  }
];

const HERO_HEADLINE_TEXT = "Hello!";
const SHARED_PROJECT_SEGMENT_BACKDROPS = [
  "/img/scenario_backdrop.png",
  "/img/concept_backdrop.png",
  "/img/artifact_backdrop.png"
];
const NAVBAR_WORKS_DROPDOWN_ITEMS = [
  { slug: "road-work-applications", label: "KIBOK" },
  { slug: "privacy-pass", label: "Living streets" },
  { slug: "nrk-dock", label: "NRK Dock" },
  { slug: "eudi-wallet", label: "Rewire" },
  { slug: "democratizing-eye-health", label: "Clinical platform" }
];
const HONORABLE_MENTIONS_PATH = "/honorable-mentions";
const HONORABLE_MENTIONS = [
  {
    title: "VG Sphere",
    description:
      "Concept and design explorations around immersive editorial experiences and how spatial interfaces can support storytelling.",
    image: "/img/vg.png",
    client: "VG",
    designType: "UX/UI Design"
  },
  {
    title: "YR Travel",
    description:
      "A weather-focused travel concept exploring how planning, route context, and forecast insights can be presented in one coherent flow.",
    image: "/img/yr.png",
    client: "YR",
    designType: "UX/UI Design"
  },
  {
    title: "Ship Navigation Overlays",
    description:
      "Interface studies for layered navigation overlays that improve situational awareness while preserving clarity in maritime contexts.",
    image: "/img/navigation.png",
    client: "Ocean Industries Concept Lab",
    designType: "UX/UI Design"
  }
];
const visibleNavbarWorksDropdownItems = NAVBAR_WORKS_DROPDOWN_ITEMS.filter(
  (item) => !HIDDEN_PROJECT_SLUGS.has(item.slug)
);
const PROJECT_SHORT_TITLES = visibleNavbarWorksDropdownItems.reduce((acc, item) => {
  acc[item.slug] = item.label;
  return acc;
}, {});
const RASTER_IMAGE_PATTERN = /\.(png|jpe?g)(\?.*)?$/i;

function getOptimizedImageSrc(src) {
  if (!src || !RASTER_IMAGE_PATTERN.test(src)) return src;
  if (src.includes("/img/nrk_")) return src;
  if (src.includes("_nrk.png")) return src;
  if (src.includes("/img/vg.png") || src.includes("/img/yr.png") || src.includes("/img/navigation.png")) return src;
  return src.replace(RASTER_IMAGE_PATTERN, ".webp$2");
}

function useImagePreload(src) {
  useEffect(() => {
    if (!src || typeof document === "undefined") return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = getOptimizedImageSrc(src);
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [src]);
}

function ExperienceBriefcaseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-zinc-400">
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Handle */}
        <rect x="8.75" y="5" width="6.5" height="3" rx="1.15" />
        {/* Rounded body */}
        <rect x="4" y="9.25" width="16" height="10.25" rx="2.75" />
        {/* Flap line, shallow dip toward center */}
        <path d="M4.75 14.2 Q12 15.55 19.25 14.2" />
        {/* Center latch */}
        <rect x="10.7" y="15.35" width="2.6" height="2.5" rx="0.45" />
      </g>
    </svg>
  );
}

function ExperienceGraduationCapIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0 text-zinc-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.316 60.316 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.919 59.919 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.716 50.716 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A60.908 60.908 0 0112 20.904a60.98 60.98 0 017.995-4.306"
      />
    </svg>
  );
}

function PageCredit() {
  return (
    <footer className="mt-16 pt-10 text-right text-sm text-zinc-400 md:mt-20 md:pt-12">
      Vegard Szilvay 2026
    </footer>
  );
}

function WorksDropdown({ worksHref, onWorksClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleWorksClick = (event) => {
    setIsOpen(false);
    if (onWorksClick) {
      onWorksClick(event);
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        className="inline-flex items-center gap-1 transition-colors motion-reduce:transition-none hover:text-zinc-900"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        Works
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className={`h-3.5 w-3.5 transition-transform motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="M4.25 6.5 8 10.25 11.75 6.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen ? (
        <div className="absolute right-0 mt-3 w-[320px] rounded-xl border border-zinc-200 bg-white p-2 shadow-lg" role="menu">
          <a
            href={worksHref}
            onClick={handleWorksClick}
            className="block rounded-lg px-3 py-2 text-sm text-zinc-700 no-underline transition-colors motion-reduce:transition-none hover:bg-zinc-100 hover:text-zinc-900"
            role="menuitem"
          >
            All works
          </a>
          <div className="my-1 h-px bg-zinc-200" aria-hidden="true" />
          {visibleNavbarWorksDropdownItems.map((item) => (
            <a
              key={item.slug}
              href={`/project/${item.slug}`}
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-zinc-700 no-underline transition-colors motion-reduce:transition-none hover:bg-zinc-100 hover:text-zinc-900"
              role="menuitem"
            >
              {item.label}
            </a>
          ))}
          <div className="my-1 h-px bg-zinc-200" aria-hidden="true" />
          <a
            href={HONORABLE_MENTIONS_PATH}
            onClick={() => setIsOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm text-zinc-700 no-underline transition-colors motion-reduce:transition-none hover:bg-zinc-100 hover:text-zinc-900"
            role="menuitem"
          >
            Honorable mentions
          </a>
        </div>
      ) : null}
    </div>
  );
}

function App() {
  const pathname = window.location.pathname;
  const isHonorableMentionsPage = pathname === HONORABLE_MENTIONS_PATH;
  const slug = pathname.startsWith("/project/") ? pathname.replace("/project/", "") : null;
  const project = visibleProjects.find((item) => item.slug === slug);

  return (
    <div
      key={isHonorableMentionsPage ? "honorable-mentions" : slug ? `project-${slug}` : "landing"}
      className="motion-safe:animate-page-fade-in min-h-dvh"
    >
      {isHonorableMentionsPage ? <HonorableMentionsPage /> : project ? <ProjectPage project={project} /> : <LandingPage />}
    </div>
  );
}

function LandingPage() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSubmitAcknowledged, setIsSubmitAcknowledged] = useState(false);
  const [formData, setFormData] = useState({ email: "", message: "" });
  const [revealedProjects, setRevealedProjects] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return Object.fromEntries(visibleProjects.map((_, i) => [i, true]));
    }
    return {};
  });
  const [heroHeadlineShown, setHeroHeadlineShown] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? HERO_HEADLINE_TEXT
      : ""
  );
  const worksSectionRef = useRef(null);
  const contactSectionRef = useRef(null);
  const projectRefs = useRef([]);
  const NAVBAR_OFFSET = 96;
  useImagePreload("/img/profile.png");

  const scrollBehavior = prefersReducedMotion ? "auto" : "smooth";

  const scrollToSection = (ref) => {
    if (!ref.current) return;
    const top = ref.current.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
    window.scrollTo({ top, behavior: scrollBehavior });
  };

  const handleNavScroll = (event, ref) => {
    event.preventDefault();
    scrollToSection(ref);
  };

  const handleLogoClick = (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: scrollBehavior });
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();
    setIsContactOpen(false);
    setIsSubmitAcknowledged(true);
    setFormData({ email: "", message: "" });
    window.setTimeout(() => {
      setIsSubmitAcknowledged(false);
    }, 2600);
  };

  const handleContactButtonClick = () => {
    setIsContactOpen(true);
    window.setTimeout(() => {
      if (!contactSectionRef.current) return;
      const top = contactSectionRef.current.getBoundingClientRect().top + window.scrollY - (NAVBAR_OFFSET - 24);
      window.scrollTo({ top, behavior: scrollBehavior });
    }, 180);
  };

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (prefersReducedMotion) return undefined;

    let intervalId = null;
    const delayId = window.setTimeout(() => {
      let index = 0;
      intervalId = window.setInterval(() => {
        index += 1;
        setHeroHeadlineShown(HERO_HEADLINE_TEXT.slice(0, index));
        if (index >= HERO_HEADLINE_TEXT.length) {
          if (intervalId !== null) window.clearInterval(intervalId);
        }
      }, 85);
    }, 200);

    return () => {
      window.clearTimeout(delayId);
      if (intervalId !== null) window.clearInterval(intervalId);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number(entry.target.getAttribute("data-project-index"));
          if (Number.isNaN(index)) return;
          setRevealedProjects((prev) => (prev[index] ? prev : { ...prev, [index]: true }));
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.4,
        rootMargin: "0px 0px -18% 0px"
      }
    );

    projectRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <main id="top" className="mx-auto max-w-6xl bg-white px-6 pb-20 md:px-8 lg:px-10">
      <header className="sticky top-0 z-50 isolate -mx-6 flex items-center justify-between bg-transparent px-6 py-6 backdrop-blur before:absolute before:inset-y-0 before:left-1/2 before:-z-10 before:w-dvw before:-translate-x-1/2 before:bg-white/95 before:content-[''] md:-mx-8 md:px-8 lg:-mx-10 lg:px-10">
        <a className="text-lg font-normal tracking-tight text-zinc-900 no-underline md:text-xl" href="#top" onClick={handleLogoClick}>
          VS
        </a>
        <nav className="flex items-center gap-7 text-xs font-medium text-zinc-500 md:text-sm">
          <a
            className="transition-colors motion-reduce:transition-none hover:text-zinc-900"
            href="#top"
            onClick={handleLogoClick}
          >
            About
          </a>
          <WorksDropdown worksHref="#works" onWorksClick={(event) => handleNavScroll(event, worksSectionRef)} />
          <a
            className="transition-colors motion-reduce:transition-none hover:text-zinc-900"
            href="#contact"
            onClick={(event) => handleNavScroll(event, contactSectionRef)}
          >
            Contact
          </a>
        </nav>
      </header>

      <section
        id="about"
        className="grid grid-cols-1 items-start gap-7 pt-8 pb-10 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] md:items-end md:gap-10 md:pt-10 md:pb-12 lg:gap-12 lg:pt-12 lg:pb-14"
      >
        <div className="md:pr-1 md:pt-6 lg:pt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">About</p>
          <h1
            className="mt-4 md:mt-5 text-5xl font-normal leading-[0.95] tracking-tight text-zinc-900 md:text-6xl lg:text-[4.1rem]"
            aria-label={HERO_HEADLINE_TEXT}
          >
            {heroHeadlineShown}
            {heroHeadlineShown.length < HERO_HEADLINE_TEXT.length ? (
              <span className="ml-0.5 inline-block animate-pulse font-light motion-reduce:animate-none" aria-hidden="true">
                |
              </span>
            ) : null}
          </h1>
          <h2 className="mt-5 max-w-3xl text-3xl font-normal leading-tight tracking-tight text-zinc-900 md:text-4xl">
            I am Vegard, a UX/Service designer based in Oslo. I design simple, human-centered digital services that make complex systems easier to navigate.
          </h2>
        </div>
        <div className="relative w-full max-w-[240px] sm:max-w-[260px] md:max-w-[280px] md:justify-self-start">
          <img
            src={getOptimizedImageSrc("/img/profile.png")}
            alt="Profile preview"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="block h-auto w-full object-contain object-bottom max-h-[min(68vh,34rem)]"
          />
        </div>
      </section>

      <section className="pt-3 pb-2 md:pt-4 md:pb-3">
        <div className="grid gap-8 pt-2 md:grid-cols-3 md:gap-10">
          {experience.map((entry, index) => (
            <article key={entry.period} className="space-y-2 pt-3">
              {index < 2 ? <ExperienceBriefcaseIcon /> : <ExperienceGraduationCapIcon />}
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">{entry.period}</p>
              <p className="text-base font-normal text-zinc-800 md:text-lg">{entry.title}</p>
              <p className="text-base leading-relaxed text-gray-600 md:text-lg">{entry.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="works" ref={worksSectionRef} className="scroll-mt-28 mt-24 border-t border-zinc-200 pt-28 md:mt-28 md:pt-32">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Work</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-normal leading-tight tracking-tight text-zinc-900 md:text-4xl">
          I have done a lot of different things, like...
        </h2>
      </section>

      <section className="mt-12 space-y-48 py-20 md:mt-14 md:space-y-56 md:py-24">
        {visibleProjects.map((project, index) => (
          <article
            ref={(element) => {
              projectRefs.current[index] = element;
            }}
            data-project-index={index}
            className={`grid grid-cols-1 items-stretch gap-8 md:gap-12 ${
              index % 2 === 0 ? "md:grid-cols-[1fr_480px]" : "md:grid-cols-[480px_1fr]"
            } transform transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
              prefersReducedMotion || revealedProjects[index]
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
            key={project.slug}
          >
            <div className={`flex min-h-[300px] h-full flex-col ${index % 2 === 0 ? "md:order-1" : "md:order-2"}`}>
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.1em] text-[#3f5330] md:text-sm">
                {PROJECT_SHORT_TITLES[project.slug]}
              </p>
              <h2 className="max-w-xl text-3xl font-normal leading-tight tracking-tight text-zinc-900 md:text-4xl">
                {project.title}
              </h2>
              <div className="mt-5 h-[340px] w-full md:hidden">
                <a href={`/project/${project.slug}`} className="relative block h-full w-full">
                  {project.image ? (
                    <>
                      <img
                        src={getOptimizedImageSrc(project.image)}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        className={`h-full w-full rounded-xl object-cover ${
                          project.slug === "eudi-wallet"
                            ? "scale-[1.08] object-[82%_center]"
                            : project.slug === "road-work-applications"
                              ? "scale-[1.08] object-[92%_center]"
                              : "object-center"
                        }`}
                      />
                      {project.slug === "eudi-wallet" ? (
                        <img
                          src="/img/aho_awards.png"
                          alt="AHO Awards stamp"
                          loading="lazy"
                          decoding="async"
                          className="pointer-events-none absolute bottom-0 left-0 z-10 h-auto w-[126px] origin-bottom-left scale-110 drop-shadow-[0_8px_20px_rgba(0,0,0,0.28)]"
                        />
                      ) : null}
                    </>
                  ) : (
                    <div className="placeholder-check h-full w-full rounded-xl" />
                  )}
                </a>
              </div>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-600 md:text-lg">
                {project.landingIntro ?? project.intro}
              </p>
              <div className="mt-12 max-w-xl">
                <div className="flex flex-wrap gap-2">
                  {project.contributions.map((item, contributionIndex) => (
                    <span
                      key={`${project.slug}-contribution-${contributionIndex}`}
                      className="rounded-sm bg-zinc-100 px-2 py-1 text-[12px] font-medium uppercase tracking-[0.08em] text-zinc-500"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <a
                className="group mt-auto inline-flex items-center gap-2.5 self-start pt-9 text-base font-medium text-zinc-700 no-underline transition-colors motion-reduce:transition-none hover:text-zinc-900"
                href={`/project/${project.slug}`}
              >
                <span>Read more</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="h-5 w-5 transition-transform duration-200 ease-out motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 group-hover:translate-x-0.5"
                  fill="none"
                >
                  <path d="M2.5 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M9.5 5 13 8l-3.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
            <div
              className={`hidden h-[340px] w-full md:block md:h-[460px] lg:h-[520px] ${
                index % 2 === 0 ? "md:order-2" : "md:order-1"
              }`}
            >
              <a href={`/project/${project.slug}`} className="relative block h-full w-full">
                {project.image ? (
                  <>
                    <img
                      src={getOptimizedImageSrc(project.image)}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className={`h-full w-full rounded-xl object-cover ${
                        project.slug === "eudi-wallet"
                          ? "scale-[1.08] object-[82%_center]"
                          : project.slug === "road-work-applications"
                            ? "scale-[1.08] object-[92%_center]"
                            : "object-center"
                      }`}
                    />
                    {project.slug === "eudi-wallet" ? (
                      <img
                        src="/img/aho_awards.png"
                        alt="AHO Awards stamp"
                        loading="lazy"
                        decoding="async"
                        className="pointer-events-none absolute bottom-0 left-0 z-10 h-auto w-[126px] origin-bottom-left scale-110 drop-shadow-[0_8px_20px_rgba(0,0,0,0.28)] md:w-[144px]"
                      />
                    ) : null}
                  </>
                ) : (
                  <div className="placeholder-check h-full w-full rounded-xl" />
                )}
              </a>
            </div>
          </article>
        ))}
        <article className="grid grid-cols-1 items-stretch gap-8">
          <div className="flex min-h-[300px] h-full flex-col">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.1em] text-[#3f5330] md:text-sm">Honorable mentions</p>
            <h2 className="max-w-xl text-3xl font-normal leading-tight tracking-tight text-zinc-900 md:text-4xl">
              Additional selected projects
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-600 md:text-lg">
              A lightweight collection of other projects and explorations that are worth highlighting.
            </p>
            <div className="mt-6 h-[240px] w-full md:mt-8 md:h-[300px] lg:h-[340px]">
              <a href={HONORABLE_MENTIONS_PATH} className="relative block h-full w-full">
                <div className="grid h-full w-full grid-cols-2 gap-2 rounded-xl md:gap-3">
                  <div className="flex h-full w-full items-center justify-center rounded-lg bg-zinc-100 p-2">
                    <img
                      src={getOptimizedImageSrc("/img/vg.png")}
                      alt="VG preview"
                      loading="lazy"
                      decoding="async"
                      className="max-h-full max-w-full object-contain object-center"
                    />
                  </div>
                  <div className="flex h-full w-full items-center justify-center rounded-lg bg-zinc-100 p-2">
                    <img
                      src={getOptimizedImageSrc("/img/navigation.png")}
                      alt="Navigation preview"
                      loading="lazy"
                      decoding="async"
                      className="max-h-full max-w-full object-contain object-center"
                    />
                  </div>
                </div>
              </a>
            </div>
            <a
              className="group mt-10 inline-flex items-center gap-2.5 self-start text-base font-medium text-zinc-700 no-underline transition-colors motion-reduce:transition-none hover:text-zinc-900 md:mt-12"
              href={HONORABLE_MENTIONS_PATH}
            >
              <span>Explore collection</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="h-5 w-5 transition-transform duration-200 ease-out motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 group-hover:translate-x-0.5"
                fill="none"
              >
                <path d="M2.5 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M9.5 5 13 8l-3.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </article>
      </section>

      <section
        id="contact"
        ref={contactSectionRef}
        className="scroll-mt-28 mt-24 border-t border-zinc-200 pb-16 pt-28 text-center md:mt-28 md:pb-20 md:pt-32"
      >
        <h2 className="text-3xl font-normal tracking-tight text-zinc-900 md:text-4xl">Get in touch</h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600">
          Placeholder text for a short contact intro that invites collaboration and new project conversations.
        </p>
        <button
          type="button"
          onClick={handleContactButtonClick}
          className="mt-6 inline-grid grid-cols-1 grid-rows-1 place-items-center rounded-full bg-[#6b7f4e] px-6 py-2.5 text-sm font-medium text-white no-underline transition-colors duration-300 ease-out hover:bg-[#5f7245]"
        >
          <span
            className={`col-start-1 row-start-1 transition-opacity duration-500 ease-in-out ${
              isSubmitAcknowledged ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
            aria-hidden={isSubmitAcknowledged}
          >
            Get in touch
          </span>
          <span
            className={`col-start-1 row-start-1 transition-opacity duration-500 ease-in-out ${
              isSubmitAcknowledged ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={!isSubmitAcknowledged}
          >
            Thanks!
          </span>
        </button>

        <div
          className={`mx-auto max-w-2xl overflow-hidden transition-all duration-500 ease-out motion-reduce:duration-200 motion-reduce:transition-opacity ${
            isContactOpen ? "mt-10 max-h-[560px] opacity-100" : "mt-0 max-h-0 opacity-0"
          }`}
        >
          <form
            onSubmit={handleContactSubmit}
            className={`rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition-all duration-500 ease-out motion-reduce:duration-200 motion-reduce:transition-opacity md:p-6 ${
              isContactOpen ? "translate-y-0 pointer-events-auto motion-reduce:translate-y-0" : "translate-y-3 pointer-events-none motion-reduce:translate-y-0"
            }`}
            aria-hidden={!isContactOpen}
          >
            <div className="grid gap-4">
              <label className="grid gap-1.5 text-sm text-zinc-600">
                Email
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="name@email.com"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-800 outline-none transition focus:border-[#6b7f4e] focus:bg-white"
                />
              </label>
              <label className="grid gap-1.5 text-sm text-zinc-600">
                Message
                <textarea
                  rows={5}
                  value={formData.message}
                  onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
                  placeholder="Tell me a bit about your project..."
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-800 outline-none transition focus:border-[#6b7f4e] focus:bg-white"
                />
              </label>
              <button
                type="submit"
                className="inline-block self-start rounded-full bg-[#6b7f4e] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#5f7245]"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </section>

      <PageCredit />
    </main>
  );
}

function ProjectPage({ project }) {
  const isRewireProject = project.slug === "eudi-wallet";
  const isKibokProject = project.slug === "road-work-applications";
  const isLivingStreetsProject = project.slug === "privacy-pass";
  useImagePreload(project.image);

  return (
    <main className="mx-auto max-w-6xl bg-white px-6 pb-20 md:px-8 lg:px-10">
      <header className="sticky top-0 z-50 isolate -mx-6 flex items-center justify-between bg-transparent px-6 py-6 backdrop-blur before:absolute before:inset-y-0 before:left-1/2 before:-z-10 before:w-dvw before:-translate-x-1/2 before:bg-white/95 before:content-[''] md:-mx-8 md:px-8 lg:-mx-10 lg:px-10">
        <a className="text-lg font-normal tracking-tight text-zinc-900 md:text-xl" href="/">
          VS
        </a>
        <nav className="flex items-center gap-7 text-xs font-medium text-zinc-500 md:text-sm">
          <a className="transition-colors motion-reduce:transition-none hover:text-zinc-900" href="/#top">
            About
          </a>
          <WorksDropdown worksHref="/#works" />
          <a className="transition-colors motion-reduce:transition-none hover:text-zinc-900" href="/#contact">
            Contact
          </a>
        </nav>
      </header>

      <section className="grid grid-cols-1 items-start pt-14 pb-0 md:pt-16 md:pb-0">
        <div className="self-start max-w-4xl">
          <a
            className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-700 no-underline transition-colors motion-reduce:transition-none hover:text-zinc-900 md:mb-10"
            href="/#works"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="h-5 w-5 shrink-0 transition-transform duration-200 ease-out motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 group-hover:-translate-x-0.5"
              fill="none"
            >
              <path d="M13.5 8h-10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M6.5 5 3 8l3.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to all projects
          </a>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.1em] text-[#3f5330] md:text-sm">
            {PROJECT_SHORT_TITLES[project.slug]}
          </p>
          <h1 className="text-4xl font-normal leading-[1.02] tracking-tight text-zinc-900 md:text-[3.25rem] md:leading-[1.02]">
            {project.title}
          </h1>
          {Array.isArray(project.contributions) && project.contributions.length > 0 ? (
            <div className="mt-6 mb-6 max-w-4xl">
              <div className="flex flex-wrap gap-2">
                {project.contributions.map((item, contributionIndex) => (
                  <span
                    key={`${project.slug}-header-contribution-${contributionIndex}`}
                    className="rounded-sm bg-zinc-100 px-2 py-1 text-[12px] font-medium uppercase tracking-[0.08em] text-zinc-500"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {project.image ? (
        <section className="pb-12 md:pb-14 lg:pb-16">
          {isRewireProject ? (
            <div className="grid h-[340px] w-full grid-cols-[1.25fr_1.25fr_0.9fr] grid-rows-2 gap-2 overflow-hidden rounded-xl md:h-[460px] lg:h-[520px]">
              <img
                src="/img/rewire_collage3.png"
                alt={project.title}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="col-span-2 row-span-2 block h-full w-full object-cover object-center"
              />
              <img
                src={getOptimizedImageSrc(project.image)}
                alt={`${project.title} collage detail 1`}
                loading="eager"
                decoding="async"
                className="block h-full w-full object-cover object-[52%_48%]"
              />
              <img
                src="/img/rewire_collage1.png"
                alt={`${project.title} collage detail 2`}
                loading="eager"
                decoding="async"
                className="block h-full w-full object-cover object-[50%_46%]"
              />
            </div>
          ) : isLivingStreetsProject ? (
            <div className="grid h-[340px] w-full grid-cols-2 gap-2 overflow-hidden rounded-xl md:h-[460px] lg:h-[520px]">
              <img
                src={getOptimizedImageSrc(project.image)}
                alt={project.title}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="block h-full w-full object-cover object-center"
              />
              <img
                src="/img/levende_gater2.png"
                alt={`${project.title} collage detail`}
                loading="eager"
                decoding="async"
                className="block h-full w-full object-cover object-center"
              />
            </div>
          ) : isKibokProject ? (
            <div className="grid h-[340px] w-full grid-cols-[0.95fr_1.05fr] gap-2 overflow-hidden rounded-xl md:h-[460px] lg:h-[520px]">
              <img
                src={getOptimizedImageSrc(project.image)}
                alt={project.title}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="block h-full w-full object-cover object-center"
              />
              <img
                src={getOptimizedImageSrc("/img/kibbok_post.png")}
                alt={`${project.title} collage detail`}
                loading="eager"
                decoding="async"
                className="block h-full w-full object-cover object-[42%_center]"
              />
            </div>
          ) : (
            <div className="w-full overflow-hidden rounded-xl h-[340px] md:h-[460px] lg:h-[520px]">
              <img
                src={getOptimizedImageSrc(project.image)}
                alt={project.title}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className={`block h-full w-full object-cover ${
                  project.slug === "eudi-wallet"
                    ? "scale-[1.08] object-[82%_center]"
                    : project.slug === "road-work-applications"
                      ? "scale-[1.08] object-[92%_center]"
                      : "object-center"
                }`}
              />
            </div>
          )}
        </section>
      ) : (
        <section className="pb-12 md:pb-14 lg:pb-16">
          <div className="placeholder-check w-full rounded-xl h-[340px] md:h-[460px] lg:h-[520px]" />
        </section>
      )}

      <section className="grid gap-4 pt-2 pb-14 md:grid-cols-3 md:pt-3 md:pb-16">
        <div className="pt-3">
          <h3 className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">Year</h3>
          <p className="mt-2 text-base font-normal text-zinc-800 md:text-lg">{project.year}</p>
        </div>
        <div className="pt-3">
          <h3 className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">Client</h3>
          <p className="mt-2 text-base font-normal text-zinc-800 md:text-lg">{project.client}</p>
        </div>
        <div className="pt-3">
          <h3 className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">Services</h3>
          <p className="mt-2 text-base font-normal text-zinc-800 md:text-lg">{project.services}</p>
        </div>
      </section>

      <EditorialInfoRow
        label="Context"
        text={
          `${project.intro} ${
            project.context ??
            "Build a trustworthy digital service that balances security, legal requirements, and human usability across countries and institutions."
          }`.trim()
        }
      />

      <EditorialInfoRow
        label="Delivery"
        className="pb-20 md:pb-24"
        text={
          project.deliveryText ??
          "Conducted stakeholder mapping, service blueprinting, and iterative UI explorations with accessibility as a default requirement."
        }
      />

      <Suspense fallback={<div className="min-h-[520px] md:min-h-[580px]" aria-hidden="true" />}>
        <ProjectSegmentSection
          segments={project.delivery.segments}
          projectSlug={project.slug}
          immersiveBackgrounds={project.delivery.immersiveBackgrounds ?? SHARED_PROJECT_SEGMENT_BACKDROPS}
          immersiveBackgroundMap={project.delivery.immersiveBackgroundMap ?? {}}
        />
      </Suspense>

      <PageCredit />
    </main>
  );
}

function HonorableMentionsPage() {
  return (
    <main className="mx-auto max-w-6xl bg-white px-6 pb-20 md:px-8 lg:px-10">
      <header className="sticky top-0 z-50 isolate -mx-6 flex items-center justify-between bg-transparent px-6 py-6 backdrop-blur before:absolute before:inset-y-0 before:left-1/2 before:-z-10 before:w-dvw before:-translate-x-1/2 before:bg-white/95 before:content-[''] md:-mx-8 md:px-8 lg:-mx-10 lg:px-10">
        <a className="text-lg font-normal tracking-tight text-zinc-900 md:text-xl" href="/">
          VS
        </a>
        <nav className="flex items-center gap-7 text-xs font-medium text-zinc-500 md:text-sm">
          <a className="transition-colors motion-reduce:transition-none hover:text-zinc-900" href="/#top">
            About
          </a>
          <WorksDropdown worksHref="/#works" />
          <a className="transition-colors motion-reduce:transition-none hover:text-zinc-900" href="/#contact">
            Contact
          </a>
        </nav>
      </header>

      <section className="pt-14 pb-10 md:pt-16 md:pb-12">
        <a
          className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-700 no-underline transition-colors motion-reduce:transition-none hover:text-zinc-900 md:mb-10"
          href="/#works"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="h-5 w-5 shrink-0 transition-transform duration-200 ease-out motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 group-hover:-translate-x-0.5"
            fill="none"
          >
            <path d="M13.5 8h-10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M6.5 5 3 8l3.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to all projects
        </a>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.1em] text-[#3f5330] md:text-sm">Honorable mentions</p>
        <h1 className="max-w-4xl text-4xl font-normal leading-[1.02] tracking-tight text-zinc-900 md:text-[3.25rem] md:leading-[1.02]">
          Additional selected projects
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-600 md:text-lg">
          A lightweight collection of projects that are worth highlighting, without full standalone case pages for now.
        </p>
      </section>

      <section className="divide-y divide-zinc-200 pb-16 md:pb-20">
        {HONORABLE_MENTIONS.map((item, index) => (
          <article
            key={item.title}
            className={`grid grid-cols-1 items-stretch gap-8 py-12 md:gap-10 md:py-14 ${
              index % 2 === 0 ? "md:grid-cols-[1.15fr_1fr]" : "md:grid-cols-[1fr_1.15fr]"
            }`}
          >
            <div className={index % 2 === 0 ? "order-1" : "order-2"}>
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">Project snippet</p>
              <h2 className="mt-3 text-3xl font-normal leading-tight tracking-tight text-zinc-900 md:text-4xl">{item.title}</h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-600 md:text-lg">{item.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-sm bg-zinc-100 px-2 py-1 text-[12px] font-medium uppercase tracking-[0.08em] text-zinc-500">
                  {item.designType}
                </span>
                <span className="rounded-sm bg-zinc-100 px-2 py-1 text-[12px] font-medium uppercase tracking-[0.08em] text-zinc-500">
                  {item.client}
                </span>
              </div>
            </div>
            <div className={index % 2 === 0 ? "order-2" : "order-1"}>
              <div className="h-[300px] w-full overflow-hidden rounded-xl bg-zinc-100 p-2 md:h-[360px] md:p-3 lg:h-[400px]">
                <img
                  src={getOptimizedImageSrc(item.image)}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="block h-full w-full object-contain object-center"
                />
              </div>
            </div>
          </article>
        ))}
      </section>

      <PageCredit />
    </main>
  );
}

function EditorialInfoRow({ label, text, className = "" }) {
  return (
    <section className={`border-t border-zinc-200 py-14 md:py-16 ${className}`}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[160px_1fr] md:gap-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">{label}</p>
        <p className="max-w-4xl text-base leading-relaxed text-gray-600 md:text-lg">{text}</p>
      </div>
    </section>
  );
}

export default App;
