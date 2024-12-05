import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

export const getAnalyticsData = async () => {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const salesData = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalSales: { $sum: 1 },
                totalRevenue: { $sum: "$totalAmount" },
            },
        },
    ]);
    const {totalSales, totalRevenue} = salesData[0] || {totalSales: 0, totalRevenue: 0};

    return {
        users: totalUsers,
        products: totalProducts,
        totalSales,
        totalRevenue,
    };
};
export const getDailySalesData = async (startDate, endDate) => {
    try {
        const dailySalesData = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },//
                    sales: { $sum: 1 },
                    revenue: { $sum: "$totalAmount" },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);
        // example of dailySalesData:
        //[
        //  {
        //      _id":"2023-08-01",
        //      sales:1,
        //      revenue:100},
        //  },
        //]
            const dateArray = getDatesInrange(startDate, endDate);
            //console.log(dateArray);//[2023-08-01, 2023-08-02, 2023-08-03, ...]
            return dateArray.map((date) => {
                const foundData = dailySalesData.find(item => item._id === date);
                return {
                    date,
                    sales: foundData ?.sales || 0,
                    revenue: foundData ?.revenue || 0,
                };
            });
    } catch (error) {
        throw error;
    }
};

function getDatesInrange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
}