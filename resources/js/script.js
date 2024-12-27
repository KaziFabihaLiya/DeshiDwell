// Ensure Firebase is loaded
if (typeof firebase === 'undefined') {
    console.error('Firebase SDK not loaded. Ensure firebaseConfig.js is loaded before script.js.');
} else if (firebase.apps.length === 0) {
    console.error('Firebase not initialized. Check firebaseConfig.js.');
} else {
    console.log('Firebase initialized successfully.');
}

async function fetchUserDetails() {
    try {
        const response = await fetch('/api/user');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const user = await response.json();
        
        const userGreeting = document.querySelector('#userGreeting');
        if (userGreeting) {
            userGreeting.textContent = `Welcome, ${user.fullname}!`;
        } else {
            console.error('Element with ID "userGreeting" not found.');
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
    }
}

function showSection(sectionId) {
    const sections = document.querySelectorAll(".section");
    sections.forEach(section => {
        section.classList.remove("active");
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add("active");
        if (sectionId === "viewProperty") {
            fetchPropertyDetails(); // Fetch and display properties dynamically
        }
    } else {
        console.error(`Section with ID "${sectionId}" not found.`);
    }
}

async function checkLoginState(authSection, confirmSection) {
    try {
        const response = await fetch("/api/session");
        if (response.ok) {
            const user = await response.json();
            console.log("User authenticated:", user);

            // Hide login/signup and show "Confirm Reservation" button
            authSection.style.display = "none";
            confirmSection.style.display = "block";
        } else {
            console.log("User not authenticated.");
            authSection.style.display = "block";
            confirmSection.style.display = "none";
        }
    } catch (error) {
        console.error("Error checking login state:", error);
    }
}

    // Fetch Property Details
const propertyList = document.querySelector('.property-list'); // Container for property cards
const viewPropertyLink = document.querySelector('.sidebar-link[data-target="viewProperty"]');

// Fetch and display properties
async function fetchAndDisplayProperties() {
    if (!propertyList) return;

    propertyList.innerHTML = ''; // Clear existing content

    try {
        const response = await fetch('/api/properties');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const properties = await response.json();

        // Loop through the properties and create cards
        properties.forEach((property) => {
            const card = document.createElement('div');
            card.classList.add('property-card');
            card.innerHTML = `
                <img src="${property.image}" alt="${property.name}" class="property-image" />
                <div class="card-details">
                    <h2>${property.name}</h2>
                    <p>${property.description}</p>
                    <p><strong>$${property.price}</strong></p>
                </div>
            `;
            propertyList.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching properties:', error);
        propertyList.innerHTML = '<p>Failed to load properties. Please try again later.</p>';
    }
}

    // Trigger fetching properties when "View Property" link is clicked
    if (viewPropertyLink) {
        viewPropertyLink.addEventListener('click', fetchAndDisplayProperties);
    }

    async function initializeMap() {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) {
            console.error('Map container not found');
            return;
        }
    
        const propertyId = '12345'; // Replace with dynamic property ID
        const apiEndpoint = `/api/property/${propertyId}`;
    
        try {
            // Fetch property details
            const response = await fetch(apiEndpoint);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
            const property = await response.json();
    
            // Initialize the map with fetched coordinates
            const map = L.map('map').setView([property.latitude, property.longitude], 13);
    
            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap',
            }).addTo(map);
    
            // Add a marker for the property location
            const marker = L.marker([property.latitude, property.longitude]).addTo(map);
            marker.bindPopup(`<b>${property.name}</b><br>${property.description}`).openPopup();
        } catch (error) {
            console.error('Error fetching property details:', error);
        }
    }
    

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    fetchUserDetails();
    // Dropdown Menu
        //Mapp 
    initializeMap();
    const dropdownButton = document.querySelector('.menu-button');
    const dropdownMenu = document.querySelector('.dropdown');
    if (dropdownButton && dropdownMenu) {
        dropdownButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const userMenu = dropdownButton.closest('.user-menu');
            userMenu.classList.toggle('active');
        });

        document.addEventListener('click', (event) => {
            if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.parentElement.classList.remove('active');
            }
        });
    }
    //Google Login Button
    const googleLoginButton = document.getElementById('googleLoginButton');
    if (googleLoginButton) {
        googleLoginButton.addEventListener('click', () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider)
                .then((result) => {
                    console.log('Google User:', result.user);
                    alert('Login successful!');
                    window.location.href = '/dashboard';
                })
                .catch((error) => {
                    console.error('Google login error:', error.message);
                    alert('Login failed: ' + error.message);
                });
        });
    }
    //Modal Handling
    const modal = document.getElementById('notificationModal');
    const modalMessage = document.getElementById('modalMessage');
    const closeModalButton = document.getElementById('closeModal');
    if (modal && closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    // Update Dates Button
    // const updateDatesBtn = document.getElementById("update-dates-btn");
    // if (updateDatesBtn) {
    //     updateDatesBtn.addEventListener("click", function () {
    //         const checkInDate = new Date(document.getElementById("check-in").value);
    //         const checkOutDate = new Date(document.getElementById("check-out").value);
    //         const guests = document.getElementById("guests").value;

    //         if (checkInDate && checkOutDate && checkOutDate > checkInDate) {
    //             const totalNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    //             document.getElementById("reserve-check-in").textContent = checkInDate.toLocaleDateString();
    //             document.getElementById("reserve-check-out").textContent = checkOutDate.toLocaleDateString();
    //             document.getElementById("total-nights").textContent = totalNights;
    //             document.getElementById("reserve-guests").textContent = `${guests} ${guests > 1 ? "guests" : "guest"}`;

    //             const nightlyRate = 509;
    //             const totalCost = nightlyRate * totalNights;
    //             document.getElementById("total-cost").textContent = `$${totalCost}`;
    //             document.getElementById("grand-total").textContent = `$${totalCost + 120 + 287}`;
    //         } else {
    //             alert("Please select valid dates!");
    //         }
    //     });
    // }
    const updateDatesBtn = document.getElementById("update-dates-btn");
    if (updateDatesBtn) {
        updateDatesBtn.addEventListener("click", function () {
            const checkInInput = document.getElementById("check-in");
            const checkOutInput = document.getElementById("check-out");
            const guestsInput = document.getElementById("guests");
            
            if (!checkInInput || !checkOutInput || !guestsInput) {
                console.error("One or more input fields are missing!");
                return;
            }
    
            const checkInDate = new Date(checkInInput.value);
            const checkOutDate = new Date(checkOutInput.value);
            const guests = guestsInput.value; // Get number of guests
    
            console.log("Check-in Date:", checkInDate); // Debugging
            console.log("Check-out Date:", checkOutDate); // Debugging
            console.log("Guests:", guests); // Debugging
    
            if (checkInDate && checkOutDate && checkOutDate > checkInDate) {
                const totalNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
                // Update reservation summary
                document.getElementById("reserve-check-in").textContent = checkInDate.toLocaleDateString();
                document.getElementById("reserve-check-out").textContent = checkOutDate.toLocaleDateString();
                document.getElementById("reserve-guests").textContent = `${guests} ${guests > 1 ? "guests" : "guest"}`; // Update guests dynamically
                
                console.log("Guests updated successfully!"); // Debugging
    
                // Update cost
                const nightlyRate = 666;
                const serviceFee = 100;
                document.getElementById("nightly-details").textContent = `$${nightlyRate} × ${totalNights} nights`;
                document.getElementById("nightly-cost").textContent = `$${nightlyRate * totalNights}`;
                document.getElementById("total-cost").textContent = `$${nightlyRate * totalNights + serviceFee}`;
            } else {
                alert("Please select valid dates!");
            }
        });
    }
    
    // Signup Form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                fullname: signupForm.fullname.value,
                username: signupForm.username.value,
                email: signupForm.email.value,
                num: signupForm.num.value,
                pass: signupForm.pass.value,
                gender: signupForm.gender.value,
            };

            try {
                const response = await fetch('http://localhost:3000/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                const result = await response.json();
                console.log('User created:', result);
            } catch (err) {
                console.error('Error:', err);
            }
        });
    }
    //Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
    
            const username = document.getElementById('username').value;
            const password = document.getElementById('pass').value;
    
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, pass: password }),
                    credentials: 'include', // Ensure cookies are sent with the request
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Login failed');
                }
    
                const responseData = await response.json();
                alert(responseData.message);
                window.location.href = '/dashboard'; // Redirect to the dashboard
            } catch (error) {
                console.error('Login failed:', error.message);
    
                const modalMessage = document.getElementById('modalMessage');
                if (modalMessage) {
                    modalMessage.textContent = `Login failed: ${error.message}`;
                    document.getElementById('notificationModal').style.display = 'block';
                }
            }
        });
    }
    
    // Make reservation part 
    const authSection = document.getElementById("auth-section");
    const confirmSection = document.getElementById("confirm-section");

    // Call the async function to check login state
    checkLoginState(authSection, confirmSection);

    // Handle Confirm Reservation button
    const confirmReservationBtn = document.getElementById("confirm-reservation-btn");
    if (confirmReservationBtn) {
        confirmReservationBtn.addEventListener("click", () => {
            alert("Reservation confirmed!");
        });
    }

    // Back Button Logic
    const backButton = document.getElementById("back-button");

    if (backButton) {
        backButton.addEventListener("click", () => {
            // Check if there's a previous page in browser history
            if (document.referrer) {
                window.history.back(); // Go to the previous page
            } else {
                // Fallback URL (adjust to your needs)
                window.location.href = "/home"; // Replace '/home' with your fallback page
            }
        });
    }
    //end
    // Sidebar and Section Handling
    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const content = document.getElementById('content');
        sidebar?.classList.toggle('hidden');
        content?.classList.toggle('shifted');
    }
    // Sidebar Navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-link'); // Sidebar links
    const sections = document.querySelectorAll('.section'); // All sections
    const defaultSectionId = 'home'; // Set your default section ID here

    // Show the default section and hide others on page load
    sections.forEach(section => {
        section.classList.remove('active'); // Remove active class
        if (section.id === defaultSectionId) {
            section.classList.add('active'); // Show the default section
        }
    });

    // Add click event listeners to sidebar links
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Get the target section ID from the clicked link
            const targetSectionId = link.getAttribute('data-target');

            // Update visibility of sections
            sections.forEach(section => {
                section.classList.remove('active'); // Hide all sections
                if (section.id === targetSectionId) {
                    section.classList.add('active'); // Show the target section
                }
            });

            // Highlight the active link in the sidebar
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // // Default to showing the "Home" section
    // showSection('home');

    document.querySelector('#menu-btn')?.addEventListener('click', toggleSidebar);

    document.querySelectorAll(".sidebar ul li a").forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            const sectionId = link.getAttribute("onclick").match(/showSection\('(\w+)'\)/)[1];
            showSection(sectionId);
        });
    });


    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (event) => {
            const targetSection = event.target.getAttribute('data-section');
            if (targetSection) {
                showSection(targetSection);
            }
        });
    });
    // Booking prompt
    // Nightly rate and service fee
    const nightlyRate = 666; // Per night cost
    const serviceFee = 100; // Fixed DeshiDwell service fee
    
    // Add event listener
    updateDatesBtn.addEventListener("click", () => {
        const checkInDate = new Date(checkInInput.value);
        const checkOutDate = new Date(checkOutInput.value);
        const guests = guestsInput.value;
    
        if (!checkInDate || !checkOutDate || checkOutDate <= checkInDate) {
            alert("Please select valid dates!");
            return;
        }
    
        // Calculate the number of nights
        const totalNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
        // Update reservation summary
        document.getElementById("reserve-check-in").textContent = checkInDate.toLocaleDateString();
        document.getElementById("reserve-check-out").textContent = checkOutDate.toLocaleDateString();
        document.getElementById("reserve-guests").textContent = `${guests} ${guests > 1 ? "guests" : "guest"}`;
        document.getElementById("nightly-details").textContent = `$${nightlyRate} × ${totalNights} nights`;
        document.getElementById("nightly-cost").textContent = `$${nightlyRate * totalNights}`;
        document.getElementById("total-cost").textContent = `$${nightlyRate * totalNights + serviceFee}`;
    });
    
    //FetchData
    fetch('/api/endpoint')
    .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
    })
    .then((data) => {
        console.log('Fetched data:', data);
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });


    // Optionally, fetch properties on page load if "View Property" is the default section
    const activeSectionId = localStorage.getItem('activeSection') || 'home';

    // Trigger fetch and display properties for 'viewProperty'
    if (activeSectionId === 'viewProperty') {
        fetchAndDisplayProperties();
    }

    // Trigger map initialization for 'explore'
    if (activeSectionId === 'explore') {
        initializeMap();
    }

    // Listen for section changes (sidebar clicks)
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetSectionId = link.getAttribute('data-target');

            // Handle 'viewProperty' section
            if (targetSectionId === 'viewProperty') {
                fetchAndDisplayProperties();
            }

            // Handle 'explore' section
            if (targetSectionId === 'explore') {
                initializeMap();
            }
        });
    });

    const addPropertyForm = document.getElementById('addPropertyForm');
    if (addPropertyForm) {
        addPropertyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(addPropertyForm);

            try {
                const response = await fetch('/api/properties', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const result = await response.json();
                    alert(result.message);
                    addPropertyForm.reset();
                } else {
                    const error = await response.json();
                    alert(error.error || 'Failed to add property');
                }
            } catch (err) {
                console.error('Error adding property:', err);
            }
        });
    }

    // Logout Button
    const logoutButton = document.querySelector('#logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const response = await fetch('/logout', { method: 'GET' });
                if (response.ok) {
                    window.location.href = '/login';
                } else {
                    alert('Failed to log out. Please try again.');
                }
            } catch (error) {
                console.error('Error during logout:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }
});

// document.addEventListener('DOMContentLoaded', () => {
//     const dropdownButton = document.querySelector('.menu-button');
//     const dropdownMenu = document.querySelector('.dropdown'); // Select the dropdown menu

//     if (dropdownButton && dropdownMenu) {
//         // Toggle dropdown visibility on button click
//         dropdownButton.addEventListener('click', (e) => {
//             e.stopPropagation(); // Prevent the click event from bubbling up
//             const userMenu = dropdownButton.closest('.user-menu'); // Get the closest user-menu
//             userMenu.classList.toggle('active'); // Toggle the active class
//         });

//         // Close dropdown when clicking outside
//         document.addEventListener('click', (event) => {
//             if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
//                 dropdownMenu.parentElement.classList.remove('active'); // Remove active class from user-menu
//             }
//         });
//     } else {
//         console.error("Dropdown button or menu is missing!");
//     }
// });

// // Google Login Functionality
// function handleGoogleLogin() {
//     const provider = new firebase.auth.GoogleAuthProvider();
//     firebase.auth().signInWithPopup(provider)
//         .then((result) => {
//             console.log('Google User:', result.user);
//             alert('Login successful!');
//             window.location.href = '/dashboard';
//         })
//         .catch((error) => {
//             console.error('Google login error:', error.message);
//             alert('Login failed: ' + error.message);
//         });
// }


// // Ensure DOM is fully loaded before adding event listeners
// document.addEventListener('DOMContentLoaded', () => {
//     console.log('DOM fully loaded');

//     // Google Login Button
//     const googleLoginButton = document.getElementById('googleLoginButton');
//     if (googleLoginButton) {
//         googleLoginButton.addEventListener('click', handleGoogleLogin);
//     }
// // Get modal elements
// const modal = document.getElementById('notificationModal');
// const modalMessage = document.getElementById('modalMessage');
// const closeModalButton = document.getElementById('closeModal');

// // Function to show the modal with a message
// function showModal(message) {
//     modalMessage.textContent = message; // Set the message in the modal
//     modal.style.display = 'block'; // Show the modal
// }

// // Close the modal when the close button is clicked
// closeModalButton.addEventListener('click', () => {
//     modal.style.display = 'none'; // Hide the modal
// });

// // Close the modal when clicking outside of the modal content
// window.addEventListener('click', (event) => {
//     if (event.target === modal) {
//         modal.style.display = 'none'; // Hide the modal
//     }
// });

// // Existing login form functionality
// document.getElementById('loginForm').addEventListener('submit', async function(e) {
//     e.preventDefault();
    
//     const email = document.getElementById('username').value; // Assuming username is the email
//     const password = document.getElementById('pass').value;

//     try {
//         const response = await fetch('http://localhost:3000/login', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ username: email, pass: password }),
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.error); // Throw an error with the message from the server
//         }

//         const user = await response.json(); // Assuming successful login returns user data
//         alert('Login successful!'); // Notify user of success
//         console.log('Logged in user:', user);
//         // Redirect to dashboard or perform other actions
//     } catch (error) {
//         // Display the error message in the modal
//         showModal('Login failed: ' + error.message); // Show the error message in the modal
//     }
// });
// //fully loaded before accessing elements
// document.addEventListener('DOMContentLoaded', () => {
//     const someElement = document.getElementById('targetElementId'); // Update ID
//     if (someElement) {
//         someElement.addEventListener('click', () => {
//             console.log('Element clicked');
//         });
//     } else {
//         console.error('Element with ID "targetElementId" not found.');
//     }
// });
// document.getElementById("update-dates-btn").addEventListener("click", function () {
//     const checkInDate = new Date(document.getElementById("check-in").value);
//     const checkOutDate = new Date(document.getElementById("check-out").value);

//     if (checkInDate && checkOutDate && checkOutDate > checkInDate) {
//         // Calculate the number of nights
//         const timeDifference = checkOutDate - checkInDate;
//         const totalNights = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

//         // Update the reservation card
//         document.getElementById("reserve-check-in").textContent = checkInDate.toLocaleDateString();
//         document.getElementById("reserve-check-out").textContent = checkOutDate.toLocaleDateString();
//         document.getElementById("total-nights").textContent = totalNights;

//         // Calculate total cost
//         const nightlyRate = 509;
//         const totalCost = nightlyRate * totalNights;
//         document.getElementById("total-cost").textContent = `$${totalCost}`;
//         document.getElementById("grand-total").textContent = `$${totalCost + 120 + 287}`; // Add fees
//     } else {
//         alert("Please select valid dates!");
//     }
// });

// const form = document.getElementById('signupForm');
// form.addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const formData = {
//         fullname: form.fullname.value,
//         username: form.username.value,
//         email: form.email.value,
//         num: form.num.value,
//         pass: form.pass.value,
//         gender: form.gender.value
//     };

//     try {
//         const response = await fetch('http://localhost:3000/api/users', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(formData)
//         });

//         const result = await response.json();
//         console.log('User created:', result);
//     } catch (err) {
//         console.error('Error:', err);
//     }
// });

// // User Dashboard Part Js

// function toggleSidebar() {
//     const sidebar = document.getElementById('sidebar');
//     const content = document.getElementById('content');
//     sidebar.classList.toggle('hidden');
//     content.classList.toggle('shifted');
// }
// document.querySelector('#menu-btn').addEventListener('click', () => {
//     toggleSidebar();
// });

// // Section Switching Function
// function showSection(sectionId) {
//     console.log('Target section:', sectionId); // Debug the section being targeted
    
//     document.querySelectorAll('.section').forEach((section) => {
//         section.style.display = 'none'; // Hide all sections
//     });
//     const targetSection = document.getElementById(sectionId);
//     if (targetSection) {
//         targetSection.style.display = 'block'; // Show the targeted section
//     } else {
//         console.error(`Section with ID "${sectionId}" not found.`);
//     }
// }


// //Default Section Visibility
// document.addEventListener('DOMContentLoaded', () => {
//     showSection('home');
// });

// // Add event listeners for navigation items
// document.querySelectorAll('.nav-item').forEach(item => {
//     item.addEventListener('click', (event) => {
//         const targetSection = event.target.getAttribute('data-section');
//         if (targetSection) {
//             showSection(targetSection);
//         }
//     });
// });


// //fetch
// fetch('/api/endpoint')
//     .then((response) => {
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.json();
//     })
//     .then((data) => {
//         console.log('Fetched data:', data);
//     })
//     .catch((error) => {
//         console.error('Error fetching data:', error);
//     });
// signInWithPopup(auth, provider)
//     .then((result) => {
//       // Handle successful login
//       console.log(result.user);
//     })
//     .catch((error) => {
//       // Handle error
//       console.error("Error during login:", error.message);
//     });
//         // Query Parameter Handling (Ensure Welcome Message Works)
//   //dynamically fetching cards of accommo
//   document.addEventListener("DOMContentLoaded", () => {
//     // Show selected section from the sidebar
//     function showSection(sectionId) {
//         const sections = document.querySelectorAll(".section");
//         sections.forEach(section => {
//             section.classList.remove("active");
//         });
//         document.getElementById(sectionId).classList.add("active");

//         // If 'viewProperty' is selected, fetch and populate property cards
//         if (sectionId === "viewProperty") {
//             fetchPropertyDetails();
//         }
//     }

//     // Fetch property details and dynamically populate the section
//     async function fetchPropertyDetails() {
//         const propertyContainer = document.querySelector(".property-container");
//         if (!propertyContainer) return;

//         propertyContainer.innerHTML = ""; // Clear existing content

//         try {
//             // Fetch data from a static JSON or API endpoint
//             const response = await fetch("/resources/data/properties.json");
//             const properties = await response.json();

//             // Populate property cards dynamically
//             properties.forEach(property => {
//                 const card = document.createElement("div");
//                 card.classList.add("property-card");

//                 card.innerHTML = `
//                     <img src="${property.image}" alt="${property.name}">
//                     <div class="card-details">
//                         <h2>${property.name}</h2>
//                         <p>Price: <strong>${property.price}</strong></p>
//                         <p>${property.description}</p>
//                         <button>View Details</button>
//                     </div>
//                 `;
//                 propertyContainer.appendChild(card);
//             });
//         } catch (error) {
//             console.error("Error fetching property details:", error);
//             propertyContainer.innerHTML = "<p>Failed to load properties. Please try again later.</p>";
//         }
//     }

//     // Add event listeners for sidebar links
//     const sidebarLinks = document.querySelectorAll(".sidebar ul li a");
//     sidebarLinks.forEach(link => {
//         link.addEventListener("click", event => {
//             event.preventDefault();
//             const sectionId = link.getAttribute("onclick").match(/showSection\('(\w+)'\)/)[1];
//             showSection(sectionId);
//         });
//     });
// });
// //file load
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './resources/uploads'); // Save files in 'resources/uploads'
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + '-' + file.originalname);
//     },
// });

// const upload = multer({ storage });
// //property 
// document.addEventListener('DOMContentLoaded', () => {
//     const addPropertyForm = document.getElementById('addPropertyForm');

//     addPropertyForm.addEventListener('submit', async (e) => {
//         e.preventDefault(); // Prevent default form submission

//         const formData = new FormData(addPropertyForm); // Gather form data

//         try {
//             const response = await fetch('/api/properties', {
//                 method: 'POST',
//                 body: formData,
//             });

//             if (response.ok) {
//                 const result = await response.json();
//                 alert(result.message); // Show success message
//                 addPropertyForm.reset(); // Clear the form
//             } else {
//                 const error = await response.json();
//                 alert(error.error || 'Failed to add property');
//             }
//         } catch (err) {
//             console.error('Error adding property:', err);
//         }
//     });
// });

// document.addEventListener('DOMContentLoaded', () => {
//     const sidebarLinks = document.querySelectorAll('.sidebar-link'); // Links in the sidebar
//     const sections = document.querySelectorAll('.section'); // All sections
    
//     // Get the last active section from localStorage or default to "home"
//     const activeSectionId = localStorage.getItem('activeSection') || 'home';
    
//     // Show the active section and hide others
//     sections.forEach(section => {
//         section.style.display = section.id === activeSectionId ? 'block' : 'none';
//     });

//     // Add "active" class to the corresponding sidebar link
//     sidebarLinks.forEach(link => {
//         const target = link.getAttribute('data-target');
//         if (target === activeSectionId) {
//             link.classList.add('active');
//         } else {
//             link.classList.remove('active');
//         }
//     });

//     // Add click event listeners to sidebar links
//     sidebarLinks.forEach(link => {
//         link.addEventListener('click', (e) => {
//             e.preventDefault();

//             // Remove "active" class from all links
//             sidebarLinks.forEach(l => l.classList.remove('active'));

//             // Add "active" class to the clicked link
//             link.classList.add('active');

//             // Get the target section ID
//             const targetSectionId = link.getAttribute('data-target');

//             // Update visibility of sections
//             sections.forEach(section => {
//                 section.style.display = section.id === targetSectionId ? 'block' : 'none';
//             });

//             // Store the active section in localStorage
//             localStorage.setItem('activeSection', targetSectionId);
//         });
//     });
// });
// // logout
// // Logout button functionality
// const logoutButton = document.querySelector('#logoutButton');

// if (logoutButton) {
//     logoutButton.addEventListener('click', async (e) => {
//         e.preventDefault(); // Prevent default link behavior
//         try {
//             const response = await fetch('/logout', {
//                 method: 'GET',
//             });

//             if (response.ok) {
//                 window.location.href = '/login'; // Redirect to login page
//             } else {
//                 alert('Failed to log out. Please try again.');
//             }
//         } catch (error) {
//             console.error('Error during logout:', error);
//             alert('An error occurred. Please try again.');
//         }
//     });
// }



