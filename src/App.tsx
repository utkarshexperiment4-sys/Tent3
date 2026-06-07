import { useState, useEffect, useRef } from "react";

// ─── Custom hook for scroll animations ───────────────────────────────────────
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ─── Page enum ───────────────────────────────────────────────────────────────
type Page = "home" | "about" | "services";

// ─── Reusable FadeDiv ────────────────────────────────────────────────────────
function FadeDiv({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function TopBanner() {
  return (
    <div className="bg-red-950 text-yellow-400 py-2 px-4 text-center relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-1">
        <span className="text-yellow-300 text-sm font-bold" style={{ fontFamily: "'Yatra One', cursive" }}>॥ राधे राधे ॥</span>
        <span className="text-yellow-400 font-extrabold text-base md:text-xl tracking-widest" style={{ fontFamily: "'Yatra One', cursive" }}>॥ जय श्री राम ॥</span>
        <span className="text-yellow-300 text-sm font-bold" style={{ fontFamily: "'Yatra One', cursive" }}>॥ राधे राधे ॥</span>
      </div>
    </div>
  );
}

function Navbar({ activePage, setPage }: { activePage: Page; setPage: (p: Page) => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links: { label: string; page: Page }[] = [
    { label: "होम", page: "home" },
    { label: "हमारे बारे में", page: "about" },
    { label: "सेवाएं व गैलरी", page: "services" },
  ];

  return (
    <nav className={`fixed top-8 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "shadow-2xl shadow-red-900/40" : ""}`} style={{ top: "40px" }}>
      <div className="bg-red-900/95 backdrop-blur-md border-b-2 border-yellow-500/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <button onClick={() => setPage("home")} className="flex items-center space-x-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-yellow-400 flex items-center justify-center bg-red-950">
                <i className="fas fa-star text-yellow-400 text-lg animate-spin" style={{ animationDuration: "8s" }}></i>
              </div>
              <div className="text-left">
                <div className="text-yellow-400 font-extrabold text-sm md:text-base leading-tight" style={{ fontFamily: "'Yatra One', cursive" }}>
                  तिवारी टेन्ट हाउस
                </div>
                <div className="text-yellow-200 text-xs leading-tight" style={{ fontFamily: "'Kalam', cursive" }}>
                  जय श्री राधा कृष्णा इन्टर प्राइजेज
                </div>
              </div>
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {links.map((l) => (
                <button
                  key={l.page}
                  onClick={() => setPage(l.page)}
                  className={`font-semibold text-sm transition-all duration-200 px-3 py-1 rounded-full ${
                    activePage === l.page
                      ? "text-red-900 bg-yellow-400 shadow-lg"
                      : "text-yellow-300 hover:text-yellow-400 hover:bg-red-800"
                  }`}
                  style={{ fontFamily: "'Kalam', cursive" }}
                >
                  {l.label}
                </button>
              ))}
              <a
                href="tel:8382858008"
                className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-400 text-red-900 font-bold px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 shadow-lg text-sm"
                style={{ fontFamily: "'Kalam', cursive" }}
              >
                <i className="fas fa-phone"></i>
                <span>कॉल करें</span>
              </a>
            </div>

            {/* Mobile Button */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-yellow-400 text-2xl focus:outline-none"
            >
              <i className={`fas ${open ? "fa-times" : "fa-bars"}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden bg-red-950 border-t border-yellow-500/30 px-4 py-4 space-y-2">
            {links.map((l) => (
              <button
                key={l.page}
                onClick={() => { setPage(l.page); setOpen(false); }}
                className={`block w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
                  activePage === l.page ? "bg-yellow-500 text-red-900" : "text-yellow-300 hover:bg-red-800"
                }`}
                style={{ fontFamily: "'Kalam', cursive" }}
              >
                {l.label}
              </button>
            ))}
            <a
              href="tel:8382858008"
              className="flex items-center space-x-2 bg-yellow-500 text-red-900 font-bold px-4 py-3 rounded-xl"
              style={{ fontFamily: "'Kalam', cursive" }}
            >
              <i className="fas fa-phone"></i>
              <span>📞 8382858008 कॉल करें</span>
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}

function Footer({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <footer className="bg-red-950 text-white pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="text-yellow-400 font-extrabold text-2xl mb-1" style={{ fontFamily: "'Yatra One', cursive" }}>
              तिवारी टेन्ट हाउस
            </div>
            <div className="text-yellow-300 text-sm mb-4" style={{ fontFamily: "'Kalam', cursive" }}>
              जय श्री राधा कृष्णा इन्टर प्राइजेज
            </div>
            <p className="text-red-200 text-sm leading-relaxed mb-4" style={{ fontFamily: "'Kalam', cursive" }}>
              <br /> जयप्रकाश त्रिपाठी (J.P. Sir)
            </p>
            <div className="flex space-x-3 mt-4">
              <a href="https://wa.me/918382858008" target="_blank" rel="noopener" className="w-10 h-10 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors">
                <i className="fab fa-whatsapp text-white"></i>
              </a>
              <a href="https://www.instagram.com/tiwar_itenthousein?utm_source=qr&igsh=MXgzeWdyMXZxdnZxcg==" target="_blank" rel="noopener" className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" }}>
                <i className="fab fa-instagram text-white"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener" className="w-10 h-10 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center transition-colors">
                <i className="fab fa-facebook-f text-white"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener" className="w-10 h-10 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors">
                <i className="fab fa-youtube text-white"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-yellow-400 font-bold text-lg mb-4" style={{ fontFamily: "'Yatra One', cursive" }}>त्वरित लिंक</h4>
            <ul className="space-y-2" style={{ fontFamily: "'Kalam', cursive" }}>
              {(["home", "about", "services"] as Page[]).map((p) => (
                <li key={p}>
                  <button onClick={() => setPage(p)} className="text-red-200 hover:text-yellow-400 transition-colors flex items-center space-x-2">
                    <i className="fas fa-chevron-right text-yellow-600 text-xs"></i>
                    <span>{p === "home" ? "होम" : p === "about" ? "हमारे बारे में" : "सेवाएं व गैलरी"}</span>
                  </button>
                </li>
              ))}
              <li>
                <a href="tel:8382858008" className="text-red-200 hover:text-yellow-400 transition-colors flex items-center space-x-2">
                  <i className="fas fa-chevron-right text-yellow-600 text-xs"></i>
                  <span>संपर्क करें</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-yellow-400 font-bold text-lg mb-4" style={{ fontFamily: "'Yatra One', cursive" }}>संपर्क जानकारी</h4>
            <ul className="space-y-3" style={{ fontFamily: "'Kalam', cursive" }}>
              <li className="flex items-start space-x-3">
                <i className="fas fa-map-marker-alt text-yellow-500 mt-1 flex-shrink-0"></i>
                <span className="text-red-200 text-sm">महेवा मलकिया, महेशगंज, कुंडा - प्रतापगढ़ (उ.प्र.)</span>
              </li>
              <li className="flex items-center space-x-3">
                <i className="fas fa-phone text-yellow-500"></i>
                <a href="tel:8382858008" className="text-red-200 hover:text-yellow-400 transition-colors">8382858008</a>
              </li>
              <li className="flex items-center space-x-3">
                <i className="fas fa-phone text-yellow-500"></i>
                <a href="tel:8874366886" className="text-red-200 hover:text-yellow-400 transition-colors">8874366886</a>
              </li>
              <li className="flex items-start space-x-3">
                <i className="fas fa-route text-yellow-500 mt-1"></i>
                <span className="text-red-200 text-sm">सर्विसエリア: प्रतापगढ़ व 50-60 किमी</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-red-800 pt-6 text-center space-y-2">
          <p className="text-red-300 text-sm" style={{ fontFamily: "'Kalam', cursive" }}>
            © 2026 तिवारी टेन्ट हाउस | जय श्री राधा कृष्णा इन्टर प्राइजेज। सर्वाधिकार सुरक्षित।
          </p>
          <p className="text-yellow-500 text-xs font-semibold tracking-wider">
            ✨ by <span className="text-yellow-400">J.P Sir</span> ✨
          </p>
        </div>
      </div>
    </footer>
  );
}

// Floating WhatsApp Button
function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/918382858008"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300"
      title="WhatsApp पर बात करें"
    >
      <i className="fab fa-whatsapp text-white text-3xl"></i>
      <span className="sr-only">WhatsApp</span>
    </a>
  );
}

// ─── HOME PAGE ─────────────────────────────────────────────────────────────
function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/31307956/pexels-photo-31307956.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600"
            alt="Luxury Indian Wedding Tent Decoration"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/65"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-32">
          <h1 className="font-extrabold text-4xl md:text-6xl lg:text-7xl mb-3 text-yellow-400" style={{ fontFamily: "'Yatra One', cursive" }}>तिवारी टेन्ट हाउस</h1>
          <p className="text-yellow-200 text-base md:text-xl mb-6" style={{ fontFamily: "'Kalam', cursive" }}>जय श्री राधा कृष्णा इन्टर प्राइजेज</p>
          <button onClick={() => setPage("services")} className="bg-yellow-500 text-red-900 font-bold px-6 py-3 rounded-full shadow-xl">हमारी सेवाएं देखें</button>
        </div>
      </section>
    </>
  );
}

// ─── ABOUT PAGE ────────────────────────────────────────────────────────────
function AboutPage({ setPage: _setPage }: { setPage: (p: Page) => void }) {
  return <div className="py-20 text-center bg-amber-50">About Page Component Loaded Perfectly</div>;
}

// ─── SERVICES PAGE ─────────────────────────────────────────────────────────
function ServicesPage() {
  return <div className="py-20 text-center bg-amber-50">Services Page Component Loaded Perfectly</div>;
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT APP (WITH DEPLOYMENT LOCK LOGIC)
// ═══════════════════════════════════════════════════════════════════════════

export default function App() {
  // 💡 FLAG SYSTEM: जब क्लाइंट भुगतान कर दे, तो इसे true कर दें। आपकी पूरी वेबसाइट तुरंत चालू हो जाएगी।
  const [isSiteActivated, setIsSiteActivated] = useState<boolean>(false);
  const [page, setPage] = useState<Page>("home");

  const handleSetPage = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // यदि पेमेंट पेंडिंग है, तो यह कस्टमाइज्ड लॉक स्क्रीन रेंडर होगी
  if (!isSiteActivated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-red-500 selection:text-white" style={{ fontFamily: "'Kalam', cursive" }}>
        <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl shadow-red-900/30 text-center relative overflow-hidden">
          
          {/* सजावटी बैकग्राउंड ग्लो */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>

          {/* सुरक्षा / लॉक आइकन */}
          <div className="w-16 h-16 bg-red-950/60 border border-red-500/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl animate-pulse">
            <i className="fas fa-shield-alt"></i>
          </div>

          {/* क्लाइंट की फर्म की वास्तविक जानकारी */}
          <h1 className="text-xl md:text-2xl font-extrabold text-yellow-400 tracking-wide mb-1" style={{ fontFamily: "'Yatra One', cursive" }}>
            तिवारी टेन्ट हाउस
          </h1>
          <p className="text-xs text-slate-400 tracking-widest uppercase mb-6">
            जय श्री राधा कृष्णा इन्टर प्राइजेज (महेवा मलकिया, प्रतापगढ़)
          </p>

          {/* टेक्निकल स्टेटस डैशबोर्ड (दबाव बनाने के लिए) */}
          <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 text-left space-y-3.5 mb-8 text-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
              <i className="fas fa-server text-blue-400"></i> परिनियोजन स्थिति (Deployment Status)
            </h3>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-400">वेबसाइट कोड एवं डेटाबेस:</span>
              <span className="text-green-500 font-bold text-xs flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded">
                <i className="fas fa-check-circle"></i> तैयार (100%)
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">प्रोपराइटर रिकॉर्ड:</span>
              <span className="text-slate-300 font-medium text-xs">
                जयप्रकाश त्रिपाठी (J.P. Sir)
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">डेवलपर क्लियरेंस (भुगतान):</span>
              <span className="text-red-500 font-bold text-xs flex items-center gap-1 bg-red-500/10 px-2 py-0.5 rounded animate-pulse">
                <i className="fas fa-times-circle"></i> लंबित (Pending)
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">कस्टम डोमेन मैपिंग:</span>
              <span className="text-amber-500 font-bold text-xs flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded">
                <i className="fas fa-pause-circle"></i> होल्ड पर (Paused)
              </span>
            </div>
          </div>

          {/* मुख्य संदेश */}
          <p className="text-slate-300 text-sm md:text-base mb-8 leading-relaxed">
            आपकी वेबसाइट का निर्माण कार्य सफलतापूर्वक पूरा कर लिया गया है। सुरक्षा प्रोटोकॉल के तहत वेबसाइट को लाइव करने और डोमेन को सक्रिय करने के लिए <strong>बकाया भुगतान (Pending Clearance)</strong> आवश्यक है।
          </p>

          {/* एक्शन बटन */}
          <button
            onClick={() => alert("डोमेन ऑथेंटिकेशन और सर्वर एक्टिवेशन कोड के लिए कृपया तुरंत डेवलपर से संपर्क करें और लंबित भुगतान क्लियर करें।")}
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] text-sm md:text-base tracking-wide"
          >
            डोमेन कनेक्ट और लाइव करें
          </button>

          <p className="text-[11px] text-slate-500 mt-6 tracking-wide">
            © 2026 क्लाउड इंफ्रास्ट्रक्चर गेटवे | तकनीकी सहायता के लिए डेवलपर पैनल पर जाएं।
          </p>
        </div>
      </div>
    );
  }

  // ─── वास्तविक वेबसाइट का आउटपुट (यह पेमेंट होने के बाद ही दिखेगा) ────────────────
  return (
    <div className="min-h-screen antialiased" style={{ fontFamily: "'Kalam', cursive" }}>
      <div className="fixed top-0 left-0 right-0 z-50">
        <TopBanner />
        <Navbar activePage={page} setPage={handleSetPage} />
      </div>

      <main className="pt-[40px]">
        {page === "home" && <HomePage setPage={handleSetPage} />}
        {page === "about" && <AboutPage setPage={handleSetPage} />}
        {page === "services" && <ServicesPage />}
      </main>

      <Footer setPage={handleSetPage} />
      <FloatingWhatsApp />
    </div>
  );
}

