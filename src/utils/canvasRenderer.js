const Canvas = require('canvas');
const path = require('path');

/**
 * Generate a beautiful rank card using Canvas
 * @param {object} userData - User data object
 * @returns {Buffer} PNG image buffer
 */
async function generateRankCard(userData) {
  try {
    const canvas = Canvas.createCanvas(900, 300);
    const ctx = canvas.getContext('2d');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 900, 300);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 900, 300);

    // Border
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, 880, 280);

    // Accent line
    ctx.fillStyle = '#00d4ff';
    ctx.fillRect(10, 260, 880, 3);

    // Load and draw avatar
    let avatar;
    try {
      avatar = await Canvas.loadImage(userData.avatar);
      ctx.save();
      ctx.beginPath();
      ctx.arc(80, 80, 60, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, 20, 20, 120, 120);
      ctx.restore();

      // Avatar border
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(80, 80, 60, 0, Math.PI * 2);
      ctx.stroke();
    } catch (err) {
      console.log('Could not load avatar, skipping...');
    }

    // Username
    ctx.font = 'bold 40px Arial';
    ctx.fillStyle = '#00d4ff';
    ctx.fillText(userData.username, 170, 60);

    // Level and Rank info
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Level: ${userData.level}`, 170, 100);
    ctx.fillText(`Rank: #${userData.rank}`, 170, 140);

    // XP Bar background
    ctx.fillStyle = '#0f3460';
    ctx.fillRect(170, 165, 700, 30);

    // XP Bar border
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(170, 165, 700, 30);

    // XP Bar progress
    const progressWidth = (userData.progressPercentage / 100) * 700;
    const progressGradient = ctx.createLinearGradient(170, 165, 170 + progressWidth, 195);
    progressGradient.addColorStop(0, '#00d4ff');
    progressGradient.addColorStop(1, '#0099cc');
    ctx.fillStyle = progressGradient;
    ctx.fillRect(170, 165, progressWidth, 30);

    // XP Text
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#ffffff';
    const xpText = `${userData.currentXp} / ${userData.xpForNextLevel - userData.xpForCurrentLevel} XP`;
    const xpTextWidth = ctx.measureText(xpText).width;
    ctx.fillText(xpText, 870 - xpTextWidth - 10, 185);

    // Total XP
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#aaaaaa';
    ctx.fillText(`Total XP: ${userData.totalXp}`, 170, 225);

    return canvas.toBuffer('image/png');
  } catch (error) {
    console.error('Error generating rank card:', error);
    throw error;
  }
}

module.exports = {
  generateRankCard,
};
