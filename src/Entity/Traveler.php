<?php

namespace App\Entity;

use App\Repository\TravelerRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TravelerRepository::class)]
class Traveler
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $surname = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $birthdate = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $gender = null;
    
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $secondName = null;

    #[ORM\Column(nullable: true)]
    private ?int $phone = null;
    
    #[ORM\Column(nullable: true)]
    private ?int $DHS = null;

    #[ORM\Column(nullable: true)]
    private ?int $KTN = null;

    #[ORM\ManyToOne(inversedBy: 'travelers')]
    #[ORM\JoinColumn(nullable: false)]
    private ?UserProfile $userProfile_id = null;

    /**
     * @var Collection<int, FidelityProgram>
     */
    #[ORM\OneToMany(targetEntity: FidelityProgram::class, mappedBy: 'traveler_id', orphanRemoval: true)]
    private Collection $fidelityPrograms;

    public function __construct()
    {
        $this->fidelityPrograms = new ArrayCollection();
    }

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

    public function getSurname(): ?string
    {
        return $this->surname;
    }

    public function setSurname(?string $surname): static
    {
        $this->surname = $surname;

        return $this;
    }

    public function getBirthdate(): ?\DateTimeInterface
    {
        return $this->birthdate;
    }

    public function setBirthdate(?\DateTimeInterface $birthdate): static
    {
        $this->birthdate = $birthdate;

        return $this;
    }

    public function getGender(): ?string
    {
        return $this->gender;
    }

    public function setGender(?string $gender): static
    {
        $this->gender = $gender;

        return $this;
    }

    public function getPhone(): ?int
    {
        return $this->phone;
    }

    public function setPhone(int $phone): static
    {
        $this->phone = $phone;

        return $this;
    }

    public function getSecondName(): ?string
    {
        return $this->secondName;
    }

    public function setSecondName(?string $secondName): static
    {
        $this->secondName = $secondName;

        return $this;
    }

    public function getDHS(): ?int
    {
        return $this->DHS;
    }

    public function setDHS(?int $DHS): static
    {
        $this->DHS = $DHS;

        return $this;
    }

    public function getKTN(): ?int
    {
        return $this->KTN;
    }

    public function setKTN(?int $KTN): static
    {
        $this->KTN = $KTN;

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

    /**
     * @return Collection<int, FidelityProgram>
     */
    public function getFidelityPrograms(): Collection
    {
        return $this->fidelityPrograms;
    }

    public function addFidelityProgram(FidelityProgram $fidelityProgram): static
    {
        if (!$this->fidelityPrograms->contains($fidelityProgram)) {
            $this->fidelityPrograms->add($fidelityProgram);
            $fidelityProgram->setTravelerId($this);
        }

        return $this;
    }

    public function removeFidelityProgram(FidelityProgram $fidelityProgram): static
    {
        if ($this->fidelityPrograms->removeElement($fidelityProgram)) {
            // set the owning side to null (unless already changed)
            if ($fidelityProgram->getTravelerId() === $this) {
                $fidelityProgram->setTravelerId(null);
            }
        }

        return $this;
    }
}
