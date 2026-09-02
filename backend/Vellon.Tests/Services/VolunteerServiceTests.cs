using Moq;
using Vellon.Application.DTOs.Volunteer;
using Vellon.Application.Services.Implementations;
using Vellon.Domain.Entities;
using Vellon.Domain.Interfaces;

namespace Vellon.Tests.Services;

public class VolunteerServiceTests
{
    [Fact]
    public async Task CreateAsync_AlwaysSetsStatusPendiente()
    {
        var repo = new Mock<IVolunteerRepository>();
        Volunteer? captured = null;
        repo.Setup(r => r.AddAsync(It.IsAny<Volunteer>(), It.IsAny<CancellationToken>()))
            .Callback<Volunteer, CancellationToken>((v, _) => captured = v)
            .Returns(Task.CompletedTask);

        var service = new VolunteerService(repo.Object);

        var dto = new CreateVolunteerDto(
            FullName: "Carlos Rojas",
            IdNumber: "1-2345-6789",
            BirthDate: new DateTime(1995, 3, 20),
            Age: 30,
            Phone: "8888-1234",
            Email: "carlos@example.com",
            Address: null,
            CurrentOccupation: null,
            AvailableDays: "Sábados",
            AvailableSchedule: "Mañana",
            WeeklyHours: 4,
            SpecialAvailability: null,
            Skills: null,
            OtherSkills: null,
            PreviousVolunteerExperience: null,
            EducationLevel: null,
            Languages: null,
            InterestAreas: null,
            OtherInterestArea: null,
            Reference1Name: null,
            Reference1Relation: null,
            Reference1Phone: null,
            Reference1Email: null,
            Reference2Name: null,
            Reference2Relation: null,
            Reference2Phone: null,
            Reference2Email: null,
            Motivation: null,
            ExpectedContribution: null);

        var result = await service.CreateAsync(dto);

        Assert.NotNull(captured);
        Assert.Equal(VolunteerStatus.Pendiente, captured!.Status);
        Assert.Equal("Pendiente", result.Status);
    }

    [Fact]
    public async Task CreateAsync_MapsAgeCorrectly()
    {
        var repo = new Mock<IVolunteerRepository>();
        Volunteer? captured = null;
        repo.Setup(r => r.AddAsync(It.IsAny<Volunteer>(), It.IsAny<CancellationToken>()))
            .Callback<Volunteer, CancellationToken>((v, _) => captured = v)
            .Returns(Task.CompletedTask);

        var service = new VolunteerService(repo.Object);

        var dto = new CreateVolunteerDto(
            FullName: "Ana Solano",
            IdNumber: "1-1111-2222",
            BirthDate: new DateTime(1998, 6, 10),
            Age: 25,
            Phone: "8888-5678",
            Email: "ana@example.com",
            Address: null,
            CurrentOccupation: null,
            AvailableDays: null,
            AvailableSchedule: null,
            WeeklyHours: null,
            SpecialAvailability: null,
            Skills: null,
            OtherSkills: null,
            PreviousVolunteerExperience: null,
            EducationLevel: null,
            Languages: null,
            InterestAreas: null,
            OtherInterestArea: null,
            Reference1Name: null,
            Reference1Relation: null,
            Reference1Phone: null,
            Reference1Email: null,
            Reference2Name: null,
            Reference2Relation: null,
            Reference2Phone: null,
            Reference2Email: null,
            Motivation: null,
            ExpectedContribution: null);

        var result = await service.CreateAsync(dto);

        Assert.NotNull(captured);
        Assert.Equal(25, captured!.Age);
        Assert.Equal(25, result.Age);
    }
}
