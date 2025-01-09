<?php

namespace App\Controller;

use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use App\Repository\UserRepository;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class GoogleController extends AbstractController
{
    #[Route('/google/connect', name: 'google_connect')]
    public function connect(ClientRegistry $clientRegistry): Response
    {
        // Redirige l'utilisateur vers Google pour l'authentification
        return $clientRegistry
            ->getClient('google') // Nom du client défini dans config/packages/knpu_oauth2_client.yaml
            ->redirect(['email'], ['profile'], ['openid']); // Scopes demandés
    }

    #[Route('/google/callback', name: 'google_callback')]
    public function callback(): Response {
        return new Response(status: 200);
    }
}
