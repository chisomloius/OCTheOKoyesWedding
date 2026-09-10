import React, { useState, useEffect, useRef } from "react";
import {
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Calendar,
  Church,
  MapPin,
  Camera,
  Upload,
  Copy,
  Check,
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
  Send,
  Code2,
} from "lucide-react";
import "./App.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://octheokoyesweddingapi.onrender.com";


export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);
  const [copiedAccount, setCopiedAccount] = useState(false);
  // Start each visitor on a different photo while keeping the carousel controls intact.
  const [currentSlide, setCurrentSlide] = useState(() => Math.floor(Math.random() * 10));
  const [rsvpStatus, setRsvpStatus] = useState({ loading: false, msg: "", error: false });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    attendance: "yes",
    guests: "1",
    message: "",
  });

  // Local audio file in public/audio/endlessLove.mp3
  const audioRef = useRef(new Audio("/audio/endlessLove.mp3"));

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;

    return () => {
      audio.pause();
    };
  }, []);

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => console.log("Audio play error:", err));
      setIsPlaying(true);
    }
  };

  const handleCopyAccount = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  const handleRSVPSubmit = async (e) => {
    e.preventDefault();
    setRsvpStatus({ loading: true, msg: "", error: false });

    try {
      const res = await fetch(`${API_BASE_URL}/api/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit RSVP");

      setRsvpStatus({ loading: false, msg: "Thank you! Your RSVP is confirmed.", error: false });
      setFormData({ name: "", email: "", phone: "", attendance: "yes", guests: "1", message: "" });
    } catch (err) {
      setRsvpStatus({ loading: false, msg: err.message, error: true });
    }
  };

  const loveStoryImages = [
    { 
      url: "https://lh3.googleusercontent.com/d/1nLWi9uOSdjxP8tWvaTaHVypcJCpBwpj7", 
      caption: "Sunny Sunday Rendezvous"
    },
    { url: "https://lh3.googleusercontent.com/d/1cdLY1aTu29EsSSuX6zOoz8E5PO43Fkvj", 
      caption: "Nights Out" 
    },
    { url: "https://lh3.googleusercontent.com/d/15emwpryZmXmNuw8Xnf6NcWr1W8oYqFf5", 
      caption: "Celebrating Our Engagement" 
    },
    { url: "https://lh3.googleusercontent.com/d/1tMN-dgBgzkK5V5ysvK7p-I4b0zq9NbgZ", 
      caption: "In the Middle of Sea" 
    },
    { url: "https://lh3.googleusercontent.com/d/1itv9GuMyRItc-PjR4laKD2s8fqS9pCWU", 
      caption: "Marriage Introduction" 
    },
    { url: "https://lh3.googleusercontent.com/d/1tV9B_WSQaYqJ-qHvdcWh6jlfHiSIevEp", 
      caption: "Roadside Pictures" 
    },
    { url: "https://lh3.googleusercontent.com/d/1yL8v90oS6w2GOeduzGNu2RM14UX0l_ti", 
      caption: "Wedding Guests" 
    },
    { url: "https://lh3.googleusercontent.com/d/1xrkmqjmhmB2sI6JKE65JRzSNtCELOPyo", 
      caption: "On Board Trip Together" 
    },
    { url: "https://lh3.googleusercontent.com/d/1Ansxf15DTZ5LHCig-Aa31G4zv_O8jozm", 
      caption: "Goofy Moments" 
    },
    { url: "https://lh3.googleusercontent.com/d/1yDZGmqc9qg1roUTzD6QWKA-WbYYsTu9t", 
      caption: "Standing Together at the Ambazonian Statue" 
    }
  ];

  const registryItems = [
  { 
    id: 1, 
    name: "4-Burner Gas Cooker", 
    category: "Gifts",
    image: "/images/image-wed.jpg"
  },
  { 
    id: 2, 
    name: "Air Conditioner", 
    category: "Gifts",
    image: "/images/image-wed-2.jpg"
  },
  { 
    id: 3, 
    name: "Air Fryer", 
    category: "Gifts",
    image: "/images/image-wed-3.jpg"
  },
  { 
    id: 4, 
    name: "Cash Gift", 
    category: "Gifts",
    image: "/images/image-wed-4.jpg"
  },
  { 
    id: 5, 
    name: "Deep Freezer", 
    category: "Gifts",
    image: "/images/image-wed-5.jpg"
  },
  { 
    id: 6, 
    name: "Food Processor", 
    category: "Gifts",
    image: "/images/image-wed-6.jpg"
  },
  { 
    id: 7, 
    name: "Stainless Cookware", 
    category: "Gifts",
    image: "/images/image-wed-7.jpg"
  },
  { 
    id: 8, 
    name: "Washing Machine", 
    category: "Gifts",
    image: "/images/image-wed-8.jpg"
  }
];



  const navLinks = [
    { href: "#story", label: "Story" },
    { href: "#details", label: "Details" },
    { href: "#dresscode", label: "Dress Code" },
    { href: "#registry", label: "Registry" },
    { href: "#rsvp", label: "RSVP" },
    { href: "#gallery", label: "Gallery" }
  ];

  return (
    <div className={`wedding-website ${darkMode ? "dark" : "light"}`}>
      {/* Navbar */}
      <header className="navbar">
        <div className="nav-container">
          <a href="#hero" className="nav-brand">#OCTheOkoyes</a>
          
          {/* Desktop Nav */}
          <nav className="nav-links desktop-nav">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>{link.label}</a>
            ))}
          </nav>

          {/* Controls */}
          <div className="nav-controls">
            <button className="control-btn" onClick={toggleAudio} title="Toggle Audio">
              {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button className="control-btn" onClick={() => setDarkMode(!darkMode)} title="Toggle Theme">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              className="control-btn mobile-menu-toggle" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav className="mobile-nav">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero-content">
          <h1 className="hero-title">Onyinye & Chisom</h1>
          <p className="hero-subtitle">Are Getting Married</p>
          <div className="hero-date">
            <span>31.10.26</span>
            <span className="dot">•</span>
            <span>#OCTheOkoyes</span>
          </div>
          <a href="#rsvp" className="hero-cta">RSVP Attendance</a>
        </div>
      </section>

      {/* Love Story */}
      <section id="story" className="section story-section">
        <h2 className="section-title">Our Love Story</h2>
        <div className="carousel">
          <button 
            className="carousel-btn prev" 
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? loveStoryImages.length - 1 : prev - 1))}
          >
            <ChevronLeft size={22} />
          </button>
          <div className="carousel-view">
            <img
              src={loveStoryImages[currentSlide].url}
              alt={loveStoryImages[currentSlide].caption}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
            <p className="carousel-caption">{loveStoryImages[currentSlide].caption}</p>
          </div>
          <button 
            className="carousel-btn next" 
            onClick={() => setCurrentSlide((prev) => (prev === loveStoryImages.length - 1 ? 0 : prev + 1))}
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </section>

      {/* Narrative Story Section */}
      <section id="journey" className="section story-narrative-section">
        <h2 className="section-title">Our Journey</h2>
        <p className="section-subtitle">From a chance encounter to a lifetime promise</p>

        <div className="timeline-container">
          {/* Milestone 1 */}
          <div className="timeline-item">
            <div className="timeline-badge">01</div>
            <div className="timeline-content">
              <span className="timeline-date">The First Encounter</span>
              <h3>How We Met</h3>
              <p>
                From a simple introduction by our mutual friend, Odiaka Ambrose at the Boat Station. 
                What began as casual banter quickly turned into hours of shared laughter, mutual curiosity, 
                and the undeniable feeling that this was the beginning of something extraordinary.
              </p>
            </div>
          </div>

          {/* Milestone 2 */}
          <div className="timeline-item">
            <div className="timeline-badge">02</div>
            <div className="timeline-content">
              <span className="timeline-date">Growing Together</span>
              <h3>How Our Love Blossomed</h3>
              <p>
                Through late-night conversations, shared dreams, quiet triumphs, some disagreements, and unwavering support 
                through every season, our bond grew deeper. We learned each other’s rhythms, celebrated each other’s 
                wins, and found in one another a true best friend, confidant, and partner in purpose.
              </p>
            </div>
          </div>

          {/* Milestone 3 */}
          <div className="timeline-item">
            <div className="timeline-badge">03</div>
            <div className="timeline-content">
              <span className="timeline-date">The Forever Choice</span>
              <h3>The Proposal & Next Chapter</h3>
              <p>
                Choosing each other wasn’t just a moment; it was a culmination of every shared memory, prayer, 
                and promise. With joyful hearts and full confidence, we made the decision to walk hand-in-hand 
                into forever, anchored by love and blessed by grace; all now rooted in Christ's Love.
              </p>
            </div>
          </div>
        </div>

        {/* Romantic Quote Banner */}
        <div className="story-quote-box">
          <p className="story-quote">
            Having you is far more valuabale than the riches the world can ever give to us.”
          </p>
        </div>
      </section>

      {/* Quick Details */}
      <section id="details" className="section">
        <h2 className="section-title">Wedding Schedule</h2>
        <div className="card-grid">
          <div className="info-card">
            <Calendar className="icon" size={28} />
            <h3>Wedding Date</h3>
            <p>Saturday, October 31, 2026 - 11:00 AM</p>
          </div>
          <div className="info-card">
            <Church className="icon" size={28} />
            <h3>Wedding Mass</h3>
            <p>Holy Family Catholic Church, Woji</p>
          </div>
          <div className="info-card">
            <MapPin className="icon" size={28} />
            <h3>Wedding Reception</h3>
            <p>The Loft Event; 4 Ezigbakagbaka, Woji </p>
          </div>
        </div>
      </section>

      {/* Dress Code */}
      <section id="dresscode" className="section">
        <h2 className="section-title">Dress Code</h2>
        <p className="section-subtitle">Formal Elegant Evening</p>
        <div className="dress-grid">
          <div className="dress-card">
            <h3>For Him</h3>
            <h4>Suit & Tie</h4>
            <p className="dress-note">A touch of Sea Green or Forest Green</p>
            <ul>
              <li>A suit in Black, Charcoal, Navy, or other dark formal tones</li>
              <li>Matching shoes and accessories</li>
              <li>Kindly avoid: White, ivory, cream, beige/nude or bright shades</li>
            </ul>
          </div>
          <div className="dress-card">
            <h3>For Her</h3>
            <h4>Formal Dress</h4>
            <p className="dress-note">Elegant Evening Dress</p>
            <ul>
              <li>Floor-length gowns or midi/maxi dresses</li>
              <li>Matching shoes and accessories</li>
              <li>Kindly avoid: White, ivory, cream, beige/nude or bright shades</li>
            </ul>
          </div>
        </div>
        <div className="swatches">
          <div className="swatch-item">
            <div className="swatch" style={{ background: "#8FB9A8" }}></div>
            <span>Sea Green</span>
          </div>
          <div className="swatch-item">
            <div className="swatch" style={{ background: "#285943" }}></div>
            <span>Forest Green</span>
          </div>
          <div className="swatch-item">
            <div className="swatch" style={{ background: "#F6F0E3", border: "1px solid #ddd" }}></div>
            <span>Ivory</span>
          </div>
        </div>
      </section>

      {/* Gift Registry */}
      <section id="registry" className="section">
        <h2 className="section-title">Our Gift Registry</h2>
        <p className="section-subtitle">Help us build our home together</p>
        <div className="registry-grid">
          {registryItems.map((item) => (
            <div key={item.id} className="registry-card">
              <img src={item.image} alt={item.name} className="registry-item-image" />
              <div className="registry-icon">{item.icon}</div>
              <h3 className="registry-item-name">{item.name}</h3>
              <p className="registry-category">{item.category}</p>
              <button className="registry-btn" onClick={() => setSelectedGift(item)}>
                        Contribute
                      </button>
            </div>
          ))}
        </div>
      </section>

      {/* Sponsor Gift Modal */}
      {selectedGift && (
        <div className="modal-overlay" onClick={() => setSelectedGift(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedGift(null)}>
              <X size={20} />
            </button>
            <h3>Sponsor {selectedGift.name}</h3>
            <p className="modal-desc">
              You can make a direct transfer to the wedding account details below:
            </p>
            <div className="account-box">
              <div className="account-row">
                <span>Bank:</span>
                <strong>Standard Chartered Bank</strong>
              </div>
              <div className="account-row">
                <span>Account Name:</span>
                <strong>Chisom Okoye</strong>
              </div>
              <div className="account-row">
                <span>Account Number:</span>
                <strong className="acc-num">000 6192 192</strong>
              </div>
            </div>
            <button className="copy-action-btn" onClick={() => handleCopyAccount("000 6192 192")}>
              {copiedAccount ? <Check size={18} /> : <Copy size={18} />}
              {copiedAccount ? "Account Number Copied!" : "Copy Account Number"}
            </button>
          </div>
        </div>
      )}

      {/* RSVP */}
      <section id="rsvp" className="section">
        <h2 className="section-title">Confirm Your Attendance</h2>
        <p className="section-subtitle">We'd love to have you celebrate with us!</p>
        <form onSubmit={handleRSVPSubmit} className="rsvp-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              required
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              required
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              required
              placeholder="+234 XXX XXX XXXX"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Will you be attending? *</label>
            <select
              value={formData.attendance}
              onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
            >
              <option value="yes">Yes, definitely</option>
              <option value="maybe">Unsure</option>
              <option value="no">Regretfully decline</option>
            </select>
          </div>
          <div className="form-group">
            <label>Number of Guests</label>
            <select
              value={formData.guests}
              onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
            >
              <option value="1">1 guest</option>
            </select>
          </div>
          <div className="form-group full-width">
            <label>A Message for Us</label>
            <textarea
              rows="3"
              placeholder="Share your well-wishes and excitement!"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            ></textarea>
          </div>
          {rsvpStatus.msg && (
            <p className={`form-alert ${rsvpStatus.error ? "error" : "success"}`}>
              {rsvpStatus.msg}
            </p>
          )}
          <button type="submit" disabled={rsvpStatus.loading} className="form-submit-btn">
            <Send size={18} /> {rsvpStatus.loading ? "Submitting..." : "Submit RSVP"}
          </button>
        </form>
      </section>

      {/* Gallery */}
      <section id="gallery" className="section">
        <h2 className="section-title">Our Wedding Moments</h2>
        <p className="section-subtitle">Share and celebrate our special day together</p>
        <div className="gallery-grid">
          <a href="https://drive.google.com/drive/folders/1ef73AWYZ85rRvnmpP6wbHwVIgh7uGfPv?usp=sharing" target="_blank" rel="noreferrer" className="gallery-card">
            <Camera className="gallery-icon" size={40} />
            <h3>View Wedding Photos</h3>
            <p>Browse all our beautiful moments</p>
            <span className="gallery-pill">View Gallery</span>
          </a>
          <a href="https://drive.google.com/drive/folders/1E86IDsTnDJxvPExmoj825e4sNvZ9f8QD?usp=drive_link" target="_blank" rel="noreferrer" className="gallery-card">
            <Upload className="gallery-icon" size={40} />
            <h3>Share Your Photos</h3>
            <p>Upload your favorite moments from the wedding</p>
            <span className="gallery-pill">Upload Photos</span>
          </a>
        </div>
      </section>

      {/* Footer (Aligned with header layout) */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-meta">
            <span className="footer-hash">#OCTheOkoyes</span>
          </div>
          <div className="footer-credits">
            <span><strong>Developer: </strong><a href="https://linkedin.com/in/chisomokoye" target="_blank" rel="noreferrer" className="footer-couple">Chisom Okoye</a></span>
            <span><strong>Media: </strong><a href="https://instagram.com/beaconvibesocials" target="_blank" rel="noreferrer" className="footer-couple">BVS</a></span>
          </div>
          <div className="footer-code">
            <a href="https://github.com/chisomloius/OCTheOKoyesWedding" target="_blank" rel="noreferrer"><Code2 size={16} />Source Code</a>
          </div>
        </div>
      </footer>
    </div>
  );
}