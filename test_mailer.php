<?php

use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mime\Email;

require 'vendor/autoload.php';

$transport = Transport::fromDsn('smtp://cd5047b28d0335:c5a5b40eacdbee@sandbox.smtp.mailtrap.io:2525');
$mailer = new Mailer($transport);

$email = (new Email())
    ->from('test@example.com')
    ->to('recipient@example.com')
    ->subject('Test Mailtrap')
    ->text('This is a test email to verify Mailtrap configuration.');

try {
    $mailer->send($email);
    echo "Email sent successfully!";
} catch (\Exception $e) {
    echo "Failed to send email: " . $e->getMessage();
}
