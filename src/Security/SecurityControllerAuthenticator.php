<?php

namespace App\Security;

use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

/**
 * @see https://symfony.com/doc/current/security/custom_authenticator.html
 */
class SecurityControllerAuthenticator extends AbstractAuthenticator
{
    private $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Cette méthode détermine si l'authentificateur est utilisé pour la requête
     */
    public function supports(Request $request): ?bool
    {
        // Vérifie si l'en-tête "X-AUTH-TOKEN" est présent dans la requête
        return $request->headers->has('X-AUTH-TOKEN');
    }

    public function authenticate(Request $request): Passport
    {
        $data = json_decode($request->getContent(), true);

        // Tu peux maintenant accéder aux données dans $data
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        // Vérifie si l'email et le mot de passe sont fournis et valide
        if (null === $email || null === $password) {
            throw new CustomUserMessageAuthenticationException('Email et mot de passe requis');
        }

        // Cherche l'utilisateur avec l'email
        $user = $this->userRepository->findOneBy(['email' => $email]);

        if (!$user || !password_verify($password, $user->getPassword())) {
            throw new CustomUserMessageAuthenticationException('Identifiants invalides');
        }

        // Crée un passport avec le badge de l'utilisateur
        return new SelfValidatingPassport(new UserBadge($user->getId()));
    }
    /**
     * Cette méthode est appelée lorsqu'une authentification réussie
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        // Si l'authentification est réussie, laissez la requête continuer
        return null; // Aucun besoin de faire quoi que ce soit ici, la requête est déjà authentifiée
    }

    /**
     * Cette méthode est appelée lorsqu'une authentification échoue
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        // Renvoyer une réponse JSON avec le message d'erreur de l'authentification
        $data = [
            'message' => strtr($exception->getMessageKey(), $exception->getMessageData()),
        ];

        return new JsonResponse($data, Response::HTTP_UNAUTHORIZED);
    }
}
