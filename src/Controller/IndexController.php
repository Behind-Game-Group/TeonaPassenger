<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
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

    #[Route('/profil', name: 'profil', methods: ['GET'])]
    public function profil():Response
    {
        return $this->render('index/index.html.twig', [
            'sitename' => 'Teona Passenger',
        ]);
    }

}
