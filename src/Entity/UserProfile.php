<?php

namespace App\Entity;

use App\Repository\UserProfileRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserProfileRepository::class)]
class UserProfile
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $surname = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $username = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $avatar = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $site = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $local_airport = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $createTime = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $updateTime = null;

    #[ORM\OneToOne(inversedBy: 'userProfile', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user_id = null;

    /**
     * @var Collection<int, History>
     */
    #[ORM\OneToMany(targetEntity: History::class, mappedBy: 'userProfile_id', orphanRemoval: true)]
    private Collection $histories;

    /**
     * @var Collection<int, Airport>
     */
    #[ORM\OneToMany(targetEntity: Airport::class, mappedBy: 'userProfile_id', orphanRemoval: true)]
    private Collection $airports;

    /**
     * @var Collection<int, FavoriteHotel>
     */
    #[ORM\OneToMany(targetEntity: FavoriteHotel::class, mappedBy: 'userProfile_id', orphanRemoval: true)]
    private Collection $favoriteHotels;

    /**
     * @var Collection<int, DislikedHotel>
     */
    #[ORM\OneToMany(targetEntity: DislikedHotel::class, mappedBy: 'userProfile_id', orphanRemoval: true)]
    private Collection $dislikedHotels;

    /**
     * @var Collection<int, Company>
     */
    #[ORM\OneToMany(targetEntity: Company::class, mappedBy: 'userProfile_id', orphanRemoval: true)]
    private Collection $companies;

    /**
     * @var Collection<int, AuthorizedExpeditor>
     */
    #[ORM\OneToMany(targetEntity: AuthorizedExpeditor::class, mappedBy: 'userProfile_id', orphanRemoval: true)]
    private Collection $authorizedExpeditors;

    /**
     * @var Collection<int, SharedTrip>
     */
    #[ORM\OneToMany(targetEntity: SharedTrip::class, mappedBy: 'userProfile_id', orphanRemoval: true)]
    private Collection $sharedTrips;

    /**
     * @var Collection<int, Trip>
     */
    #[ORM\OneToMany(targetEntity: Trip::class, mappedBy: 'userProfile_id', orphanRemoval: true)]
    private Collection $trips;

    /**
     * @var Collection<int, FavoriteDestination>
     */
    #[ORM\OneToMany(targetEntity: FavoriteDestination::class, mappedBy: 'userProfile_id', orphanRemoval: true)]
    private Collection $favoriteDestinations;

    /**
     * @var Collection<int, Traveler>
     */
    #[ORM\OneToMany(targetEntity: Traveler::class, mappedBy: 'userProfile_id', orphanRemoval: true)]
    private Collection $travelers;

    public function __construct()
    {
        $this->histories = new ArrayCollection();
        $this->airports = new ArrayCollection();
        $this->favoriteHotels = new ArrayCollection();
        $this->dislikedHotels = new ArrayCollection();
        $this->companies = new ArrayCollection();
        $this->authorizedExpeditors = new ArrayCollection();
        $this->sharedTrips = new ArrayCollection();
        $this->trips = new ArrayCollection();
        $this->favoriteDestinations = new ArrayCollection();
        $this->travelers = new ArrayCollection();
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

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(?string $username): static
    {
        $this->username = $username;

        return $this;
    }

    public function getAvatar(): ?string
    {
        return $this->avatar;
    }

    public function setAvatar(?string $avatar): static
    {
        $this->avatar = $avatar;

        return $this;
    }

    public function getSite(): ?string
    {
        return $this->site;
    }

    public function setSite(?string $site): static
    {
        $this->site = $site;

        return $this;
    }

    public function getLocalAirport(): ?string
    {
        return $this->local_airport;
    }

    public function setLocalAirport(?string $local_airport): static
    {
        $this->local_airport = $local_airport;

        return $this;
    }

    public function getCreateTime(): ?\DateTimeImmutable
    {
        return $this->createTime;
    }

    public function setCreateTime(?\DateTimeImmutable $createTime): static
    {
        $this->createTime = $createTime;

        return $this;
    }

    public function getUpdateTime(): ?\DateTimeInterface
    {
        return $this->updateTime;
    }

    public function setUpdateTime(?\DateTimeInterface $updateTime): static
    {
        $this->updateTime = $updateTime;

        return $this;
    }

    public function getUserId(): ?User
    {
        return $this->user_id;
    }

    public function setUserId(User $user_id): static
    {
        $this->user_id = $user_id;

        return $this;
    }

    /**
     * @return Collection<int, History>
     */
    public function getHistories(): Collection
    {
        return $this->histories;
    }

    public function addHistory(History $history): static
    {
        if (!$this->histories->contains($history)) {
            $this->histories->add($history);
            $history->setUserProfileId($this);
        }

        return $this;
    }

    public function removeHistory(History $history): static
    {
        if ($this->histories->removeElement($history)) {
            // set the owning side to null (unless already changed)
            if ($history->getUserProfileId() === $this) {
                $history->setUserProfileId(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Airport>
     */
    public function getAirports(): Collection
    {
        return $this->airports;
    }

    public function addAirport(Airport $airport): static
    {
        if (!$this->airports->contains($airport)) {
            $this->airports->add($airport);
            $airport->setUserProfileId($this);
        }

        return $this;
    }

    public function removeAirport(Airport $airport): static
    {
        if ($this->airports->removeElement($airport)) {
            // set the owning side to null (unless already changed)
            if ($airport->getUserProfileId() === $this) {
                $airport->setUserProfileId(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, FavoriteHotel>
     */
    public function getFavoriteHotels(): Collection
    {
        return $this->favoriteHotels;
    }

    public function addFavoriteHotel(FavoriteHotel $favoriteHotel): static
    {
        if (!$this->favoriteHotels->contains($favoriteHotel)) {
            $this->favoriteHotels->add($favoriteHotel);
            $favoriteHotel->setUserProfileId($this);
        }

        return $this;
    }

    public function removeFavoriteHotel(FavoriteHotel $favoriteHotel): static
    {
        if ($this->favoriteHotels->removeElement($favoriteHotel)) {
            // set the owning side to null (unless already changed)
            if ($favoriteHotel->getUserProfileId() === $this) {
                $favoriteHotel->setUserProfileId(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, DislikedHotel>
     */
    public function getDislikedHotels(): Collection
    {
        return $this->dislikedHotels;
    }

    public function addDislikedHotel(DislikedHotel $dislikedHotel): static
    {
        if (!$this->dislikedHotels->contains($dislikedHotel)) {
            $this->dislikedHotels->add($dislikedHotel);
            $dislikedHotel->setUserProfileId($this);
        }

        return $this;
    }

    public function removeDislikedHotel(DislikedHotel $dislikedHotel): static
    {
        if ($this->dislikedHotels->removeElement($dislikedHotel)) {
            // set the owning side to null (unless already changed)
            if ($dislikedHotel->getUserProfileId() === $this) {
                $dislikedHotel->setUserProfileId(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Company>
     */
    public function getCompanies(): Collection
    {
        return $this->companies;
    }

    public function addCompany(Company $company): static
    {
        if (!$this->companies->contains($company)) {
            $this->companies->add($company);
            $company->setUserProfileId($this);
        }

        return $this;
    }

    public function removeCompany(Company $company): static
    {
        if ($this->companies->removeElement($company)) {
            // set the owning side to null (unless already changed)
            if ($company->getUserProfileId() === $this) {
                $company->setUserProfileId(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, AuthorizedExpeditor>
     */
    public function getAuthorizedExpeditors(): Collection
    {
        return $this->authorizedExpeditors;
    }

    public function addAuthorizedExpeditor(AuthorizedExpeditor $authorizedExpeditor): static
    {
        if (!$this->authorizedExpeditors->contains($authorizedExpeditor)) {
            $this->authorizedExpeditors->add($authorizedExpeditor);
            $authorizedExpeditor->setUserProfileId($this);
        }

        return $this;
    }

    public function removeAuthorizedExpeditor(AuthorizedExpeditor $authorizedExpeditor): static
    {
        if ($this->authorizedExpeditors->removeElement($authorizedExpeditor)) {
            // set the owning side to null (unless already changed)
            if ($authorizedExpeditor->getUserProfileId() === $this) {
                $authorizedExpeditor->setUserProfileId(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, SharedTrip>
     */
    public function getSharedTrips(): Collection
    {
        return $this->sharedTrips;
    }

    public function addSharedTrip(SharedTrip $sharedTrip): static
    {
        if (!$this->sharedTrips->contains($sharedTrip)) {
            $this->sharedTrips->add($sharedTrip);
            $sharedTrip->setUserProfileId($this);
        }

        return $this;
    }

    public function removeSharedTrip(SharedTrip $sharedTrip): static
    {
        if ($this->sharedTrips->removeElement($sharedTrip)) {
            // set the owning side to null (unless already changed)
            if ($sharedTrip->getUserProfileId() === $this) {
                $sharedTrip->setUserProfileId(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Trip>
     */
    public function getTrips(): Collection
    {
        return $this->trips;
    }

    public function addTrip(Trip $trip): static
    {
        if (!$this->trips->contains($trip)) {
            $this->trips->add($trip);
            $trip->setUserProfileId($this);
        }

        return $this;
    }

    public function removeTrip(Trip $trip): static
    {
        if ($this->trips->removeElement($trip)) {
            // set the owning side to null (unless already changed)
            if ($trip->getUserProfileId() === $this) {
                $trip->setUserProfileId(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, FavoriteDestination>
     */
    public function getFavoriteDestinations(): Collection
    {
        return $this->favoriteDestinations;
    }

    public function addFavoriteDestination(FavoriteDestination $favoriteDestination): static
    {
        if (!$this->favoriteDestinations->contains($favoriteDestination)) {
            $this->favoriteDestinations->add($favoriteDestination);
            $favoriteDestination->setUserProfileId($this);
        }

        return $this;
    }

    public function removeFavoriteDestination(FavoriteDestination $favoriteDestination): static
    {
        if ($this->favoriteDestinations->removeElement($favoriteDestination)) {
            // set the owning side to null (unless already changed)
            if ($favoriteDestination->getUserProfileId() === $this) {
                $favoriteDestination->setUserProfileId(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Traveler>
     */
    public function getTravelers(): Collection
    {
        return $this->travelers;
    }

    public function addTraveler(Traveler $traveler): static
    {
        if (!$this->travelers->contains($traveler)) {
            $this->travelers->add($traveler);
            $traveler->setUserProfileId($this);
        }

        return $this;
    }

    public function removeTraveler(Traveler $traveler): static
    {
        if ($this->travelers->removeElement($traveler)) {
            // set the owning side to null (unless already changed)
            if ($traveler->getUserProfileId() === $this) {
                $traveler->setUserProfileId(null);
            }
        }

        return $this;
    }


}
