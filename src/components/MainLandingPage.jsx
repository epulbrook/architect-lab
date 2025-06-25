import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLogos from './ClientLogos';
import CompleteSeOAnalyzer from "./tools/WebsiteComparisonTool";
import { Helmet } from 'react-helmet-async'

const GOOGLE_CALENDAR_LINK = 'https://calendar.google.com/calendar/appointments/AcZssZ3RJRgK3FH4awi0c83MQmPRmAo09-0N4ZAdiNQ=?gv=true';
const EMAIL_ADDRESS = 'hello@thearchitectlab.com';

const MainLandingPage = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [counts, setCounts] = useState({ strategies: 0, brands: 0, introductions: 0, value: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    toolId: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [showSeoToolModal, setShowSeoToolModal] = useState(false);
  const [navIsDark, setNavIsDark] = useState(true);
  const navigate = useNavigate();

  const sections = [
    "Hero", "Services", "Impact", "Clients", "Tools", "Industries", "Contact"
  ];

  const tools = useMemo(() => [
    {
      id: "seo-analyser",
      title: "Competitor Website Checker",
      description: "Compare your website to competitors instantly. Get actionable SEO and web performance insights.",
      cta: "Check Now",
      service: "Competitor Website Checker"
    },
    {
      id: "partnership-health",
      title: "Referral Management Portal",
      description: "Centralise your partner referral programme, score partner health, and optimise deal velocity with a data-driven dashboard.",
      cta: "Access Tool",
      service: "Referral Management Portal"
    },
    {
      id: "market-readiness",
      title: "Market Entry Readiness Assessment",
      description: "A discerning evaluation of your expansion readiness. Better to know now than discover later in expensive real-time.",
      cta: "Access Tool",
      service: "Market Entry Engine"
    }
  ], []);

  const services = useMemo(() => [
    {
      id: "01",
      title: "Understand & Test",
      subtitle: "Tools & Systems",
      description: "We design and build bespoke tools and systems to help you understand, test, and validate your business opportunities.",
      funFacts: [],
      forWho: "",
      builtFor: "",
      keywords: ""
    },
    {
      id: "02",
      title: "Build",
      subtitle: "Market Entry",
      description: "We architect and execute your market entry—combining strategy, localisation, and operational delivery for successful launches.",
      funFacts: [],
      forWho: "",
      builtFor: "",
      keywords: ""
    },
    {
      id: "03",
      title: "Expand",
      subtitle: "Partnerships & Relationships",
      description: "We help you scale through partnership and relationship programmes, unlocking new channels and sustainable growth.",
      funFacts: [],
      forWho: "",
      builtFor: "",
      keywords: ""
    }
  ], []);

  const industriesList = [
    "LUXURY", "TECHNOLOGY", "AUTOMOTIVE", "FASHION", "FINTECH", "TRAVEL", "BEAUTY", "ENTERTAINMENT", "RETAIL", "SAAS AND TECH"
  ];

  // Check for mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Optimized counter animation with useCallback
  const animateCounters = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const duration = 2000;
    const startTime = Date.now();
    const targetValues = { strategies: 30, brands: 12, introductions: 60, value: 110 };
    
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setCounts({
        strategies: Math.floor(easeOutQuart * targetValues.strategies),
        brands: Math.floor(easeOutQuart * targetValues.brands),
        introductions: Math.floor(easeOutQuart * targetValues.introductions),
        value: Math.floor(easeOutQuart * targetValues.value)
      });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };
    animate();
  }, [isAnimating]);

  // Only animate counters when Impact section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isAnimating) {
            animateCounters();
          }
        });
      },
      { threshold: 0.5 }
    );

    const impactSection = document.getElementById('impact');
    if (impactSection) {
      observer.observe(impactSection);
    }

    return () => {
      if (impactSection) {
        observer.unobserve(impactSection);
      }
    };
  }, [isAnimating, animateCounters]);

  // Add scroll-based section detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const sectionHeight = windowHeight;
      const newSection = Math.floor(scrollPosition / sectionHeight);
      
      if (newSection !== currentSection && newSection >= 0 && newSection < sections.length) {
        setCurrentSection(newSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSection, sections.length]);

  // Add scroll-based nav color detection
  useEffect(() => {
    const handleScroll = () => {
      // If scrolled past the hero section (height of window), switch to black text
      setNavIsDark(window.scrollY < window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // set initial
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToolAccess = (tool) => {
    if (tool.id === 'seo-analyser') {
      navigate('/seo-analyzer');
    } else if (tool.id === 'partnership-health') {
      window.open('/tools/partnership-health', '_blank');
    } else {
      setSelectedTool(tool);
      setShowLeadModal(true);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Here you would typically send the data to your backend
      console.log('Form submitted:', formData);
      // Only open a new tab for non-SEO tools
      if (formData.toolId !== 'seo-analyser') {
        window.open(`/tools/${formData.toolId}?access=granted&email=${encodeURIComponent(formData.email)}`, '_blank');
      }
      setFormData({ name: '', email: '', company: '', toolId: '' });
      setShowLeadModal(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const renderHero = () => (
    <div className="w-full h-screen bg-black text-white flex flex-col justify-center items-center px-4 md:px-12 text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 md:opacity-20 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1200 800" aria-hidden="true">
          <defs>
            <linearGradient id="wireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          <path d="M0,400 Q300,200 600,400 T1200,400" stroke="url(#wireGradient)" strokeWidth="1" fill="none" className="animate-pulse"/>
          <path d="M0,600 Q400,300 800,600 T1200,200" stroke="url(#wireGradient)" strokeWidth="1" fill="none"/>
          <circle cx="200" cy="150" r="80" stroke="url(#wireGradient)" strokeWidth="1" fill="none"/>
          <circle cx="1000" cy="600" r="120" stroke="url(#wireGradient)" strokeWidth="1" fill="none" className="animate-ping"/>
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl w-full">        
        <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-extralight mb-8 md:mb-20 leading-[0.75] tracking-tight">
          The{' '}
          <span className="relative">
            <span className="italic font-thin text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">
              Architect Lab
            </span>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          </span>
        </h1>
        <div className="max-w-4xl mx-auto mb-12 md:mb-24">
          <p className="text-base sm:text-lg md:text-xl font-light text-gray-300 leading-relaxed mb-8 md:mb-12 px-4">
            A modern growth atelier. We craft unfair advantages through three distinct movements.
          </p>
          <button
            className="group relative px-8 md:px-20 py-4 md:py-6 bg-white text-black text-xs font-medium tracking-[0.2em] md:tracking-[0.4em] uppercase hover:bg-gray-100 transition-all duration-700 rounded-full shadow-2xl overflow-hidden"
            onClick={() => setShowContactModal(true)}
          >
            <span className="relative z-10">Start Conversation</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
        </div>
      </div>

      <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-mono tracking-wider animate-bounce">
        ↓ SCROLL
      </div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </div>
  );

  const renderServiceSummary = () => (
    <div className="w-full h-screen bg-gradient-to-br from-rose-100 to-amber-100 flex flex-col justify-center px-4 md:px-12 text-center relative overflow-hidden">
      {!isMobile && (
        <>
          <div className="absolute top-1/5 right-1/4 w-28 h-28 bg-white rounded-full opacity-40 blur-sm"></div>
          <div className="absolute bottom-1/4 left-1/5 w-20 h-20 bg-black rounded-full opacity-10"></div>
        </>
      )}
      
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="text-xs font-mono text-stone-500 mb-6 md:mb-12 tracking-[0.4em] uppercase">Services</div>
        <div className="text-lg md:text-xl font-light text-black mb-8">We help B2B teams test, refine and expand their growth.</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
          {services.map((service, idx) => (
            <div key={service.id} className="text-center">
              <div className="text-sm text-stone-600 mb-2">{service.title}</div>
              <h3 className="text-2xl md:text-3xl font-light mb-4 text-black">{service.subtitle}</h3>
              <p className="text-sm text-stone-700 font-light">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderImpact = () => (
    <div className="w-full h-screen bg-stone-50 flex flex-col justify-center px-4 md:px-12 text-left relative">
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="text-xs font-mono text-stone-500 mb-4 md:mb-8 tracking-[0.3em] uppercase">Proven Results</div>
        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light mb-12 md:mb-24 text-black tracking-tight">Impact</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-20">
          <div className="text-left">
            <div className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light mb-3 md:mb-6 text-black tracking-tight">
              {counts.strategies}+
            </div>
            <div className="text-xs text-stone-600 font-mono tracking-[0.2em] uppercase leading-relaxed">
              Go-to-market<br/>Strategies
            </div>
          </div>
          <div className="text-left">
            <div className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light mb-3 md:mb-6 text-black tracking-tight">
              {counts.brands}+
            </div>
            <div className="text-xs text-stone-600 font-mono tracking-[0.2em] uppercase leading-relaxed">
              Brands<br/>Repositioned
            </div>
          </div>
          <div className="text-left">
            <div className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light mb-3 md:mb-6 text-black tracking-tight">
              {counts.introductions}+
            </div>
            <div className="text-xs text-stone-600 font-mono tracking-[0.2em] uppercase leading-relaxed">
              Strategic<br/>Introductions
            </div>
          </div>
          <div className="text-left">
            <div className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light mb-3 md:mb-6 text-black tracking-tight">
              €{counts.value}M+
            </div>
            <div className="text-xs text-stone-600 font-mono tracking-[0.2em] uppercase leading-relaxed">
              Value<br/>Created
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="w-full h-screen bg-white flex flex-col justify-center px-4 md:px-12 text-center relative">
      {!isMobile && (
        <div className="absolute top-1/3 left-1/6 w-20 h-20 bg-rose-100 rounded-full opacity-30"></div>
      )}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="text-xs font-mono text-stone-400 mb-6 md:mb-12 tracking-[0.4em] uppercase">Trusted By</div>
        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight mb-12 md:mb-24 text-black tracking-tight">Selected Clients</h2>
        <ClientLogos />
      </div>
    </div>
  );

  const renderTools = () => (
    <div className="w-full min-h-screen bg-white flex flex-col justify-center px-4 md:px-12 text-left pb-16">
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-light mb-8 md:mb-12">Tools. By us.</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
          {tools.map((tool, index) => (
            <div key={index} className="bg-gray-50 border border-gray-200 p-6 md:p-8 rounded-xl shadow hover:shadow-md transition">
              <div className="text-xs font-mono text-stone-500 mb-4 tracking-[0.2em] uppercase">{tool.service}</div>
              <h3 className="text-lg md:text-xl font-medium mb-4">{tool.title}</h3>
              <p className="text-sm text-gray-700 mb-6 leading-relaxed">{tool.description}</p>
              <button 
                onClick={() => handleToolAccess(tool)}
                className="text-sm px-6 py-3 bg-black text-white rounded hover:bg-gray-900 transition-all"
              >
                {tool.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderIndustries = () => (
    <div className="w-full h-screen bg-black text-white overflow-hidden relative flex flex-col justify-center">
      <div className="flex flex-col gap-8 md:gap-16 w-full">
        {/* Line 1: Left to Right */}
        <div className="w-full overflow-x-hidden">
          <div className="whitespace-nowrap animate-marquee-right">
            {industriesList.concat(industriesList).map((industry, idx) => (
              <span key={`ind1-${idx}`} className="text-2xl sm:text-4xl md:text-6xl font-light opacity-30 inline-block mx-8">
                / {industry} 
              </span>
            ))}
          </div>
        </div>
        {/* Line 2: Right to Left */}
        <div className="w-full overflow-x-hidden">
          <div className="whitespace-nowrap animate-marquee-left">
            {industriesList.concat(industriesList).map((industry, idx) => (
              <span key={`ind2-${idx}`} className="text-2xl sm:text-4xl md:text-6xl font-light opacity-30 inline-block mx-8">
                / {industry} 
              </span>
            ))}
          </div>
        </div>
        {/* Line 3: Left to Right */}
        <div className="w-full overflow-x-hidden">
          <div className="whitespace-nowrap animate-marquee-right">
            {industriesList.concat(industriesList).map((industry, idx) => (
              <span key={`ind3-${idx}`} className="text-2xl sm:text-4xl md:text-6xl font-light opacity-30 inline-block mx-8">
                / {industry} 
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute top-4 md:top-8 left-4 md:left-8 z-10">
        <div className="text-xs font-mono text-gray-400 tracking-[0.3em] uppercase">We Work With</div>
      </div>
      <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 z-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-right"></h2>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="w-full h-screen bg-black text-white flex flex-col justify-center px-4 md:px-12 text-center relative">
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-6xl sm:text-8xl md:text-[12rem] font-extralight mb-8 md:mb-16 leading-none text-white tracking-tight cursor-pointer"
          onClick={() => setShowContactModal(true)}
        >
          LET'S TALK
        </h2>
        <p className="text-base md:text-lg text-gray-300 mb-8 md:mb-16 max-w-2xl mx-auto font-light leading-relaxed px-4"></p>
        <div className="space-y-4 md:space-y-6">
          <div className="text-sm text-gray-400 font-mono tracking-wider">
            {EMAIL_ADDRESS}
          </div>
        </div>
      </div>
      {/* Modal Popup */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full text-center relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-black text-xl font-bold"
              onClick={() => setShowContactModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-2xl font-semibold mb-6 text-black">How do you want to connect?</h3>
            <div className="flex flex-col gap-4">
              <a
                href={GOOGLE_CALENDAR_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-black text-white rounded hover:bg-gray-900 transition text-base font-medium"
              >
                Extroverts: Book a Call
              </a>
              <a
                href={`mailto:${EMAIL_ADDRESS}`}
                className="w-full py-3 px-4 bg-gray-100 text-black rounded hover:bg-gray-200 transition text-base font-medium"
              >
                Introverts: Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderLeadModal = () => {
    if (!showLeadModal || !selectedTool) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4 relative">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl font-bold"
            onClick={() => setShowLeadModal(false)}
            aria-label="Close"
          >
            ×
          </button>
          
          <div className="mb-6">
            <h3 className="text-2xl font-light mb-2">Access {selectedTool.title}</h3>
            <p className="text-sm text-gray-600">Quick details for tool access. No spam, just insights.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                  formErrors.name ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Your name"
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                  formErrors.email ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="you@company.com"
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company (optional)
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Your company"
              />
            </div>

            <input
              type="hidden"
              name="toolId"
              value={selectedTool.id}
            />

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium"
              >
                Access Tool
              </button>
              <p className="mt-2 text-xs text-gray-500 text-center">
                We'll email you the results. Unsubscribe anytime.
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Prevent background scroll when SEO tool modal is open
  useEffect(() => {
    if (showSeoToolModal) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [showSeoToolModal]);

  return (
    <>
      <Helmet>
        <title>The Architect Lab - Modern Growth Atelier | Strategic Business Consulting</title>
        <meta name="description" content="A modern growth atelier crafting unfair advantages for luxury brands and high-growth companies through strategic consulting and business architecture." />
        <meta name="keywords" content="business consulting, growth strategy, luxury brands, business architecture, strategic consulting, modern atelier" />
        <meta property="og:title" content="The Architect Lab - Modern Growth Atelier" />
        <meta property="og:description" content="A modern growth atelier crafting unfair advantages for luxury brands and high-growth companies." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thearchitectlab.com/" />
        <meta property="og:image" content="https://thearchitectlab.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Architect Lab - Modern Growth Atelier" />
        <meta name="twitter:description" content="A modern growth atelier crafting unfair advantages for luxury brands and high-growth companies." />
        <meta name="twitter:image" content="https://thearchitectlab.com/twitter-image.jpg" />
        <link rel="canonical" href="https://thearchitectlab.com/" />
      </Helmet>
      <div className="w-full min-h-screen font-sans relative">
        <nav className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 md:p-8 bg-transparent transition-colors duration-300 ${navIsDark ? 'text-white' : 'text-black'}`}>
          <div className="grid grid-cols-3 gap-1 text-xs font-mono leading-none">
            <span>A</span><span>R</span><span>C</span>
            <span>H</span><span>I</span><span>T</span>
            <span>L</span><span>A</span><span>B</span>
          </div>
          <div className="hidden sm:flex space-x-4 md:space-x-8 text-xs font-mono tracking-wider">
            <a href="#services" className="hover:opacity-50 transition-opacity">SERVICES</a>
            <a href="#tools" className="hover:opacity-50 transition-opacity">TOOLS</a>
            <a href="#contact" className="hover:opacity-50 transition-opacity">CONTACT</a>
          </div>
          <div className="sm:hidden">
            <a href="#contact" className="text-xs font-mono tracking-wider">MENU</a>
          </div>
        </nav>

        {/* All sections stacked vertically */}
        <div className="w-full">
          {renderHero()}
          <div id="services">{renderServiceSummary()}</div>
          <div id="impact">{renderImpact()}</div>
          {renderClients()}
          <div id="tools">{renderTools()}</div>
          <div id="industries">{renderIndustries()}</div>
          <div id="contact">{renderContact()}</div>
        </div>
        {renderLeadModal()}
        {showSeoToolModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-3xl w-full mx-4 relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl font-bold"
                onClick={() => setShowSeoToolModal(false)}
                aria-label="Close"
              >
                ×
              </button>
              <CompleteSeOAnalyzer />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MainLandingPage; 