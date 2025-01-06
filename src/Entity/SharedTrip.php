<?php

namespace App\Entity;

use App\Repository\SharedTripRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: SharedTripRepository::class)]
class SharedTrip
{
    #[Groups('sharedTrip:read')]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups('sharedTrip:read')]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $email = null;

    #[Groups('sharedTrip:read')]
    #[ORM\Column]
    private ?bool $isEditable = null;

    #[ORM\ManyToOne(inversedBy: 'sharedTrips')]
    #[ORM\JoinColumn(nullable: false)]
    private ?UserProfile $userProfile_id = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function isEditable(): ?bool
    {
        return $this->isEditable;
    }

    public function setIsEditable(bool $isEditable): static
    {
        $this->isEditable = $isEditable;

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
