<?php

namespace App\Entity;

use App\Repository\FavoriteHotelRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: FavoriteHotelRepository::class)]
class FavoriteHotel
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['favoriteHotel:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['favoriteHotel:read'])]
    private ?string $name = null;

    #[ORM\ManyToOne(inversedBy: 'favoriteHotels')]
    #[ORM\JoinColumn(nullable: false)]
    private ?UserProfile $userProfile_id = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getUserProfileId(): ?UserProfile
    {
        return $this->userProfile_id;
    }

    public function setUserProfileId(?UserProfile $userProfile_id): static
    {
        $this->userProfile_id = $userProfile_id;

        return $this;
    }
}
