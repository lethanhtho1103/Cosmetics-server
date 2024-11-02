const cron = require("node-cron");
const Promotion = require("../app/models/Promotion");

async function updatePromotionStatus(promotion) {
  const today = new Date();
  if (
    today >= new Date(promotion.start_date) &&
    today <= new Date(promotion.end_date)
  ) {
    promotion.status = "active";
  } else if (today > new Date(promotion.end_date)) {
    promotion.status = "expired";
  } else if (today < new Date(promotion.start_date)) {
    promotion.status = "inactive";
  }
  await promotion.save();
}

async function updateAllPromotionsStatus() {
  try {
    const promotions = await Promotion.find();
    for (let promotion of promotions) {
      await updatePromotionStatus(promotion);
    }
    console.log("Cập nhật trạng thái khuyến mãi thành công");
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái khuyến mãi:", error);
  }
}

// Thiết lập cron job chạy mỗi giờ
function setupPromotionCronJob() {
  cron.schedule("0 0 * * *", () => {
    console.log("Chạy cron job cập nhật trạng thái khuyến mãi...");
    updateAllPromotionsStatus();
  });
}

module.exports = {
  updatePromotionStatus,
  updateAllPromotionsStatus,
  setupPromotionCronJob,
};
