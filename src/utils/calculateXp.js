/**
 * Calculate the XP required for a specific level
 * Formula: Quadratic progression (common in RPGs)
 * @param {number} level - Target level
 * @returns {number} XP required for that level
 */
function xpForLevel(level) {
  return 50 * level * level + 50 * level;
}

/**
 * Calculate the current level based on total XP
 * @param {number} totalXp - Total XP earned
 * @returns {number} Current level
 */
function calculateLevel(totalXp) {
  let level = 0;
  let xpRequiredForLevel = 0;

  while (xpForLevel(level + 1) <= totalXp) {
    level++;
  }

  return Math.max(0, level);
}

/**
 * Calculate current XP progress and XP needed for next level
 * @param {number} totalXp - Total XP earned
 * @returns {object} { currentXp, xpForCurrentLevel, xpForNextLevel, level }
 */
function getXpProgress(totalXp) {
  const currentLevel = calculateLevel(totalXp);
  const xpForCurrentLevel = xpForLevel(currentLevel);
  const xpForNextLevel = xpForLevel(currentLevel + 1);
  const currentXp = totalXp - xpForCurrentLevel;

  return {
    level: currentLevel,
    currentXp: Math.max(0, currentXp),
    xpForCurrentLevel,
    xpForNextLevel,
    xpNeeded: Math.max(0, xpForNextLevel - totalXp),
    progressPercentage: Math.min(
      100,
      (currentXp / (xpForNextLevel - xpForCurrentLevel)) * 100
    ),
  };
}

module.exports = {
  xpForLevel,
  calculateLevel,
  getXpProgress,
};
