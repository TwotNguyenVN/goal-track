const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('Khởi động trình duyệt...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('Đang truy cập VnExpress để cập nhật tỉ số...');
    await page.goto('https://vnexpress.net/the-thao/world-cup-2026/lich-thi-dau', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(5000); // Đảm bảo render đủ

    const extractedMatches = await page.evaluate(() => {
      const matches = [];
      const matchElements = document.querySelectorAll('.doidau.flexbox');
      
      matchElements.forEach((el) => {
        try {
          const homeTeam = el.querySelector('.doi-1 .name')?.innerText?.trim();
          const awayTeam = el.querySelector('.doi-2 .name')?.innerText?.trim();
          if (!homeTeam || !awayTeam) return;

          let scoreText = el.querySelector('.ti-so .so')?.innerText?.trim() || '';
          
          let homeScore = null;
          let awayScore = null;
          let status = 'upcoming';

          if (scoreText && scoreText.includes('-')) {
            const parts = scoreText.split('-');
            homeScore = parseInt(parts[0].trim(), 10);
            awayScore = parseInt(parts[1].trim(), 10);
            
            if (!isNaN(homeScore) && !isNaN(awayScore)) {
              status = 'finished'; 
            } else {
              homeScore = null;
              awayScore = null;
            }
          }

          if (el.querySelector('.status-finish')) {
              status = 'finished';
          } else if (el.querySelector('.status-live')) {
              status = 'live';
          }

          matches.push({ home_team: homeTeam, away_team: awayTeam, home_score: homeScore, away_score: awayScore, status: status });
        } catch (err) {}
      });
      return matches;
    });

    console.log(`Đã trích xuất được ${extractedMatches.length} trận đấu từ VnExpress.`);

    if (extractedMatches.length > 0) {
      const matchesPath = path.join(__dirname, '../data/matches.json');
      const existingMatches = JSON.parse(fs.readFileSync(matchesPath, 'utf8'));

      let updatedCount = 0;
      existingMatches.forEach(existing => {
          const liveMatch = extractedMatches.find(m => m.home_team === existing.home_team && m.away_team === existing.away_team);
          if (liveMatch) {
              if (existing.home_score !== liveMatch.home_score || existing.away_score !== liveMatch.away_score || existing.status !== liveMatch.status) {
                  existing.home_score = liveMatch.home_score;
                  existing.away_score = liveMatch.away_score;
                  existing.status = liveMatch.status;
                  updatedCount++;
              }
          }
      });

      if (updatedCount > 0) {
          fs.writeFileSync(matchesPath, JSON.stringify(existingMatches, null, 2));
          console.log(`Đã cập nhật tỉ số cho ${updatedCount} trận đấu.`);
      } else {
          console.log(`Không có tỉ số/trạng thái nào mới cần cập nhật.`);
      }
    }
  } catch (error) {
    console.error('Lỗi trong quá trình cập nhật tỉ số:', error);
  } finally {
    await browser.close();
    console.log('Hoàn thành cập nhật.');
  }
})();
