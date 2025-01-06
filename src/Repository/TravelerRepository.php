<?php
// Voyageur
namespace App\Repository;

use App\Entity\Traveler;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\QueryBuilder;

/**
 * @extends ServiceEntityRepository<Traveler>
 */
class TravelerRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Traveler::class);
    }

    /**
     * Trouver tous les voyageurs associés à un profil utilisateur
     * @param int $userProfileId
     * @return Traveler[] Retourne un tableau de voyageurs
     */
    public function findByUserProfile(int $userProfileId): array
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.userProfile = :userProfileId')
            ->setParameter('userProfileId', $userProfileId)
            ->orderBy('t.name', 'ASC') // Tri par nom, mais tu peux ajuster
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouver un voyageur par son nom complet
     * @param string $name
     * @param string|null $surname
     * @return Traveler[] Retourne un tableau de voyageurs qui correspondent
     */
    public function findByFullName(string $name, ?string $surname = null): array
    {
        $qb = $this->createQueryBuilder('t')
            ->andWhere('t.name = :name')
            ->setParameter('name', $name);

        if ($surname) {
            $qb->andWhere('t.surname = :surname')
                ->setParameter('surname', $surname);
        }

        return $qb->getQuery()->getResult();
    }

    /**
     * Trouver tous les voyageurs dont la date de naissance est avant une certaine date
     * @param \DateTimeInterface $date
     * @return Traveler[] Retourne les voyageurs dont la date de naissance est antérieure à $date
     */
    public function findTravelersBornBefore(\DateTimeInterface $date): array
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.birthdate < :date')
            ->setParameter('date', $date)
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouver un voyageur par téléphone
     * @param string $phone
     * @return Traveler|null Retourne un voyageur ou null s'il n'est pas trouvé
     */
    public function findByPhone(string $phone): ?Traveler
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.phone = :phone')
            ->setParameter('phone', $phone)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
