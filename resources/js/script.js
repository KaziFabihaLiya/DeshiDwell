let menu = document.querySelector('#menu-btn');
let navlinks = document.querySelector('.headerfix .nav-links');
let header = document.querySelector('.headerfix');
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
});
