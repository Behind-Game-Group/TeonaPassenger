<?php

namespace App\Controller;

use App\Entity\Auth0Connection;
use App\Entity\User;
use App\Entity\UserProfile;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;

class Auth0Controller extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private SerializerInterface $serializer;
    private TokenStorageInterface $tokenStorage;

    public function __construct(EntityManagerInterface $entityManager, TokenStorageInterface $tokenStorage, SerializerInterface $serializer)
    {
        $this->entityManager = $entityManager;
        $this->tokenStorage = $tokenStorage;
        $this->serializer = $serializer;
    }

    #[Route('/auth0/callback', name: 'auth0_callback', methods: ['POST'])]
    public function callback(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['sub'], $data['email'])) {
            return new JsonResponse(['error' => 'Invalid or missing data'], 400);
        }

        $this->entityManager->beginTransaction();

        try {
            // Recherche de la connexion Auth0
            $auth0Connection = $this->entityManager->getRepository(Auth0Connection::class)
                ->findOneBy(['auth0_id' => $data['sub']]);

            // Récupération ou création de l'utilisateur
            if ($auth0Connection) {
                $user = $auth0Connection->getUser();
            } else {
                $user = $this->entityManager->getRepository(User::class)
                    ->findOneBy(['email' => $data['email']]);

                if (!$user) {
                    $user = (new User())
                        ->setEmail($data['email'])
                        ->setRoles(['ROLE_USER'])
                        ->setCreatedAt(new \DateTimeImmutable())
                        ->setUpdatedAt(new \DateTimeImmutable());

                    $userProfile = (new UserProfile())
                        ->setUserId($user)
                        ->setFirstname($data['given_name'] ?? null)
                        ->setLastname($data['family_name'] ?? null)
                        ->setUsername($data['nickname'] ?? null)
                        ->setAvatar($data['picture'] ?? null)
                        ->setCreateTime(new \DateTimeImmutable());

                    $this->entityManager->persist($user);
                    $this->entityManager->persist($userProfile);
                }

                $auth0Connection = (new Auth0Connection())
                    ->setUser($user)
                    ->setAuth0Id($data['sub'])
                    ->setPicture($data['picture'] ?? null)
                    ->setEmailVerified((bool) ($data['email_verified'] ?? false));

                $this->entityManager->persist($auth0Connection);
            }

            // Sauvegarde des changements
            $this->entityManager->flush();
            $this->entityManager->commit();

            // Authentification manuelle de l'utilisateur
            $token = new UsernamePasswordToken($user, 'main', $user->getRoles());
            $this->tokenStorage->setToken($token);
            $request->getSession()->set('_security_main', serialize($token));

            return new JsonResponse([
                'status' => 'success',
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'roles' => $user->getRoles(),
                    'username' => $user->getUsername(),
                    'profile' => [
                        'firstname' => $user->getUserProfile()?->getFirstname(),
                        'lastname' => $user->getUserProfile()?->getLastname(),
                        'avatar' => $user->getUserProfile()?->getAvatar(),
                    ],
                    'auth0' => [
                        'picture' => $auth0Connection->getPicture(),
                        'email_verified' => $auth0Connection->getEmailVerified(),
                    ]
                ]
            ]);
        } catch (\Doctrine\DBAL\Exception\UniqueConstraintViolationException $e) {
            $this->entityManager->rollback();
            return new JsonResponse(['error' => 'Duplicate entry: ' . $e->getMessage()], 400);
        } catch (\Exception $e) {
            $this->entityManager->rollback();
            return new JsonResponse([
                'error' => 'An unexpected error occurred',
                'details' => $e->getMessage()
            ], 500);
        }
    }


    #[Route('/auth0/user', name: 'auth0_user', methods: ['GET'])]
    public function getAuth0User(): JsonResponse
    {
        $user = $this->getUser();

        $currentUser = $this->entityManager->getRepository(User::class)->findOneBy([$user]);

        if (!$currentUser) {
            return new JsonResponse(['error' => 'Not authenticated'], 401);
        }

        $data = $this->serializer->serialize(
            $user,
            'json',
            ['groups' => ['user:read']]
        );

        $userDataJson = json_decode($data, true);

        return new JsonResponse([
            'user' => $userDataJson
        ], 200);
    }
}
