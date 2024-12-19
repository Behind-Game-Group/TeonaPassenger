<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\UserProfile;
use DateTime;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

class AuthController extends AbstractController
{
    #[Route('/registerCredentials', name: 'app_register_credentials', methods: ['POST'])]
    public function registerCredentials(Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            return new JsonResponse(['error' => 'Email and password are required'], 400);
        }

        $user = new User();
        $user->setEmail($email);
        $user->setRoles(['ROLE_USER']);
        $user->setPassword($passwordHasher->hashPassword($user, $password));

        $userProfile = new UserProfile();
        $user->setUserProfile($userProfile);
        $userProfile->setCreateTime(new DateTimeImmutable());
        $userProfile->setUpdateTime(new DateTime());

        $em->persist($user);
        $em->flush();

        return new JsonResponse(['message' => 'User registered successfully'], 201);
    }

    #[Route('/loginCreddentials', name: 'app_login_credentials', methods: ['POST'])]
    public function loginCreddentials(): JsonResponse
    {
        // Symfony déclenchera automatiquement le SecurityControllerAuthenticator sur cette route.
        return new JsonResponse(['message' => 'You should never see this!'], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
