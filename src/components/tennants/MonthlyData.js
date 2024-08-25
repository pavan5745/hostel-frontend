import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const API_URL = "http://localhost:5000/api/v1"; // Update with your actual API URL
const token = localStorage.getItem("jwt");

const MonthlyData = () => {
  const [payments, setPayments] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchPayments();
  }, [selectedMonth, selectedYear]);
  const fetchPayments = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/hostler/monthly-data?month=${selectedMonth}&year=${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const filteredPayments = response.data;
      setPayments(filteredPayments);

      const income = filteredPayments.reduce(
        (acc, payment) => acc + payment.amount,
        0
      );
      setTotalIncome(income);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  /*const fetchPayments = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/payments?month=${selectedMonth}&year=${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const filteredPayments = response.data.filter((payment) => {
        const paymentDate = new Date(payment.paymentDate);
        return (
          paymentDate.getMonth() + 1 === selectedMonth &&
          paymentDate.getFullYear() === selectedYear
        );
      });
      setPayments(filteredPayments);

      const income = filteredPayments.reduce(
        (acc, payment) => acc + payment.amount,
        0
      );
      setTotalIncome(income);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };
*/
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // Formats as dd/mm/yyyy
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Format month and year
    const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString(
      "default",
      { month: "long" }
    );
    const startDate = new Date(selectedYear, selectedMonth - 2, 25);
    const endDate = new Date(selectedYear, selectedMonth - 1, 24);

    // Format date range
    const formattedStartDate = `${startDate.getDate()} ${startDate.toLocaleString(
      "default",
      { month: "long" }
    )} ${startDate.getFullYear()}`;
    const formattedEndDate = `${endDate.getDate()} ${endDate.toLocaleString(
      "default",
      { month: "long" }
    )} ${endDate.getFullYear()}`;

    // Title
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 139); // Dark Blue
    doc.setFont("helvetica", "bold");
    const title = `${monthName} Month Report`;
    const titleWidth = doc.getStringUnitWidth(title) * doc.internal.scaleFactor;
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleX = (pageWidth - titleWidth) / 2;

    // Total Income
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black
    const totalIncomeText = `Total Income: Rs ${totalIncome}`;
    const totalIncomeWidth =
      doc.getStringUnitWidth(totalIncomeText) * doc.internal.scaleFactor;

    // Title and Total Income
    doc.text(title, titleX, 15);
    doc.text(totalIncomeText, 10, 25); // Positioned below the title

    // Date Range
    doc.setFontSize(12);
    const dateRange = `Date: ${formattedStartDate} to ${formattedEndDate}`;
    const dateRangeWidth =
      doc.getStringUnitWidth(dateRange) * doc.internal.scaleFactor;
    const dateRangeX = pageWidth - dateRangeWidth - 40; // 10 units margin from right
    doc.text(dateRange, dateRangeX, 25);

    // Table
    doc.autoTable({
      head: [["Room Number", "Name", "Paid Date", "Amount"]],
      body: payments.map((payment) => [
        payment.hostler.roomNumber,
        payment.hostler.name,
        formatDate(payment.paymentDate),
        ` Rs ${payment.amount}`,
      ]),
      startY: 35, // Adjusted to avoid overlapping with the title and income text
      theme: "grid",
      headStyles: {
        fillColor: [20, 20, 20], // Dark Blue
        textColor: [255, 255, 255], // White
        fontSize: 12,
        fontStyle: "bold",
        halign: "center",
      },
      styles: {
        cellPadding: 6,
        fontSize: 12,
        textColor: [0, 0, 0], // Black
        lineColor: [0, 0, 0], // Black borders
        lineWidth: 0.5,
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], // Light Gray
      },
      margin: { top: 35 },
    });

    // Add page number
    const totalPages = doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    doc.text(`Page ${totalPages}`, 190, doc.internal.pageSize.height - 10, {
      align: "right",
    });

    // Filename
    const fileName = `${monthName}_Monthly_Payment_Report.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="card m-3 p-3">
      <div className="row">
        <div className="col">
          <h5>Total Income: ₹{totalIncome}</h5>
        </div>
        <div className="col">
          <select
            className="form-select mb-3"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {[...Array(12)].map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {new Date(0, index).toLocaleString("default", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
        </div>
        <div className="col">
          <select
            className="form-select mb-3"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {[...Array(10)].map((_, index) => {
              const year = new Date().getFullYear() - index;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
        <div className="col text-end">
          <button onClick={downloadPDF} className="btn btn-secondary">
            Download Monthly PDF
          </button>
        </div>
      </div>

      <div className="row">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Room Number</th>
              <th>Name</th>
              <th>Paid Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td>{payment.hostler.roomNumber}</td>
                <td>{payment.hostler.name}</td>
                <td>{formatDate(payment.paymentDate)}</td>
                <td>₹{payment.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyData;
