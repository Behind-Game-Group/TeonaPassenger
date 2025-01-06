<?php
// userprofile
namespace App\Repository;

use App\Entity\UserProfile;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @extends ServiceEntityRepository<UserProfile>
 */
class UserProfileRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserProfile::class);
    }

    /**
     * Mise à jour d'un profil utilisateur.
     *
     * @param UserProfile $userProfile
     * @param array $newData
     * @return UserProfile
     */
    public function updateUserProfile(UserProfile $userProfile, array $newData): UserProfile
    {
        // Met à jour chaque champ si les nouvelles données sont présentes
        if (isset($newData['name'])) {
            $userProfile->setName($newData['name']);
        }
        if (isset($newData['surname'])) {
            $userProfile->setSurname($newData['surname']);
        }
        if (isset($newData['username'])) {
            $userProfile->setUsername($newData['username']);
        }
        if (isset($newData['avatar'])) {
            $userProfile->setAvatar($newData['avatar']);
        }
        if (isset($newData['site'])) {
            $userProfile->setSite($newData['site']);
        }
        if (isset($newData['local_airport'])) {
            $userProfile->setLocalAirport($newData['local_airport']);
        }
        
        // Mise à jour des timestamps (si nécessaires)
        $userProfile->setUpdateTime(new \DateTime());

        // Persiste et sauvegarde les changements
        $this->_em->flush();

        return $userProfile;
    }
}
