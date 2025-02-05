<?php

namespace App\Repository;

use App\Entity\AuthorizedExpeditor;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AuthorizedExpeditor>
 */
class AuthorizedExpeditorRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AuthorizedExpeditor::class);
    }

    public function save(AuthorizedExpeditor $authorizedExpeditor, ?bool $isSaved): void
    {
        if ($isSaved) {
            $this->getEntityManager()->persist($authorizedExpeditor);
            $this->getEntityManager()->flush();
        }
    }

    public function remove(AuthorizedExpeditor $expeditor, bool $flush = true): void
    {
        $entityManager = $this->getEntityManager(); // Utilisation correcte de l'EntityManager
        $entityManager->remove($expeditor);

        if ($flush) {
            $entityManager->flush();
        }
    }
    //    /**
    //     * @return AuthorizedExpeditor[] Returns an array of AuthorizedExpeditor objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('a')
    //            ->andWhere('a.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('a.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?AuthorizedExpeditor
    //    {
    //        return $this->createQueryBuilder('a')
    //            ->andWhere('a.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
