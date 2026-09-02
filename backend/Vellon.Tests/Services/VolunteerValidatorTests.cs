using Vellon.Application.DTOs.Volunteer;
using Vellon.Application.Validators;

namespace Vellon.Tests.Services;

public class VolunteerValidatorTests
{
    private static CreateVolunteerDto ValidDto(int? age = null) => new(
        FullName: "Jose Mora",
        IdNumber: "1-2222-3333",
        BirthDate: new DateTime(1990, 1, 1),
        Age: age,
        Phone: "8888-9999",
        Email: "jose@example.com",
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

    [Theory]
    [InlineData(1, true)]
    [InlineData(120, true)]
    [InlineData(30, true)]
    [InlineData(0, false)]
    [InlineData(121, false)]
    [InlineData(-5, false)]
    public void Validate_AgeRange_ReturnsExpected(int age, bool expectedValid)
    {
        var validator = new CreateVolunteerValidator();
        var dto = ValidDto(age);

        var result = validator.Validate(dto);

        Assert.Equal(expectedValid, result.IsValid);
    }

    [Fact]
    public void Validate_AgeNull_IsValid()
    {
        var validator = new CreateVolunteerValidator();
        var dto = ValidDto(age: null);

        var result = validator.Validate(dto);

        Assert.True(result.IsValid);
    }
}
