<?php
// Voyageur
namespace App\Controller;

use App\Entity\Traveler;
use App\Repository\TravelerRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class TravelerController extends AbstractController
{
    private TravelerRepository $travelerRepository;
    private EntityManagerInterface $entityManager;

    public function __construct(TravelerRepository $travelerRepository, EntityManagerInterface $entityManager)
    {
        $this->travelerRepository = $travelerRepository;
        $this->entityManager = $entityManager;
    }

    #[Route('/travelers', name: 'traveler_index', methods: ['GET'])]
    public function index(): Response
    {
        // Récupérer tous les voyageurs
        $travelers = $this->travelerRepository->findAll();

        return $this->json([
            'status' => 'success',
            'data' => $travelers,
        ]);
    }

    #[Route('/traveler/{id}', name: 'traveler_show', methods: ['GET'])]
    public function show(int $id): Response
    {
        // Recherche d'un voyageur par son ID
        $traveler = $this->travelerRepository->find($id);

        if (!$traveler) {
            return $this->json([
                'status' => 'error',
                'message' => 'Traveler not found',
            ], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'status' => 'success',
            'data' => $traveler,
        ]);
    }

    #[Route('/traveler/new', name: 'traveler_new', methods: ['POST'])]
    public function new(Request $request): Response
    {
        // Extraction des données de la requête JSON
        $data = json_decode($request->getContent(), true);

        // Création du nouveau voyageur
        $traveler = new Traveler();
        $traveler->setName($data['name'] ?? null);
        $traveler->setSurname($data['surname'] ?? null);
        $traveler->setBirthdate(new \DateTime($data['birthdate'] ?? 'now'));
        $traveler->setGender($data['gender'] ?? null);
        $traveler->setSecondName($data['secondName'] ?? null);
        $traveler->setPhone($data['phone'] ?? null);
        $traveler->setDHS($data['DHS'] ?? null);
        $traveler->setKTN($data['KTN'] ?? null);

        // Association avec le profil utilisateur actuel
        $userProfile = $this->getUser()->getUserProfile();  // Assuming you have a method to get the current UserProfile
        $traveler->setUserProfileId($userProfile);

        // Persist l'entité
        $this->entityManager->persist($traveler);
        $this->entityManager->flush();

        return $this->json([
            'status' => 'success',
            'message' => 'Traveler created successfully!',
            'data' => $traveler,
        ], Response::HTTP_CREATED);
    }

    #[Route('/traveler/{id}/edit', name: 'traveler_edit', methods: ['PUT'])]
    public function edit(int $id, Request $request): Response
    {
        // Recherche du voyageur à modifier
        $traveler = $this->travelerRepository->find($id);

        if (!$traveler) {
            return $this->json([
                'status' => 'error',
                'message' => 'Traveler not found',
            ], Response::HTTP_NOT_FOUND);
        }

        // Extraction des données de la requête pour la mise à jour
        $data = json_decode($request->getContent(), true);

        // Mise à jour des informations du voyageur
        $traveler->setName($data['name'] ?? $traveler->getName());
        $traveler->setSurname($data['surname'] ?? $traveler->getSurname());
        $traveler->setBirthdate(new \DateTime($data['birthdate'] ?? $traveler->getBirthdate()->format('Y-m-d')));
        $traveler->setGender($data['gender'] ?? $traveler->getGender());
        $traveler->setSecondName($data['secondName'] ?? $traveler->getSecondName());
        $traveler->setPhone($data['phone'] ?? $traveler->getPhone());
        $traveler->setDHS($data['DHS'] ?? $traveler->getDHS());
        $traveler->setKTN($data['KTN'] ?? $traveler->getKTN());

        // Persist la mise à jour
        $this->entityManager->flush();

        return $this->json([
            'status' => 'success',
            'message' => 'Traveler updated successfully!',
            'data' => $traveler,
        ]);
    }

    #[Route('/traveler/{id}/delete', name: 'traveler_delete', methods: ['DELETE'])]
    public function delete(int $id): Response
    {
        // Recherche du voyageur à supprimer
        $traveler = $this->travelerRepository->find($id);

        if (!$traveler) {
            return $this->json([
                'status' => 'error',
                'message' => 'Traveler not found',
            ], Response::HTTP_NOT_FOUND);
        }

        // Suppression du voyageur
        $this->entityManager->remove($traveler);
        $this->entityManager->flush();

        return $this->json([
            'status' => 'success',
            'message' => 'Traveler deleted successfully!',
        ]);
    }
}
