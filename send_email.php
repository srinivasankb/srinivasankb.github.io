if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "hello@srinivasan.online"; // Srinivasan's email address
    $subject = "New Contact Form Submission";
    $name = $_POST["name"];
    $email = $_POST["email"];
    $message = $_POST["message"];

    $fullMessage = "Name: $name\nEmail: $email\n\n$message";

    // Send email
    mail($to, $subject, $fullMessage);

    // Redirect back to the main page or display a thank you message
    header("Location: index.html");
    exit();
}