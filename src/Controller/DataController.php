<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class DataController extends AbstractController
{
    #[Route('/insert-user-data', name: 'insert_user_data', methods: ['POST'])]
    public function insertData(Request $request, UserRepository $userRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data['email'] || !$data['password']) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Email and password are required.'
            ], 400);
        }

        // Check if email already exists
        if ($userRepository->findOneBy(['email' => $data['email']])) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Email already exists.'
            ], 400);
        }

        // Save the new user
        $user = new User();
        $user->setEmail($data['email']);
        $user->setPassword($data['password']);
        $userRepository->save($user);

        return new JsonResponse([
            'status' => 'success',
            'message' => 'User successfully added.'
        ], 201);
    }

    #[Route('/userlist', name: 'api_user_list', methods: ['GET'])]
    public function displayAllUsers(UserRepository $userRepository): JsonResponse
    {
        // Récupération de données BDD
        $users = $userRepository->findAll();

        // Prépare les données des utilisateurs à renvoyer
        $userData = array_map(function ($user) { 
            return [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'password' => $user->getPassword(),
            ];
        }, $users); 

        // Retourne les données sous format JSON
        return new JsonResponse($userData);
    }
}
