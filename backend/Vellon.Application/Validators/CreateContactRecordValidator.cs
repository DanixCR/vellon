using FluentValidation;
using Vellon.Application.DTOs.ContactRecord;

namespace Vellon.Application.Validators;

public class CreateContactRecordValidator : AbstractValidator<CreateContactRecordDto>
{
    public CreateContactRecordValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("El nombre completo es requerido.")
            .MaximumLength(100).WithMessage("El nombre no puede superar los 100 caracteres.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("El correo electrónico es requerido.")
            .EmailAddress().WithMessage("El correo electrónico no tiene un formato válido.");

        RuleFor(x => x.Phone)
            .MaximumLength(20).WithMessage("El teléfono no puede superar los 20 caracteres.")
            .When(x => x.Phone != null);

        RuleFor(x => x.Message)
            .MaximumLength(500).WithMessage("El mensaje no puede superar los 500 caracteres.")
            .When(x => x.Message != null);
    }
}
