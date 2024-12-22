let menu = document.querySelector('#menu-btn');
document.querySelector('.menu-button').addEventListener('click', () => {
    const userMenu = document.querySelector('.user-menu');
    userMenu.classList.toggle('active');
});
menu.onclick = () => {
    menu.classList.toggle('fa-times');
    navlinks.classList.toggle('active');
}   
window.onscroll = () => {
    menu.classList.remove('fa-times');
    navlinks.classList.remove('active');

    if (window.scrollY>0){
        header.classList.add('active');
    }
    else{
        header.classList.remove('active');
    }
}
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('pass').value;
    
    console.log('Username:', username);
    console.log('Password:', pass);
    
    alert('Login submitted! (Check console for values)');
}); 
//fully loaded before accessing elements
document.addEventListener('DOMContentLoaded', () => {
    const someElement = document.getElementById('targetElementId'); // Update ID
    if (someElement) {
        someElement.addEventListener('click', () => {
            console.log('Element clicked');
        });
    } else {
        console.error('Element with ID "targetElementId" not found.');
    }
});
document.getElementById("update-dates-btn").addEventListener("click", function () {
    const checkInDate = new Date(document.getElementById("check-in").value);
    const checkOutDate = new Date(document.getElementById("check-out").value);

    if (checkInDate && checkOutDate && checkOutDate > checkInDate) {
        // Calculate the number of nights
        const timeDifference = checkOutDate - checkInDate;
        const totalNights = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        // Update the reservation card
        document.getElementById("reserve-check-in").textContent = checkInDate.toLocaleDateString();
        document.getElementById("reserve-check-out").textContent = checkOutDate.toLocaleDateString();
        document.getElementById("total-nights").textContent = totalNights;

        // Calculate total cost
        const nightlyRate = 509;
        const totalCost = nightlyRate * totalNights;
        document.getElementById("total-cost").textContent = `$${totalCost}`;
        document.getElementById("grand-total").textContent = `$${totalCost + 120 + 287}`; // Add fees
    } else {
        alert("Please select valid dates!");
    }
});

// document.addEventListener("DOMContentLoaded", function () {
//     const signupForm = document.getElementById("signupForm");
//     const password = document.getElementById("pass");
//     const confPassword = document.getElementById("confpass");
//     const email = document.getElementById("email");
//     const phone = document.getElementById("num");
//     const username = document.getElementById("username");

//     function isValidEmail(email) {
//         const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
//         return regex.test(email);
//     }

//     function isValidPhone(phone) {
//         const regex = /^[0-9]{10}$/; 
//         return regex.test(phone);
//     }

//     function checkPasswordsMatch() {
//         return password.value === confPassword.value;
//     }

//     signupForm.addEventListener("submit", function (e) {
//         let valid = true;

//         // Check if passwords match
//         if (!checkPasswordsMatch()) {
//             valid = false;
//             alert("Passwords do not match!");
//         }
//         if (!isValidEmail(email.value)) {
//             valid = false;
//             alert("Please enter a valid email address!");
//         }
//         if (!isValidPhone(num.value)) {
//             valid = false;
//             alert("Please enter a valid phone number!");
//         }
//         if (!valid) {
//             e.preventDefault();
//         }
//     });
// }
// );
const form = document.getElementById('signupForm');
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        fullname: form.fullname.value,
        username: form.username.value,
        email: form.email.value,
        num: form.num.value,
        pass: form.pass.value,
        gender: form.gender.value
    };

    try {
        const response = await fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        console.log('User created:', result);
    } catch (err) {
        console.error('Error:', err);
    }
});

// User Dashboard Part Js

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    sidebar.classList.toggle('hidden');
    content.classList.toggle('shifted');
}
document.querySelector('#menu-btn').addEventListener('click', () => {
    toggleSidebar();
});

// Section Switching Function
function showSection(sectionId) {
    console.log('Target section:', sectionId); // Debug the section being targeted
    
    document.querySelectorAll('.section').forEach((section) => {
        section.style.display = 'none'; // Hide all sections
    });
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block'; // Show the targeted section
    } else {
        console.error(`Section with ID "${sectionId}" not found.`);
    }
}


// Default Section Visibility
// document.addEventListener('DOMContentLoaded', () => {
//     showSection('home');
// });

// Add event listeners for navigation items
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (event) => {
        const targetSection = event.target.getAttribute('data-section');
        if (targetSection) {
            showSection(targetSection);
        }
    });
});


//fetch
fetch('/api/endpoint')
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        console.log('Fetched data:', data);
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });

document.addEventListener('DOMContentLoaded', async () => {
    const welcomeMessage = document.getElementById('welcomeMessage');
    
    try {
        const response = await fetch('/api/session');
        if (!response.ok) throw new Error('Failed to fetch session data');
    
        const user = await response.json();
        welcomeMessage.innerText = `Welcome Back, ${user.fullname}!`;
    } catch (err) {
        console.error(err);
        welcomeMessage.innerText = 'Welcome Back!';
    }
    });
        // Query Parameter Handling (Ensure Welcome Message Works)
  //dynamically fetching cards of accommo
  document.addEventListener("DOMContentLoaded", () => {
    // Show selected section from the sidebar
    function showSection(sectionId) {
        const sections = document.querySelectorAll(".section");
        sections.forEach(section => {
            section.classList.remove("active");
        });
        document.getElementById(sectionId).classList.add("active");

        // If 'viewProperty' is selected, fetch and populate property cards
        if (sectionId === "viewProperty") {
            fetchPropertyDetails();
        }
    }

    // Fetch property details and dynamically populate the section
    async function fetchPropertyDetails() {
        const propertyContainer = document.querySelector(".property-container");
        if (!propertyContainer) return;

        propertyContainer.innerHTML = ""; // Clear existing content

        try {
            // Fetch data from a static JSON or API endpoint
            const response = await fetch("/resources/data/properties.json");
            const properties = await response.json();

            // Populate property cards dynamically
            properties.forEach(property => {
                const card = document.createElement("div");
                card.classList.add("property-card");

                card.innerHTML = `
                    <img src="${property.image}" alt="${property.name}">
                    <div class="card-details">
                        <h2>${property.name}</h2>
                        <p>Price: <strong>${property.price}</strong></p>
                        <p>${property.description}</p>
                        <button>View Details</button>
                    </div>
                `;
                propertyContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Error fetching property details:", error);
            propertyContainer.innerHTML = "<p>Failed to load properties. Please try again later.</p>";
        }
    }

    // Add event listeners for sidebar links
    const sidebarLinks = document.querySelectorAll(".sidebar ul li a");
    sidebarLinks.forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            const sectionId = link.getAttribute("onclick").match(/showSection\('(\w+)'\)/)[1];
            showSection(sectionId);
        });
    });
});

//property 
document.addEventListener('DOMContentLoaded', () => {
    const addPropertyForm = document.getElementById('addPropertyForm');

    // Handle form submission
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
                alert(result.message); // Show success message
                addPropertyForm.reset(); // Clear the form
                fetchPropertyDetails(); // Refresh property list
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to add property');
            }
        } catch (err) {
            console.error('Error adding property:', err);
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.querySelectorAll('.sidebar-link'); // Links in the sidebar
    const sections = document.querySelectorAll('.section'); // All sections
    
    // Get the last active section from localStorage or default to "home"
    const activeSectionId = localStorage.getItem('activeSection') || 'home';
    
    // Show the active section and hide others
    sections.forEach(section => {
        section.style.display = section.id === activeSectionId ? 'block' : 'none';
    });

    // Add "active" class to the corresponding sidebar link
    sidebarLinks.forEach(link => {
        const target = link.getAttribute('data-target');
        if (target === activeSectionId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Add click event listeners to sidebar links
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove "active" class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));

            // Add "active" class to the clicked link
            link.classList.add('active');

            // Get the target section ID
            const targetSectionId = link.getAttribute('data-target');

            // Update visibility of sections
            sections.forEach(section => {
                section.style.display = section.id === targetSectionId ? 'block' : 'none';
            });

            // Store the active section in localStorage
            localStorage.setItem('activeSection', targetSectionId);
        });
    });
});
// logout
// Logout button functionality
const logoutButton = document.querySelector('#logoutButton');

if (logoutButton) {
    logoutButton.addEventListener('click', async (e) => {
        e.preventDefault(); // Prevent default link behavior
        try {
            const response = await fetch('/logout', {
                method: 'GET',
            });

            if (response.ok) {
                window.location.href = '/login'; // Redirect to login page
            } else {
                alert('Failed to log out. Please try again.');
            }
        } catch (error) {
            console.error('Error during logout:', error);
            alert('An error occurred. Please try again.');
        }
    });
}



