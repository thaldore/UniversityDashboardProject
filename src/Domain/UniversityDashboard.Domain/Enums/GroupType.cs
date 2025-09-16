namespace UniversityDashBoardProject.Domain.Enums
{
    /// <summary>
    /// Grafik grupları için grup tiplerini tanımlar
    /// </summary>
    public enum GroupType
    {
        /// <summary>
        /// Ana grup - Renk gruplandırması için kullanılır (Örn: Ulusal Dergi Yayın Grubu)
        /// </summary>
        ColorGroup = 1,
        
        /// <summary>
        /// Alt grup - İsim gruplandırması için kullanılır (Örn: Tıp Fakültesi)
        /// </summary>
        NameGroup = 2
    }
}