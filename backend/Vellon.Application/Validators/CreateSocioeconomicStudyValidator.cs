using FluentValidation;
using Vellon.Application.DTOs.SocioeconomicStudy;

namespace Vellon.Application.Validators;

public class CreateSocioeconomicStudyValidator : AbstractValidator<CreateSocioeconomicStudyDto>
{
    public CreateSocioeconomicStudyValidator()
    {
        RuleFor(x => x.FamilyMembers)
            .NotEmpty().WithMessage("Debe incluir al menos un miembro de la familia.");

        RuleForEach(x => x.FamilyMembers).ChildRules(member =>
        {
            member.RuleFor(m => m.Name)
                .NotEmpty().WithMessage("El nombre del miembro es requerido.")
                .MaximumLength(100).WithMessage("El nombre no puede superar los 100 caracteres.");

            member.RuleFor(m => m.Age)
                .InclusiveBetween(0, 120).WithMessage("La edad debe estar entre 0 y 120 años.");

            member.RuleFor(m => m.MonthlyIncome)
                .GreaterThanOrEqualTo(0).WithMessage("El ingreso mensual no puede ser negativo.")
                .When(m => m.MonthlyIncome.HasValue);
        });

        RuleFor(x => x.AlimonyAmount)
            .GreaterThanOrEqualTo(0).WithMessage("El monto de pensión no puede ser negativo.")
            .When(x => x.AlimonyAmount.HasValue);

        RuleFor(x => x.ImasSubsidy)
            .GreaterThanOrEqualTo(0).WithMessage("El subsidio IMAS no puede ser negativo.")
            .When(x => x.ImasSubsidy.HasValue);

        RuleFor(x => x.OtherInstitutionAid)
            .GreaterThanOrEqualTo(0).WithMessage("La ayuda de otras instituciones no puede ser negativa.")
            .When(x => x.OtherInstitutionAid.HasValue);

        RuleFor(x => x.OtherIncome)
            .GreaterThanOrEqualTo(0).WithMessage("Otros ingresos no pueden ser negativos.")
            .When(x => x.OtherIncome.HasValue);

        RuleFor(x => x.FoodExpense)
            .GreaterThanOrEqualTo(0).WithMessage("El gasto en alimentación no puede ser negativo.")
            .When(x => x.FoodExpense.HasValue);

        RuleFor(x => x.EducationExpense)
            .GreaterThanOrEqualTo(0).WithMessage("El gasto en educación no puede ser negativo.")
            .When(x => x.EducationExpense.HasValue);

        RuleFor(x => x.ServicesExpense)
            .GreaterThanOrEqualTo(0).WithMessage("El gasto en servicios no puede ser negativo.")
            .When(x => x.ServicesExpense.HasValue);

        RuleFor(x => x.MedicineExpense)
            .GreaterThanOrEqualTo(0).WithMessage("El gasto en medicamentos no puede ser negativo.")
            .When(x => x.MedicineExpense.HasValue);

        RuleFor(x => x.RentExpense)
            .GreaterThanOrEqualTo(0).WithMessage("El alquiler no puede ser negativo.")
            .When(x => x.RentExpense.HasValue);

        RuleFor(x => x.CreditCardDebt)
            .GreaterThanOrEqualTo(0).WithMessage("La deuda de tarjeta no puede ser negativa.")
            .When(x => x.CreditCardDebt.HasValue);

        RuleFor(x => x.SavingsAmount)
            .GreaterThanOrEqualTo(0).WithMessage("El monto de ahorros no puede ser negativo.")
            .When(x => x.SavingsAmount.HasValue);
    }
}
