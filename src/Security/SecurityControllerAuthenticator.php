<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractLoginFormAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\RememberMeBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\PasswordCredentials;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;

class SecurityControllerAuthenticator extends AbstractLoginFormAuthenticator
{
    // Définir l'URL de connexion
    protected function getLoginUrl(Request $request): string
    {
        return '/loginCredentials'; // Votre route de login
    }

    // Vérifie si cette authentification doit être déclenchée
    public function supports(Request $request): bool
    {
        return $request->isMethod('POST') && $request->getPathInfo() === '/loginCredentials';
    }

    // Tente de récupérer et valider les informations d'authentification
    public function authenticate(Request $request): Passport
    {
        $data = json_decode($request->getContent(), true);

        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            throw new CustomUserMessageAuthenticationException('Email and password are required.');
        }

        return new Passport(
            new UserBadge($email),
            new PasswordCredentials($password),
            [new RememberMeBadge()]
        );
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): JsonResponse
    {
        return new JsonResponse(['message' => 'Login successful'], Response::HTTP_OK);
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): JsonResponse
    {
        return new JsonResponse(['message' => $exception->getMessageKey()], Response::HTTP_UNAUTHORIZED);
    }
}
