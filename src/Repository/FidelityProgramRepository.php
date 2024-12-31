<?php
// Fidélity
namespace App\Repository;

use App\Entity\FidelityProgram;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<FidelityProgram>
 */
class FidelityProgramRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FidelityProgram::class);
    }

    /**
     * Trouver tous les programmes de fidélité (optionnel, exemple de méthode personnalisée)
     * @return FidelityProgram[] Retourne un tableau de FidelityProgram
     */
    public function findAllFidelityPrograms(): array
    {
        return $this->createQueryBuilder('f')
            ->orderBy('f.id', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouver un programme de fidélité par son identifiant
     * @param int $id L'identifiant du programme de fidélité
     * @return FidelityProgram|null Un programme de fidélité ou null si non trouvé
     */
    public function findOneById(int $id): ?FidelityProgram
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }

    // Vous pouvez décommenter et personnaliser ces méthodes si nécessaire

    // /**
    //  * @return FidelityProgram[] Retourne un tableau de FidelityProgram
    //  */
    // public function findByExampleField($value): array
    // {
    //     return $this->createQueryBuilder('f')
    //         ->andWhere('f.exampleField = :val')
    //         ->setParameter('val', $value)
    //         ->orderBy('f.id', 'ASC')
    //         ->setMaxResults(10)
    //         ->getQuery()
    //         ->getResult()
    //     ;
    // }

    // public function findOneBySomeField($value): ?FidelityProgram
    // {
    //     return $this->createQueryBuilder('f')
    //         ->andWhere('f.exampleField = :val')
    //         ->setParameter('val', $value)
    //         ->getQuery()
    //         ->getOneOrNullResult()
    //     ;
    // }
}
