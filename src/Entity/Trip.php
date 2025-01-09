<?php

namespace App\Entity;

use App\Repository\TripRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: TripRepository::class)]
class Trip
{
    #[Groups('trip:read')]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups('trip:read')]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $destination = null;

    #[Groups('trip:read')]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $name = null;

    #[Groups('trip:read')]
    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $departureDate = null;

    #[Groups('trip:read')]
    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $arrivalDate = null;

    #[Groups('trip:read')]
    #[ORM\Column(length: 255, nullable: true)]
    private ?bool $consultation = null;

    #[ORM\ManyToOne(inversedBy: 'trips')]
    #[ORM\JoinColumn(nullable: false)]
    private ?UserProfile $userProfile_id = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDestination(): ?string
    {
        return $this->destination;
    }

    public function setDestination(?string $destination): static
    {
        $this->destination = $destination;

        return $this;
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

    public function getDepartureDate(): ?\DateTimeInterface
    {
        return $this->departureDate;
    }

    public function setDepartureDate(?\DateTimeInterface $departureDate): static
    {
        $this->departureDate = $departureDate;

        return $this;
    }

    public function getArrivalDate(): ?\DateTimeInterface
    {
        return $this->arrivalDate;
    }

    public function setArrivalDate(?\DateTimeInterface $arrivalDate): static
    {
        $this->arrivalDate = $arrivalDate;

        return $this;
    }

    public function getConsultation(): ?bool
    {
        return $this->consultation;
    }

    public function setConsultation(?bool $consultation): static
    {
        $this->consultation = $consultation;

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
