<?php

namespace App\Repository;

use App\Entity\SharedTrip;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<SharedTrip>
 */
class SharedTripRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SharedTrip::class);
    }
    
    public function save(SharedTrip $sharedTrip, ?bool $isSaved): void
    {
        if($isSaved){
            $this->getEntityManager()->persist($sharedTrip);
            $this->getEntityManager()->flush();
        }
    }

    public function remove(SharedTrip $sharedTrip): void
    {
        $this->getEntityManager()->remove($sharedTrip);
        $this->getEntityManager()->flush();
    }
//    /**
//     * @return SharedTrip[] Returns an array of SharedTrip objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('s')
//            ->andWhere('s.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('s.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?SharedTrip
//    {
//        return $this->createQueryBuilder('s')
//            ->andWhere('s.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
