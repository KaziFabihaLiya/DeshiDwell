<!DOCTYPE html>
<html lang="en">
<?php 
    include "db_connect.php";
?>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel</title>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Welcome to Admin Panel</h1>
<?php
  $query=mysqli_query($conn, "SELECT * FROM `users`");
?>
<table class="table table-hover">
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Fullname</th>
      <th scope="col">Username</th>
      <th scope="col">Email</th>
      <th scope="col">Password</th>
      <th scope="col">Confirmed Password</th>
      <th scope="col">Gender</th>
    </tr>
  </thead>
  <tbody>
    <?php
    while ($row = mysqli_fetch_array($query)) {
      ?>
        <tr>
          <td><?php echo htmlspecialchars($row['id']); ?></td>
          <td><?php echo htmlspecialchars($row['fullname']); ?></td>
          <td><?php echo htmlspecialchars($row['username']); ?></td>
          <td><?php echo htmlspecialchars($row['email']); ?></td>
          <td><?php echo md5($row['pass']); ?></td>
          <td><?php echo md5($row['pass']); ?></td> <!-- Confirmed password should be displayed securely, if needed -->
          <td><?php echo $row['gender']; ?></td>
        </tr>
      <?php
      }
      ?>
  </tbody>
</table>
    
</body>
</html>