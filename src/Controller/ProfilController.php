<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

class ProfilController extends AbstractController
{
    //READ PROFIL
    public function readProfile(): JsonResponse
    {
        $userProfile = [
            'a' => 1,
            'b' => 'John',
            'c' => 'Doe',
            'd' => 'johndoe',
            'e' => '/images/avatar.jpg',
            'f' => 'France',
            'g' => 'JFK',
        ];
        return $this->json($userProfile);
    }
}