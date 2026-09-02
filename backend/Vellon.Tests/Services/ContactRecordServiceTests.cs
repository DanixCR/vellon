using Moq;
using Vellon.Application.DTOs.ContactRecord;
using Vellon.Application.Services.Implementations;
using Vellon.Application.Validators;
using Vellon.Domain.Entities;
using Vellon.Domain.Interfaces;

namespace Vellon.Tests.Services;

public class ContactRecordServiceTests
{
    [Fact]
    public async Task CreateAsync_ValidData_ReturnsUnreadRecord()
    {
        var repo = new Mock<IContactRecordRepository>();
        var service = new ContactRecordService(repo.Object);

        var dto = new CreateContactRecordDto(
            "María Jiménez", "maria@example.com", "8888-8888", "Quiero donar", ContactType.Donante);

        var result = await service.CreateAsync(dto);

        Assert.Equal(dto.FullName, result.FullName);
        Assert.Equal(dto.Email, result.Email);
        Assert.False(result.IsRead);
        repo.Verify(r => r.AddAsync(It.IsAny<ContactRecord>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Theory]
    [InlineData("", "maria@example.com")]
    [InlineData("María Jiménez", "correo-invalido")]
    [InlineData("María Jiménez", "")]
    public void CreateContactRecordValidator_InvalidData_FailsValidation(string fullName, string email)
    {
        var validator = new CreateContactRecordValidator();
        var dto = new CreateContactRecordDto(fullName, email, null, null, ContactType.Información);

        var result = validator.Validate(dto);

        Assert.False(result.IsValid);
    }
}
