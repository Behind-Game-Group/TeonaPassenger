<?php
// Fidélity
namespace App\Controller;

use App\Entity\FidelityProgram;
use App\Repository\FidelityProgramRepository;
use App\Repository\TravelerRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Routing\Annotation\Route;

class FidelityProgramController extends AbstractController
{
    private FidelityProgramRepository $fidelityProgramRepository;
    private TravelerRepository $travelerRepository;
    private EntityManagerInterface $entityManager;

    public function __construct(
        FidelityProgramRepository $fidelityProgramRepository,
        TravelerRepository $travelerRepository,
        EntityManagerInterface $entityManager
    ) {
        $this->fidelityProgramRepository = $fidelityProgramRepository;
        $this->travelerRepository = $travelerRepository;
        $this->entityManager = $entityManager;
    }

    #[Route('/fidelity_program', name: 'fidelity_program_index', methods: ['GET'])]
    public function index(): Response
    {
        // Récupérer tous les programmes de fidélité
        $fidelityPrograms = $this->fidelityProgramRepository->findAll();

        return $this->json([
            'fidelityPrograms' => $fidelityPrograms,
        ]);
    }

    #[Route('/fidelity_program/new', name: 'fidelity_program_new', methods: ['POST'])]
    public function new(Request $request): Response
    {
        // Extraction des données du corps de la requête (en JSON par exemple)
        $data = json_decode($request->getContent(), true);

        // Création d'un nouveau programme de fidélité
        $fidelityProgram = new FidelityProgram();
        $fidelityProgram->setName($data['name'] ?? null);
        $fidelityProgram->setProgramNumber($data['programNumber'] ?? null);

        // Associer un Traveler (par exemple, l'utilisateur actuellement connecté)
        // Récupération du Traveler, ici un exemple statique avec l'ID 1
        $traveler = $this->travelerRepository->find(1); // Remplacez cela par un moyen plus dynamique
        if (!$traveler) {
            throw new AccessDeniedException('Traveler not found');
        }

        $fidelityProgram->setTravelerId($traveler);

        // Persist l'entité
        $this->entityManager->persist($fidelityProgram);
        $this->entityManager->flush();

        return $this->json([
            'message' => 'Program created successfully!',
            'fidelityProgram' => $fidelityProgram,
        ], Response::HTTP_CREATED);
    }

    #[Route('/fidelity_program/{id}', name: 'fidelity_program_show', methods: ['GET'])]
    public function show(int $id): Response
    {
        // Recherche d'un programme de fidélité par son ID
        $fidelityProgram = $this->fidelityProgramRepository->find($id);

        if (!$fidelityProgram) {
            return $this->json(['message' => 'Program not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($fidelityProgram);
    }

    #[Route('/fidelity_program/{id}/edit', name: 'fidelity_program_edit', methods: ['PUT'])]
    public function edit(int $id, Request $request): Response
    {
        // Recherche du programme de fidélité à modifier
        $fidelityProgram = $this->fidelityProgramRepository->find($id);

        if (!$fidelityProgram) {
            return $this->json(['message' => 'Program not found'], Response::HTTP_NOT_FOUND);
        }

        // Extraction des données de la requête pour la mise à jour
        $data = json_decode($request->getContent(), true);

        // Mise à jour des informations
        $fidelityProgram->setName($data['name'] ?? $fidelityProgram->getName());
        $fidelityProgram->setProgramNumber($data['programNumber'] ?? $fidelityProgram->getProgramNumber());

        // Enregistrement de l'entité modifiée
        $this->entityManager->flush();

        return $this->json([
            'message' => 'Program updated successfully!',
            'fidelityProgram' => $fidelityProgram,
        ]);
    }

    #[Route('/fidelity_program/{id}/delete', name: 'fidelity_program_delete', methods: ['DELETE'])]
    public function delete(int $id): Response
    {
        // Recherche du programme à supprimer
        $fidelityProgram = $this->fidelityProgramRepository->find($id);

        if (!$fidelityProgram) {
            return $this->json(['message' => 'Program not found'], Response::HTTP_NOT_FOUND);
        }

        // Suppression du programme
        $this->entityManager->remove($fidelityProgram);
        $this->entityManager->flush();

        return $this->json(['message' => 'Program deleted successfully!']);
    }
}
