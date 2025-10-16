import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

function convertToCSV(data, delimiter = ",") {
  if (!data || data.length === 0) return "No data available.\n";

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(delimiter),
    ...data.map((row) =>
      headers
        .map((field) => {
          const value = row[field];
          if (value === null || value === undefined) return "";
          if (typeof value === "object")
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(delimiter)
    ),
  ];
  return csvRows.join("\n");
}

export async function GET() {
  try {
    const [
      { data: students, error: studentError },
      { data: payments, error: paymentError },
      { data: expenses, error: expenseError },
    ] = await Promise.all([
      supabase
        .from("students")
        .select(
          "id, full_name, email, phone, status, balance, registration_date"
        ),
      supabase
        .from("payments")
        .select(
          "id, amount, payment_method, student_name, student_id, description, created_at"
        ),
      supabase
        .from("expenses")
        .select("id, amount, category, description, notes, created_at"),
    ]);

    // Handle possible fetch errors
    if (studentError || paymentError || expenseError) {
      console.error(
        "Supabase Fetch Error:",
        studentError || paymentError || expenseError
      );
      return NextResponse.json(
        {
          error: "Database fetch failed. Check RLS or connection.",
          details:
            studentError?.message ||
            paymentError?.message ||
            expenseError?.message,
        },
        { status: 500 }
      );
    }

    // Compute summary metrics
    const totalStudents = students?.length || 0;
    const totalReceived = (payments || []).reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );
    const totalExpenses = (expenses || []).reduce(
      (sum, e) => sum + Number(e.amount || 0),
      0
    );
    const netProfitLoss = totalReceived - totalExpenses;

    const summaryData = [
      { Metric: "Total Students", Value: totalStudents },
      { Metric: "Total Received (₹)", Value: totalReceived.toFixed(2) },
      { Metric: "Total Expenses (₹)", Value: totalExpenses.toFixed(2) },
      { Metric: "Net Profit/Loss (₹)", Value: netProfitLoss.toFixed(2) },
      { Metric: "Report Generated On", Value: new Date().toLocaleString() },
    ];

    const reportParts = [
      "--- SUMMARY STATISTICS ---",
      convertToCSV(summaryData),
      "\n\n--- RAW STUDENT DATA ---",
      convertToCSV(students),
      "\n\n--- RAW PAYMENT DATA ---",
      convertToCSV(payments),
      "\n\n--- RAW EXPENSE DATA ---",
      convertToCSV(expenses),
    ];

    const reportText = reportParts.join("\n");

    return new NextResponse(reportText, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="Library_Report_${new Date()
          .toISOString()
          .slice(0, 10)}.csv"`,
      },
    });
  } catch (err) {
    console.error("Report Generation Error:", err);
    return NextResponse.json(
      { error: "Internal server error during report generation." },
      { status: 500 }
    );
  }
}
