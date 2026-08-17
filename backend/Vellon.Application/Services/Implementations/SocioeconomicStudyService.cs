using Vellon.Application.DTOs.SocioeconomicStudy;
using Vellon.Application.Exceptions;
using Vellon.Application.Services.Interfaces;
using Vellon.Domain.Entities;
using Vellon.Domain.Interfaces;

namespace Vellon.Application.Services.Implementations;

public class SocioeconomicStudyService : ISocioeconomicStudyService
{
    private readonly ISocioeconomicStudyRepository _repo;

    public SocioeconomicStudyService(ISocioeconomicStudyRepository repo) => _repo = repo;

    public async Task<IEnumerable<SocioeconomicStudySummaryDto>> GetAllAsync(CancellationToken ct = default)
    {
        var studies = await _repo.GetAllAsync(ct);
        return studies.Select(MapToSummaryDto);
    }

    public async Task<SocioeconomicStudyResponseDto> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var study = await _repo.GetByIdAsync(id, ct)
            ?? throw new NotFoundException($"No se encontró el estudio socioeconómico con ID {id}.");
        return MapToResponseDto(study);
    }

    public async Task<SocioeconomicStudyResponseDto> CreateAsync(CreateSocioeconomicStudyDto dto, CancellationToken ct = default)
    {
        var study = new SocioeconomicStudy
        {
            AlimonyAmount = dto.AlimonyAmount,
            AlimonyDetails = dto.AlimonyDetails,
            IsAlimonyVoluntary = dto.IsAlimonyVoluntary,
            ImasSubsidy = dto.ImasSubsidy,
            ImasSubsidyProgram = dto.ImasSubsidyProgram,
            OtherInstitutionAid = dto.OtherInstitutionAid,
            OtherInstitutionAidDetails = dto.OtherInstitutionAidDetails,
            OtherIncome = dto.OtherIncome,
            OtherIncomeDetails = dto.OtherIncomeDetails,
            FoodExpense = dto.FoodExpense,
            EducationExpense = dto.EducationExpense,
            ServicesExpense = dto.ServicesExpense,
            MedicineExpense = dto.MedicineExpense,
            RentExpense = dto.RentExpense,
            CableExpense = dto.CableExpense,
            DebtExpense = dto.DebtExpense,
            OtherExpenses = dto.OtherExpenses,
            OtherExpensesDetails = dto.OtherExpensesDetails,
            HasCreditCard = dto.HasCreditCard,
            CreditCardBank = dto.CreditCardBank,
            CreditCardDebt = dto.CreditCardDebt,
            HasSavings = dto.HasSavings,
            SavingsBank = dto.SavingsBank,
            SavingsAmount = dto.SavingsAmount,
            HousingType = dto.HousingType,
            HousingOwnerName = dto.HousingOwnerName,
            HousingOwnerIdNumber = dto.HousingOwnerIdNumber,
            RentIsUpToDate = dto.RentIsUpToDate,
            HousingDebtStatus = dto.HousingDebtStatus,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        foreach (var m in dto.FamilyMembers)
            study.FamilyMembers.Add(MapToFamilyMember(m));

        foreach (var item in dto.HouseholdItems)
            study.HouseholdItems.Add(MapToHouseholdItem(item));

        await _repo.AddAsync(study, ct);
        return MapToResponseDto(study);
    }

    public async Task<SocioeconomicStudyResponseDto> UpdateAsync(int id, UpdateSocioeconomicStudyDto dto, CancellationToken ct = default)
    {
        var study = await _repo.GetByIdAsync(id, ct)
            ?? throw new NotFoundException($"No se encontró el estudio socioeconómico con ID {id}.");

        study.AlimonyAmount = dto.AlimonyAmount;
        study.AlimonyDetails = dto.AlimonyDetails;
        study.IsAlimonyVoluntary = dto.IsAlimonyVoluntary;
        study.ImasSubsidy = dto.ImasSubsidy;
        study.ImasSubsidyProgram = dto.ImasSubsidyProgram;
        study.OtherInstitutionAid = dto.OtherInstitutionAid;
        study.OtherInstitutionAidDetails = dto.OtherInstitutionAidDetails;
        study.OtherIncome = dto.OtherIncome;
        study.OtherIncomeDetails = dto.OtherIncomeDetails;
        study.FoodExpense = dto.FoodExpense;
        study.EducationExpense = dto.EducationExpense;
        study.ServicesExpense = dto.ServicesExpense;
        study.MedicineExpense = dto.MedicineExpense;
        study.RentExpense = dto.RentExpense;
        study.CableExpense = dto.CableExpense;
        study.DebtExpense = dto.DebtExpense;
        study.OtherExpenses = dto.OtherExpenses;
        study.OtherExpensesDetails = dto.OtherExpensesDetails;
        study.HasCreditCard = dto.HasCreditCard;
        study.CreditCardBank = dto.CreditCardBank;
        study.CreditCardDebt = dto.CreditCardDebt;
        study.HasSavings = dto.HasSavings;
        study.SavingsBank = dto.SavingsBank;
        study.SavingsAmount = dto.SavingsAmount;
        study.HousingType = dto.HousingType;
        study.HousingOwnerName = dto.HousingOwnerName;
        study.HousingOwnerIdNumber = dto.HousingOwnerIdNumber;
        study.RentIsUpToDate = dto.RentIsUpToDate;
        study.HousingDebtStatus = dto.HousingDebtStatus;
        study.UpdatedAt = DateTime.UtcNow;

        // Reemplazar colecciones hijas — EF Core cascade delete elimina los huérfanos
        study.FamilyMembers.Clear();
        foreach (var m in dto.FamilyMembers)
            study.FamilyMembers.Add(MapToFamilyMember(m));

        study.HouseholdItems.Clear();
        foreach (var item in dto.HouseholdItems)
            study.HouseholdItems.Add(MapToHouseholdItem(item));

        await _repo.UpdateAsync(study, ct);
        return MapToResponseDto(study);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var study = await _repo.GetByIdAsync(id, ct)
            ?? throw new NotFoundException($"No se encontró el estudio socioeconómico con ID {id}.");

        await _repo.DeleteAsync(study, ct);
    }

    private static SocioeconomicStudySummaryDto MapToSummaryDto(SocioeconomicStudy s) => new(
        s.Id,
        s.CreatedAt,
        s.FamilyMembers.Count,
        (s.AlimonyAmount ?? 0) + (s.ImasSubsidy ?? 0) + (s.OtherInstitutionAid ?? 0) + (s.OtherIncome ?? 0)
            + s.FamilyMembers.Sum(f => f.MonthlyIncome ?? 0),
        (s.FoodExpense ?? 0) + (s.EducationExpense ?? 0) + (s.ServicesExpense ?? 0) + (s.MedicineExpense ?? 0)
            + (s.RentExpense ?? 0) + (s.CableExpense ?? 0) + (s.DebtExpense ?? 0) + (s.OtherExpenses ?? 0)
    );

    private static SocioeconomicStudyResponseDto MapToResponseDto(SocioeconomicStudy s) => new(
        s.Id,
        s.CreatedAt,
        s.AlimonyAmount, s.AlimonyDetails, s.IsAlimonyVoluntary,
        s.ImasSubsidy, s.ImasSubsidyProgram,
        s.OtherInstitutionAid, s.OtherInstitutionAidDetails,
        s.OtherIncome, s.OtherIncomeDetails,
        s.FoodExpense, s.EducationExpense, s.ServicesExpense, s.MedicineExpense,
        s.RentExpense, s.CableExpense, s.DebtExpense, s.OtherExpenses, s.OtherExpensesDetails,
        s.HasCreditCard, s.CreditCardBank, s.CreditCardDebt,
        s.HasSavings, s.SavingsBank, s.SavingsAmount,
        s.HousingType, s.HousingOwnerName, s.HousingOwnerIdNumber, s.RentIsUpToDate, s.HousingDebtStatus,
        s.FamilyMembers.Select(f => new FamilyMemberResponseDto(
            f.Id, f.Name, f.Age, f.Occupation, f.EmploymentType, f.MonthlyIncome, f.Workplace, f.Phone)).ToList(),
        s.HouseholdItems.Select(h => new HouseholdItemResponseDto(
            h.Id, h.ItemName, h.Quantity, h.Condition, h.AcquisitionType, h.HasPendingPayments)).ToList()
    );

    private static FamilyMember MapToFamilyMember(FamilyMemberInputDto m) => new()
    {
        Name = m.Name,
        Age = m.Age,
        Occupation = m.Occupation,
        EmploymentType = m.EmploymentType,
        MonthlyIncome = m.MonthlyIncome,
        Workplace = m.Workplace,
        Phone = m.Phone,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow
    };

    private static HouseholdItem MapToHouseholdItem(HouseholdItemInputDto item) => new()
    {
        ItemName = item.ItemName,
        Quantity = item.Quantity,
        Condition = item.Condition,
        AcquisitionType = item.AcquisitionType,
        HasPendingPayments = item.HasPendingPayments,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow
    };
}
