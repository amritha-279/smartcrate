// ============================================================
// SmartCrate Prediction Utilities
// Replace these with Axios API calls when backend is ready:
// POST /api/prediction
// POST /api/recommendation
// ============================================================

/**
 * Mock shelf-life prediction logic.
 * In production, this will be replaced by an ML model API call.
 */
export function predictShelfLife(formData) {
  const baseShelfLife = {
    Tomato: 5, Onion: 20, Banana: 7, Potato: 25, Carrot: 14,
    Brinjal: 5, Okra: 4, Cabbage: 10, Cauliflower: 7, Spinach: 3,
    Mango: 6, Grapes: 10, Papaya: 5, Guava: 5, Pomegranate: 15,
  };

  const crop = formData.cropType || "Tomato";
  let base = baseShelfLife[crop] || 7;

  // Maturity stage adjustment
  const maturityMap = {
    "Immature": 1.3, "Mature": 1.0, "Semi-Ripe": 0.85,
    "Fully Ripe": 0.6, "Over-Ripe": 0.3,
  };
  base *= (maturityMap[formData.maturityStage] || 1.0);

  // Temperature adjustment (ideal ~20°C)
  const temp = parseFloat(formData.temperature) || 25;
  if (temp > 35) base *= 0.6;
  else if (temp > 30) base *= 0.75;
  else if (temp > 25) base *= 0.9;
  else if (temp < 15) base *= 1.2;

  // Humidity adjustment (ideal ~60%)
  const humidity = parseFloat(formData.humidity) || 65;
  if (humidity > 80) base *= 0.8;
  else if (humidity > 70) base *= 0.9;
  else if (humidity < 40) base *= 0.85;

  // Ethylene level adjustment
  const ethylene = parseFloat(formData.ethyleneLevel) || 1;
  if (ethylene > 3) base *= 0.75;
  else if (ethylene > 2) base *= 0.85;

  // Storage condition adjustment
  const storageMap = {
    "Open Shed": 0.8, "Warehouse": 0.9, "Cool Storage": 1.1,
    "Cold Room": 1.3, "Refrigerated": 1.5,
  };
  base *= (storageMap[formData.storageCondition] || 1.0);

  const shelfLife = Math.max(1, Math.round(base));

  let risk = "Low";
  if (shelfLife <= 2) risk = "High";
  else if (shelfLife <= 4) risk = "Medium";

  const confidence = Math.floor(Math.random() * 10) + 85; // 85–94%

  return { shelfLife, risk, confidence };
}

/**
 * Mock market recommendation logic.
 * In production, replace with: GET /api/recommendation
 */
export function getRecommendation(harvest, markets) {
  const crop = harvest.crop || harvest.cropType;
  const shelfLife = harvest.remainingShelfLife || harvest.shelfLife || 3;
  const risk = harvest.spoilageRisk || harvest.risk || "Medium";

  const scored = markets.map((market) => {
    const price = market.prices[crop] || 10;
    const grossValue = price * (harvest.quantity || 100);
    const netValue = grossValue - market.transportCost;
    const travelHours = parseFloat(market.travelTime) || 0.5;
    const safeToTravel = shelfLife > travelHours / 24 + 1;

    let score = netValue;
    if (!safeToTravel) score -= 5000;
    if (risk === "High" && market.distance > 30) score -= 3000;

    return { ...market, price, grossValue, netValue, safeToTravel, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];

  let action = "Sell Today";
  let reason = [];

  if (risk === "High") {
    action = "Sell Today";
    reason = [
      "High spoilage risk detected",
      "Immediate sale is recommended",
      "Local market is the safest option",
    ];
  } else if (best.distance <= 10) {
    action = "Sell Today";
    reason = [
      "Local market offers a fair price",
      "Minimal transport cost",
      "Produce is ready for sale",
    ];
  } else if (shelfLife >= 3 && best.netValue > scored[scored.length - 1].netValue * 1.1) {
    action = `Transport to ${best.name}`;
    reason = [
      `Better current price at ${best.name} (₹${best.price}/kg)`,
      "Produce has sufficient remaining shelf life",
      "Travel time is within the safe selling period",
      `Expected net value is ₹${best.netValue.toLocaleString("en-IN")}`,
    ];
  } else if (shelfLife >= 5) {
    action = "Wait for a Better Price";
    reason = [
      "Produce has sufficient shelf life to wait",
      "Current prices are not optimal",
      "Monitor market prices for the next 1–2 days",
    ];
  } else {
    action = "Move Produce";
    reason = [
      "Move produce to better storage",
      "Shelf life is moderate",
      "Prepare for sale within 2 days",
    ];
  }

  return { action, reason, markets: scored, bestMarket: best };
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getRiskColor(risk) {
  if (risk === "High") return "#e53e3e";
  if (risk === "Medium") return "#dd6b20";
  return "#38a169";
}

export function getShelfLifePercent(remaining, total) {
  if (!total) return 0;
  return Math.min(100, Math.round((remaining / total) * 100));
}
