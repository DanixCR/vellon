using FluentValidation;
using Vellon.Application.DTOs.Project;

namespace Vellon.Application.Validators;

public class UpdateProjectValidator : AbstractValidator<UpdateProjectDto>
{
    public UpdateProjectValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("El nombre del proyecto es requerido.")
            .MaximumLength(150).WithMessage("El nombre no puede superar los 150 caracteres.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("La descripción es requerida.")
            .MaximumLength(2000).WithMessage("La descripción no puede superar los 2000 caracteres.");

        RuleFor(x => x.ProjectType)
            .NotEmpty().WithMessage("El tipo de proyecto es requerido.");

        RuleFor(x => x.StartDate)
            .NotEmpty().WithMessage("La fecha de inicio es requerida.");

        RuleFor(x => x.MainObjective)
            .NotEmpty().WithMessage("El objetivo principal es requerido.")
            .MaximumLength(500).WithMessage("El objetivo no puede superar los 500 caracteres.");

        RuleFor(x => x.ResponsibleName)
            .NotEmpty().WithMessage("El nombre del responsable es requerido.")
            .MaximumLength(100).WithMessage("El nombre del responsable no puede superar los 100 caracteres.");

        RuleFor(x => x.TotalBudget)
            .GreaterThanOrEqualTo(0).WithMessage("El presupuesto no puede ser negativo.")
            .When(x => x.TotalBudget.HasValue);
    }
}
