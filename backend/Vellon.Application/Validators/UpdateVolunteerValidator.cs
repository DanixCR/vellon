using FluentValidation;
using Vellon.Application.DTOs.Volunteer;

namespace Vellon.Application.Validators;

public class UpdateVolunteerValidator : AbstractValidator<UpdateVolunteerDto>
{
    public UpdateVolunteerValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("El nombre completo es requerido.")
            .MaximumLength(100).WithMessage("El nombre no puede superar los 100 caracteres.");

        RuleFor(x => x.IdNumber)
            .NotEmpty().WithMessage("El número de cédula es requerido.")
            .MaximumLength(20).WithMessage("La cédula no puede superar los 20 caracteres.");

        RuleFor(x => x.BirthDate)
            .NotEmpty().WithMessage("La fecha de nacimiento es requerida.")
            .LessThan(DateTime.Today).WithMessage("La fecha de nacimiento debe ser anterior a hoy.");

        RuleFor(x => x.Age)
            .InclusiveBetween(1, 120).WithMessage("La edad debe ser un valor válido.")
            .When(x => x.Age.HasValue);

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("El teléfono es requerido.")
            .MaximumLength(20).WithMessage("El teléfono no puede superar los 20 caracteres.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("El correo electrónico es requerido.")
            .EmailAddress().WithMessage("El correo electrónico no tiene un formato válido.");

        RuleFor(x => x.Motivation)
            .MaximumLength(1000).WithMessage("La motivación no puede superar los 1000 caracteres.")
            .When(x => x.Motivation != null);

        RuleFor(x => x.ExpectedContribution)
            .MaximumLength(1000).WithMessage("La respuesta no puede superar los 1000 caracteres.")
            .When(x => x.ExpectedContribution != null);

        RuleFor(x => x.PreviousVolunteerExperience)
            .MaximumLength(500).WithMessage("La experiencia previa no puede superar los 500 caracteres.")
            .When(x => x.PreviousVolunteerExperience != null);

        RuleFor(x => x.EducationLevel)
            .MaximumLength(500).WithMessage("Los estudios o formación no pueden superar los 500 caracteres.")
            .When(x => x.EducationLevel != null);

        RuleFor(x => x.Languages)
            .MaximumLength(500).WithMessage("Los idiomas no pueden superar los 500 caracteres.")
            .When(x => x.Languages != null);
    }
}
