<?php 

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\UserRepository;

class APIController extends AbstractController
{
    #[Route('/api/users', name: 'api_users', methods: ['GET'])]
    public function getUsers(UserRepository $userRepository): JsonResponse
    {
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
