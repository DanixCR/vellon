using FluentValidation;
using Vellon.Application.DTOs.Auth;

namespace Vellon.Application.Validators;

public class UpdateAdminValidator : AbstractValidator<UpdateAdminDto>
{
    public UpdateAdminValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("El correo electrónico es requerido.")
            .EmailAddress().WithMessage("El correo electrónico no tiene un formato válido.");

        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("El nombre completo es requerido.")
            .MaximumLength(100).WithMessage("El nombre completo no puede superar los 100 caracteres.");
    }
}
