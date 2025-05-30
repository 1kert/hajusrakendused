using FluentValidation;

namespace hajusrakendused.Models.Http;

public class CartRequest
{
    public long? Id { get; set; }
    public int? Quantity { get; set; }
}

public class CartRequestValidator : AbstractValidator<CartRequest>
{
    public CartRequestValidator()
    {
        RuleFor(x => x.Id).NotNull();
        RuleFor(x => x.Quantity).NotNull();
    }
}