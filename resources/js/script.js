let menu = document.querySelector('#menu-btn');
// let navlinks = document.querySelector('.headerfix .nav-links');
// let header = document.querySelector('.headerfix');
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

document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signupForm");
    const password = document.getElementById("pass");
    const confPassword = document.getElementById("confpass");
    const email = document.getElementById("email");
    const phone = document.getElementById("num");
    const username = document.getElementById("username");

    function isValidEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    }

    function isValidPhone(phone) {
        const regex = /^[0-9]{10}$/; 
        return regex.test(phone);
    }

    function checkPasswordsMatch() {
        return password.value === confPassword.value;
    }

    signupForm.addEventListener("submit", function (e) {
        let valid = true;

        // Check if passwords match
        if (!checkPasswordsMatch()) {
            valid = false;
            alert("Passwords do not match!");
        }
        if (!isValidEmail(email.value)) {
            valid = false;
            alert("Please enter a valid email address!");
        }
        if (!isValidPhone(num.value)) {
            valid = false;
            alert("Please enter a valid phone number!");
        }
        if (!valid) {
            e.preventDefault();
        }
    });
}
);
