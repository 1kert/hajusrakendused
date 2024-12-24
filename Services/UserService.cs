using System.Security.Cryptography;
using hajusrakendused.Models;

namespace hajusrakendused.Services;

public class UserService
{
    public static bool IsUsernameValid(Credentials user)
    {
        return false;
    }

    public static bool DoesUserExist(Credentials user, DatabaseContext database)
    {
        string username = user.Username.ToLower();
        return false;
    }
    
    public static bool AddUserToDatabase(Credentials user)
    {
        return true;
    }
}
