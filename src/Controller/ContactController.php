<?php

// src/Controller/ContactController.php
namespace App\Controller;

use App\Form\ContactType;
use App\Command\TestMailerCommand;
use App\Controller\TestMailerCommand as ControllerTestMailerCommand;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput; // Utilisation de BufferedOutput
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ContactController extends AbstractController
{
    private $testMailerCommand;

    // Injection de la commande TestMailerCommand dans le constructeur
    public function __construct(TestMailerCommand $testMailerCommand)
    {
        $this->testMailerCommand = $testMailerCommand;
    }

    #[Route('/contact', name: 'contact')]
    public function contact(Request $request): Response
    {
        $form = $this->createForm(ContactType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $data = $form->getData();

            // Préparer l'input pour la commande (les arguments et options)
            $input = new ArrayInput([
                'to' => 'admin@example.com', // Destinataire (admin ou autre)
                '--from' => $data['email'], // Expéditeur (l'email de la personne)
                '--subject' => $data['subject'], // Sujet du message
                '--body' => $data['message'], // Corps du message
            ]);

            // Créez une sortie tamponnée pour capturer la sortie de la commande
            $output = new BufferedOutput();

            // Exécuter la commande
            $status = $this->testMailerCommand->run($input, $output);  // Exécution de la commande

            // Capture la sortie de la commande
            $result = $output->fetch();

            // Vérifier le statut de la commande et ajouter un message Flash
            if ($status === 0) {
                // Si la commande a réussi
                $this->addFlash('success', 'Votre message a été envoyé avec succès.');
            } else {
                // Si la commande a échoué
                $this->addFlash('error', 'Une erreur est survenue lors de l\'envoi de votre message: ' . $result);
            }

            return $this->redirectToRoute('contact');
        }

        return $this->render('contact/contact.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}
