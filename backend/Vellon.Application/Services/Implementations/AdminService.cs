using Vellon.Application.DTOs.Auth;
using Vellon.Application.Exceptions;
using Vellon.Application.Services.Interfaces;
using Vellon.Domain.Entities;
using Vellon.Domain.Interfaces;

namespace Vellon.Application.Services.Implementations;

public class AdminService : IAdminService
{
    private readonly IAdminRepository _adminRepo;
    private readonly IPasswordHasher _passwordHasher;

    public AdminService(IAdminRepository adminRepo, IPasswordHasher passwordHasher)
    {
        _adminRepo = adminRepo;
        _passwordHasher = passwordHasher;
    }

    public async Task<IEnumerable<AdminResponseDto>> GetAllAsync(CancellationToken ct = default)
    {
        var admins = await _adminRepo.GetAllAsync(ct);
        return admins.Select(a => ToDto(a));
    }

    public async Task<AdminResponseDto> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var admin = await _adminRepo.GetByIdAsync(id, ct)
            ?? throw new NotFoundException("Administrador no encontrado.");
        return ToDto(admin);
    }

    public async Task<AdminResponseDto> CreateAsync(CreateAdminDto dto, CancellationToken ct = default)
    {
        if (await _adminRepo.GetByUsernameAsync(dto.Username, ct) is not null)
            throw new BadRequestException("Ya existe un administrador con ese nombre de usuario.");

        if (await _adminRepo.GetByEmailAsync(dto.Email, ct) is not null)
            throw new BadRequestException("Ya existe un administrador con ese correo electrónico.");

        var admin = new Admin
        {
            Username = dto.Username,
            Email = dto.Email,
            FullName = dto.FullName,
            PasswordHash = _passwordHasher.Hash(dto.Password),
            IsActive = true,
            IsSuperAdmin = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _adminRepo.AddAsync(admin, ct);
        return ToDto(admin);
    }

    public async Task<AdminResponseDto> UpdateAsync(int id, UpdateAdminDto dto, CancellationToken ct = default)
    {
        var admin = await _adminRepo.GetByIdAsync(id, ct)
            ?? throw new NotFoundException("Administrador no encontrado.");

        if (!string.Equals(admin.Email, dto.Email, StringComparison.OrdinalIgnoreCase))
        {
            var existing = await _adminRepo.GetByEmailAsync(dto.Email, ct);
            if (existing is not null && existing.Id != id)
                throw new BadRequestException("Ya existe un administrador con ese correo electrónico.");
        }

        admin.Email = dto.Email;
        admin.FullName = dto.FullName;
        admin.IsActive = dto.IsActive;
        admin.UpdatedAt = DateTime.UtcNow;

        await _adminRepo.UpdateAsync(admin, ct);
        return ToDto(admin);
    }

    public async Task ToggleActiveAsync(int id, CancellationToken ct = default)
    {
        var admin = await _adminRepo.GetByIdAsync(id, ct)
            ?? throw new NotFoundException("Administrador no encontrado.");

        admin.IsActive = !admin.IsActive;
        admin.UpdatedAt = DateTime.UtcNow;

        await _adminRepo.UpdateAsync(admin, ct);
    }

    public async Task DeleteAsync(int id, int currentAdminId, CancellationToken ct = default)
    {
        if (id == currentAdminId)
            throw new BadRequestException("No podés eliminarte a vos mismo.");

        if (id == 1)
            throw new BadRequestException("El administrador principal no puede ser eliminado.");

        var admin = await _adminRepo.GetByIdAsync(id, ct)
            ?? throw new NotFoundException("Administrador no encontrado.");

        await _adminRepo.DeleteAsync(admin, ct);
    }

    private static AdminResponseDto ToDto(Admin a) =>
        new(a.Id, a.Username, a.Email, a.FullName, a.IsActive, a.IsSuperAdmin, a.CreatedAt);
}
