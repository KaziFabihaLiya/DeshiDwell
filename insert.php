<?php
include "db_connect.php" ;

if(isset($_POST['signup'])){
    $fullname = $_POST["fullname"];
    $username = $_POST["username"];
    $email = $_POST["email"];
    $num = $_POST["num"];
    $pass = $_POST["pass"];
    $confpass = $_POST['confpass'];
    $gender = $_POST["gender"];

    if ($pass !== $confpass) {
        echo "Passwords do not match!";
        "<script> alert ('Passwords do not match!'); </script>";
        exit();
    }    
    // Hash the password
    $hashedPass = password_hash($pass, PASSWORD_DEFAULT);

    // Insert user into database
    $insertQuery = "INSERT INTO users (fullname, username, email, num, pass, gender) VALUES (?, ?, ?, ?, ?, ?)";

    if ($stmt = $conn->prepare($insertQuery)) {
        $stmt->bind_param("ssssss", $fullname, $username, $email, $num, $hashedPass, $gender);

        if ($stmt->execute()) {
            echo "User registered successfully!";
        } else {
            echo "Error: " . $stmt->error;
        }

        $stmt->close();
    } else {
        echo "Error in preparing statement: " . $conn->error;
    }
}



if (isset($_POST['signIn'])) {
    $username = $_POST['username'];
    $pass = $_POST['pass'];
    
    $sql = "SELECT * FROM users WHERE username = ?";
    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();

            // Debugging: Display fetched user data
            echo "Fetched user: ";
            print_r($row);

            if (password_verify($pass, $row['pass'])) {
                session_start();
                $_SESSION['username'] = $row['username'];
                header("Location: UDashboard.php");
                exit();
            } else {
                echo "Incorrect Password.";
            }
        } else {
            echo "No such user found.";
        }
    } else {
        echo "Error in preparing statement: " . $conn->error;
    }
}
?>