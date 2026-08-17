using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vellon.Application.DTOs.Auth;
using Vellon.Application.Services.Interfaces;

namespace Vellon.WebAPI.Controllers;

[ApiController]
[Route("api/admins")]
[Authorize]
public class AdminController : ControllerBase
{
    private readonly IAdminService _service;

    public AdminController(IAdminService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        if (!IsSuperAdmin()) return Forbid();
        var result = await _service.GetAllAsync(ct);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        if (!IsSuperAdmin()) return Forbid();
        var result = await _service.GetByIdAsync(id, ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAdminDto dto, CancellationToken ct)
    {
        if (!IsSuperAdmin()) return Forbid();
        var result = await _service.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateAdminDto dto, CancellationToken ct)
    {
        if (!IsSuperAdmin()) return Forbid();
        var result = await _service.UpdateAsync(id, dto, ct);
        return Ok(result);
    }

    [HttpPatch("{id:int}/toggle-active")]
    public async Task<IActionResult> ToggleActive(int id, CancellationToken ct)
    {
        if (!IsSuperAdmin()) return Forbid();
        await _service.ToggleActiveAsync(id, ct);
        return Ok(new { message = "Estado del administrador actualizado." });
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        if (!IsSuperAdmin()) return Forbid();
        var currentAdminId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _service.DeleteAsync(id, currentAdminId, ct);
        return NoContent();
    }

    private bool IsSuperAdmin() =>
        User.FindFirstValue("IsSuperAdmin") == "true";
}
