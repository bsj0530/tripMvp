export function getRealOrderResult({
  cart,
  pickupTime,
}: {
  cart: any[];
  pickupTime: string;
}) {
  const now = new Date();

  const [h, m] = pickupTime.split(":").map(Number);

  const pickupDate = new Date();
  pickupDate.setHours(h, m, 0, 0);

  // 🔥 핵심: 매장 수 기준
  const shopCount = new Set(cart.map((i) => i.product.shopId)).size;

  const pickupMinutes = shopCount * 8;
  const deliveryMinutes = 15;
  const bufferMinutes = 10;

  const totalNeed = pickupMinutes + deliveryMinutes + bufferMinutes;

  const deadline = new Date(pickupDate);
  deadline.setMinutes(deadline.getMinutes() - totalNeed);

  const canOrder = now <= deadline;

  return {
    canOrder,
    now,
    deadline,
    totalNeed,
    shopCount,
  };
}
