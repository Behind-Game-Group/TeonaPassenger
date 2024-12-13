<?php

namespace App\API;

use App\Entity\Test;
use App\Entity\User;
use App\Repository\TestRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Validator\Constraints as Assert;

class ProfilController extends AbstractController
{
    #[Route('/api/register', name: 'app_register', methods: ['POST'])]
public function register(
    Request $request,
    UserRepository $userRepository,
    UserPasswordHasherInterface $passwordHasher,
    ValidatorInterface $validator
): JsonResponse {
    $data = json_decode($request->getContent(), true);

    // Valider les données
    $constraints = new Assert\Collection([
        'email' => [new Assert\NotBlank(), new Assert\Email()],
        'password' => [new Assert\NotBlank(), new Assert\Length(['min' => 8])]
    ]);

    $violations = $validator->validate($data, $constraints);

    if (count($violations) > 0) {
        $errors = [];
        foreach ($violations as $violation) {
            $errors[] = $violation->getMessage();
        }

        return new JsonResponse(['errors' => $errors], Response::HTTP_BAD_REQUEST);
    }

    // Vérifier si l'utilisateur existe déjà
    $existingUser = $userRepository->findOneBy(['email' => $data['email']]);
    if ($existingUser) {
        return new JsonResponse(['error' => 'User already exists'], Response::HTTP_CONFLICT);
    }

    // Créer un nouvel utilisateur
    $user = new User();
    $user->setEmail($data['email']);
    $user->getRoles();
    $user->setPassword($passwordHasher->hashPassword($user, $data['password']));

    // Sauvegarder l'utilisateur en base de données
    $userRepository->save($user, true);

    // Retourner une réponse de succès
    return new JsonResponse(['message' => 'User registered successfully'], Response::HTTP_CREATED);
    }

    #[Route('/api/test', name: 'app_register')]
    public function test(
        Request $request,
        TestRepository $userRepository,
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Validation des données (email et mot de passe)
        if (empty($data['email'])) {
            return new JsonResponse(['error' => 'Email and password are required'], Response::HTTP_BAD_REQUEST);
        }

        // Vérifier si l'utilisateur existe déjà
        $existingUser = $userRepository->findOneBy(['email' => $data['email']]);
        if ($existingUser) {
            return new JsonResponse(['error' => 'User already exists'], Response::HTTP_CONFLICT);
        }

        // Créer un nouvel utilisateur
        $user = new Test();
        $user->setEmail($data['email']);

        // Sauvegarder l'utilisateur en base de données
        $userRepository->save($user, true);

        // Retourner une réponse de succès
        return new JsonResponse(['message' => 'User registered successfully'], Response::HTTP_CREATED);
    }

    #[Route('/api/profil', name: 'app_api', methods: ['GET'])]
    public function apiAction()
    {
        $data = ['message' => 'Success'];
        return new JsonResponse($data);
    }
}
