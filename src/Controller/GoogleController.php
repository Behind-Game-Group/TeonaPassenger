<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use League\OAuth2\Client\Provider\Google;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use App\Entity\GoogleConnection;
use App\Entity\UserProfile;
use DateTimeImmutable;

class GoogleController
{
    private Google $provider;
    private EntityManagerInterface $entityManager;
    private TokenStorageInterface $tokenStorage;

    public function __construct(
        string $clientId,
        string $clientSecret,
        string $redirectUri,
        EntityManagerInterface $entityManager,
        TokenStorageInterface $tokenStorage
    ) {
        $this->provider = new Google([
            'clientId'     => $clientId,
            'clientSecret' => $clientSecret,
            'redirectUri'  => $redirectUri,
        ]);
        $this->entityManager = $entityManager;
        $this->tokenStorage = $tokenStorage;
    }

    #[Route('/google/connect', name: 'auth_google_start')]
    public function login(Request $request, SessionInterface $session): RedirectResponse
    {
        $authUrl = $this->provider->getAuthorizationUrl([
            'scope' => [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
                'openid'
            ],
            'access_type' => 'online',
            'prompt' => 'select_account consent'
        ]);

        $session->set('oauth2state', $this->provider->getState());
        return new RedirectResponse($authUrl);
    }

    #[Route('/google/callback', name: 'auth_google_callback')]
    public function callback(Request $request, SessionInterface $session): Response
    {
        $state = $request->get('state');
        if (empty($state) || ($state !== $session->get('oauth2state'))) {
            $session->remove('oauth2state');
            return new Response('Invalid OAuth state.', 400);
        }

        try {
            $token = $this->provider->getAccessToken('authorization_code', [
                'code' => $request->get('code')
            ]);

            /** @var \League\OAuth2\Client\Provider\GoogleUser $googleUser */
            $googleUser = $this->provider->getResourceOwner($token);

            // Rechercher d'abord une connexion Google existante
            $googleConnection = $this->entityManager->getRepository(GoogleConnection::class)
                ->findOneBy(['google_id' => $googleUser->getId()]);

            if ($googleConnection) {
                $user = $googleConnection->getUser();
            } else {
                // Rechercher un utilisateur existant par email
                $date = new DateTimeImmutable();
                $user = $this->entityManager->getRepository(User::class)
                    ->findOneBy(['email' => $googleUser->getEmail()]);

                if (!$user) {
                    // Créer un nouvel utilisateur + son profil
                    $user = new User();
                    $user->setEmail($googleUser->getEmail());
                    $user->setRoles(['ROLE_USER']);
                    $user->setCreatedAt($date);
                    $user->setUpdatedAt($date);
                    $userprofile = new UserProfile();
                    $userprofile->setCreateTime(new DateTimeImmutable());
                    $user->setUserProfile($userprofile);
                    $this->entityManager->persist($user);
                    $this->entityManager->persist($userprofile);
                }

                // Créer la connexion Google
                $googleConnection = new GoogleConnection();
                $googleConnection->setUser($user);
                $googleConnection->setGoogleId($googleUser->getId());
                $user->setEmail($googleUser->getEmail());
                $googleConnection->setGoogleName($googleUser->getName());
                $user->setUpdatedAt($date);

                $this->entityManager->persist($user);
                $this->entityManager->persist($googleConnection);
            }

            $this->entityManager->flush();

            // Authentifier l'utilisateur
            $token = new UsernamePasswordToken($user, 'main', $user->getRoles());
            $this->tokenStorage->setToken($token);
            $session->set('_security_main', serialize($token));

            return new RedirectResponse('/');
        } catch (\Exception $e) {
            return new Response('Authentication failed: ' . $e->getMessage(), 500);
        }
    }
}
