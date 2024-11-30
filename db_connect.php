<?php
$server = "localhost";
$username = "root";
$password = "";
$database = "deshidwell";

$conn = mysqli_connect($server,$username,$password,$database);

if (!$conn) {
    die("Bhugichugi korso, kisu hoy nai". mysqli_connect_error());
}
?>