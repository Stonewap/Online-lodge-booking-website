/* ==========================================================================
   MOCK LODGE DATABASE ARRAY
   ========================================================================== */
const lodgesDatabase = [
    {
        id: 1,
        name: "Mountain Vista Resort",
        location: "Manali",
        price: 3500,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
        description: "Wake up to majestic pine forests and direct snowcapped Himalayan views. This luxury mountain retreat features rustic wood architectural details combined with top-tier modern accommodations.",
        featured: true,
        amenities: ["Free Wi-Fi", "Heated Rooms", "In-house Restaurant", "Mountain Balcony", "Free Parking"]
    },
    {
        id: 2,
        name: "Blue Lagoon Beach House",
        location: "Goa",
        price: 4800,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
        description: "Situated mere steps away from sandy ocean shores. Enjoy tranquil coastal sunsets, private beach lounging, dynamic beach activities, and outstanding fresh tropical dining options.",
        featured: true,
        amenities: ["Beach Access", "Swimming Pool", "Complimentary Breakfast", "Mini Bar", "Air Conditioning"]
    },
    {
        id: 3,
        name: "The Grand Palace Residency",
        location: "Udaipur",
        price: 8500,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        description: "Live like traditional royalty in the heritage district. Experience gorgeous courtyard dynamics, classic architectural archways, luxurious silk bedding setups, and stunning lake views.",
        featured: true,
        amenities: ["Historic Decor", "Private Balcony", "Airport Shuttle", "Roof Dining", "Spa Access"]
    },
    {
        id: 4,
        name: "Oakridge Forest Cottage",
        location: "Shimla",
        price: 2800,
        rating: 4.2,
        image: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=800&q=80",
        description: "A cozy family-friendly stone and wood cottage nested deep within the green oak forests. Ideal for nature walks, bonfire evenings, and standard peaceful vacations away from busy cities.",
        featured: false,
        amenities: ["Wi-Fi Access", "Fireplace Setup", "Bonfire Garden", "Kitchenette Available", "Pet Friendly"]
    },
    {
        id: 5,
        name: "Silent Palms Retreat",
        location: "Kochi",
        price: 5200,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
        description: "Surrounded by quiet coconut farms and relaxing waterways. Enjoy a traditional houseboat vibe combined with structural, luxurious, and highly clean modern suite bathrooms.",
        featured: false,
        amenities: ["Backwater View", "Ayurvedic Spa", "Free Wi-Fi", "Swimming Pool", "Eco Friendly"]
    },
    {
        id: 6,
        name: "City Comfort Suites",
        location: "Mumbai",
        price: 3900,
        rating: 3.9,
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
        description: "Centrally positioned in the metropolitan zone. Excellent for business travelers looking for ultra-high speed internet networks, neat layouts, and effortless access to taxi stands.",
        featured: false,
        amenities: ["High-speed Wi-Fi", "Working Desk", "Gym Facility", "Laundry Service", "Buffet Breakfast"]
    }
];

/* ==========================================================================
   APP STATE MANAGEMENT
   ========================================================================== */
let currentUser = JSON.parse(localStorage.getItem('cozyUser')) || null;
let selectedLodge = null;

// Initialize System on DOM Load
document.addEventListener("DOMContentLoaded", () => {
    checkAuthenticationStatus();
    renderFeaturedLodges();
    renderAllLodgesList(lodgesDatabase);
    
    // Set default check-in date rules (cannot book past dates)
    const today = new Date().toISOString().split('T')[0];
    const checkinEl = document.getElementById("booking-checkin");
    if (checkinEl) checkinEl.setAttribute('min', today);
});

/* ==========================================================================
   ROUTING & NAVIGATION SYSTEM
   ========================================================================== */
function navigateTo(viewId) {
    // Hide all view panels
    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.add('hidden');
    });

    // Display targeted section
    const targetSection = document.getElementById(viewId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Toggle nav menu highlighting
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Map viewId back to nav link if possible
    if (viewId === 'home-view') document.querySelectorAll('.nav-link')[0].classList.add('active');
    else if (viewId === 'lodges-view') document.querySelectorAll('.nav-link')[1].classList.add('active');
    else if (viewId === 'about-view') document.querySelectorAll('.nav-link')[2].classList.add('active');
    else if (viewId === 'contact-view') document.querySelectorAll('.nav-link')[3].classList.add('active');
    else if (viewId === 'dashboard-view') document.getElementById('nav-dashboard').classList.add('active');

    // Close mobile side menus if open
    document.getElementById("nav-menu").classList.remove("active");
}

function toggleMobileMenu() {
    const menu = document.getElementById("nav-menu");
    menu.classList.toggle("active");
}

/* ==========================================================================
   DYNAMIC RENDERING (HOME & LISTINGS)
   ========================================================================== */
function renderFeaturedLodges() {
    const container = document.getElementById("featured-lodges-container");
    if (!container) return;
    
    const featuredList = lodgesDatabase.filter(item => item.featured);
    container.innerHTML = featuredList.map(lodge => createLodgeCardMarkup(lodge)).join('');
}

function renderAllLodgesList(list) {
    const container = document.getElementById("all-lodges-container");
    const countEl = document.getElementById("results-count");
    if (!container) return;

    countEl.textContent = list.length;

    if (list.length === 0) {
        container.innerHTML = `
            <div class="text-center w-100 py-50" style="grid-column: 1 / -1;">
                <i class="fa-solid fa-hotel-slash" style="font-size: 48px; color: var(--text-muted); margin-bottom: 15px;"></i>
                <p>No lodges found matches your criteria. Try adjustments!</p>
            </div>`;
        return;
    }

    container.innerHTML = list.map(lodge => createLodgeCardMarkup(lodge)).join('');
}

function createLodgeCardMarkup(lodge) {
    return `
        <article class="lodge-card">
            <img src="${lodge.image}" alt="${lodge.name}">
            <div class="lodge-card-content">
                <div class="lodge-card-location"><i class="fa-solid fa-location-dot"></i> ${lodge.location}</div>
                <h3>${lodge.name}</h3>
                <div class="lodge-rating">
                    <i class="fa-solid fa-star"></i> ${lodge.rating} <span>/ 5.0 Rating</span>
                </div>
                <div class="lodge-footer">
                    <div class="lodge-price">₹${lodge.price} <span>/ night</span></div>
                    <button class="btn btn-primary" onclick="viewLodgeDetails(${lodge.id})">Details</button>
                </div>
            </div>
        </article>
    `;
}

/* ==========================================================================
   SEARCH & FILTERS ENGINE
   ========================================================================== */
function updatePriceLabel(val) {
    document.getElementById("price-val").textContent = `₹${val}`;
    applyFilters();
}

function applyFilters() {
    const searchVal = document.getElementById("search-filter").value.toLowerCase().trim();
    const priceVal = parseInt(document.getElementById("price-filter").value);
    const ratingVal = parseFloat(document.getElementById("rating-filter").value);

    const filtered = lodgesDatabase.filter(lodge => {
        const matchesSearch = lodge.location.toLowerCase().includes(searchVal) || lodge.name.toLowerCase().includes(searchVal);
        const matchesPrice = lodge.price <= priceVal;
        const matchesRating = lodge.rating >= ratingVal;
        
        return matchesSearch && matchesPrice && matchesRating;
    });

    renderAllLodgesList(filtered);
}

function resetFilters() {
    document.getElementById("search-filter").value = "";
    document.getElementById("price-filter").value = "10000";
    document.getElementById("price-val").textContent = "₹10000";
    document.getElementById("rating-filter").value = "0";
    renderAllLodgesList(lodgesDatabase);
}

function executeHeroSearch() {
    const val = document.getElementById("hero-search-input").value;
    document.getElementById("search-filter").value = val;
    applyFilters();
    navigateTo('lodges-view');
}

/* ==========================================================================
   LODGE DETAILS PAGE LOAD
   ========================================================================== */
function viewLodgeDetails(id) {
    selectedLodge = lodgesDatabase.find(l => l.id === id);
    if (!selectedLodge) return;

    const detailsContainer = document.getElementById("details-container");
    
    // Amenities string generation
    const amenitiesHTML = selectedLodge.amenities.map(amenity => `
        <div class="amenity-item">
            <i class="fa-solid fa-circle-check"></i>
            <span>${amenity}</span>
        </div>
    `).join('');

    detailsContainer.innerHTML = `
        <img class="details-banner" src="${selectedLodge.image}" alt="${selectedLodge.name}">
        <div class="details-content-grid">
            <div class="details-info">
                <h1>${selectedLodge.name}</h1>
                <div class="details-location"><i class="fa-solid fa-location-dot"></i> ${selectedLodge.location}, India</div>
                <div class="lodge-rating">
                    <i class="fa-solid fa-star"></i> ${selectedLodge.rating} Rating (Verified Partner Stay)
                </div>
                <p style="margin: 20px 0; line-height: 1.8;">${selectedLodge.description}</p>
                
                <div class="amenities-section">
                    <h3>Standard Amenities Included</h3>
                    <div class="amenities-list">
                        ${amenitiesHTML}
                    </div>
                </div>
            </div>
            
            <aside class="booking-card">
                <h3>Reserve Your Stay</h3>
                <div class="lodge-price" style="font-size: 24px; margin-bottom: 20px;">
                    ₹${selectedLodge.price} <span style="font-size: 14px; color: var(--text-muted);">/ night</span>
                </div>
                
                <form id="booking-form" onsubmit="handleBookingSubmit(event)">
                    <div class="form-group">
                        <label for="booking-name">Guest Name</label>
                        <input type="text" id="booking-name" required placeholder="Who is checking in?">
                    </div>
                    <div class="form-group">
                        <label for="booking-checkin">Check-In Date</label>
                        <input type="date" id="booking-checkin" required onchange="calculateBookingTotal()">
                    </div>
                    <div class="form-group">
                        <label for="booking-checkout">Check-Out Date</label>
                        <input type="date" id="booking-checkout" required onchange="calculateBookingTotal()">
                    </div>
                    
                    <div id="booking-total-box" class="hidden" style="background:#e0f2fe; padding:12px; border-radius:6px; margin: 15px 0;">
                        <p style="font-size:14px; font-weight:600; color:var(--primary-color);">Total Price: <span id="computed-price">₹0</span></p>
                    </div>

                    <button type="submit" class="btn btn-secondary w-100" style="margin-top:10px;">Book Room Now</button>
                </form>
            </aside>
        </div>
    `;

    // Reset date attributes again for safety in dynamically created element
    const today = new Date().toISOString().split('T')[0];
    document.getElementById("booking-checkin").setAttribute('min', today);
    document.getElementById("booking-checkout").setAttribute('min', today);

    // Auto-fill traveler name if authenticated
    if (currentUser) {
        document.getElementById("booking-name").value = currentUser.name;
    }

    navigateTo('details-view');
}

/* ==========================================================================
   BOOKING SYSTEM LOGIC
   ========================================================================== */
function calculateBookingTotal() {
    const checkin = document.getElementById("booking-checkin").value;
    const checkout = document.getElementById("booking-checkout").value;
    const totalBox = document.getElementById("booking-total-box");
    const computedSpan = document.getElementById("computed-price");

    if (!checkin || !checkout) return;

    const date1 = new Date(checkin);
    const date2 = new Date(checkout);
    const diffTime = date2 - date1;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
        totalBox.classList.remove('hidden');
        const totalPrice = diffDays * selectedLodge.price;
        computedSpan.textContent = `₹${totalPrice} (${diffDays} Night${diffDays > 1 ? 's' : ''})`;
        return totalPrice;
    } else {
        totalBox.classList.add('hidden');
        return 0;
    }
}

function handleBookingSubmit(event) {
    event.preventDefault();

    // Check auth status
    if (!currentUser) {
        alert("Please login or register to book room reservations.");
        openAuthModal();
        return;
    }

    const checkin = document.getElementById("booking-checkin").value;
    const checkout = document.getElementById("booking-checkout").value;
    const guestName = document.getElementById("booking-name").value;

    const totalCost = calculateBookingTotal();
    if (!totalCost || totalCost <= 0) {
        alert("Invalid Check-out date selection. Ensure checkout is at least 1 day after check-in.");
        return;
    }

    // Prepare booking payload
    const bookingDetails = {
        bookingId: "B" + Math.floor(1000 + Math.random() * 9000),
        lodgeName: selectedLodge.name,
        location: selectedLodge.location,
        guestName: guestName,
        checkin: checkin,
        checkout: checkout,
        totalPrice: totalCost,
        status: "Confirmed"
    };

    // Store in LocalStorage under user specific key
    const allBookings = JSON.parse(localStorage.getItem('allBookings')) || [];
    allBookings.push({ userEmail: currentUser.email, ...bookingDetails });
    localStorage.setItem('allBookings', JSON.stringify(allBookings));

    // Show booking confirmation success modal UI
    document.getElementById("booking-success-msg").textContent = `Your room at ${selectedLodge.name} has been successfully reserved.`;
    document.getElementById("summary-dates").textContent = `${checkin} to ${checkout}`;
    document.getElementById("summary-price").textContent = `₹${totalCost}`;
    
    document.getElementById("booking-modal").classList.add("active");
}

function closeBookingModal() {
    document.getElementById("booking-modal").classList.remove("active");
    loadUserBookings();
    navigateTo('dashboard-view');
}

/* ==========================================================================
   AUTHENTICATION SYSTEM (LOCAL STORAGE BASED)
   ========================================================================== */
function openAuthModal() {
    document.getElementById("auth-modal").classList.add("active");
}

function closeAuthModal() {
    document.getElementById("auth-modal").classList.remove("active");
}

function switchAuthTab(type) {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const loginTab = document.getElementById("tab-login");
    const registerTab = document.getElementById("tab-register");

    if (type === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
    }
}

function handleRegisterSubmit(event) {
    event.preventDefault();
    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value;

    if (password.length < 6) {
        alert("Password should be at least 6 characters.");
        return;
    }

    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    
    // Check if user exists
    const userExists = registeredUsers.some(u => u.email === email);
    if (userExists) {
        alert("This email address is already registered.");
        return;
    }

    const newUser = { name, email, password };
    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    // Auto Login after successful signup
    currentUser = { name, email };
    localStorage.setItem('cozyUser', JSON.stringify(currentUser));
    
    checkAuthenticationStatus();
    closeAuthModal();
    alert(`Account created successfully! Welcome, ${name}.`);
}

function handleLoginSubmit(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    
    // Verify credentials
    const user = registeredUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = { name: user.name, email: user.email };
        localStorage.setItem('cozyUser', JSON.stringify(currentUser));
        
        checkAuthenticationStatus();
        closeAuthModal();
        alert(`Welcome back, ${user.name}!`);
    } else {
        alert("Invalid email or password mismatch.");
    }
}

function checkAuthenticationStatus() {
    const authBtn = document.getElementById("auth-btn");
    const welcomeText = document.getElementById("user-welcome");
    const dashboardNav = document.getElementById("nav-dashboard");

    if (currentUser) {
        welcomeText.textContent = `Hello, ${currentUser.name.split(' ')[0]}`;
        welcomeText.classList.remove('hidden');
        dashboardNav.classList.remove('hidden');
        
        authBtn.textContent = "Logout";
        authBtn.setAttribute("onclick", "handleUserLogout()");
        
        // Auto-populate custom booking forms if rendered
        const nameField = document.getElementById("booking-name");
        if (nameField) nameField.value = currentUser.name;
    } else {
        welcomeText.classList.add('hidden');
        dashboardNav.classList.add('hidden');
        
        authBtn.textContent = "Login / Register";
        authBtn.setAttribute("onclick", "openAuthModal()");
    }
}

function handleUserLogout() {
    if (confirm("Are you sure you want to log out?")) {
        currentUser = null;
        localStorage.removeItem('cozyUser');
        checkAuthenticationStatus();
        navigateTo('home-view');
    }
}

/* ==========================================================================
   USER BOOKING DASHBOARD RENDERING
   ========================================================================== */
function loadUserBookings() {
    const container = document.getElementById("bookings-list-container");
    if (!container) return;

    if (!currentUser) {
        container.innerHTML = `<p>Please log in to view booking statements.</p>`;
        return;
    }

    const allBookings = JSON.parse(localStorage.getItem('allBookings')) || [];
    // Filter bookings belonging strictly to current logged-in user
    const userBookings = allBookings.filter(b => b.userEmail === currentUser.email);

    if (userBookings.length === 0) {
        container.innerHTML = `
            <div class="empty-bookings-box">
                <i class="fa-solid fa-suitcase"></i>
                <h3>No Bookings Found</h3>
                <p>You haven't booked any CozyStay lodges yet. Your search starts today!</p>
                <button class="btn btn-primary mt-30" onclick="navigateTo('lodges-view')">Discover Lodges</button>
            </div>
        `;
        return;
    }

    container.innerHTML = userBookings.map(booking => `
        <div class="booking-item-card">
            <div class="booking-item-details">
                <span class="booking-status-badge"><i class="fa-solid fa-check"></i> ${booking.status}</span>
                <h4 style="margin-top: 8px;">${booking.lodgeName}</h4>
                <div class="booking-item-meta">
                    <span><i class="fa-solid fa-receipt"></i> Booking ID: ${booking.bookingId}</span>
                    <span><i class="fa-solid fa-calendar-days"></i> Stay: ${booking.checkin} to ${booking.checkout}</span>
                    <span><i class="fa-solid fa-user"></i> Guest: ${booking.guestName}</span>
                </div>
            </div>
            <div class="booking-item-price">
                <p class="small-text text-muted">Paid amount</p>
                <h5>₹${booking.totalPrice}</h5>
            </div>
        </div>
    `).reverse().join(''); // Show latest bookings on top
}

/* ==========================================================================
   CONTACT US FORM SIMULATION
   ========================================================================== */
function handleContactSubmit(event) {
    event.preventDefault();
    const name = document.getElementById("contact-name").value;
    const email = document.getElementById("contact-email").value;
    
    alert(`Thank you, ${name}! Your feedback request is successfully noted. Our support desk will reach out at ${email} shortly.`);
    document.getElementById("contact-form").reset();
}