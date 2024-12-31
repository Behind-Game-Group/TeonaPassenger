<?php

namespace App\Repository;

use App\Entity\Airport;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Airport>
 */
class AirportRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Airport::class);
    }

    /**
     * Trouver tous les aéroports associés à un profil utilisateur
     * @param int $userProfileId L'identifiant du profil utilisateur
     * @return Airport[] Retourne un tableau d'aéroports associés à ce profil
     */
    public function findByUserProfile(int $userProfileId): array
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.userProfile = :userProfileId')
            ->setParameter('userProfileId', $userProfileId)
            ->orderBy('a.name', 'ASC') // Tri par nom d'aéroport, vous pouvez ajuster selon les besoins
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouver un aéroport par son nom
     * @param string $name Le nom de l'aéroport
     * @return Airport|null Retourne un aéroport si trouvé, ou null si non trouvé
     */
    public function findOneByName(string $name): ?Airport
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.name = :name')
            ->setParameter('name', $name)
            ->getQuery()
            ->getOneOrNullResult();
    }

}
