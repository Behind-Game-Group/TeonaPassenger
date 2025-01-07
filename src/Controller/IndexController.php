<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

class IndexController extends AbstractController
{
    #[Route('/', name: 'app_index')]
    public function index(): Response
    {
        return $this->render('index/index.html.twig', [
            'sitename' => 'Teona Passenger',
        ]);
    }

    #[Route('/profil', name: 'app_profil')]
    public function profil(): Response
    {
        return $this->render('index/index.html.twig', [
            'sitename' => 'Teona Passenger',
        ]);
    }

    #[Route('/userprofil', name: 'app_userprofil')]
    public function userProfil(): Response
    {
        return $this->render('index/index.html.twig', [
            'sitename' => 'Teona Passenger',
        ]);
    }

    #[Route('/favorite', name: 'app_favorite')]
    public function favorite(): Response
    {
        return $this->render('index/index.html.twig', [
            'sitename' => 'Teona Passenger',
        ]);
    }

    #[Route('/vols/page', name: 'app_vols')]
    public function vols(): Response
    {
        return $this->render('index/index.html.twig', [
            'sitename' => 'Teona Passenger',
        ]);
    }

    #[Route('/sharedtrips', name: 'app_shared_trips', methods: ['GET'])]
    public function sharedTrips(): Response
    {
        return $this->render('index/index.html.twig', [
            'sitename' => 'Teona Passenger',
        ]);
    }

    #[Route('/trips', name: 'app_trips', methods: ['GET'])]
    public function trips(): Response
    {
        return $this->render('index/index.html.twig', [
            'sitename' => 'Teona Passenger',
        ]);
    }

    #[Route('/getCurrentUser', name: 'app_get_current_user')]
    public function getCurrentUser(CsrfTokenManagerInterface $csrfTokenManager): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json([
                'success' => false,
                'message' => 'User not authenticated',
            ], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $csrfToken = $csrfTokenManager->getToken('default')->getValue();
        return $this->json([
            'success' => true,
            'user' => [
                'csrfToken' => $csrfToken,
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),
            ],
        ]);
    }

    #[Route('/resultat', name: 'app_resultats')]
    public function resultat(): Response
    {
        return $this->render('resultat/resultat.html.twig', [
            'test' => 'test',
        ]);
    }

    #[Route('/hebergement', name: 'app_hebergement')]
    public function hebergement(): Response
    {
        return $this->render('hebergement/hebergement.html.twig');
    }

    #[Route('/profil/parametres', name: 'app_parametres')]
    public function parametres(): Response
    {
        return $this->render('profil/parametres.html.twig');
    }

    #[Route('/profil/preferences', name: 'app_preferences')]
    public function preferences(): Response
    {
        return $this->render('profil/preferences.html.twig');
    }

    #[Route('/profil/voyageurs', name: 'app_voyageurs')]
    public function voyageurs(): Response
    {
        return $this->render('profil/voyageurs.html.twig');
    }

    #[Route('/profil/ajoutervoyageur', name: 'app_ajoutervoyageur')]
    public function ajouterVoyageur(): Response
    {
        return $this->render('profil/ajoutervoyageur.html.twig');
    }
}
