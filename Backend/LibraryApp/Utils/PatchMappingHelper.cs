using System.Security.AccessControl;

namespace LibraryApp.Utils
{
    public class PatchMappingHelper<T>
    {
        public static (T updated, bool isChanged) PatchMappingFields(T source, T patch)
        {
            if (source == null || patch == null)
                return (source, false);

            bool isChanged = false;

            foreach (var property in typeof(T).GetProperties()
                         .Where(p => p.Name != "Id" && p.Name != "CreatedAt" && p.Name != "UpdatedAt" && p.CanWrite && p.GetIndexParameters().Length == 0))
            {
                var patchValue = property.GetValue(patch);
                var originalValue = property.GetValue(source);

                // Skip if patchValue is null
                if (patchValue == null)
                    continue;

                // If it's a string, skip whitespace-only strings
                if (property.PropertyType == typeof(string) && string.IsNullOrWhiteSpace(patchValue.ToString()))
                    continue;

                if (!object.Equals(patchValue, originalValue))
                {
                    property.SetValue(source, patchValue);
                    isChanged = true;
                }
            }

            return (source, isChanged);
        }

    }
}