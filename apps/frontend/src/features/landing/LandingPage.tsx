import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { data, useNavigate } from "react-router";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { ChatWidget } from "@features/chat/ChatWidget";
import { useLang } from "@shared/hooks/useLang";
import { REAL_LISTINGS, TOUR_STEPS } from "./data";
import {
  GetStartedModal,
  CommandPalette,
  ProductTour,
  MobileBottomNav,
  StickyCompareBar,
  ComparisonDrawer,
  SearchResultsSection,
  ContactListingModal,
  QuickLoginModal,
} from "./components";
import type { ContactListing } from "./components";
import NavbarSection from "./sections/NavbarSection";
import HeroSection from "./sections/HeroSection";
import MarqueeSection from "./sections/MarqueeSection";
import BentoSection from "./sections/BentoSection";
import ListingsSection from "./sections/ListingsSection";
import HowItWorksSection from "./sections/HowItWorksSection";
import AppDownloadSection from "./sections/AppDownloadSection";
import CTASection from "./sections/CTASection";
import FooterSection from "./sections/FooterSection";
import UtilityToolsSection from "./sections/UtilityToolsSection";
import { AgentControlRoom } from "./components";

import { api } from "@/lib/api";
import { error } from "node:console";

// ─── LandingPage ──────────────────────────────────────────────────────────────
export function LandingPage() {
  const navigate = useNavigate();
  const { lang, toggleLang, t } = useLang("landing");

  // UI state
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [showGetStarted, setShowGetStarted] = useState(false);
  const [chatTrigger, setChatTrigger] = useState<{ query: string; id: number } | undefined>();
  const [contactListing, setContactListing] = useState<ContactListing | null>(null);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [showComparisonDrawer, setShowComparisonDrawer] = useState(false);
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [listingFilter, setListingFilter] = useState<"all" | "hc" | "tk" | "st" | "lc">("all");
  const [quickLogin, setQuickLogin] = useState<"chat" | "post" | null>(null);

  

  const handleContact = () => setQuickLogin("chat");
  const handlePostListing = () => setQuickLogin("post");

  // Handlers
  const openGetStarted = () => {
    setShowGetStarted(true);
    setTourStep(null);
    try { localStorage.setItem("nv-tour-done", "true"); } catch { /* noop */ }
  };

  const toggleCompare = (id: string) => {
    setSelectedListings(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const handleSearchSubmit = () => {
    const q = searchQuery.trim();
    if (q) {
      setSubmittedQuery(q);
      setSearchFocused(false);
      document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth" });
    } else {
      setShowGetStarted(true);
    }
  };

  const handleAskAI = () => {
    setChatTrigger({
      query: searchQuery.trim()
        ? t(
            `Tôi đang tìm: "${searchQuery.trim()}". Bạn có thể tư vấn giúp tôi không?`,
            `I'm looking for: "${searchQuery.trim()}". Can you help me find something?`
          )
        : t("Xin chào! Tôi cần tư vấn về thuê căn hộ.", "Hello! I need advice about renting an apartment."),
      id: Date.now(),
    });
  };

  const handleContactAskAI = (listing: ContactListing) => {
    setChatTrigger({
      query: `Tôi muốn hỏi về tin đăng: "${listing.title}" — ${listing.price}, ${listing.area}, ${listing.district}. Có thể tư vấn cho tôi không?`,
      id: Date.now(),
    });
    setContactListing(null);
  };

  // Scroll effects
  const { scrollYProgress: pageScrollProgress } = useScroll();
  const progressWidth = useTransform(pageScrollProgress, [0, 1], ["0%", "100%"]);

  // Section refs
  const heroRef = useRef<HTMLElement>(null);
  const howRef = useRef<HTMLElement>(null);
  const listingsRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroScrollProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const { scrollYProgress: howScrollProgress }  = useScroll({ target: howRef,  offset: ["start end", "end start"] });
  const { scrollYProgress: listingsScrollProgress } = useScroll({ target: listingsRef, offset: ["start end", "end start"] });
  const { scrollYProgress: ctaScrollProgress }  = useScroll({ target: ctaRef,  offset: ["start end", "end start"] });

  // Parallax transforms
  const headlineY     = useTransform(heroScrollProgress, [0, 0.6], [0, -80]);
  const subTextY      = useTransform(heroScrollProgress, [0, 0.6], [0, -80]);
  const widgetY       = useTransform(heroScrollProgress, [0, 0.6], [0, 40]);
  const widgetOpacity = useTransform(heroScrollProgress, [0, 0.4], [1, 0]);
  const heroBlobAY    = useTransform(heroScrollProgress, [0, 1], [0, -160]);
  const heroBlobBY    = useTransform(heroScrollProgress, [0, 1], [0, -70]);
  const connectorScale = useTransform(howScrollProgress, [0.1, 0.5], [0, 1]);
  const listingsDrift  = useTransform(listingsScrollProgress, [0, 1], [0, -40]);
  const ctaGlowX       = useTransform(ctaScrollProgress, [0, 1], ["-20%", "20%"]);

  // Force dark mode
  useEffect(() => {
    document.documentElement.removeAttribute("data-theme");
    return () => {
      try {
        const saved = localStorage.getItem("nv-theme");
        if (saved === "light") document.documentElement.setAttribute("data-theme", "light");
        else document.documentElement.removeAttribute("data-theme");
      } catch {}
    };
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setShowCommandPalette(v => !v); }
      if (e.key === "Escape") { setShowCommandPalette(false); setShowComparisonDrawer(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    try {
      const done = localStorage.getItem("nv-tour-done");
      if (!done) {
        const timer = setTimeout(() => setTourStep(0), 2000);
        return () => clearTimeout(timer);
      }
    } catch { /* noop */ }
  }, []);

  useEffect( () => {
    const fetchListing = async () => {
      try {
        const res = await api.get("/listing");
        console.log("Đã call NestJS BE");
        
        if(res){
          console.log("Tất cả bài viết là: ");
          console.log(res.data)
        } else {
          console.log("Không thể nhận được Data");
        }
      } catch (err) {
        console.error("Lỗi khi call listing data: ", err);
      }
    }

    fetchListing();
  }, [])
  

  
  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ backgroundColor: "#030B14" }}>
      {/* Scroll progress line */}
      <motion.div className="nv-scroll-line" style={{ width: progressWidth }} />

      {/* Portals */}
      {createPortal(
        <AnimatePresence>
          {showGetStarted && <GetStartedModal onClose={() => setShowGetStarted(false)} />}
          {quickLogin && (
            <QuickLoginModal
              mode={quickLogin}
              onClose={() => setQuickLogin(null)}
              onSuccess={() => { setQuickLogin(null); navigate(quickLogin === "chat" ? "/chat" : "/post"); }}
            />
          )}
        </AnimatePresence>,
        document.body
      )}

      <AnimatePresence>
        {contactListing && (
          <ContactListingModal
            listing={contactListing}
            onClose={() => setContactListing(null)}
            onAskAI={handleContactAskAI}
            onGetStarted={openGetStarted}
            t={t}
          />
        )}
      </AnimatePresence>

      <ChatWidget trigger={chatTrigger} />

      <AnimatePresence>
        {showCommandPalette && (
          <CommandPalette
            onClose={() => setShowCommandPalette(false)}
            onLang={toggleLang}
            onGetStarted={() => { setShowGetStarted(true); setShowCommandPalette(false); }}
            t={t}
            navigate={navigate}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {tourStep !== null && (
          <ProductTour
            step={tourStep}
            total={TOUR_STEPS.length}
            t={t}
            onNext={() => {
              if (tourStep < TOUR_STEPS.length - 1) { setTourStep(tourStep + 1); }
              else { setTourStep(null); try { localStorage.setItem("nv-tour-done","true"); } catch { /**/ } setShowGetStarted(true); }
            }}
            onSkip={() => { setTourStep(null); try { localStorage.setItem("nv-tour-done","true"); } catch { /**/ } }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showComparisonDrawer && (
          <ComparisonDrawer selectedIds={selectedListings} onClose={() => setShowComparisonDrawer(false)} t={t} onGetStarted={() => setShowGetStarted(true)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedListings.length > 0 && !showComparisonDrawer && (
          <StickyCompareBar
            selectedIds={selectedListings}
            onCompare={() => setShowComparisonDrawer(true)}
            onClear={() => setSelectedListings([])}
            t={t}
          />
        )}
      </AnimatePresence>

      <MobileBottomNav onGetStarted={() => setShowGetStarted(true)} t={t} />

      {/* Fixed background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div style={{ y: heroBlobAY, top: "-10%", left: "-5%", width: "70%", height: "80%", background: "radial-gradient(ellipse, rgba(34,211,238,0.14) 0%, transparent 65%)", filter: "blur(40px)" }} className="absolute" />
        <motion.div style={{ y: heroBlobBY, top: "20%", right: "-10%", width: "65%", height: "75%", background: "radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 65%)", filter: "blur(50px)" }} className="absolute" />
        <div className="absolute" style={{ bottom: "10%", left: "25%", width: "55%", height: "50%", background: "radial-gradient(ellipse, rgba(52,211,153,0.08) 0%, transparent 65%)", filter: "blur(60px)" }} />
        <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(rgba(148,163,184,0.022) 1px, transparent 1px)`, backgroundSize: "36px 36px" }} />
        <div className="absolute left-0 right-0" style={{ top: "100vh", height: "1px", background: "linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.12) 30%, rgba(139,92,246,0.12) 70%, transparent 100%)" }} />
      </div>

      {/* ── SECTIONS ── */}
      <NavbarSection
        scrolled={scrolled}
        navigate={navigate}
        lang={lang}
        toggleLang={toggleLang}
        onContact={handleContact}
        onPostListing={handlePostListing}
        t={t}
      />

      <HeroSection
        heroRef={heroRef}
        headlineY={headlineY}
        subTextY={subTextY}
        widgetY={widgetY}
        widgetOpacity={widgetOpacity}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchFocused={searchFocused}
        setSearchFocused={setSearchFocused}
        setSubmittedQuery={setSubmittedQuery}
        handleSearchSubmit={handleSearchSubmit}
        onAskAI={handleAskAI}
        listings={REAL_LISTINGS}
        totalListings={REAL_LISTINGS.length}
        onGetStarted={openGetStarted}
        t={t}
      />

      <AnimatePresence>
        {submittedQuery && (
          <motion.div id="search-results" key={submittedQuery} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SearchResultsSection query={submittedQuery} onGetStarted={openGetStarted} t={t} />
          </motion.div>
        )}
      </AnimatePresence>

      <MarqueeSection />

      <div className="nv-section-divider" />
      <ListingsSection
        listingsRef={listingsRef}
        listingsDrift={listingsDrift}
        listingFilter={listingFilter}
        setListingFilter={setListingFilter}
        selectedListings={selectedListings}
        toggleCompare={toggleCompare}
        onContactListing={listing => navigate(`/listing/${listing.id}`)}
        onGetStarted={openGetStarted}
        t={t}
      />

      <div className="nv-section-divider" />
      <UtilityToolsSection />

      <div className="nv-section-divider" />
      <section className="py-28 px-6">
        <AgentControlRoom />
      </section>

      <div className="nv-section-divider" />
      <HowItWorksSection howRef={howRef} connectorScale={connectorScale} t={t} />

      <div className="nv-section-divider" />
      <AppDownloadSection t={t} />

      <div className="nv-section-divider" />
      <BentoSection t={t} />

      <div className="nv-section-divider" />
      <CTASection ctaRef={ctaRef} ctaGlowX={ctaGlowX} onGetStarted={openGetStarted} t={t} />

      <div className="nv-section-divider" />
      <FooterSection navigate={navigate} onGetStarted={openGetStarted} t={t} />
    </div>
  );
}
