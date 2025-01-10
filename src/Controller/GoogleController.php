<?php

namespace App\Controller;

use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use App\Repository\UserRepository;
use App\Entity\User;
use App\Security\GoogleAuthenticator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Http\Authentication\UserAuthenticatorInterface;
use Symfony\Component\Security\Http\Authenticator\AuthenticatorInterface;

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
    public function callback(
        ClientRegistry $clientRegistry,
        EntityManagerInterface $entityManager,
        UserRepository $userRepository,
        UserAuthenticatorInterface $userAuthenticator,
        RequestStack $requestStack,
        AuthenticatorInterface $authenticator
    ): JsonResponse {
        $client = $clientRegistry->getClient('google');
        $request = $requestStack->getCurrentRequest();

        try {
            /** @var GoogleUser $googleUser */
            $googleUser = $client->fetchUser();

            $email = $googleUser->getEmail();
            $googleId = $googleUser->getId();

            if (!$email) {
                throw new \Exception('Impossible de récupérer l\'email de l\'utilisateur.');
            }

            // Récupérer ou créer l'utilisateur
            $user = $userRepository->findOneBy(['email' => $email]);
            if (!$user) {
                // Vérification par GoogleId pour création d'un nouvel utilisateur
                $user = $userRepository->findOneBy(['google_Id' => $googleId]);

                if (!$user) {
                    $user = new User();
                    $user->setEmail($email);
                    $user->setGoogle_Id($googleId);

                    $entityManager->persist($user);
                    $entityManager->flush();
                }
            }

            // Authentification avec GoogleAuthenticator
            if ($authenticator instanceof GoogleAuthenticator) {
                $response = $userAuthenticator->authenticateUser(
                    $user,
                    $authenticator, // Cela sera l'authenticator personnalisé
                    $request
                );

                return $response ?? new JsonResponse([
                    'status' => 'success',
                    'user' => [
                        'id' => $user->getId(),
                        'email' => $user->getEmail(),
                        'name' => $user->getName(),
                    ],
                ]);
            } else {
                throw new \Exception('Authenticator is not of type GoogleAuthenticator.');
            }
        } catch (\Exception $e) {
            return new JsonResponse([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}