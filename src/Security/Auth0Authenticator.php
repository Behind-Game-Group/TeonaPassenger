<?php

namespace App\Security;

use App\Entity\User;
use App\Entity\UserProfile;
use App\Repository\UserRepository;
use DateTimeImmutable;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\RememberMeBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

class Auth0Authenticator extends AbstractAuthenticator
{
    public function __construct(
        private readonly UserRepository $repository,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly LoggerInterface $logger
    ) {}
    
    // Vérifie si cette authentification doit être déclenchée
    public function supports(Request $request): bool
    {
        return $request->getPathInfo() === '/loginAuth0' && $request->isMethod('POST');
    }

    // Tente de récupérer et valider les informations d'authentification
    public function authenticate(Request $request): SelfValidatingPassport
    {
        $this->logger->info('Auth0Authenticator is triggered.');
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            $this->logger->error('Auth0Authenticator: Failed to parse JSON from request.');
            throw new CustomUserMessageAuthenticationException('Invalid JSON payload.');
        }

        $email = $data['email'] ?? null;
        $firstname = $data['given_name'] ?? null;
        $lastname = $data['family_name'] ?? null;
        $nickname = $data['nickname'] ?? null;
        $picture = $data['picture'] ?? null;
        $auth0id = $data['sub'] ?? null;

        if (!$email) {
            throw new CustomUserMessageAuthenticationException('Email are required.');
        }

        $user = $this->repository->findOneBy(['email' => $email]);

        if (!$user) {
            $newuser = new User();

            $newuser->setEmail($email);
            $newuser->setPassword($this->passwordHasher->hashPassword($newuser, bin2hex(random_bytes(16))));
            $newuser->setRoles(['ROLE_USER']);
            $newuser->setAuth0_id($auth0id);

            $userProfile = new UserProfile();
            $userProfile->setName($firstname);
            $userProfile->setSurname($lastname);
            $userProfile->setUsername($nickname);
            $userProfile->setAvatar($picture);
            $userProfile->setCreateTime(new DateTimeImmutable());
            $newuser->setUserProfile($userProfile);

            $this->repository->save($newuser, true);

            $user = $this->repository->findOneBy(['email' => $email]);
        }

        return new SelfValidatingPassport(
            userBadge: new UserBadge($user->getUserIdentifier(), fn() => $user),
            badges: [
                new RememberMeBadge()
            ]
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
