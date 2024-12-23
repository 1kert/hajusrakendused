using System.Security.Cryptography;
using hajusrakendused.Models;

namespace hajusrakendused.Services;

public class UserService
{
    public static bool DoesUserExist(Credentials user)
    {
        return user.Username.ToLower().Equals("test");
    }
    
    public static bool AddUserToDatabase(Credentials user)
    {
        return true;
    }
}
