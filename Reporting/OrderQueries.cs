using System.Data;
using Dapper;

namespace Reporting;

public static class OrderQueries
{
    public sealed record Summary(string Region, decimal TotalAmount, int Count);

    public static async Task<IReadOnlyList<Summary>> GetSummaryAsync(IDbConnection db)
    {
        const string sql = """
            SELECT Region, SUM(Amount) AS TotalAmount, COUNT(*) AS [Count]
            FROM dbo.Orders
            GROUP BY Region
            ORDER BY Region
        """;
        var rows = await db.QueryAsync<Summary>(sql);
        return rows.AsList();
    }
}
