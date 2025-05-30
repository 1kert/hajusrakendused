using System.Text.RegularExpressions;
using FluentValidation;

namespace hajusrakendused.Models.Http;

public class StoreContinueRequest
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
}

public partial class StoreContinueRequestValidator : AbstractValidator<StoreContinueRequest>
{
    public StoreContinueRequestValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty()
            .WithMessage("First name cannot be empty")
            .MaximumLength(50)
            .WithMessage("First name cannot exceed 50 characters");
        
        RuleFor(x => x.LastName)
            .NotEmpty()
            .WithMessage("Last name cannot be empty")
            .MaximumLength(50)
            .WithMessage("Last name cannot exceed 50 characters");
        
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email cannot be empty")
            .MaximumLength(50)
            .WithMessage("Email cannot exceed 50 characters")
            .Must(x => x != null && EmailRegex().IsMatch(x))
            .WithMessage("Not a valid email address format");
        
        RuleFor(x => x.PhoneNumber)
            .NotEmpty()
            .WithMessage("Phone number cannot be empty")
            .MaximumLength(15)
            .WithMessage("Phone number cannot exceed 15 characters")
            .Must(x => x != null && PhoneNumberRegex().IsMatch(x))
            .WithMessage("Not a valid email address format");
    }

    [GeneratedRegex(@"^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$")]
    private static partial Regex EmailRegex();
    
    [GeneratedRegex(@"^[+]?[(]?[0-9]{3}[)]?[- .]?[0-9]{3}[- .]?[0-9]{4,6}$")]
    private static partial Regex PhoneNumberRegex();
}