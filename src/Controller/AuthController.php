<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Core\Validator\Constraints\UserPassword;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class AuthController extends AbstractController
{
    private UserPasswordHasherInterface $passwordHasher;
    private UserRepository $userRepository;

    public function __construct(UserPasswordHasherInterface $passwordHasher, UserRepository $userRepository)
    {
        $this->passwordHasher = $passwordHasher;
        $this->userRepository = $userRepository;
    }

    #[Route('register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        // Décoder les données JSON
        $data = json_decode($request->getContent(), true);

        $email = $data['email'];
        $password = $data['password'];

        // Vérifier si les données sont valides
        if ($data === null || !isset($email) || !isset($password)) {
            return new JsonResponse(['error' => 'Invalid data. Please provide email and password.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = new User();
        $user->setEmail($email);
        $user->setRoles(['ROLE_USER']);
        $user->setPassword($this->passwordHasher->hashPassword($user, $password));

        $this->userRepository->save($user, true);

        return new JsonResponse(['message' => 'User created'], 201);
    }

    #[Route('login_check', methods: ['POST'])]
    public function loginCheck(Request $request, UserRepository $userRepository, TokenStorageInterface $tokenStorage, UserPasswordHasherInterface $passwordHasher)
    {
        // Récupérer l'email et le mot de passe envoyés par React
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        // Si l'un des champs est manquant, renvoyer une erreur
        if (!$email || !$password) {
            return new JsonResponse(['message' => 'Email et mot de passe sont requis'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Si les informations sont valides, on authentifie l'utilisateur
        $user = $userRepository->findOneBy(['email' => $email]);

        if (!$user) {
            return new JsonResponse(['message' => 'Utilisateur non trouvé'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        // Vérification du mot de passe
        if (!$passwordHasher->isPasswordValid($user, $password)) {
            return new JsonResponse(['message' => 'Mot de passe invalide'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        // Authentification réussie, créer un token pour l'utilisateur
        $token = new UsernamePasswordToken($user, $password, ["main"], $user->getRoles());
        $tokenStorage->setToken($token);

        // Renvoyer une réponse JSON avec un message de succès
        return new JsonResponse(['message' => 'Connexion réussie'], JsonResponse::HTTP_OK);
    }

    #[Route('logout', methods: ['POST'])]
    public function logout() {}
}
