namespace UniversityDashBoardProject.Domain.Entities
{
    public class PerformanceScoring
    {
        public int ScoringId { get; set; }
        public int PeriodId { get; set; }
        public decimal MinValue { get; set; }
        public decimal? MaxValue { get; set; }
        public decimal Score { get; set; }
        public string LetterGrade { get; set; } = string.Empty;
        public bool IsForNegativeTarget { get; set; } = false;
        public int DisplayOrder { get; set; } = 1;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation Properties
        public virtual PerformancePeriod Period { get; set; } = null!;
    }
}
