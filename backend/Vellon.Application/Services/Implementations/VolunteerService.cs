using Vellon.Application.DTOs.Volunteer;
using Vellon.Application.Exceptions;
using Vellon.Application.Services.Interfaces;
using Vellon.Domain.Entities;
using Vellon.Domain.Interfaces;

namespace Vellon.Application.Services.Implementations;

public class VolunteerService : IVolunteerService
{
    private readonly IVolunteerRepository _repo;

    public VolunteerService(IVolunteerRepository repo) => _repo = repo;

    public async Task<IEnumerable<VolunteerResponseDto>> GetAllAsync(
        VolunteerStatus? status = null, CancellationToken ct = default)
    {
        var volunteers = await _repo.GetAllAsync(ct);

        if (status.HasValue)
            volunteers = volunteers.Where(v => v.Status == status.Value);

        return volunteers.Select(MapToResponseDto);
    }

    public async Task<VolunteerDetailDto> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var volunteer = await _repo.GetByIdAsync(id, ct)
            ?? throw new NotFoundException($"No se encontró el voluntario con ID {id}.");
        return MapToDetailDto(volunteer);
    }

    public async Task<VolunteerDetailDto> CreateAsync(CreateVolunteerDto dto, CancellationToken ct = default)
    {
        var volunteer = new Volunteer
        {
            FullName = dto.FullName,
            IdNumber = dto.IdNumber,
            BirthDate = dto.BirthDate,
            Age = dto.Age,
            Phone = dto.Phone,
            Email = dto.Email,
            Address = dto.Address,
            CurrentOccupation = dto.CurrentOccupation,
            AvailableDays = dto.AvailableDays,
            AvailableSchedule = dto.AvailableSchedule,
            WeeklyHours = dto.WeeklyHours,
            SpecialAvailability = dto.SpecialAvailability,
            Skills = dto.Skills,
            OtherSkills = dto.OtherSkills,
            PreviousVolunteerExperience = dto.PreviousVolunteerExperience,
            EducationLevel = dto.EducationLevel,
            Languages = dto.Languages,
            InterestAreas = dto.InterestAreas,
            OtherInterestArea = dto.OtherInterestArea,
            Reference1Name = dto.Reference1Name,
            Reference1Relation = dto.Reference1Relation,
            Reference1Phone = dto.Reference1Phone,
            Reference1Email = dto.Reference1Email,
            Reference2Name = dto.Reference2Name,
            Reference2Relation = dto.Reference2Relation,
            Reference2Phone = dto.Reference2Phone,
            Reference2Email = dto.Reference2Email,
            Motivation = dto.Motivation,
            ExpectedContribution = dto.ExpectedContribution,
            Status = VolunteerStatus.Pendiente,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _repo.AddAsync(volunteer, ct);
        return MapToDetailDto(volunteer);
    }

    public async Task<VolunteerDetailDto> UpdateStatusAsync(
        int id, UpdateVolunteerStatusDto dto, CancellationToken ct = default)
    {
        var volunteer = await _repo.GetByIdAsync(id, ct)
            ?? throw new NotFoundException($"No se encontró el voluntario con ID {id}.");

        volunteer.Status = dto.Status;
        volunteer.AdminNotes = dto.AdminNotes;
        volunteer.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(volunteer, ct);
        return MapToDetailDto(volunteer);
    }

    public async Task<VolunteerDetailDto> UpdateAsync(
        int id, UpdateVolunteerDto dto, CancellationToken ct = default)
    {
        var volunteer = await _repo.GetByIdAsync(id, ct)
            ?? throw new NotFoundException($"No se encontró el voluntario con ID {id}.");

        volunteer.FullName = dto.FullName;
        volunteer.IdNumber = dto.IdNumber;
        volunteer.BirthDate = dto.BirthDate;
        volunteer.Age = dto.Age;
        volunteer.Phone = dto.Phone;
        volunteer.Email = dto.Email;
        volunteer.Address = dto.Address;
        volunteer.CurrentOccupation = dto.CurrentOccupation;
        volunteer.AvailableDays = dto.AvailableDays;
        volunteer.AvailableSchedule = dto.AvailableSchedule;
        volunteer.WeeklyHours = dto.WeeklyHours;
        volunteer.SpecialAvailability = dto.SpecialAvailability;
        volunteer.Skills = dto.Skills;
        volunteer.OtherSkills = dto.OtherSkills;
        volunteer.PreviousVolunteerExperience = dto.PreviousVolunteerExperience;
        volunteer.EducationLevel = dto.EducationLevel;
        volunteer.Languages = dto.Languages;
        volunteer.InterestAreas = dto.InterestAreas;
        volunteer.OtherInterestArea = dto.OtherInterestArea;
        volunteer.Reference1Name = dto.Reference1Name;
        volunteer.Reference1Relation = dto.Reference1Relation;
        volunteer.Reference1Phone = dto.Reference1Phone;
        volunteer.Reference1Email = dto.Reference1Email;
        volunteer.Reference2Name = dto.Reference2Name;
        volunteer.Reference2Relation = dto.Reference2Relation;
        volunteer.Reference2Phone = dto.Reference2Phone;
        volunteer.Reference2Email = dto.Reference2Email;
        volunteer.Motivation = dto.Motivation;
        volunteer.ExpectedContribution = dto.ExpectedContribution;
        volunteer.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(volunteer, ct);
        return MapToDetailDto(volunteer);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var volunteer = await _repo.GetByIdAsync(id, ct)
            ?? throw new NotFoundException($"No se encontró el voluntario con ID {id}.");

        await _repo.DeleteAsync(volunteer, ct);
    }

    private static VolunteerResponseDto MapToResponseDto(Volunteer v) =>
        new(v.Id, v.FullName, v.IdNumber, v.Phone, v.Email,
            v.AvailableSchedule, v.Status.ToString(), v.CreatedAt);

    private static VolunteerDetailDto MapToDetailDto(Volunteer v) => new(
        v.Id, v.FullName, v.IdNumber, v.BirthDate, v.Age, v.Phone, v.Email,
        v.Address, v.CurrentOccupation,
        v.AvailableDays, v.AvailableSchedule, v.WeeklyHours, v.SpecialAvailability,
        v.Skills, v.OtherSkills, v.PreviousVolunteerExperience, v.EducationLevel, v.Languages,
        v.InterestAreas, v.OtherInterestArea,
        v.Reference1Name, v.Reference1Relation, v.Reference1Phone, v.Reference1Email,
        v.Reference2Name, v.Reference2Relation, v.Reference2Phone, v.Reference2Email,
        v.Motivation, v.ExpectedContribution,
        v.Status.ToString(), v.AdminNotes, v.CreatedAt
    );
}
