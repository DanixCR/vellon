using Vellon.Domain.Common;

namespace Vellon.Domain.Entities;

public class SocioeconomicStudy : BaseEntity
{
    // Ingresos
    public decimal? AlimonyAmount { get; set; }
    public string? AlimonyDetails { get; set; }
    public bool IsAlimonyVoluntary { get; set; }
    public decimal? ImasSubsidy { get; set; }
    public string? ImasSubsidyProgram { get; set; }
    public decimal? OtherInstitutionAid { get; set; }
    public string? OtherInstitutionAidDetails { get; set; }
    public decimal? OtherIncome { get; set; }
    public string? OtherIncomeDetails { get; set; }

    // Gastos
    public decimal? FoodExpense { get; set; }
    public decimal? EducationExpense { get; set; }
    public decimal? ServicesExpense { get; set; }
    public decimal? MedicineExpense { get; set; }
    public decimal? RentExpense { get; set; }
    public decimal? CableExpense { get; set; }
    public decimal? DebtExpense { get; set; }
    public decimal? OtherExpenses { get; set; }
    public string? OtherExpensesDetails { get; set; }

    // Tarjeta de crédito
    public bool HasCreditCard { get; set; }
    public string? CreditCardBank { get; set; }
    public decimal? CreditCardDebt { get; set; }

    // Ahorros
    public bool HasSavings { get; set; }
    public string? SavingsBank { get; set; }
    public decimal? SavingsAmount { get; set; }

    // Vivienda
    public HousingType HousingType { get; set; }
    public string? HousingOwnerName { get; set; }
    public string? HousingOwnerIdNumber { get; set; }
    public bool? RentIsUpToDate { get; set; }
    public HousingDebtStatus? HousingDebtStatus { get; set; }

    // Relaciones
    public ICollection<FamilyMember> FamilyMembers { get; set; } = [];
    public ICollection<HouseholdItem> HouseholdItems { get; set; } = [];
}
