const axios = require('axios');
const Prediction = require('../models/Prediction');
const notificationService = require('./notificationService');

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:8000';

/**
 * Sends harvest + sensor data to the ML FastAPI service.
 * Stores the result in MongoDB.
 * Falls back to rule-based logic if ML service is unavailable.
 */
const runPrediction = async (harvest, sensorReading) => {
  const features = {
    crop: harvest.crop,
    variety: harvest.variety || '',
    maturity_stage: harvest.maturityStage || '',
    harvest_date: harvest.harvestDate,
    harvest_time: harvest.harvestTime || '',
    storage_type: harvest.storageType || '',
    storage_condition: harvest.storageCondition || '',
    temperature: sensorReading.temperature,
    humidity: sensorReading.humidity,
    ethylene: sensorReading.ethylene,
    voc: sensorReading.voc,
    co2: sensorReading.co2 || null,
    initial_weight: harvest.initialWeight || null,
    current_weight: sensorReading.currentWeight || null,
    quantity: harvest.quantity,
  };

  let shelfLifeResult = null;
  let spoilageResult = null;
  let source = 'rule_based';

  try {
    const [slRes, srRes] = await Promise.all([
      axios.post(`${ML_API_URL}/predict/shelf-life`, features, { timeout: 10000 }),
      axios.post(`${ML_API_URL}/predict/spoilage-risk`, features, { timeout: 10000 }),
    ]);
    shelfLifeResult = slRes.data;
    spoilageResult = srRes.data;
    source = 'ml_model';
  } catch (err) {
    console.warn('[PredictionService] ML API unavailable, using rule-based fallback:', err.message);
    shelfLifeResult = ruleBasedShelfLife(features);
    spoilageResult = ruleBasedSpoilageRisk(features);
  }

  const prediction = await Prediction.create({
    harvestId: harvest._id,
    farmerId: harvest.farmerId,
    sensorReadingId: sensorReading._id,
    remainingShelfLife: shelfLifeResult.remaining_shelf_life,
    shelfLifeUnit: 'days',
    shelfLifeConfidence: shelfLifeResult.confidence || null,
    spoilageRisk: spoilageResult.risk,
    spoilageRiskConfidence: spoilageResult.confidence || null,
    featuresUsed: features,
    modelVersion: shelfLifeResult.model_version || 'rule_based_v1',
    source,
  });

  // Trigger notifications based on prediction
  await notificationService.createPredictionNotifications(harvest, prediction);

  return prediction;
};

// ─── Rule-based fallback (used only when ML service is down) ─────────────────
// This is NOT the production prediction. Replace with ML model.
const ruleBasedShelfLife = (f) => {
  const base = { Tomato: 5, Onion: 20, Banana: 7, Potato: 25, Carrot: 14 };
  let days = base[f.crop] || 7;
  const maturityMap = { 'Immature': 1.3, 'Mature': 1.0, 'Semi-Ripe': 0.85, 'Fully Ripe': 0.6, 'Over-Ripe': 0.3 };
  days *= (maturityMap[f.maturity_stage] || 1.0);
  if (f.temperature > 35) days *= 0.6;
  else if (f.temperature > 30) days *= 0.75;
  else if (f.temperature > 25) days *= 0.9;
  if (f.humidity > 80) days *= 0.8;
  else if (f.humidity > 70) days *= 0.9;
  if (f.ethylene > 3) days *= 0.75;
  else if (f.ethylene > 2) days *= 0.85;
  const storageMap = { 'Open Shed': 0.8, 'Cool Storage': 1.1, 'Cold Room': 1.3, 'Refrigerated': 1.5 };
  days *= (storageMap[f.storage_condition] || 1.0);
  return { remaining_shelf_life: Math.max(1, Math.round(days)), confidence: null };
};

const ruleBasedSpoilageRisk = (f) => {
  const sl = ruleBasedShelfLife(f).remaining_shelf_life;
  const risk = sl <= 2 ? 'High' : sl <= 4 ? 'Medium' : 'Low';
  return { risk, confidence: null };
};

module.exports = { runPrediction };
