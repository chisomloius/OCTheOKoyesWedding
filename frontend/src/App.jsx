import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Music, Moon, Sun, ChevronLeft, ChevronRight, Send } from 'lucide-react';

function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : false;
  });

  const [envelopeOpened, setEnvelopeOpened] = useState(() => {
    return localStorage.getItem('envelopeOpened') === 'true';
  });

  const [musicPlaying, setMusicPlaying] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // RSVP Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    attendance: '',
    guests: '1',
    message: ''
  });

  const [formStatus, setFormStatus] = useState('idle'); // idle, loading, success, error
  const [formMessage, setFormMessage] = useState('');
  const [showDonationModal, setShowDonationModal] = useState(false);

  // Sample carousel images
  const couplePictures = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1537633552985-caf4165fb2b9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1537633552985-caf4165fb2b9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1537633552985-caf4165fb2b9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
  ];

  const audioRef = useRef(null);

  // Dress Code Information
  const dressCodeInfo = {
    men: {
      title: 'For Him',
      icon: '👔',
      mainAttire: 'Formal Suit & Tie',
      colorNote: 'With a touch of Sea Green, Forest Green, or Ivory',
      details: [
        'Pocket square or tie in our wedding colors',
        'Classic dress shoes',
        'Cufflinks welcome'
      ]
    },
    women: {
      title: 'For Her',
      icon: '👗',
      mainAttire: 'Formal Dress',
      colorNote: 'In soft or muted tones with our colors',
      details: [
        'Floor-length gown preferred',
        'Soft pastels with Sea Green, Forest Green, or Ivory',
        'Elegant accessories'
      ]
    }
  };

  // Sample registry items (customize with your items)
  const registryItems = [
    { name: 'Refrigerator', category: 'Appliances', icon: '❄️' },
    { name: 'Generator', category: 'Power', icon: '⚡' },
    { name: 'Washing Machine', category: 'Appliances', icon: '🔄' },
    { name: 'Microwave', category: 'Kitchen', icon: '🍳' },
    { name: 'Air Conditioner', category: 'Climate', icon: '❄️' },
    { name: 'Home Theater', category: 'Entertainment', icon: '🎬' },
    { name: 'Dining Table Set', category: 'Furniture', icon: '🪑' },
    { name: 'Bedroom Set', category: 'Furniture', icon: '🛏️' },
    { name: 'Sofa Set', category: 'Furniture', icon: '🛋️' },
    { name: 'Kitchen Utensils', category: 'Kitchen', icon: '🍽️' },
  ];

  const photoGalleryInfo = {
    viewLink: process.env.REACT_APP_GOOGLE_DRIVE_VIEW_LINK || 'https://drive.google.com/drive/folders/1ef73AWYZ85rRvnmpP6wbHwVIgh7uGfPv?usp=drive_link',
    uploadLink: process.env.REACT_APP_GOOGLE_DRIVE_UPLOAD_LINK || 'https://drive.google.com/drive/folders/1E86IDsTnDJxvPExmoj825e4sNvZ9f8QD?usp=drive_link'
  };

  // Save envelope state
  useEffect(() => {
    localStorage.setItem('envelopeOpened', envelopeOpened.toString());
  }, [envelopeOpened]);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Auto-advance carousel every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev === couplePictures.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(timer);
  }, [couplePictures.length]);

  // Toggle music
  const toggleMusic = () => {
    if (audioRef.current) {
      if (musicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setMusicPlaying(!musicPlaying);
    }
  };

  // Carousel navigation
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? couplePictures.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === couplePictures.length - 1 ? 0 : prev + 1));
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setFormMessage('Please enter your name');
      return false;
    }
    if (!formData.email.trim()) {
      setFormMessage('Please enter your email');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormMessage('Please enter a valid email');
      return false;
    }
    if (!formData.phone.trim()) {
      setFormMessage('Please enter your phone number');
      return false;
    }
    if (!formData.attendance) {
      setFormMessage('Please select your attendance status');
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormMessage('');

    if (!validateForm()) {
      setFormStatus('error');
      return;
    }

    setFormStatus('loading');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus('success');
        setFormMessage('✅ RSVP submitted successfully! Thank you for confirming your attendance.');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          attendance: '',
          guests: '1',
          message: ''
        });

        // Show donation modal after 2 seconds
        setTimeout(() => {
          setShowDonationModal(true);
        }, 2000);
      } else {
        setFormStatus('error');
        setFormMessage(data.error || 'Failed to submit RSVP. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setFormStatus('error');
      setFormMessage('Error connecting to server. Please check your internet connection.');
    }
  };

  // Envelope opening screen (before website opens)
  if (!envelopeOpened) {
    return (
      <div className={`envelope-container ${isDark ? 'dark' : 'light'}`}>
        <audio ref={audioRef} loop>
          <source src="https://music.youtube.com/playlist?list=OLAK5uy_k0ljSUoCPETK141cf4JW2SiLH8_4erg0k" type="audio/mpeg" />
        </audio>

        <div className="envelope-wrapper">
          <div className="envelope" onClick={() => setEnvelopeOpened(true)}>
            <div className="envelope-flap"></div>
            <div className="envelope-body">
              <div className="envelope-text">CO</div>
            </div>
          </div>
          <p className="envelope-hint">Click to open our invitation</p>
        </div>

        <button 
          className="theme-toggle" 
          onClick={() => setIsDark(!isDark)} 
          title="Toggle theme"
        >
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>
    );
  }

  // Main website (after envelope opens)
  return (
    <div className={`wedding-website ${isDark ? 'dark' : 'light'}`}>
      <audio ref={audioRef} loop>
        <source src="https://music.youtube.com/playlist?list=OLAK5uy_k0ljSUoCPETK141cf4JW2SiLH8_4erg0k" type="audio/mpeg" />
      </audio>

      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand">#OCtheOkoyes26</div>
        <div className="nav-controls">
          <button 
            className="music-btn" 
            onClick={toggleMusic} 
            title="Toggle background music"
          >
            <Music size={20} />
            {musicPlaying && <span className="pulse"></span>}
          </button>
          <button 
            className="theme-toggle" 
            onClick={() => setIsDark(!isDark)}
            title="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Onyinye & Chisom</h1>
          <p className="hero-subtitle">Are Getting Married</p>
          <div className="hero-date">
            <span>31.10.26</span>
            <span className="dot">•</span>
            <span>#OCtheOkoyes26</span>
          </div>
          <div className="hero-divider"></div>
        </div>

        {/* Floating decorative elements */}
        <div className="floating-element top-left"></div>
        <div className="floating-element bottom-right"></div>
      </section>

      {/* Photo Carousel Section */}
      <section className="carousel-section">
        <h2 className="section-title">Our Love Story</h2>
        
        <div className="carousel-container">
          {/* Previous Button */}
          <button 
            className="carousel-btn prev" 
            onClick={handlePrevImage}
            title="Previous photo"
          >
            <ChevronLeft size={32} />
          </button>

          {/* Main Image */}
          <div className="carousel-image-wrapper">
            <img 
              src={couplePictures[currentImageIndex]} 
              alt={`Couples ${currentImageIndex + 1}`}
              className="carousel-image"
            />
          </div>

          {/* Next Button */}
          <button 
            className="carousel-btn next" 
            onClick={handleNextImage}
            title="Next photo"
          >
            <ChevronRight size={32} />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="carousel-indicators">
          {couplePictures.map((_, idx) => (
            <button
              key={idx}
              className={`indicator ${idx === currentImageIndex ? 'active' : ''}`}
              onClick={() => setCurrentImageIndex(idx)}
              title={`Go to photo ${idx + 1}`}
              aria-label={`Photo ${idx + 1}`}
            />
          ))}
        </div>

        {/* Photo Counter */}
        <p className="carousel-counter">
          {currentImageIndex + 1} of {couplePictures.length}
        </p>
      </section>

      {/* RSVP Form Section */}
      <section className="rsvp-section">
        <h2 className="section-title">Confirm Your Attendance</h2>
        <p className="section-subtitle">We'd love to have you celebrate with us!</p>

        <form className="rsvp-form" onSubmit={handleFormSubmit}>
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your full name"
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              required
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+234 XXX XXX XXXX"
              required
            />
          </div>

          {/* Attendance Status */}
          <div className="form-group">
            <label htmlFor="attendance">Will you be attending? *</label>
            <select
              id="attendance"
              name="attendance"
              value={formData.attendance}
              onChange={handleInputChange}
              required
            >
              <option value="">-- Select an option --</option>
              <option value="yes">Yes, I'll be there! 🎉</option>
              <option value="maybe">Maybe, I'll let you know 🤔</option>
              <option value="no">Sorry, can't make it 😢</option>
            </select>
          </div>

          {/* Number of Guests */}
          <div className="form-group">
            <label htmlFor="guests">Number of Guests</label>
            <select
              id="guests"
              name="guests"
              value={formData.guests}
              onChange={handleInputChange}
            >
              <option value="1">1 guest</option>
              <option value="2">2 guests</option>
              <option value="3">3 guests</option>
              <option value="4">4 guests</option>
              <option value="5">5+ guests</option>
            </select>
          </div>

          

          {/* Message */}
          <div className="form-group">
            <label htmlFor="message">A Message for Us</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Share your well-wishes and excitement!"
              rows="4"
            ></textarea>
          </div>

          {/* Status Message */}
          {formMessage && (
            <div className={`form-message ${formStatus}`}>
              {formMessage}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="submit-btn"
            disabled={formStatus === 'loading'}
          >
            {formStatus === 'loading' ? (
              <>
                <span className="spinner"></span>
                Submitting...
              </>
            ) : (
              <>
                <Send size={20} />
                Submit RSVP
              </>
            )}
          </button>
        </form>
      </section>

      {/* Quick Info Section */}
      <section className="quick-info">
        <div className="info-card">
          <span className="info-icon">📅</span>
          <h3>Date</h3>
          <p>Saturday, August 16, 2026</p>
        </div>
        <div className="info-card">
          <span className="info-icon">🕐</span>
          <h3>Time</h3>
          <p>3:00 PM - 11:00 PM</p>
        </div>
        <div className="info-card">
          <span className="info-icon">📍</span>
          <h3>Venue</h3>
          <p>The Grand Event Center, Lagos</p>
        </div>
      </section>

      {/* Donation Modal */}
      {showDonationModal && (
        <div className="modal-overlay" onClick={() => setShowDonationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close" 
              onClick={() => setShowDonationModal(false)}
              title="Close modal"
            >
              ✕
            </button>
            
            <div className="modal-header">
              <span className="modal-icon">💝</span>
              <h2>Support Our Journey</h2>
            </div>

            <div className="donation-methods">
              <div className="donation-card">
                <h3>🏦 Bank Transfer</h3>
                <div className="account-detail">
                  <span className="label">Account Name:</span>
                  <span className="value">Chisom E. Okoye</span>
                </div>
                <div className="account-detail">
                  <span className="label">Account Number:</span>
                  <span className="value">1234567890</span>
                </div>
                <div className="account-detail">
                  <span className="label">Bank:</span>
                  <span className="value">First Bank Nigeria</span>
                </div>
              </div>

              <div className="donation-card">
                <h3>📱 Mobile Money</h3>
                <div className="account-detail">
                  <span className="label">WhatsApp/Call:</span>
                  <span className="value">+234 XXX XXX XXXX</span>
                </div>
                <div className="account-detail">
                  <span className="label">Name:</span>
                  <span className="value">Chisom Emmanuel Okoye</span>
                </div>
              </div>
            </div>

            <p className="donation-thanks">
              Your generosity means the world to us! 💚
            </p>
          </div>
        </div>
      )}

      {/* Dress Code Section */}
      <section className="dresscode-section">
        <h2 className="section-title">Dress Code</h2>
        <p className="section-subtitle">Formal Elegant Evening</p>

        <div className="dresscode-grid">
          {/* Men's Dress Code */}
          <div className="dresscode-card men-card">
            <div className="dresscode-icon">{dressCodeInfo.men.icon}</div>
            <h3>{dressCodeInfo.men.title}</h3>
            <p className="dress-attire">{dressCodeInfo.men.mainAttire}</p>
            <p className="dress-color">{dressCodeInfo.men.colorNote}</p>
            
            <ul className="dress-details">
              {dressCodeInfo.men.details.map((detail, idx) => (
                <li key={idx}>{detail}</li>
              ))}
            </ul>
          </div>

          {/* Women's Dress Code */}
          <div className="dresscode-card women-card">
            <div className="dresscode-icon">{dressCodeInfo.women.icon}</div>
            <h3>{dressCodeInfo.women.title}</h3>
            <p className="dress-attire">{dressCodeInfo.women.mainAttire}</p>
            <p className="dress-color">{dressCodeInfo.women.colorNote}</p>
            
            <ul className="dress-details">
              {dressCodeInfo.women.details.map((detail, idx) => (
                <li key={idx}>{detail}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Color Swatches */}
        <div className="color-swatches">
          <div className="swatch">
            <div className="swatch-box" style={{ backgroundColor: '#2E8B8B' }}></div>
            <p>Sea Green</p>
          </div>
          <div className="swatch">
            <div className="swatch-box" style={{ backgroundColor: '#228B22' }}></div>
            <p>Forest Green</p>
          </div>
          <div className="swatch">
            <div className="swatch-box" style={{ backgroundColor: '#F5F5DC' }}></div>
            <p>Ivory</p>
          </div>
        </div>
      </section>

      {/* Gift Registry Section */}
      <section className="registry-section">
        <h2 className="section-title">Our Gift Registry</h2>
        <p className="section-subtitle">Help us build our home together</p>

        <div className="registry-grid">
          {registryItems.map((item, idx) => (
            <div key={idx} className="registry-card">
              <div className="registry-icon">{item.icon}</div>
              <h3 className="registry-item-name">{item.name}</h3>
              <p className="registry-category">{item.category}</p>
              <button className="registry-btn">
                Contribute
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="gallery-section">
        <h2 className="section-title">Our Wedding Moments</h2>
        <p className="section-subtitle">Share and celebrate our special day together</p>

        <div className="gallery-buttons-container">
          {/* View Photos Button */}
          <div className="gallery-card view-card">
            <div className="gallery-icon">📸</div>
            <h3>View Wedding Photos</h3>
            <p className="gallery-description">Browse all our beautiful moments</p>
            <a 
              href={photoGalleryInfo.viewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="gallery-btn view-btn"
            >
              View Gallery
            </a>
          </div>

          {/* Upload Photos Button */}
          <div className="gallery-card upload-card">
            <div className="gallery-icon">📤</div>
            <h3>Share Your Photos</h3>
            <p className="gallery-description">Upload your favorite moments from the wedding</p>
            <a 
              href={photoGalleryInfo.uploadLink}
              target="_blank"
              rel="noopener noreferrer"
              className="gallery-btn upload-btn"
            >
              Upload Photos
            </a>
          </div>
        </div>

        <p className="gallery-note">
          💡 Click to open Google Drive in a new tab. You can easily upload your photos there!
        </p>
      </section>


      {/* Footer */}
      <footer className="footer">
        <p>💍 Made with love for our special day</p>
        <p className="hashtag">#OCtheOkoyes26</p>
      </footer>
    </div>
  );
}

export default App;
