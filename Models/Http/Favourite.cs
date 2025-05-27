using FluentValidation;

namespace hajusrakendused.Models.Http;

public class FavouriteGameRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Image { get; set; }
    public string[]? Genres { get; set; }
    public string? Developer { get; set; }
}

public class FavouriteGameResponse
{
    public long Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Image { get; set; }
    public string[]? Genres { get; set; }
    public string? Developer { get; set; }
}

public class FavouriteGameUpdateRequest
{
    public long? Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Image { get; set; }
    public string[]? Genres { get; set; }
    public string? Developer { get; set; }
}

public class FavouriteGameCreateValidator : AbstractValidator<FavouriteGameRequest>
{
    public FavouriteGameCreateValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .WithMessage("Title is required")
            .MaximumLength(64)
            .WithMessage("Title is too long");
        RuleFor(x => x.Description)
            .NotEmpty()
            .WithMessage("Description is required")
            .MaximumLength(128)
            .WithMessage("Description is too long");
        RuleFor(x => x.Image)
            .NotEmpty()
            .WithMessage("Image is required")
            .MaximumLength(256)
            .WithMessage("Image is too long");
        RuleFor(x => x.Genres)
            .NotEmpty()
            .WithMessage("Must have at least one genre")
            .Must(x => x!.Length <= 20)
            .WithMessage("Can have at most 20 genres");
        RuleForEach(x => x.Genres)
            .NotEmpty()
            .WithMessage("Genres can't be empty")
            .MaximumLength(20)
            .WithMessage("Genres can't be longer than 20 characters");
        RuleFor(x => x.Developer)
            .NotEmpty()
            .WithMessage("Developer can't be empty")
            .MaximumLength(64)
            .WithMessage("Developer can't be longer than 64 characters");
    }
}

public class FavouriteGameUpdateValidator : AbstractValidator<FavouriteGameUpdateRequest>
{
    public FavouriteGameUpdateValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Id is required");
        RuleFor(x => x.Title)
            .NotEmpty()
            .WithMessage("Title is required")
            .MaximumLength(64)
            .WithMessage("Title is too long");
        RuleFor(x => x.Description)
            .NotEmpty()
            .WithMessage("Description is required")
            .MaximumLength(128)
            .WithMessage("Description is too long");
        RuleFor(x => x.Image)
            .NotEmpty()
            .WithMessage("Image is required")
            .MaximumLength(256)
            .WithMessage("Image is too long");
        RuleFor(x => x.Genres)
            .NotEmpty()
            .WithMessage("Must have at least one genre")
            .Must(x => x!.Length <= 20)
            .WithMessage("Can have at most 20 genres");
        RuleForEach(x => x.Genres)
            .NotEmpty()
            .WithMessage("Genres can't be empty")
            .MaximumLength(20)
            .WithMessage("Genres can't be longer than 20 characters");
        RuleFor(x => x.Developer)
            .NotEmpty()
            .WithMessage("Developer can't be empty")
            .MaximumLength(64)
            .WithMessage("Developer can't be longer than 64 characters");
    }
}