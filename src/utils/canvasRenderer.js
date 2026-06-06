const Canvas = require('canvas');
const path = require('path');

/**
 * Generate a beautiful rank card using Canvas with modern design
 * @param {object} userData - User data object
 * @returns {Buffer} PNG image buffer
 */
async function generateRankCard(userData) {
  try {
    const canvas = Canvas.createCanvas(1080, 400);
    const ctx = canvas.getContext('2d');

    // ===== BACKGROUND =====
    // Dark sleek background
    ctx.fillStyle = '#0f0f13';
    ctx.fillRect(0, 0, 1080, 400);

    // Modern glowing orbs in the background
    const orb1 = ctx.createRadialGradient(200, -50, 0, 200, -50, 400);
    orb1.addColorStop(0, 'rgba(255, 215, 0, 0.2)'); // Premium Gold
    orb1.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.fillStyle = orb1;
    ctx.fillRect(0, 0, 1080, 400);

    const orb2 = ctx.createRadialGradient(900, 450, 0, 900, 450, 400);
    orb2.addColorStop(0, 'rgba(255, 140, 0, 0.2)'); // Dark Orange
    orb2.addColorStop(1, 'rgba(255, 140, 0, 0)');
    ctx.fillStyle = orb2;
    ctx.fillRect(0, 0, 1080, 400);

    // ===== GLASSMORPHISM CARD LAYER =====
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(20, 20, 1040, 360, 24);
    ctx.fill();
    ctx.stroke();

    // ===== AVATAR SECTION =====
    const avatarX = 130;
    const avatarY = 130;
    const avatarRadius = 80;

    // Load and draw avatar
    let avatar;
    try {
      avatar = await Canvas.loadImage(userData.avatar);
      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, avatarX - avatarRadius, avatarY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
      ctx.restore();
    } catch (err) {
      console.log('Could not load avatar');
    }

    // Avatar ring (gradient)
    const ringGradient = ctx.createLinearGradient(
      avatarX - avatarRadius, avatarY - avatarRadius, 
      avatarX + avatarRadius, avatarY + avatarRadius
    );
    ringGradient.addColorStop(0, '#FFD700'); // Gold
    ringGradient.addColorStop(1, '#FF8C00'); // Orange

    ctx.strokeStyle = ringGradient;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarRadius + 4, 0, Math.PI * 2);
    ctx.stroke();

    // ===== USER INFO SECTION =====
    // Username
    ctx.font = 'bold 48px "Segoe UI", "Arial", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText(userData.username, 250, 110);

    // ===== RANK & LEVEL BADGES =====
    ctx.textAlign = 'right';
    
    // Rank
    ctx.font = 'bold 32px "Segoe UI", "Arial", sans-serif';
    ctx.fillStyle = '#a3a6aa';
    ctx.fillText('RANK', 850, 110);
    ctx.font = 'bold 48px "Segoe UI", "Arial", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`#${userData.rank}`, 960, 110);

    // Level
    ctx.font = 'bold 32px "Segoe UI", "Arial", sans-serif';
    ctx.fillStyle = '#a3a6aa';
    ctx.fillText('LEVEL', 850, 170);
    ctx.font = 'bold 48px "Segoe UI", "Arial", sans-serif';
    ctx.fillStyle = '#FFD700'; // Accent color
    ctx.fillText(`${userData.level}`, 960, 170);

    // ===== XP BAR SECTION =====
    const xpBarX = 250;
    const xpBarY = 250;
    const xpBarWidth = 750;
    const xpBarHeight = 30;
    const xpBarRadius = 15;

    // XP Text
    const maxXpForLevel = userData.xpForNextLevel - userData.xpForCurrentLevel;
    const currentLevelXp = userData.currentXp;

    ctx.textAlign = 'right';
    ctx.font = 'bold 22px "Segoe UI", "Arial", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${currentLevelXp} / ${maxXpForLevel} XP`, xpBarX + xpBarWidth, xpBarY - 15);

    // XP Bar Track (Background)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.roundRect(xpBarX, xpBarY, xpBarWidth, xpBarHeight, xpBarRadius);
    ctx.fill();

    // XP Bar Fill
    const progressWidth = Math.max((userData.progressPercentage / 100) * xpBarWidth, xpBarRadius * 2); 
    
    // Gradient for fill
    const fillGradient = ctx.createLinearGradient(xpBarX, xpBarY, xpBarX + xpBarWidth, xpBarY);
    fillGradient.addColorStop(0, '#FFD700');
    fillGradient.addColorStop(1, '#FF8C00');
    
    ctx.fillStyle = fillGradient;
    ctx.beginPath();
    ctx.roundRect(xpBarX, xpBarY, Math.min(progressWidth, xpBarWidth), xpBarHeight, xpBarRadius);
    ctx.fill();

    // Progress percentage
    ctx.textAlign = 'left';
    ctx.font = 'bold 22px "Segoe UI", "Arial", sans-serif';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(`${userData.progressPercentage.toFixed(1)}%`, xpBarX, xpBarY - 15);

    // ===== STATS SECTION =====
    // Total XP stat
    ctx.font = 'bold 20px "Segoe UI", "Arial", sans-serif';
    ctx.fillStyle = '#a3a6aa';
    ctx.textAlign = 'left';
    ctx.fillText(`TOTAL XP`, 250, 330);
    
    ctx.font = 'bold 24px "Segoe UI", "Arial", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(userData.totalXp.toLocaleString(), 250, 360);

    // Voice minutes stat (if available)
    if (userData.voiceMinutes) {
      ctx.font = 'bold 20px "Segoe UI", "Arial", sans-serif';
      ctx.fillStyle = '#a3a6aa';
      ctx.fillText(`VOICE TIME`, 450, 330);
      
      ctx.font = 'bold 24px "Segoe UI", "Arial", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${userData.voiceMinutes}m`, 450, 360);
    }

    return canvas.toBuffer('image/png');
  } catch (error) {
    console.error('Error generating rank card:', error);
    throw error;
  }
}

module.exports = {
  generateRankCard,
};
