<?php

// src/Command/TestMailerCommand.php
namespace App\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class TestMailerCommand extends Command
{
    // Nom de la commande
    protected static $defaultName = 'mailer:test';

    private $mailer;

    public function __construct(MailerInterface $mailer)
    {
        parent::__construct();

        $this->mailer = $mailer;
    }

    protected function configure()
    {
        $this
            ->setDescription('Send a test email')
            ->addArgument('to', null, 'Recipient email')
            ->addOption('from', null, null, 'Sender email')
            ->addOption('subject', null, null, 'Subject of the email')
            ->addOption('body', null, null, 'Body of the email');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        // Récupérer les options et arguments
        $to = $input->getArgument('to');
        $from = $input->getOption('from') ?: 'no-reply@yourdomain.com';
        $subject = $input->getOption('subject');
        $body = $input->getOption('body');

        // Créer l'email
        $email = (new Email())
            ->from($from)
            ->to($to)
            ->subject($subject)
            ->text($body);

        try {
            $this->mailer->send($email);
            $output->writeln('<info>Email sent successfully</info>');
        } catch (\Exception $e) {
            $output->writeln('<error>Error sending email: ' . $e->getMessage() . '</error>');
        }

        return Command::SUCCESS;
    }
}
