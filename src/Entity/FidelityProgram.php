<?php

namespace App\Entity;

use App\Repository\FidelityProgramRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FidelityProgramRepository::class)]
class FidelityProgram
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $name = null;

    #[ORM\Column(nullable: true)]
    private ?int $programNumber = null;

    #[ORM\ManyToOne(inversedBy: 'fidelityPrograms')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Traveler $traveler_id = null;

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

    public function getProgramNumber(): ?int
    {
        return $this->programNumber;
    }

    public function setProgramNumber(?int $programNumber): static
    {
        $this->programNumber = $programNumber;

        return $this;
    }

    public function getTravelerId(): ?Traveler
    {
        return $this->traveler_id;
    }

    public function setTravelerId(?Traveler $traveler_id): static
    {
        $this->traveler_id = $traveler_id;

        return $this;
    }
}
