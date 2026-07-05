const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('Khởi động trình duyệt...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('Đang truy cập VnExpress...');
    await page.goto('https://vnexpress.net/the-thao/world-cup-2026/lich-thi-dau', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Đợi 5 giây để đảm bảo DOM render đủ
    await page.waitForTimeout(5000);

    const extractedMatches = await page.evaluate(() => {
      const matches = [];
      const matchElements = document.querySelectorAll('.doidau.flexbox');
      
      let currentGroupOrStage = "TBD";
      let matchId = 1;

      matchElements.forEach((el) => {
        try {
          const homeTeam = el.querySelector('.doi-1 .name')?.innerText?.trim() || 'Chưa rõ';
          const awayTeam = el.querySelector('.doi-2 .name')?.innerText?.trim() || 'Chưa rõ';
          
          let scoreText = el.querySelector('.ti-so .so')?.innerText?.trim() || '';
          
          let homeScore = null;
          let awayScore = null;
          let status = 'upcoming';

          if (scoreText && scoreText.includes('-')) {
            const parts = scoreText.split('-');
            homeScore = parseInt(parts[0].trim(), 10);
            awayScore = parseInt(parts[1].trim(), 10);
            
            if (!isNaN(homeScore) && !isNaN(awayScore)) {
              status = 'finished'; // Có thể VnExpress có class báo live, nhưng tạm xét finished nếu có số
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

          // Lấy vòng đấu
          const stageTag = el.querySelector('.row-tags .item-tag')?.innerText?.trim();
          if (stageTag) {
            currentGroupOrStage = stageTag;
          }

          matches.push({
            id: String(matchId++),
            home_team: homeTeam,
            away_team: awayTeam,
            stage: stageTag || currentGroupOrStage,
            status: status,
            home_score: homeScore,
            away_score: awayScore,
            stadium: "TBD",
            links: {
              live: [
                  {"name": "VTV Go", "url": "https://vtvgo.vn/"},
                  {"name": "Socolive", "url": "https://socolive.pro/"},
                  {"name": "Xoilac", "url": "https://xoilac.tv/"}
              ],
              replay: "https://youtube.com/fifa"
            }
          });
        } catch (err) {
          // Bỏ qua lỗi
        }
      });
      return matches;
    });

    console.log(`Đã trích xuất được ${extractedMatches.length} trận đấu từ VnExpress.`);

    // Vì dữ liệu cũ được mock theo mẫu, ta có thể ghi đè toàn bộ hoặc map ngày tháng.
    // Ở đây ta ghi đè danh sách match (giữ nguyên ID). Về date, VnExpress ẩn date trong thẻ comment. 
    // Tạm thời ta lấy 104 trận và bổ sung ngày tháng tĩnh (mock date) nếu không cào được.
    
    if (extractedMatches.length > 0) {
      // Mock dates manually since the DOM doesn't expose them cleanly
      const baseDate = new Date('2026-06-12T02:00:00+07:00'); 
      const addDays = (startDate, daysToAdd, hoursOffset = 0) => {
          const d = new Date(startDate);
          d.setDate(d.getDate() + daysToAdd);
          d.setHours(d.getHours() + hoursOffset);
          return d.toISOString();
      };
      
      let dayOffset = 0;
      extractedMatches.forEach((match, index) => {
         // Phân bổ ngày tạm thời: 72 trận đầu (vòng bảng) -> 16 ngày
         if (index < 72) {
             match.date = addDays(baseDate, dayOffset, (index % 4) * 3);
             if (index > 0 && index % 4 === 0) dayOffset++;
         } else if (index < 88) { // vòng 32
             match.date = addDays(baseDate, 16 + Math.floor((index - 72)/3), ((index - 72) % 3) * 4);
         } else if (index < 96) { // vòng 16
             match.date = addDays(baseDate, 22 + Math.floor((index - 88)/2), ((index - 88) % 2) * 4);
         } else if (index < 100) { // tứ kết
             match.date = addDays(baseDate, 27 + Math.floor((index - 96)/2), ((index - 96) % 2) * 4);
         } else if (index < 102) { // bán kết
             match.date = addDays(baseDate, 32 + (index - 100), 0);
         } else if (index === 102) { // hạng 3
             match.date = addDays(baseDate, 36, 0);
         } else { // chung kết
             match.date = addDays(baseDate, 38, 0);
         }
      });

      const matchesPath = path.join(__dirname, '../data/matches.json');
      fs.writeFileSync(matchesPath, JSON.stringify(extractedMatches, null, 2));
      console.log(`Đã cập nhật toàn bộ ${extractedMatches.length} trận đấu vào data/matches.json`);
    } else {
      console.log('Không tìm thấy trận nào.');
    }
  } catch (error) {
    console.error('Lỗi trong quá trình cào dữ liệu:', error);
  } finally {
    await browser.close();
    console.log('Hoàn thành kịch bản cào dữ liệu.');
  }
})();
