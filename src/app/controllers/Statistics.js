const Order = require("../models/Order");
const Product = require("../models/Product");
const Users = require("../models/User");

const dayjs = require("dayjs");

class StatisticsController {
  async statistics(req, res) {
    try {
      const [totalRevenueResult, totalProducts, totalUsers, totalOrders] =
        await Promise.all([
          Order.aggregate([
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: "$total_price" },
              },
            },
          ]),
          Product.countDocuments(),
          Users.countDocuments(),
          Order.countDocuments({ status: "pending" }),
        ]);

      res.status(200).json({
        totalRevenue:
          totalRevenueResult.length > 0
            ? totalRevenueResult[0].totalRevenue
            : 0,
        totalProducts,
        totalUsers,
        totalOrders,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getOrderStatisticsByMonth(req, res) {
    const { year, month } = req.query;
    if (!year || !month) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp cả năm và tháng" });
    }

    try {
      const parsedYear = parseInt(year);
      const parsedMonth = parseInt(month);
      // Lấy tổng số ngày của tháng đó
      const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();
      // Tạo danh sách tất cả các ngày trong tháng đó
      const allDaysInMonth = Array.from({ length: daysInMonth }, (v, i) => ({
        day: i + 1,
        count: 0,
        totalRevenue: 0,
      }));

      // Lấy thống kê số lượng đơn hàng của các ngày trong tháng cụ thể
      const stats = await Order.aggregate([
        {
          $match: {
            $expr: {
              $and: [
                { $eq: [{ $year: "$order_date" }, parsedYear] },
                { $eq: [{ $month: "$order_date" }, parsedMonth] },
              ],
            },
          },
        },
        {
          $group: {
            _id: {
              day: { $dayOfMonth: "$order_date" },
              month: { $month: "$order_date" },
              year: { $year: "$order_date" },
            },
            count: { $sum: 1 },
            totalRevenue: { $sum: "$total_price" },
          },
        },
      ]);

      // Gộp dữ liệu thống kê vào tất cả các ngày
      let monthlyTotalRevenue = 0;
      const result = allDaysInMonth.map((day) => {
        const statForDay = stats.find((stat) => stat._id.day === day.day);
        if (statForDay) {
          monthlyTotalRevenue += statForDay.totalRevenue; // Tính tổng doanh thu cả tháng
          return {
            day: day.day,
            count: statForDay.count,
            totalRevenue: statForDay.totalRevenue,
          };
        }
        return day;
      });

      return res.status(200).json({
        message: `Thống kê số đơn hàng ${month}/${year}`,
        totalMonthlyRevenue: monthlyTotalRevenue,
        data: result,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getOrderStatisticsByYear(req, res) {
    const { year } = req.query;
    if (!year) {
      return res.status(400).json({ message: "Vui lòng cung cấp năm" });
    }

    try {
      const parsedYear = parseInt(year);

      // Tạo danh sách tất cả các tháng trong năm đó
      const allMonthsInYear = Array.from({ length: 12 }, (v, i) => ({
        month: i + 1,
        count: 0,
        totalRevenue: 0,
      }));

      // Lấy thống kê số lượng đơn hàng của các tháng trong năm cụ thể
      const stats = await Order.aggregate([
        {
          $match: {
            $expr: {
              $eq: [{ $year: "$order_date" }, parsedYear],
            },
          },
        },
        {
          $group: {
            _id: { month: { $month: "$order_date" } },
            count: { $sum: 1 },
            totalRevenue: { $sum: "$total_price" },
          },
        },
      ]);

      // Gộp dữ liệu thống kê vào tất cả các tháng
      let yearlyTotalRevenue = 0;
      const result = allMonthsInYear.map((month) => {
        const statForMonth = stats.find(
          (stat) => stat._id.month === month.month
        );
        if (statForMonth) {
          yearlyTotalRevenue += statForMonth.totalRevenue; // Tính tổng doanh thu cả năm
          return {
            month: month.month,
            count: statForMonth.count,
            totalRevenue: statForMonth.totalRevenue,
          };
        }
        return month;
      });

      return res.status(200).json({
        message: `Thống kê đơn hàng năm ${year}`,
        totalYearlyRevenue: yearlyTotalRevenue,
        data: result,
      });
    } catch (error) {
      console.error("Lỗi khi lấy thống kê theo năm:", error);
      return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
  }

  async getTopCategoriesBySales(req, res) {
    try {
      // Step 1: Aggregate sales data by category
      const categorySales = await Product.aggregate([
        // Group by category and sum the sold_quantity
        {
          $group: {
            _id: "$category_id",
            totalSold: { $sum: "$sold_quantity" },
          },
        },
        // Lookup category name
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "category",
          },
        },
        // Unwind the category array
        { $unwind: "$category" },
        // Project necessary fields
        {
          $project: {
            categoryName: "$category.name",
            totalSold: 1,
          },
        },
        { $sort: { totalSold: -1 } },
      ]);

      // Step 2: Calculate total sold quantity
      const totalSales = categorySales.reduce(
        (acc, item) => acc + item.totalSold,
        0
      );

      // Step 3: Identify top 5 categories
      const top5Categories = categorySales.slice(0, 5);

      // Step 4: Calculate sales percentage for each category
      const top5WithPercentage = top5Categories.map((category) => ({
        name: category.categoryName,
        value: parseFloat(((category.totalSold / totalSales) * 100).toFixed(2)),
      }));

      // Step 5: Calculate the "Other" category percentage
      const otherSales = categorySales
        .slice(5)
        .reduce((acc, item) => acc + item.totalSold, 0);
      const otherPercentage = ((otherSales / totalSales) * 100).toFixed(2);

      // Step 6: Combine results with the "Other" category
      const result = [
        ...top5WithPercentage,
        {
          name: "Khác",
          value: parseFloat(otherPercentage),
        },
      ];

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error calculating category sales:", error);
    }
  }

  async getTopProductsBySales(req, res) {
    try {
      const topProducts = await Product.find()
        .sort({ sold_quantity: -1 })
        .limit(9)
        .select("name sold_quantity price image")
        .lean();

      if (topProducts.length === 0) {
        return res.status(404).json({ message: "Không có sản phẩm nào." });
      }

      return res.status(200).json({
        message: "10 sản phẩm bán chạy nhất",
        data: topProducts,
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm bán chạy:", error);
      return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
  }
}

module.exports = new StatisticsController();
