<?php

namespace App\Controller;

use App\Repository\UserProfileRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class IndexController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(): Response
    {
        return $this->render('index/index.html.twig', [
            'sitename' => 'Teona Passenger',
        ]);
    }

// Ajouter la route
    #[Route('/profile', name: 'app_profile')]
    public function profile(): Response
    {
        // Simuler des données de profil utilisateur
        $userProfile = [
            'id' => 1,
            'name' => 'John',
            'surname' => 'Doe',
            'username' => 'johndoe',
            'avatar' => '/images/avatar.jpg',
            'site' => 'France',
            'local_airport' => 'JFK',
        ];
    
        return $this->json($userProfile);
    }    



}
