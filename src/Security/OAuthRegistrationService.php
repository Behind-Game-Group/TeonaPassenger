<?php

declare(strict_types=1);

namespace App\Security;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use League\OAuth2\Client\Provider\GoogleUser;
use League\OAuth2\Client\Provider\ResourceOwnerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final readonly class OAuthRegistrationService
{
    public function __construct(private readonly UserPasswordHasherInterface $passwordHasher)
    {
    }

    /**
     * @param GoogleUser $resourceOwner
     */
    public function persist(ResourceOwnerInterface $resourceOwner, UserRepository $userRepository): User
    {
        $user = new User();
        $user->setEmail($resourceOwner->getEmail());
        $user->setGoogleId($resourceOwner->getId());
        $user->setRoles(['ROLE_USER']);
        $user->setPassword($this->passwordHasher->hashPassword($user, bin2hex(random_bytes(16))));

        $userRepository->save($user, true);

        return $user;
    }
}