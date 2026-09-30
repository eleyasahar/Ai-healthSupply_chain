// redistributionEngine.js

/**
 * Calculates stock depletion days and triggers redistribution recommendations.
 */
function calculateRedistributionNeed(phcList, inventoryList) {
  const alerts = [];
  const surplusNodes = [];
  const deficitNodes = [];

  // Step 1: Categorize PHCs into Deficit or Surplus based on Runway Days
  inventoryList.forEach((item) => {
    const daysRemaining = item.daily_consumption_avg > 0
      ? item.current_stock / item.daily_consumption_avg
      : 999;

    if (daysRemaining <= 2) { // Stock-out expected within 48 hours
      deficitNodes.push({
        phc_id: item.phc_id,
        item_id: item.item_id,
        item_name: item.item_name,
        needed_quantity: (item.daily_consumption_avg * 7) - item.current_stock, // 7 days safety buffer
        daysRemaining: Number(daysRemaining.toFixed(1))
      });
    } else if (daysRemaining >= 15 && item.current_stock > item.minimum_threshold * 2) {
      surplusNodes.push({
        phc_id: item.phc_id,
        item_id: item.item_id,
        available_surplus: item.current_stock - item.minimum_threshold
      });
    }
  });

  // Step 2: Match Deficit Nodes with Nearby Surplus Nodes
  deficitNodes.forEach((deficit) => {
    const matchingSurplus = surplusNodes.find(
      (surplus) => surplus.item_id === deficit.item_id && surplus.available_surplus > 50
    );

    if (matchingSurplus) {
      const transferQty = Math.min(deficit.needed_quantity, matchingSurplus.available_surplus);

      alerts.push({
        id: `ALERT_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        type: 'STOCKOUT_WARNING',
        severity: deficit.daysRemaining <= 1 ? 'CRITICAL' : 'HIGH',
        target_phc: deficit.phc_id,
        source_phc: matchingSurplus.phc_id,
        item_name: deficit.item_name,
        recommended_transfer_qty: transferQty,
        message: `Critical shortage in PHC ${deficit.phc_id} (${deficit.daysRemaining} days left). Recommending transfer of ${transferQty} units from PHC ${matchingSurplus.phc_id}.`
      });

      // Update available surplus locally
      matchingSurplus.available_surplus -= transferQty;
    }
  });

  return alerts;
}

// Demo Test Call
const mockInventory = [
  { phc_id: 'PHC_ALPHA', item_id: 'MED_O2_CYLINDER', item_name: 'Oxygen Cylinders', current_stock: 5, daily_consumption_avg: 10, minimum_threshold: 20 },
  { phc_id: 'PHC_BETA', item_id: 'MED_O2_CYLINDER', item_name: 'Oxygen Cylinders', current_stock: 120, daily_consumption_avg: 4, minimum_threshold: 20 }
];



module.exports = calculateRedistributionNeed;