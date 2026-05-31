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
              <a href="https://instagram.com" target="_blank" rel="noopener" className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" }}>
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
                <span className="text-red-200 text-sm">सर्विस एरिया: प्रतापगढ़ व 50-60 किमी</span>
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
            ✨ by <span className="text-yellow-400">J.P</span> ✨
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

// ═══════════════════════════════════════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════════════════════════════════════

function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/31307956/pexels-photo-31307956.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600"
            alt="Luxury Indian Wedding Tent Decoration"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/65"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-red-950/40 via-transparent to-red-950/70"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-32">
          <p className="text-yellow-300 text-sm md:text-base mb-3 tracking-widest animate-pulse" style={{ fontFamily: "'Yatra One', cursive" }}>
            ॥ माता पिता का आशीर्वाद ॥
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-yellow-500"></div>
            <i className="fas fa-star text-yellow-400 text-sm"></i>
            <i className="fas fa-crown text-yellow-500 text-xl"></i>
            <i className="fas fa-star text-yellow-400 text-sm"></i>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-yellow-500"></div>
          </div>

          <h1
            className="font-extrabold text-4xl md:text-6xl lg:text-7xl mb-3 leading-tight bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 text-transparent bg-clip-text drop-shadow-2xl"
            style={{ fontFamily: "'Yatra One', cursive" }}
          >
            तिवारी टेन्ट हाउस
          </h1>
          <p className="text-yellow-200 text-base md:text-xl mb-6 tracking-wide" style={{ fontFamily: "'Kalam', cursive" }}>
            जय श्री राधा कृष्णा इन्टर प्राइजेज
          </p>
          <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed" style={{ fontFamily: "'Kalam', cursive" }}>
            हर खुशी को यादगार बनाने के लिए — VIP टेन्ट, लग्जरी लाइटिंग, जनरेटर और स्मार्ट स्टाफ के साथ आपका स्वागत है।
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="https://wa.me/918382858008"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-2xl text-base"
              style={{ fontFamily: "'Kalam', cursive" }}
            >
              <i className="fab fa-whatsapp text-xl"></i>
              <span>WhatsApp पर बुकिंग करें</span>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center space-x-2 text-white font-bold px-6 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-2xl text-base"
              style={{ fontFamily: "'Kalam', cursive", background: "linear-gradient(135deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)" }}
            >
              <i className="fab fa-instagram text-xl"></i>
              <span>Instagram पर देखें</span>
            </a>
          </div>

          {/* Badge */}
          <div className="inline-block bg-red-900/70 backdrop-blur-sm border border-yellow-500/40 text-yellow-200 text-xs md:text-sm px-5 py-2 rounded-full" style={{ fontFamily: "'Kalam', cursive" }}>
             प्रोपराइटर: जयप्रकाश त्रिपाठी (J.P. Sir) &nbsp;|&nbsp; 🚚 सर्विस एरिया: 50-60 किमी
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-yellow-400/70 animate-bounce">
          <i className="fas fa-chevron-down text-2xl"></i>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <div className="bg-red-900 py-6 border-y-2 border-yellow-500/30">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { icon: "fa-tent", value: "500+", label: "सफल आयोजन" },
            { icon: "fa-map-marker-alt", value: "50-60 km", label: "सर्विस एरिया" },
            { icon: "fa-users", value: "1000+", label: "खुश परिवार" },
            { icon: "fa-star", value: "VIP", label: "सेवा स्तर" },
          ].map((s, i) => (
            <FadeDiv key={i} delay={i * 100} className="py-2">
              <div className="text-yellow-400 text-2xl mb-1">
                <i className={`fas ${s.icon}`}></i>
              </div>
              <div className="text-yellow-300 font-extrabold text-xl md:text-2xl" style={{ fontFamily: "'Yatra One', cursive" }}>{s.value}</div>
              <div className="text-red-200 text-xs mt-1" style={{ fontFamily: "'Kalam', cursive" }}>{s.label}</div>
            </FadeDiv>
          ))}
        </div>
      </div>

      {/* ── About Intro ── */}
      <section className="py-20 md:py-28 px-4 bg-amber-50">
        <div className="max-w-7xl mx-auto">
          <FadeDiv className="text-center mb-14">
            <span className="text-red-800 tracking-widest uppercase text-sm font-semibold" style={{ fontFamily: "'Kalam', cursive" }}>हमारा परिचय</span>
            <h2 className="font-extrabold text-3xl md:text-5xl text-red-900 mt-3 mb-2" style={{ fontFamily: "'Yatra One', cursive" }}>
              हर खुशी हो खास, हर पल हो यादगार
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-red-800 mx-auto mt-4"></div>
          </FadeDiv>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeDiv>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                <img
                  src="https://images.pexels.com/photos/9491250/pexels-photo-9491250.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800"
                  alt="Luxury Tent House Setup"
                  className="w-full h-80 md:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-950/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="bg-yellow-500 text-red-950 font-bold text-sm px-4 py-1 rounded-full" style={{ fontFamily: "'Kalam', cursive" }}>
                    👑 VIP लग्जरी टेन्ट हाउस
                  </span>
                </div>
              </div>
            </FadeDiv>

            <FadeDiv delay={200} className="space-y-5">
              <div className="bg-white rounded-2xl p-6 shadow-xl border-l-4 border-yellow-500">
                <h3 className="font-extrabold text-2xl md:text-3xl text-red-900 mb-3" style={{ fontFamily: "'Yatra One', cursive" }}>
                  तिवारी टेन्ट हाउस में आपका स्वागत है
                </h3>
                <p className="text-gray-700 leading-relaxed mb-3" style={{ fontFamily: "'Kalam', cursive" }}>
                  महेवा मलकिया, महेशगंज, कुंडा - प्रतापगढ़ में स्थित हमारा टेन्ट हाउस पिछले कई वर्षों से लोगों की खुशियों को और खूबसूरत बना रहा है।
                </p>
                <p className="text-gray-700 leading-relaxed" style={{ fontFamily: "'Kalam', cursive" }}>
                  हम सभी प्रकार की VIP सुविधाएँ उपलब्ध कराते हैं — वॉटरप्रूफ टेंट से लेकर लग्जरी लाइटिंग, जनरेटर, स्मार्ट स्टाफ, जयमाल सोफा, कॉफी व फव्वारा मशीन तक।
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-900 rounded-xl p-4 text-center shadow-lg">
                  <div className="text-yellow-400 text-2xl mb-1"><i className="fas fa-shield-alt"></i></div>
                  <div className="text-yellow-300 font-bold text-sm" style={{ fontFamily: "'Kalam', cursive" }}>100% विश्वसनीय</div>
                  <div className="text-red-200 text-xs mt-1" style={{ fontFamily: "'Kalam', cursive" }}>गारंटीड सर्विस</div>
                </div>
                <div className="bg-yellow-500 rounded-xl p-4 text-center shadow-lg">
                  <div className="text-red-900 text-2xl mb-1"><i className="fas fa-crown"></i></div>
                  <div className="text-red-950 font-bold text-sm" style={{ fontFamily: "'Kalam', cursive" }}>VIP अनुभव</div>
                  <div className="text-red-800 text-xs mt-1" style={{ fontFamily: "'Kalam', cursive" }}>हर आयोजन में</div>
                </div>
              </div>

              <button
                onClick={() => setPage("about")}
                className="inline-flex items-center space-x-2 bg-red-900 hover:bg-red-800 text-yellow-400 font-bold px-6 py-3 rounded-full transition-all hover:scale-105 shadow-xl"
                style={{ fontFamily: "'Kalam', cursive" }}
              >
                <span>और जानें</span>
                <i className="fas fa-arrow-right"></i>
              </button>
            </FadeDiv>
          </div>
        </div>
      </section>

      {/* ── Services Preview ── */}
      <section className="py-20 bg-gradient-to-b from-red-900 to-red-950">
        <div className="max-w-7xl mx-auto px-4">
          <FadeDiv className="text-center mb-14">
            <span className="text-yellow-300 tracking-widest uppercase text-sm" style={{ fontFamily: "'Kalam', cursive" }}>हमारी VIP सेवाएं</span>
            <h2 className="font-extrabold text-3xl md:text-5xl text-yellow-400 mt-3" style={{ fontFamily: "'Yatra One', cursive" }}>
              सभी सुविधाएं एक छत के नीचे
            </h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mt-4"></div>
          </FadeDiv>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "fa-tent", title: "VIP वॉटरप्रूफ टेंट", desc: "हर मौसम में सुरक्षित, बड़े से बड़े आयोजन के लिए विशाल वॉटरप्रूफ VIP टेंट।", delay: 0 },
              { icon: "fa-lightbulb", title: "लग्जरी लाइटिंग & जनरेटर", desc: "जगमगाती रोशनी और निर्बाध बिजली के लिए हाई-क्वालिटी जनरेटर सेवा।", delay: 100 },
              { icon: "fa-couch", title: "जयमाल सोफा & स्टेज", desc: "VIP जयमाल सोफा, शाही स्टेज डेकोर और वेडिंग सेटअप — एकदम शाही अनुभव।", delay: 200 },
              { icon: "fa-user-tie", title: "स्मार्ट वेटर & स्टाफ", desc: "प्रशिक्षित और अनुशासित स्टाफ जो आपके हर मेहमान का खयाल रखे।", delay: 300 },
            ].map((s, i) => (
              <FadeDiv key={i} delay={s.delay}>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-yellow-500/20 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/15 transition-all duration-300 group h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform shadow-lg">
                    <i className={`fas ${s.icon} text-red-900 text-2xl`}></i>
                  </div>
                  <h3 className="text-yellow-300 font-bold text-lg mb-3" style={{ fontFamily: "'Yatra One', cursive" }}>{s.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: "'Kalam', cursive" }}>{s.desc}</p>
                </div>
              </FadeDiv>
            ))}
          </div>

          <FadeDiv className="text-center mt-10">
            <button
              onClick={() => setPage("services")}
              className="inline-flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-400 text-red-950 font-bold px-8 py-4 rounded-full transition-all hover:scale-105 shadow-2xl"
              style={{ fontFamily: "'Kalam', cursive" }}
            >
              <span>सभी सेवाएं देखें</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </FadeDiv>
        </div>
      </section>

      {/* ── Quote / Tagline ── */}
      <section className="py-24 px-4 bg-amber-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 flex items-center justify-center">
          <i className="fas fa-om text-red-900" style={{ fontSize: "30rem" }}></i>
        </div>
        <FadeDiv className="max-w-4xl mx-auto text-center relative z-10">
          <i className="fas fa-quote-left text-5xl text-yellow-500/40 mb-6"></i>
          <blockquote className="text-2xl md:text-4xl text-red-900 font-bold leading-relaxed italic mb-6" style={{ fontFamily: "'Yatra One', cursive" }}>
            "आपकी हर खुशी हमारी जिम्मेदारी — हर रस्म को बनाएं यादगार, हर पल को करें खास।"
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-yellow-500"></div>
            <span className="text-yellow-600 font-bold" style={{ fontFamily: "'Yatra One', cursive" }}>तिवारी टेन्ट हाउस</span>
            <div className="w-12 h-px bg-yellow-500"></div>
          </div>
          <p className="text-red-700 mt-3 text-sm" style={{ fontFamily: "'Kalam', cursive" }}>महेवा मलकिया, महेशगंज, कुंडा - प्रतापगढ़</p>
        </FadeDiv>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-20 px-4 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600">
        <FadeDiv className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-red-950 mb-4" style={{ fontFamily: "'Yatra One', cursive" }}>
            अपना आयोजन अभी बुक करें!
          </h2>
          <p className="text-red-900 text-lg mb-8" style={{ fontFamily: "'Kalam', cursive" }}>
            बुकिंग के लिए आज ही कॉल करें या WhatsApp करें — हम हमेशा तैयार हैं।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:8382858008"
              className="inline-flex items-center justify-center space-x-2 bg-red-900 hover:bg-red-800 text-yellow-400 font-bold px-8 py-4 rounded-full transition-all hover:scale-105 shadow-2xl"
              style={{ fontFamily: "'Kalam', cursive" }}
            >
              <i className="fas fa-phone"></i>
              <span>📞 8382858008</span>
            </a>
            <a
              href="tel:8874366886"
              className="inline-flex items-center justify-center space-x-2 bg-white hover:bg-red-50 text-red-900 font-bold px-8 py-4 rounded-full transition-all hover:scale-105 shadow-2xl"
              style={{ fontFamily: "'Kalam', cursive" }}
            >
              <i className="fas fa-phone"></i>
              <span>📞 8874366886</span>
            </a>
          </div>
        </FadeDiv>
      </section>

      {/* ── Terms & Conditions ── */}
      <section className="py-16 px-4 bg-red-950">
        <div className="max-w-4xl mx-auto">
          <FadeDiv>
            <div className="border-2 border-yellow-500/50 rounded-2xl p-6 md:p-8 bg-red-900/60 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-file-contract text-red-950 text-lg"></i>
                </div>
                <h3 className="text-yellow-400 font-extrabold text-xl md:text-2xl" style={{ fontFamily: "'Yatra One', cursive" }}>
                  नियम एवं शर्तें (Terms & Conditions)
                </h3>
              </div>
              <ul className="space-y-4">
                {[
                  { icon: "fa-money-bill-wave", text: "बुकिंग कन्फर्म करने के लिए 50% एडवांस अनिवार्य है।" },
                  { icon: "fa-truck", text: "सामान लाने-ले जाने का ट्रांसपोर्ट व लेबर खर्च आर्डरकर्ता का होगा।" },
                  { icon: "fa-clock", text: "सामान की वापसी 11 बजे तक अनिवार्य है।" },
                  { icon: "fa-exclamation-triangle", text: "नुकसान की भरपाई: सामान टूटने या खो जाने पर नया सामान का पूरा पैसा आर्डरकर्ता को देना होगा।  आर्डर मे जितना सामान लिखाया गया है उसके अलावा सामान उपलब्ध होने पर ही मिल सकता है।  यदि किसी प्रकार का विवाद होता है तो इसका निपटारा प्रतापगढ़ न्यायालय मे होगा।" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-500/20 border border-yellow-500/40 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className={`fas ${item.icon} text-yellow-400 text-xs`}></i>
                    </div>
                    <p className="text-red-100 text-sm md:text-base leading-relaxed" style={{ fontFamily: "'Kalam', cursive" }}>
                      {item.text}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-5 border-t border-yellow-500/20 text-center">
                <p className="text-yellow-400/80 text-sm italic" style={{ fontFamily: "'Kalam', cursive" }}>
                  ॥ श्री गणेशाय नमः — आपका हर आयोजन मंगलमय हो ॥
                </p>
              </div>
            </div>
          </FadeDiv>
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ABOUT PAGE
// ═══════════════════════════════════════════════════════════════════════════

function AboutPage({ setPage: _setPage }: { setPage: (p: Page) => void }) {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 md:pt-36 pb-20 bg-gradient-to-br from-red-950 via-red-900 to-red-800 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img
            src="https://images.pexels.com/photos/36836730/pexels-photo-36836730.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600"
            alt="Indian Wedding"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <span className="text-yellow-300 tracking-widest uppercase text-sm" style={{ fontFamily: "'Kalam', cursive" }}>हमारे बारे में</span>
          <h1 className="font-extrabold text-4xl md:text-6xl text-yellow-400 mt-4 mb-4" style={{ fontFamily: "'Yatra One', cursive" }}>
            तिवारी टेन्ट हाउस की कहानी
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto" style={{ fontFamily: "'Kalam', cursive" }}>
            विश्वास, अनुभव और समर्पण का अनूठा संगम
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 0C1440 0 1080 60 720 60C360 60 0 0 0 0L0 80Z" fill="#fffbeb" />
          </svg>
        </div>
      </section>

      {/* Firm Details */}
      <section className="py-20 px-4 bg-amber-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <FadeDiv>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/14395559/pexels-photo-14395559.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800"
                  alt="Wedding Stage Decoration"
                  className="w-full h-80 md:h-96 object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-950/50 to-transparent"></div>
              </div>
            </FadeDiv>
            <FadeDiv delay={150} className="space-y-5">
              <div>
                <span className="text-red-800 text-sm font-semibold tracking-widest uppercase" style={{ fontFamily: "'Kalam', cursive" }}>फर्म का नाम</span>
                <h2 className="font-extrabold text-2xl md:text-3xl text-red-900 mt-1" style={{ fontFamily: "'Yatra One', cursive" }}>
                  जय श्री राधा कृष्णा इन्टर प्राइजेज
                </h2>
              </div>
              <div className="w-16 h-1 bg-yellow-500"></div>
              <div className="bg-white rounded-2xl p-5 shadow-lg border-l-4 border-yellow-500 space-y-3">
                <div className="flex items-start gap-3">
                  <i className="fas fa-user-tie text-yellow-600 mt-1"></i>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">प्रोपराइटर</p>
                    <p className="text-red-900 font-bold" style={{ fontFamily: "'Yatra One', cursive" }}>
                    </p>
                    <p className="text-red-800 font-semibold text-sm" style={{ fontFamily: "'Kalam', cursive" }}>
                    जयप्रकाश त्रिपाठी (J.P. Sir)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <i className="fas fa-map-marker-alt text-yellow-600 mt-1"></i>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">पता</p>
                    <p className="text-gray-700 text-sm" style={{ fontFamily: "'Kalam', cursive" }}>
                      महेवा मलकिया, महेशगंज, कुंडा - प्रतापगढ़ (उ.प्र.)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <i className="fas fa-phone text-yellow-600 mt-1"></i>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">संपर्क</p>
                    <a href="tel:8382858008" className="text-red-900 font-bold hover:text-red-700" style={{ fontFamily: "'Kalam', cursive" }}>8382858008</a>
                    <span className="text-gray-400 mx-2">|</span>
                    <a href="tel:8874366886" className="text-red-900 font-bold hover:text-red-700" style={{ fontFamily: "'Kalam', cursive" }}>8874366886</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <i className="fas fa-route text-yellow-600 mt-1"></i>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">सर्विस एरिया</p>
                    <p className="text-gray-700 text-sm" style={{ fontFamily: "'Kalam', cursive" }}>
                      प्रतापगढ़ व 50 से 60 किलोमीटर के दायरे में सर्विस उपलब्ध।
                    </p>
                  </div>
                </div>
              </div>
            </FadeDiv>
          </div>

          {/* Why Us */}
          <FadeDiv className="text-center mb-12">
            <span className="text-red-800 text-sm font-semibold tracking-widest uppercase" style={{ fontFamily: "'Kalam', cursive" }}>हमारी खासियत</span>
            <h2 className="font-extrabold text-3xl md:text-4xl text-red-900 mt-2" style={{ fontFamily: "'Yatra One', cursive" }}>
              क्यों चुनें तिवारी टेन्ट हाउस?
            </h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mt-4"></div>
          </FadeDiv>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "fa-award", title: "वर्षों का अनुभव", desc: "लंबे अनुभव के साथ हमने सैकड़ों शादियों, हल्दी, बारात और रिसेप्शन को यादगार बनाया है।", delay: 0 },
              { icon: "fa-handshake", title: "विश्वसनीय सेवा", desc: "हम समय पर, पूरी तैयारी के साथ आते हैं। हमारा वादा है — आपकी खुशी, हमारी प्राथमिकता।", delay: 100 },
              { icon: "fa-tags", title: "उचित मूल्य", desc: "VIP सुविधाएं, लेकिन जेब पर भारी नहीं। बजट के अनुसार बेहतरीन पैकेज उपलब्ध।", delay: 200 },
              { icon: "fa-map-marked-alt", title: "50-60 km सर्विस", desc: "प्रतापगढ़ व आसपास के 50-60 किमी के दायरे में हम आपके दरवाजे तक पहुंचते हैं।", delay: 0 },
              { icon: "fa-headset", title: "24/7 सपोर्ट", desc: "आयोजन से पहले, दौरान और बाद में — हमारी टीम हमेशा आपके साथ।", delay: 100 },
              { icon: "fa-star", title: "पूर्ण VIP व्यवस्था", desc: "टेंट से लेकर स्टाफ तक, लाइट से लेकर कॉफी मशीन तक — सब कुछ VIP स्तर का।", delay: 200 },
            ].map((item, i) => (
              <FadeDiv key={i} delay={item.delay}>
                <div className="bg-white rounded-2xl p-6 shadow-xl hover:-translate-y-2 transition-all duration-300 group border border-red-100 h-full">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-900 to-red-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <i className={`fas ${item.icon} text-yellow-400 text-xl`}></i>
                  </div>
                  <h3 className="text-red-900 font-bold text-lg mb-2" style={{ fontFamily: "'Yatra One', cursive" }}>{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "'Kalam', cursive" }}>{item.desc}</p>
                </div>
              </FadeDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area Section */}
      <section className="py-20 px-4 bg-red-900">
        <div className="max-w-5xl mx-auto text-center">
          <FadeDiv>
            <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-map-marked-alt text-red-950 text-3xl"></i>
            </div>
            <h2 className="font-extrabold text-3xl md:text-4xl text-yellow-400 mb-4" style={{ fontFamily: "'Yatra One', cursive" }}>
              हमारा सर्विस एरिया
            </h2>
            <p className="text-white/80 text-lg mb-6" style={{ fontFamily: "'Kalam', cursive" }}>
              प्रतापगढ़ व 50 से 60 किलोमीटर के दायरे में सर्विस उपलब्ध।
            </p>
            <div className="grid md:grid-cols-3 gap-5 mt-10">
              {["प्रतापगढ़", "कुंडा", "महेशगंज", "रानीगंज", "लालगंज", "विश्वनाथगंज"].map((area, i) => (
                <FadeDiv key={i} delay={i * 80}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl py-3 px-5 border border-yellow-500/30 text-yellow-300 font-semibold hover:bg-white/20 transition-all" style={{ fontFamily: "'Kalam', cursive" }}>
                    <i className="fas fa-map-pin text-yellow-500 mr-2"></i>
                    {area}
                  </div>
                </FadeDiv>
              ))}
            </div>
            <p className="text-red-200 mt-6 text-sm" style={{ fontFamily: "'Kalam', cursive" }}>
              * और भी क्षेत्रों में सेवा उपलब्ध — कॉल करके पुष्टि करें।
            </p>
          </FadeDiv>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-yellow-500 to-amber-500">
        <FadeDiv className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-red-950 mb-4" style={{ fontFamily: "'Yatra One', cursive" }}>
            आज ही बुकिंग करें!
          </h2>
          <p className="text-red-900 mb-6" style={{ fontFamily: "'Kalam', cursive" }}>
            बुकिंग कन्फर्म करने के लिए 50% एडवांस अनिवार्य है।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:8382858008" className="inline-flex items-center justify-center gap-2 bg-red-900 hover:bg-red-800 text-yellow-400 font-bold px-8 py-4 rounded-full hover:scale-105 transition-all shadow-2xl" style={{ fontFamily: "'Kalam', cursive" }}>
              <i className="fas fa-phone"></i> 8382858008
            </a>
            <a href="https://wa.me/918382858008" target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-4 rounded-full hover:scale-105 transition-all shadow-2xl" style={{ fontFamily: "'Kalam', cursive" }}>
              <i className="fab fa-whatsapp text-xl"></i> WhatsApp करें
            </a>
          </div>
        </FadeDiv>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SERVICES PAGE
// ═══════════════════════════════════════════════════════════════════════════

function ServicesPage(_props?: { setPage?: (p: Page) => void }) {
  const services = [
    {
      icon: "fa-tent",
      title: "VIP वॉटरप्रूफ टेंट",
      desc: "बड़े से बड़े आयोजन के लिए विशाल, मजबूत और पूरी तरह वॉटरप्रूफ VIP टेंट। हर मौसम में सुरक्षित और शानदार।",
      img: "https://images.pexels.com/photos/9491250/pexels-photo-9491250.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
      badge: "सबसे लोकप्रिय",
    },
    {
      icon: "fa-lightbulb",
      title: "लग्जरी लाइटिंग & जनरेटर",
      desc: "रंग-बिरंगी LED लाइटें, फैंसी झालर, फुल्ल डेकोरेटिव लाइटिंग और हाई-कैपेसिटी जनरेटर — बिजली की कोई चिंता नहीं।",
      img: "https://images.pexels.com/photos/36513643/pexels-photo-36513643.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
      badge: "VIP",
    },
    {
      icon: "fa-user-tie",
      title: "स्मार्ट वेटर & स्टाफ",
      desc: "यूनिफॉर्म में प्रशिक्षित, अनुशासित वेटर और स्टाफ — आपके हर मेहमान का सम्मान और सेवा सुनिश्चित।",
      img: "https://images.pexels.com/photos/35688723/pexels-photo-35688723.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
      badge: "प्रीमियम",
    },
    {
      icon: "fa-couch",
      title: "जयमाल सोफा",
      desc: "VIP शाही जयमाल सोफा — दूल्हा-दुल्हन के लिए एकदम शाही और आकर्षक सीटिंग अरेंजमेंट।",
      img: "https://ibb.co/jvfHsDPc",
      badge: "VIP",
    },
    {
      icon: "fa-coffee",
      title: "कॉफी & फव्वारा मशीन",
      desc: "मेहमानों के लिए स्वचालित कॉफी मशीन और सुंदर फव्वारा मशीन — एक लग्जरी अनुभव।",
      img: "https://i.ibb.co/3ydkQc9D/1780231008588.png",
      badge: "एक्सक्लूसिव",
    },
    {
      icon: "fa-archway",
      title: "गेट & स्टेज डेकोर",
      desc: "भव्य वेलकम गेट, शाही स्टेज, फूलों की सजावट — आपका हर आयोजन सोशल मीडिया-वर्दी बने।",
      img: "https://images.pexels.com/photos/32325269/pexels-photo-32325269.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
      badge: "ट्रेंडिंग",
    },
  ];

  const occasions = [
    { icon: "fa-heart", label: "शादी विवाह" },
    { icon: "fa-drumstick-bite", label: "हल्दी संगीत" },
    { icon: "fa-horse", label: "बारात" },
    { icon: "fa-utensils", label: "रिसेप्शन" },
    { icon: "fa-birthday-cake", label: "जन्मदिन" },
    { icon: "fa-star-and-crescent", label: "धार्मिक आयोजन" },
    { icon: "fa-building", label: "कॉर्पोरेट इवेंट" },
    { icon: "fa-calendar-check", label: "सभी आयोजन" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 md:pt-36 pb-20 bg-gradient-to-br from-red-950 via-red-900 to-red-800 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.pexels.com/photos/9714792/pexels-photo-9714792.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600"
            alt="Wedding Event"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <span className="text-yellow-300 tracking-widest uppercase text-sm" style={{ fontFamily: "'Kalam', cursive" }}>हमारी VIP सेवाएं</span>
          <h1 className="font-extrabold text-4xl md:text-6xl text-yellow-400 mt-4 mb-4" style={{ fontFamily: "'Yatra One', cursive" }}>
            सेवाएं & गैलरी
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto" style={{ fontFamily: "'Kalam', cursive" }}>
            VIP सुविधाएं एक जगह — शादी हो या कोई भी आयोजन, हम हर पल को खास बनाते हैं।
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 0C1440 0 1080 60 720 60C360 60 0 0 0 0L0 80Z" fill="#fffbeb" />
          </svg>
        </div>
      </section>

      {/* Occasions Strip */}
      <section className="py-10 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4">
          <FadeDiv className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-red-900" style={{ fontFamily: "'Yatra One', cursive" }}>
              किस आयोजन के लिए?
            </h2>
          </FadeDiv>
          <div className="flex flex-wrap justify-center gap-3">
            {occasions.map((o, i) => (
              <FadeDiv key={i} delay={i * 60}>
                <div className="flex items-center gap-2 bg-white border-2 border-red-100 hover:border-yellow-500 rounded-full px-4 py-2 cursor-pointer hover:shadow-lg transition-all group">
                  <i className={`fas ${o.icon} text-yellow-600 group-hover:text-red-900`}></i>
                  <span className="text-red-900 font-semibold text-sm" style={{ fontFamily: "'Kalam', cursive" }}>{o.label}</span>
                </div>
              </FadeDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 bg-amber-50">
        <div className="max-w-7xl mx-auto">
          <FadeDiv className="text-center mb-14">
            <span className="text-red-800 text-sm font-semibold tracking-widest uppercase" style={{ fontFamily: "'Kalam', cursive" }}>VIP सेवाएं</span>
            <h2 className="font-extrabold text-3xl md:text-5xl text-red-900 mt-3" style={{ fontFamily: "'Yatra One', cursive" }}>
              हमारी प्रीमियम सेवाएं
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-red-800 mx-auto mt-4"></div>
          </FadeDiv>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <FadeDiv key={i} delay={i * 100}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-2xl hover:-translate-y-2 hover:shadow-red-200 transition-all duration-300 group h-full flex flex-col">
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={s.img}
                      alt={s.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-red-950/70 via-transparent to-transparent"></div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-yellow-500 text-red-950 text-xs font-bold px-3 py-1 rounded-full" style={{ fontFamily: "'Kalam', cursive" }}>
                        {s.badge}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                        <i className={`fas ${s.icon} text-red-950 text-base`}></i>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-red-900 font-extrabold text-xl mb-2" style={{ fontFamily: "'Yatra One', cursive" }}>{s.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed flex-1" style={{ fontFamily: "'Kalam', cursive" }}>{s.desc}</p>
                    <a
                      href="https://wa.me/918382858008"
                      target="_blank"
                      rel="noopener"
                      className="mt-4 inline-flex items-center gap-2 text-green-700 hover:text-green-600 font-bold text-sm transition-colors"
                      style={{ fontFamily: "'Kalam', cursive" }}
                    >
                      <i className="fab fa-whatsapp text-base"></i>
                      <span>WhatsApp पर पूछें</span>
                    </a>
                  </div>
                </div>
              </FadeDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-4 bg-red-950">
        <div className="max-w-7xl mx-auto">
          <FadeDiv className="text-center mb-14">
            <span className="text-yellow-300 text-sm tracking-widest uppercase" style={{ fontFamily: "'Kalam', cursive" }}>हमारी गैलरी</span>
            <h2 className="font-extrabold text-3xl md:text-4xl text-yellow-400 mt-3" style={{ fontFamily: "'Yatra One', cursive" }}>
              हमारे आयोजनों की झलक
            </h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mt-4"></div>
          </FadeDiv>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { img: "https://images.pexels.com/photos/31307956/pexels-photo-31307956.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600", label: "आउटडोर वेडिंग सेटअप" },
              { img: "https://images.pexels.com/photos/14395559/pexels-photo-14395559.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600", label: "शाही स्टेज डेकोर" },
              { img: "https://images.pexels.com/photos/9714792/pexels-photo-9714792.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600", label: "इवनिंग वेडिंग" },
              { img: "https://images.pexels.com/photos/36836730/pexels-photo-36836730.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600", label: "जयमाल सेरेमनी" },
              { img: "https://images.pexels.com/photos/36766850/pexels-photo-36766850.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600", label: "रिसेप्शन सेटअप" },
              { img: "https://images.pexels.com/photos/27078978/pexels-photo-27078978.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600", label: "डाइनिंग अरेंजमेंट" },
            ].map((g, i) => (
              <FadeDiv key={i} delay={i * 80}>
                <div className="relative rounded-xl overflow-hidden shadow-xl group h-48 md:h-64">
                  <img
                    src={g.img}
                    alt={g.label}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-950/80 via-red-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-yellow-300 font-bold text-sm" style={{ fontFamily: "'Kalam', cursive" }}>{g.label}</p>
                  </div>
                </div>
              </FadeDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Package CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600">
        <FadeDiv className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">👑</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-red-950 mb-4" style={{ fontFamily: "'Yatra One', cursive" }}>
            अपना VIP पैकेज बुक करें
          </h2>
          <p className="text-red-900 text-lg mb-8 max-w-2xl mx-auto" style={{ fontFamily: "'Kalam', cursive" }}>
            हर बजट के लिए बेहतरीन पैकेज। अभी कॉल करें और अपने आयोजन को यादगार बनाएं।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:8382858008"
              className="inline-flex items-center justify-center gap-2 bg-red-900 hover:bg-red-800 text-yellow-400 font-bold px-8 py-4 rounded-full hover:scale-105 transition-all shadow-2xl"
              style={{ fontFamily: "'Kalam', cursive" }}
            >
              <i className="fas fa-phone"></i>
              <span>📞 8382858008</span>
            </a>
            <a
              href="tel:8874366886"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-900 font-bold px-8 py-4 rounded-full hover:scale-105 transition-all shadow-2xl"
              style={{ fontFamily: "'Kalam', cursive" }}
            >
              <i className="fas fa-phone"></i>
              <span>📞 8874366886</span>
            </a>
            <a
              href="https://wa.me/918382858008"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-4 rounded-full hover:scale-105 transition-all shadow-2xl"
              style={{ fontFamily: "'Kalam', cursive" }}
            >
              <i className="fab fa-whatsapp text-xl"></i>
              <span>WhatsApp करें</span>
            </a>
          </div>
        </FadeDiv>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-amber-50" id="contact">
        <div className="max-w-4xl mx-auto">
          <FadeDiv className="text-center mb-12">
            <span className="text-red-800 text-sm font-semibold tracking-widest uppercase" style={{ fontFamily: "'Kalam', cursive" }}>संपर्क करें</span>
            <h2 className="font-extrabold text-3xl md:text-4xl text-red-900 mt-2" style={{ fontFamily: "'Yatra One', cursive" }}>
              हमसे बात करें
            </h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mt-4"></div>
          </FadeDiv>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <FadeDiv>
              <div className="bg-white rounded-2xl p-6 shadow-xl border-t-4 border-yellow-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-red-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-phone text-yellow-400 text-xl"></i>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">कॉल करें</p>
                    <a href="tel:8382858008" className="text-red-900 font-bold text-lg block" style={{ fontFamily: "'Kalam', cursive" }}>8382858008</a>
                    <a href="tel:8874366886" className="text-red-900 font-bold text-lg block" style={{ fontFamily: "'Kalam', cursive" }}>8874366886</a>
                  </div>
                </div>
                <p className="text-gray-500 text-sm" style={{ fontFamily: "'Kalam', cursive" }}>सोमवार - रविवार | सुबह 7 बजे से रात 10 बजे तक</p>
              </div>
            </FadeDiv>

            <FadeDiv delay={100}>
              <div className="bg-white rounded-2xl p-6 shadow-xl border-t-4 border-green-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fab fa-whatsapp text-white text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">WhatsApp करें</p>
                    <a href="https://wa.me/918382858008" target="_blank" rel="noopener" className="text-green-700 font-bold text-lg block" style={{ fontFamily: "'Kalam', cursive" }}>8382858008</a>
                    <p className="text-gray-500 text-sm" style={{ fontFamily: "'Kalam', cursive" }}>तुरंत जवाब पाएं</p>
                  </div>
                </div>
                <a href="https://wa.me/918382858008" target="_blank" rel="noopener" className="inline-flex items-center gap-2 bg-green-600 text-white font-bold px-5 py-2 rounded-full hover:bg-green-500 transition-all text-sm" style={{ fontFamily: "'Kalam', cursive" }}>
                  <i className="fab fa-whatsapp"></i> अभी WhatsApp करें
                </a>
              </div>
            </FadeDiv>
          </div>

          <FadeDiv delay={200}>
            <div className="bg-white rounded-2xl p-6 shadow-xl border-t-4 border-red-800">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-red-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i className="fas fa-map-marker-alt text-yellow-400 text-xl"></i>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">हमारा पता</p>
                  <p className="text-red-900 font-bold text-lg" style={{ fontFamily: "'Yatra One', cursive" }}>तिवारी टेन्ट हाउस</p>
                  <p className="text-gray-700 font-semibold" style={{ fontFamily: "'Kalam', cursive" }}>जय श्री राधा कृष्णा इन्टर प्राइजेज</p>
                  <p className="text-gray-600 mt-1" style={{ fontFamily: "'Kalam', cursive" }}>महेवा मलकिया, महेशगंज, कुंडा - प्रतापगढ़ (उत्तर प्रदेश)</p>
                  <p className="text-gray-600 mt-2 text-sm" style={{ fontFamily: "'Kalam', cursive" }}>
                    <i className="fas fa-route text-yellow-600 mr-1"></i>
                    सर्विस एरिया: प्रतापगढ़ व 50 से 60 किलोमीटर के दायरे में
                  </p>
                </div>
              </div>
            </div>
          </FadeDiv>
        </div>
      </section>

      {/* Terms & Conditions */}
      <section className="py-16 px-4 bg-red-950">
        <div className="max-w-4xl mx-auto">
          <FadeDiv>
            <div className="border-2 border-yellow-500/50 rounded-2xl p-6 md:p-8 bg-red-900/60 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-file-contract text-red-950 text-lg"></i>
                </div>
                <h3 className="text-yellow-400 font-extrabold text-xl md:text-2xl" style={{ fontFamily: "'Yatra One', cursive" }}>
                  नियम एवं शर्तें (Terms & Conditions)
                </h3>
              </div>
              <ul className="space-y-4">
                {[
                  { icon: "fa-money-bill-wave", text: "बुकिंग कन्फर्म करने के लिए 50% एडवांस अनिवार्य है।" },
                  { icon: "fa-truck", text: "सामान लाने-ले जाने का ट्रांसपोर्ट व लेबर खर्च आर्डरकर्ता का होगा।" },
                  { icon: "fa-clock", text: "सामान की वापसी 11 बजे तक अनिवार्य है।" },
                  { icon: "fa-exclamation-triangle", text: "नुकसान की भरपाई: सामान टूटने या खो जाने पर नया सामान का पूरा पैसा आर्डरकर्ता को देना होगा। आर्डर मे जितना सामान लिखाया गया है उसके अलावा सामान उपलब्ध होने पर ही मिल सकता है।  यदि किसी प्रकार का विवाद होता है तो इसका निपटारा प्रतापगढ़ न्यायालय मे होगा।  " },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-500/20 border border-yellow-500/40 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className={`fas ${item.icon} text-yellow-400 text-xs`}></i>
                    </div>
                    <p className="text-red-100 text-sm md:text-base leading-relaxed" style={{ fontFamily: "'Kalam', cursive" }}>
                      {item.text}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-5 border-t border-yellow-500/20 text-center">
                <p className="text-yellow-400/80 text-sm italic" style={{ fontFamily: "'Kalam', cursive" }}>
                  ॥ श्री गणेशाय नमः — आपका हर आयोजन मंगलमय हो ॥
                </p>
              </div>
            </div>
          </FadeDiv>
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════

export default function App() {
  const [page, setPage] = useState<Page>("home");

  const handleSetPage = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen antialiased" style={{ fontFamily: "'Kalam', cursive" }}>
      {/* Top Banner - always visible */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <TopBanner />
        <Navbar activePage={page} setPage={handleSetPage} />
      </div>

      {/* Page content with top padding for fixed header */}
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
