<?php
// Airport
namespace App\Controller;

use App\Entity\Airport;
use App\Repository\AirportRepository;
use App\Repository\UserProfileRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class AirportController extends AbstractController
{
    private AirportRepository $airportRepository;
    private UserProfileRepository $userProfileRepository;
    private EntityManagerInterface $entityManager;

    public function __construct(
        AirportRepository $airportRepository,
        UserProfileRepository $userProfileRepository,
        EntityManagerInterface $entityManager
    ) {
        $this->airportRepository = $airportRepository;
        $this->userProfileRepository = $userProfileRepository;
        $this->entityManager = $entityManager;
    }

    #[Route('/airport', name: 'airport_index', methods: ['GET'])]
    public function index(): Response
    {
        $airports = $this->airportRepository->findAll();

        return $this->json([
            'airports' => $airports,
        ]);
    }

    #[Route('/airport/{id}', name: 'airport_show', methods: ['GET'])]
    public function show(int $id): Response
    {
        $airport = $this->airportRepository->find($id);

        if (!$airport) {
            return $this->json(['message' => 'Airport not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($airport);
    }

    #[Route('/airport/new', name: 'airport_new', methods: ['POST'])]
    public function new(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);

        // Création d'un nouvel aéroport
        $airport = new Airport();
        $airport->setName($data['name'] ?? null);

        // Associer à un profil utilisateur
        $userProfileId = $data['userProfile_id'] ?? null;
        if ($userProfileId) {
            $userProfile = $this->userProfileRepository->find($userProfileId);

            if (!$userProfile) {
                throw new AccessDeniedException('UserProfile not found');
            }

            $airport->setUserProfileId($userProfile);
        }

        // Enregistrer l'aéroport
        $this->entityManager->persist($airport);
        $this->entityManager->flush();

        return $this->json([
            'message' => 'Airport created successfully!',
            'airport' => $airport,
        ], Response::HTTP_CREATED);
    }

    #[Route('/airport/{id}/edit', name: 'airport_edit', methods: ['PUT'])]
    public function edit(int $id, Request $request): Response
    {
        $airport = $this->airportRepository->find($id);

        if (!$airport) {
            return $this->json(['message' => 'Airport not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        // Mettre à jour les informations
        $airport->setName($data['name'] ?? $airport->getName());

        // Associer à un profil utilisateur si nécessaire
        $userProfileId = $data['userProfile_id'] ?? null;
        if ($userProfileId) {
            $userProfile = $this->userProfileRepository->find($userProfileId);

            if (!$userProfile) {
                throw new AccessDeniedException('UserProfile not found');
            }

            $airport->setUserProfileId($userProfile);
        }

        // Enregistrer les modifications
        $this->entityManager->flush();

        return $this->json([
            'message' => 'Airport updated successfully!',
            'airport' => $airport,
        ]);
    }

    #[Route('/airport/{id}/delete', name: 'airport_delete', methods: ['DELETE'])]
    public function delete(int $id): Response
    {
        $airport = $this->airportRepository->find($id);

        if (!$airport) {
            return $this->json(['message' => 'Airport not found'], Response::HTTP_NOT_FOUND);
        }

        // Supprimer l'aéroport
        $this->entityManager->remove($airport);
        $this->entityManager->flush();

        return $this->json(['message' => 'Airport deleted successfully!']);
    }
}
