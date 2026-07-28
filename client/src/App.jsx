import { useEffect, useState } from "react";
import "./App.css";

import Login from "./Login";
import Register from "./Register";
import Booking from "./Booking";
import Payment from "./Payment";
import MyBookings from "./MyBookings";
const API_URL = "http://localhost:5000";

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  
  const [showPayment, setShowPayment] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  // =========================
  // FETCH VEHICLES
  // =========================

  const fetchVehicles = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/vehicles`);
      const data = await response.json();

      if (data.success) {
        setVehicles(data.vehicles || []);
      } else {
        setVehicles([]);
      }
    } catch (error) {
      console.error("Vehicle Error:", error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // =========================
  // SCROLL
  // =========================

  const scrollToVehicles = () => {
    document.getElementById("vehicles")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // =========================
  // LOGIN
  // =========================

  const handleLogin = (loggedUser) => {
    setUser(loggedUser);
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
  };

  // =========================
  // OPEN BOOKING
  // =========================

  const openBooking = (vehicle) => {
    if (!user) {
      setShowLogin(true);
      setShowRegister(false);
      return;
    }

    setSelectedVehicle(vehicle);
    setShowBooking(true);
  };

  // =========================
  // CLOSE BOOKING
  // =========================

  const closeBooking = () => {
    setShowBooking(false);
    setSelectedVehicle(null);
  };
  const openPayment = (bookingDetails) => {
  setShowBooking(false);
  setSelectedVehicle(null);

  setPaymentDetails(bookingDetails);
  setShowPayment(true);
};

  // =========================
  // FILTER
  // =========================

  const filteredVehicles = vehicles.filter((vehicle) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      vehicle.name?.toLowerCase().includes(searchText) ||
      vehicle.brand?.toLowerCase().includes(searchText) ||
      vehicle.type?.toLowerCase().includes(searchText);

    const matchesCategory =
      category === "All" ||
      vehicle.type?.toLowerCase() === category.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="app">

      {/* =========================
          NAVBAR
      ========================= */}

      <header className="navbar">

        <a href="#home" className="brand">
          <div className="brand-logo">R</div>

          <div className="brand-text">
            <h2>RideRent</h2>
            <span>PREMIUM MOBILITY</span>
          </div>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#vehicles">Vehicles</a>
          <a href="#about">Why Us</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="nav-actions">

          {!user ? (
            <>
              <button
                className="login-btn"
                onClick={() => {
                  setShowLogin(true);
                  setShowRegister(false);
                }}
              >
                Login
              </button>

              <button
                className="register-btn"
                onClick={() => {
                  setShowRegister(true);
                  setShowLogin(false);
                }}
              >
                Register
              </button>
            </>
          ) : (
            <div className="user-area">

              <div className="user-avatar">
                {(user.name || user.email || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <span className="user-name">
                {user.name || user.email}
              </span>
              <button
  className="nav-btn"
  onClick={() => setShowMyBookings(true)}
>
  My Bookings
</button>
              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>

            </div>
          )}

          <button
            className="nav-btn"
            onClick={scrollToVehicles}
          >
            Book a Ride <span>↗</span>
          </button>

        </div>
      </header>

      {/* =========================
          HERO
      ========================= */}

      <main>

        <section className="hero" id="home">

          <div className="hero-content">

            <div className="hero-badge">
              <span className="badge-dot"></span>
              PREMIUM VEHICLE RENTAL
            </div>

            <h1>
              Find the ride
              <br />
              that fits your
              <br />
              <span>journey.</span>
            </h1>

            <p className="hero-description">
              Discover reliable cars and bikes at
              affordable prices. Easy booking,
              transparent pricing and a smooth
              journey from start to finish.
            </p>

            <div className="hero-buttons">

              <button
                className="primary-btn"
                onClick={scrollToVehicles}
              >
                Explore Vehicles
                <span>→</span>
              </button>

              <a
                href="#about"
                className="secondary-btn"
              >
                Why RideRent?
              </a>

            </div>

            <div className="hero-stats">

              <div className="stat">
                <strong>500+</strong>
                <span>Vehicles</span>
              </div>

              <div className="stat">
                <strong>10K+</strong>
                <span>Happy Customers</span>
              </div>

              <div className="stat">
                <strong>4.9</strong>
                <span>Average Rating</span>
              </div>

            </div>

          </div>

          <div className="hero-visual">

            <div className="hero-image-wrapper">

              <img
                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85"
                alt="Premium rental car"
              />

              <div className="hero-image-overlay"></div>

              <div className="image-caption">
                <span>YOUR NEXT RIDE</span>

                <h3>
                  Ready when
                  <br />
                  you are.
                </h3>
              </div>

              <div className="available-card">

                <div className="available-icon">
                  ✓
                </div>

                <div>
                  <strong>Available Now</strong>
                  <span>Vehicles ready to book</span>
                </div>

              </div>

            </div>

            <div className="visual-circle"></div>
            <div className="visual-small-circle"></div>

          </div>

        </section>

        {/* =========================
            SEARCH
        ========================= */}

        <section className="booking-wrapper">

          <div className="booking-box">

            <div className="booking-item">

              <div className="booking-icon">⌕</div>

              <div>
                <label>Search Vehicle</label>

                <input
                  type="text"
                  placeholder="Car name, brand or type"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

            </div>

            <div className="booking-line"></div>

            <div className="booking-item">

              <div className="booking-icon">🚘</div>

              <div>
                <label>Vehicle Type</label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="All">All Vehicles</option>
                  <option value="Car">Cars</option>
                  <option value="Bike">Bikes</option>
                  <option value="SUV">SUVs</option>
                </select>
              </div>

            </div>

            <button
              className="search-btn"
              onClick={scrollToVehicles}
            >
              Search Ride <span>→</span>
            </button>

          </div>

        </section>

        {/* =========================
            VEHICLES
        ========================= */}

        <section
          className="vehicles-section"
          id="vehicles"
        >

          <div className="section-heading">

            <div>

              <span className="eyebrow">
                OUR FLEET
              </span>

              <h2>
                Choose your
                <br />
                <span>perfect ride.</span>
              </h2>

            </div>

            <p>
              From everyday commutes to weekend
              adventures, find a vehicle that
              matches your journey.
            </p>

          </div>

          {/* FILTERS */}

          <div className="filter-row">

            <div className="filter-buttons">

              <button
                className={
                  category === "All"
                    ? "filter active"
                    : "filter"
                }
                onClick={() => setCategory("All")}
              >
                All Vehicles
              </button>

              <button
                className={
                  category === "Car"
                    ? "filter active"
                    : "filter"
                }
                onClick={() => setCategory("Car")}
              >
                🚗 Cars
              </button>

              <button
                className={
                  category === "Bike"
                    ? "filter active"
                    : "filter"
                }
                onClick={() => setCategory("Bike")}
              >
                🏍 Bikes
              </button>

              <button
                className={
                  category === "SUV"
                    ? "filter active"
                    : "filter"
                }
                onClick={() => setCategory("SUV")}
              >
                🚙 SUVs
              </button>

            </div>

            <span className="vehicle-count">
              {filteredVehicles.length} vehicles
            </span>

          </div>

          {/* LOADING */}

          {loading && (
            <div className="state-box">

              <div className="loader"></div>

              <h3>Finding your next ride...</h3>

              <p>Please wait a moment.</p>

            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            filteredVehicles.length === 0 && (
              <div className="state-box">

                <div className="empty-icon">🚘</div>

                <h3>No vehicles found</h3>

                <p>
                  Try another search or category.
                </p>

                <button
                  className="reset-btn"
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                  }}
                >
                  Show All Vehicles
                </button>

              </div>
            )}

          {/* VEHICLE CARDS */}

          {!loading &&
            filteredVehicles.length > 0 && (

              <div className="vehicle-grid">

                {filteredVehicles.map((vehicle) => (

                  <article
                    className="vehicle-card"
                    key={vehicle._id}
                  >

                    <div className="vehicle-image">

                      <img
                        src={
                          vehicle.image ||
                          "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=85"
                        }
                        alt={vehicle.name}
                      />

                      <div
                        className={
                          vehicle.isAvailable
                            ? "availability available"
                            : "availability unavailable"
                        }
                      >
                        <span></span>

                        {vehicle.isAvailable
                          ? "Available"
                          : "Unavailable"}
                      </div>

                      <button
                        className="favorite-btn"
                        type="button"
                      >
                        ♡
                      </button>

                    </div>

                    <div className="vehicle-content">

                      <div className="vehicle-header">

                        <div>

                          <span className="vehicle-category">
                            {vehicle.type || "Vehicle"}
                          </span>

                          <h3>{vehicle.name}</h3>

                          <p>
                            {vehicle.brand || "Premium Brand"}
                          </p>

                        </div>

                        <div className="vehicle-price">

                          <strong>
                            ₹{vehicle.pricePerDay}
                          </strong>

                          <span>/day</span>

                        </div>

                      </div>

                      <div className="vehicle-info">

                        <span>
                          📍{" "}
                          {vehicle.location ||
                            "Location available"}
                        </span>

                        <span>
                          ⚡ Quick booking
                        </span>

                      </div>

                      {/* IMPORTANT BOOKING BUTTON */}

                      <button
                        className="rent-btn"
                        type="button"
                        disabled={!vehicle.isAvailable}
                        onClick={() => openBooking(vehicle)}
                      >

                        {vehicle.isAvailable
                          ? "Rent This Vehicle"
                          : "Currently Unavailable"}

                        {vehicle.isAvailable && (
                          <span>→</span>
                        )}

                      </button>

                    </div>

                  </article>

                ))}

              </div>
            )}

        </section>

        {/* =========================
            WHY US
        ========================= */}

        <section
          className="why-section"
          id="about"
        >

          <div className="why-top">

            <div>

              <span className="eyebrow light">
                WHY RIDERENT
              </span>

              <h2>
                Simple rental.
                <br />
                <span>Better journeys.</span>
              </h2>

            </div>

            <p>
              We make renting a vehicle simple,
              transparent and stress-free.
            </p>

          </div>

          <div className="features">

            <div className="feature-card">
              <span className="feature-number">01</span>
              <div className="feature-icon">🚘</div>
              <h3>Premium Fleet</h3>
              <p>
                Clean, reliable and well-maintained
                vehicles for every journey.
              </p>
            </div>

            <div className="feature-card">
              <span className="feature-number">02</span>
              <div className="feature-icon">⚡</div>
              <h3>Quick Booking</h3>
              <p>
                Find your vehicle and get ready
                to go without unnecessary steps.
              </p>
            </div>

            <div className="feature-card">
              <span className="feature-number">03</span>
              <div className="feature-icon">🔒</div>
              <h3>Secure Payment</h3>
              <p>
                Fast and secure payments designed
                to keep your booking protected.
              </p>
            </div>

            <div className="feature-card">
              <span className="feature-number">04</span>
              <div className="feature-icon">☎</div>
              <h3>24/7 Support</h3>
              <p>
                Need help? Our support team is
                always ready to assist you.
              </p>
            </div>

          </div>

        </section>

        {/* =========================
            CTA
        ========================= */}

        <section className="cta-section">

          <div className="cta-content">

            <span className="eyebrow">
              READY TO GO?
            </span>

            <h2>
              Your next journey
              <br />
              starts <span>here.</span>
            </h2>

            <p>
              Choose a vehicle and make your
              journey memorable.
            </p>

            <button
              className="primary-btn"
              onClick={scrollToVehicles}
            >
              Browse Vehicles
              <span>→</span>
            </button>

          </div>

          <div className="cta-circle">
            <span>R</span>
          </div>

        </section>

      </main>

      {/* =========================
          FOOTER
      ========================= */}

      <footer id="contact">

        <div className="footer-main">

          <div className="footer-brand">

            <div className="brand-logo">R</div>

            <div className="brand-text">
              <h2>RideRent</h2>
              <span>PREMIUM MOBILITY</span>
            </div>

          </div>

          <p>
            Making every journey easier,
            smarter and better.
          </p>

        </div>

        <div className="footer-bottom">

          {/* <div className="footer-links">

            <a href="#home">Home</a>
            <a href="#vehicles">Vehicles</a>
            <a href="#about">Why Us</a>
            <a href="#contact">Contact</a>

          </div> */}

          <span>
            © 2026 RideRent. All rights reserved.
          </span>

        </div>

      </footer>

      {/* =========================
          LOGIN
      ========================= */}

      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
          goToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

      {/* =========================
          REGISTER
      ========================= */}

      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          goToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}

      {/* =========================
          BOOKING MODAL
      ========================= */}

    {showBooking && selectedVehicle && (
  <Booking
    vehicle={selectedVehicle}
    user={user}
    onClose={closeBooking}
    onBookingSuccess={openPayment}
  />
)}

{showPayment && paymentDetails && (
  <Payment
    bookingDetails={paymentDetails}
    onClose={() => setShowPayment(false)}
  />
)}
{showMyBookings && (
  <MyBookings
    user={user}
    onClose={() => setShowMyBookings(false)}
  />
)}
    </div>
  );
}

export default App;