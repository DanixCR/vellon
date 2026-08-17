using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vellon.Application.DTOs.Volunteer;
using Vellon.Application.Services.Interfaces;
using Vellon.Domain.Entities;

namespace Vellon.WebAPI.Controllers;

[ApiController]
[Route("api/volunteers")]
public class VolunteerController : ControllerBase
{
    private readonly IVolunteerService _service;

    public VolunteerController(IVolunteerService service) => _service = service;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateVolunteerDto dto, CancellationToken ct)
    {
        var result = await _service.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll([FromQuery] VolunteerStatus? status, CancellationToken ct)
    {
        var result = await _service.GetAllAsync(status, ct);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    [Authorize]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var result = await _service.GetByIdAsync(id, ct);
        return Ok(result);
    }

    [HttpPatch("{id:int}/status")]
    [Authorize]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateVolunteerStatusDto dto, CancellationToken ct)
    {
        var result = await _service.UpdateStatusAsync(id, dto, ct);
        return Ok(result);
    }

    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateVolunteerDto dto, CancellationToken ct)
    {
        var result = await _service.UpdateAsync(id, dto, ct);
        return Ok(result);
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await _service.DeleteAsync(id, ct);
        return NoContent();
    }
}
