const Order = require("../models/Order");
const Product = require("../models/Product");
const Users = require("../models/User");
const dayjs = require("dayjs");

class StatisticsController {
  async statistics(req, res) {
    try {
      const [totalRevenueResult, totalProducts, totalUsers] = await Promise.all(
        [
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
        ]
      );

      res.status(200).json({
        totalRevenue:
          totalRevenueResult.length > 0
            ? totalRevenueResult[0].totalRevenue
            : 0,
        totalProducts,
        totalUsers,
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
      const result = allDaysInMonth.map((day) => {
        const statForDay = stats.find((stat) => stat._id.day === day.day);
        if (statForDay) {
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
        data: result,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new StatisticsController();
