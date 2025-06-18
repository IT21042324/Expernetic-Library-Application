namespace LibraryApp.Configuration
{
    public sealed class JwtSettings
    {
        public string Key { get; init; } = string.Empty;
        public string Issuer { get; init; } = "LibraryApp";
        public string Audience { get; init; } = "LibraryAppUsers";
        public int ExpiresInMinutes { get; init; } = 60;
    }

}
