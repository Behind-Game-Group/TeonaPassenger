<?php

namespace App\Security;

use Firebase\JWT\JWT;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\PasswordCredentials;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Psr\Log\LoggerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class SecurityControllerAuthenticator extends AbstractAuthenticator
{
    private $logger;
    private $tokenStorage;

    public function __construct(LoggerInterface $logger, TokenStorageInterface $tokenStorage)
    {
        $this->logger = $logger;
        $this->tokenStorage = $tokenStorage;
    }

    public function supports(Request $request): ?bool
    {
        $this->logger->info('supports() called', [
            'path' => $request->getPathInfo(),
            'method' => $request->getMethod()
        ]);

        return $request->getPathInfo() === '/loginCheck' && $request->isMethod('POST');
    }

    public function authenticate(Request $request): Passport
    {
        $this->logger->info('authenticate() called');
        // Récupération des données JSON
        $data = json_decode($request->getContent(), true);

        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (empty($email) || empty($password)) {
            $this->logger->error('Email or password is missing', [
                'email' => $email,
                'password' => $password
            ]);
            throw new CustomUserMessageAuthenticationException('Veuillez remplir tous les champs.');
        }

        return new Passport(
            new UserBadge($email),
            new PasswordCredentials($password)
        );
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): JsonResponse
    {
        $user = $token->getUser(); // Récupérer l'utilisateur authentifié

        // Générer un JWT
        $key = 'votre_clé_secrète'; // Utilisez une clé secrète sécurisée
        $payload = [
            'email' => $user->getUserIdentifier(), // Identifiant unique (email ou username)
            'roles' => $user->getRoles(),
            'exp' => time() + 3600, // Expiration du token (1 heure)
        ];
    
        $jwt = JWT::encode($payload, $key, 'HS256'); // Encoder le token JWT
    
        return new JsonResponse([
            'message' => 'Authentification réussie',
            'token' => $jwt, // Retourner le token JWT
        ], JsonResponse::HTTP_OK);
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): JsonResponse
    {
        // Réponse en cas d'échec
        return new JsonResponse(['error' => $exception->getMessage()], 401);
    }
}
