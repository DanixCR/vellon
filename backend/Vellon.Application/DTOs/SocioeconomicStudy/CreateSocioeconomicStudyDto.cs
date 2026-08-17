using Vellon.Domain.Entities;

namespace Vellon.Application.DTOs.SocioeconomicStudy;

public record CreateSocioeconomicStudyDto(
    // Ingresos
    decimal? AlimonyAmount,
    string? AlimonyDetails,
    bool IsAlimonyVoluntary,
    decimal? ImasSubsidy,
    string? ImasSubsidyProgram,
    decimal? OtherInstitutionAid,
    string? OtherInstitutionAidDetails,
    decimal? OtherIncome,
    string? OtherIncomeDetails,
    // Gastos
    decimal? FoodExpense,
    decimal? EducationExpense,
    decimal? ServicesExpense,
    decimal? MedicineExpense,
    decimal? RentExpense,
    decimal? CableExpense,
    decimal? DebtExpense,
    decimal? OtherExpenses,
    string? OtherExpensesDetails,
    // Tarjeta de crédito
    bool HasCreditCard,
    string? CreditCardBank,
    decimal? CreditCardDebt,
    // Ahorros
    bool HasSavings,
    string? SavingsBank,
    decimal? SavingsAmount,
    // Vivienda
    HousingType HousingType,
    string? HousingOwnerName,
    string? HousingOwnerIdNumber,
    bool? RentIsUpToDate,
    HousingDebtStatus? HousingDebtStatus,
    // Colecciones
    List<FamilyMemberInputDto> FamilyMembers,
    List<HouseholdItemInputDto> HouseholdItems
);
