<?php

namespace App\Security;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use App\Security\SecurityControllerAuthenticator;
use Symfony\Component\HttpFoundation\RedirectResponse;

class AuthController extends AbstractController
{
    private UserPasswordHasherInterface $passwordHasher;
    private UserRepository $userRepository;

    public function __construct(UserPasswordHasherInterface $passwordHasher, UserRepository $userRepository)
    {
        $this->passwordHasher = $passwordHasher;
        $this->userRepository = $userRepository;
    }

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

    public function loginCheck()
    {
        // Renvoyer une réponse JSON avec un message de succès
        return new RedirectResponse('/profil');
    }

    #[Route('/logout', name: 'app_logout')]
    public function logout(Request $request)
    {
        return $this->redirect('/');
    }
}
