<?php
session_start();
include "db_connect.php" ;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> User Dashboard </title>
    <p>Hello, <?php 
       if(isset($_SESSION['username'])){
        $email=$_SESSION['username'];
        $query=mysqli_query($conn, "SELECT users.* FROM `users` WHERE users.username='$username'");
        while($row=mysqli_fetch_array($query)){
            echo $row['username'];
        }
       }
       ?></p>

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"/>
    <!-- bootstrap -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/css/bootstrap.min.css"/>
    <!-- CSS file linked -->
    <link rel="stylesheet" href="style.css">


    <!-- <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet"> -->
</head>
<body>
    <!-- header start -->
<header class="headerfix">

    <div class="container">

        <div class="bar">
            <a href="#home" class="logo"><span>DeshiDwell</span></a>
            <nav class="navbarr">
                <nav class="nav-links">
                    <a href="#home">Home</a>
                    <a href="#about">About</a>
                    <a href="#services">Services</a>
                    <a href="#foot">Contact US</a>
                    <a href="#reviews">Reviews</a>
                </nav>
            </nav>
            <div class="buttons" id="buttons">    
                <a href="../ProjectMid/login.html" class="link-btn" align-items-center><nobr>Book Now</nobr></a>
            </div>
            
            <div id="menu-btn" class="fas fa-bars"></div>

        </div>

    </div>

</header>
    <!-- header end -->
<section class="home" id="home">
    <div class="container">
        <div class="minvh">
            <div class="content text-center text-md-start">
                <h1 class="title">Welcome to Deshi Dwell</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. <br> Dolorum reiciendis, commodi possimus non assumenda vitae<br>voluptatibus error omnis debitis eligendi et sapiente molestias<br>quod fuga ab maiores accusamus impedit cupiditate.</p>
                <a href="#contact" class="link-btn">Book Now</a> 
            </div>
            
        </div>
    </div>
</section>

<section class="about" id="about">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-md-6 image">
                <img src="../ProjectMid/resources/image/house2.jpg" alt="" class="w-100 mb-5 mb-md-0">
            </div>
            <div class="col-md-6 content">
                <span>About Us</span>
                <h3>Find a temporary housing in Deshi Dwell</h3>
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem esse cumque, maxime maiores veniam aspernatur sapiente consequuntur 
                    perferendis possimus doloribus velit nisi nesciunt asperiores laudantium reiciendis totam. Voluptatibus, optio rem?</p>
                <a href="#contact" class="link-btn"> Booking </a>
            </div>
    </div>
</section>
<section class="footer" id="foot">
    <div class="box-container container">
        <div class="box">
            <i class="fas fa-phone"></i>
            <h3>Phone Number</h3>
            <p>+123-456-8980</p>
            <p>+880-156-8980</p>
        </div>
        <div class="box">
            <i class="fas fa-map-marked-alt"></i>
            <h3>Our Address</h3>
            <p>Dhaka, Bangladesh</p>
        </div>
        <div class="box">
            <i class="fas fa-clock"></i>
            <h3>Opening Hour</h3>
            <p>10.00 AM - 8.00 PM</p>
        </div>
        <div class="box">
            <i class="fas fa-envelope-square"></i>
            <h3>Email Address</h3>
            <p>Kazifabiha20@gmail.com</p>
            <p>Syedahad60@gmail.com</p>
        </div>
    </div>
    <div class="credit"> &copy; copyright @ <?php echo date('Y'); ?> by <span>Kazi Fabiha Liya</span></div>
</section>
    <script src="..//ProjectMid/resources/js/script.js"></script>
</body>
</html>