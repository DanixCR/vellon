using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vellon.Application.DTOs.ContactRecord;
using Vellon.Application.Services.Interfaces;
using Vellon.Domain.Entities;

namespace Vellon.WebAPI.Controllers;

[ApiController]
[Route("api/contact-records")]
public class ContactRecordController : ControllerBase
{
    private readonly IContactRecordService _service;

    public ContactRecordController(IContactRecordService service) => _service = service;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateContactRecordDto dto, CancellationToken ct)
    {
        var result = await _service.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll(
        [FromQuery] ContactType? type, [FromQuery] bool? isRead, CancellationToken ct)
    {
        var result = await _service.GetAllAsync(type, isRead, ct);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    [Authorize]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var result = await _service.GetByIdAsync(id, ct);
        return Ok(result);
    }

    [HttpPatch("{id:int}/read")]
    [Authorize]
    public async Task<IActionResult> MarkAsRead(int id, CancellationToken ct)
    {
        await _service.MarkAsReadAsync(id, ct);
        return Ok(new { message = "Registro marcado como leído." });
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await _service.DeleteAsync(id, ct);
        return NoContent();
    }
}
