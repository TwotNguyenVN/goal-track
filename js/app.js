document.addEventListener('DOMContentLoaded', () => {
    const matchesGrid = document.getElementById('matches-grid');
    const searchInput = document.getElementById('search');
    const filterSelect = document.getElementById('status-filter');

    let matchesData = [];

    // Fetch data
    const fetchMatches = async () => {
        try {
            // Hiển thị trạng thái loading
            matchesGrid.innerHTML = '<div class="loading">Đang tải dữ liệu trận đấu...</div>';
            
            // cache busting for local files can be skipped, but helpful if data changes frequently
            const response = await fetch('data/matches.json');
            if (!response.ok) throw new Error('Không thể tải dữ liệu');
            
            matchesData = await response.json();
            renderFeaturedMatch(matchesData);
            renderMatches(matchesData);
        } catch (error) {
            console.error('Error fetching matches:', error);
            matchesGrid.innerHTML = '<div class="error">Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.</div>';
        }
    };

    // Render featured match
    const renderFeaturedMatch = (matches) => {
        const featuredSection = document.getElementById('upcoming-match-section');
        const now = new Date();
        
        // Find first live match or next upcoming match
        let featured = matches.find(m => m.status === 'live');
        if (!featured) {
            const upcoming = matches.filter(m => m.status === 'upcoming' && new Date(m.date) > now)
                                    .sort((a,b) => new Date(a.date) - new Date(b.date));
            if (upcoming.length > 0) featured = upcoming[0];
        }

        if (featured) {
            const statusClass = featured.status === 'live' ? 'status-live' : 'status-upcoming';
            const statusText = featured.status === 'live' ? '🔴 Đang diễn ra' : 'Sắp diễn ra';
            
            const homeFlagHTML = featured.home_flag_local 
                ? `<img src="${featured.home_flag_local}" alt="${featured.home_team} flag" class="team-flag">` 
                : `<span class="flag-placeholder"></span>`;
            
            const awayFlagHTML = featured.away_flag_local 
                ? `<img src="${featured.away_flag_local}" alt="${featured.away_team} flag" class="team-flag">` 
                : `<span class="flag-placeholder"></span>`;
                
            let stageDisplay = featured.stage;
            if (featured.group) stageDisplay += ` &bull; ${featured.group}`;

            let linksHTML = '';
            if (featured.links && featured.links.live && featured.links.live.length > 0) {
                featured.links.live.forEach(liveLink => {
                    linksHTML += `<a href="${liveLink.url}" target="_blank" class="btn btn-primary" title="Xem trực tiếp">▶ ${liveLink.name}</a>`;
                });
            }

            featuredSection.innerHTML = `
                <div class="featured-header">Trận đấu tâm điểm</div>
                <div class="match-list-item featured-item">
                    <div class="match-status-badge ${statusClass}">${statusText}</div>
                    <div class="match-stage" style="margin-bottom: 0.5rem; text-align: center;">
                        ${stageDisplay} &bull; ${formatTime(featured.date)} - ${formatDay(featured.date)}
                    </div>
                    <div class="match-main">
                        <div class="team team-home">
                            ${homeFlagHTML}
                            <span class="team-name">${featured.home_team}</span>
                        </div>
                        <div class="score-container" style="font-size: 1.5rem;">
                            ${featured.status === 'upcoming' ? 'VS' : (featured.home_score + ' - ' + featured.away_score)}
                        </div>
                        <div class="team team-away">
                            ${awayFlagHTML}
                            <span class="team-name">${featured.away_team}</span>
                        </div>
                    </div>
                    ${linksHTML ? `<div class="links-container" style="justify-content: center; margin-top: 1rem;">${linksHTML}</div>` : ''}
                </div>
            `;
            featuredSection.style.display = 'block';
        } else {
            featuredSection.style.display = 'none';
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const options = { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    // Format date headers
    const formatDay = (dateString) => {
        const d = new Date(dateString);
        return `Ngày ${d.getDate()}/${d.getMonth() + 1}`;
    };

    // Format time for match
    const formatTime = (dateString) => {
        const d = new Date(dateString);
        return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    let initialLoad = true;

    // Render matches
    const renderMatches = (matches) => {
        if (matches.length === 0) {
            matchesGrid.innerHTML = '<div class="loading">Không tìm thấy trận đấu nào phù hợp.</div>';
            return;
        }

        // Group matches by day
        const grouped = {};
        matches.forEach(match => {
            const dayStr = formatDay(match.date);
            if (!grouped[dayStr]) {
                grouped[dayStr] = [];
            }
            grouped[dayStr].push(match);
        });

        let html = '';
        
        for (const [dayStr, dayMatches] of Object.entries(grouped)) {
            html += `
                <div class="date-section">
                    <h2 class="date-header"><span class="date-bar"></span> ${dayStr}</h2>
                    <div class="matches-list">
            `;
            
            dayMatches.forEach(match => {
                const statusClass = `status-${match.status}`;
                const statusText = match.status === 'live' ? 'Đang đá' : 
                                 match.status === 'finished' ? 'Kết thúc' : 'Dự đoán';
                
                const scoreDisplay = match.status === 'upcoming' 
                    ? `<span class="time-only">${formatTime(match.date)}</span>`
                    : `<span class="score-only">${match.home_score} - ${match.away_score}</span>`;

                let linksHTML = '';
                if (match.links) {
                    if (match.links.live && match.links.live.length > 0) {
                        match.links.live.forEach(liveLink => {
                            linksHTML += `<a href="${liveLink.url}" target="_blank" class="btn btn-primary" title="Xem trực tiếp">▶ ${liveLink.name}</a>`;
                        });
                    }
                    if (match.links.replay) {
                        linksHTML += `<a href="${match.links.replay}" target="_blank" class="btn btn-secondary" title="Xem lại toàn trận">⏪ Xem lại</a>`;
                    }
                }

                let stageDisplay = match.stage;
                if (match.group) {
                    stageDisplay += ` &bull; ${match.group}`;
                }

                const homeFlagHTML = match.home_flag_local 
                    ? `<img src="${match.home_flag_local}" alt="${match.home_team} flag" class="team-flag">` 
                    : `<span class="flag-placeholder"></span>`;
                
                const awayFlagHTML = match.away_flag_local 
                    ? `<img src="${match.away_flag_local}" alt="${match.away_team} flag" class="team-flag">` 
                    : `<span class="flag-placeholder"></span>`;

                html += `
                    <div class="match-list-item">
                        <div class="match-status-badge ${statusClass}">
                            ${match.status === 'live' ? '🔴 ' : ''}${statusText}
                        </div>
                        <div class="match-main">
                            <div class="team team-home">
                                ${homeFlagHTML}
                                <span class="team-name">${match.home_team}</span>
                            </div>
                            <div class="score-container">
                                ${scoreDisplay}
                            </div>
                            <div class="team team-away">
                                ${awayFlagHTML}
                                <span class="team-name">${match.away_team}</span>
                            </div>
                        </div>
                        <div class="match-stage">
                            ${stageDisplay}
                        </div>
                        ${linksHTML ? `<div class="links-container">${linksHTML}</div>` : ''}
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        }

        matchesGrid.innerHTML = html;

        if (initialLoad) {
            scrollToLatestMatchDay(grouped);
            initialLoad = false;
        }
    };

    const scrollToLatestMatchDay = (grouped) => {
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today

        let targetDateStr = null;
        let targetDateObj = new Date(0); // Start epoch

        for (const [dayStr, dayMatches] of Object.entries(grouped)) {
            const matchDate = new Date(dayMatches[0].date);
            matchDate.setHours(0, 0, 0, 0);

            // Find the most recent date that is less than or equal to today
            if (matchDate <= today) {
                if (matchDate > targetDateObj) {
                    targetDateObj = matchDate;
                    targetDateStr = dayStr;
                }
            }
        }

        // If no past/current matches exist (e.g. tournament hasn't started), scroll to the very first match
        if (!targetDateStr) {
            targetDateStr = Object.keys(grouped)[0];
        }

        if (targetDateStr) {
            const headers = document.querySelectorAll('.date-header');
            for (const header of headers) {
                if (header.textContent.includes(targetDateStr)) {
                    // Small delay to ensure rendering is completely done
                    setTimeout(() => {
                        header.parentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 500); // 0.5s delay for smooth UX
                    break;
                }
            }
        }
    };

    // Filter logic
    let currentStageFilter = 'all';

    const filterMatches = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const statusFilter = filterSelect.value;

        const filtered = matchesData.filter(match => {
            const matchesSearch = match.home_team.toLowerCase().includes(searchTerm) || 
                                match.away_team.toLowerCase().includes(searchTerm);
            const matchesStatus = statusFilter === 'all' || match.status === statusFilter;
            const matchesStage = currentStageFilter === 'all' || match.stage === currentStageFilter;
            
            return matchesSearch && matchesStatus && matchesStage;
        });

        renderMatches(filtered);
    };

    // Tabs logic
    const stageTabs = document.querySelectorAll('.stage-tab');
    stageTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            // Remove active class from all
            stageTabs.forEach(t => t.classList.remove('active'));
            // Add to clicked
            e.target.classList.add('active');
            
            currentStageFilter = e.target.getAttribute('data-stage');
            filterMatches();
        });
    });

    // Event listeners
    searchInput.addEventListener('input', filterMatches);
    filterSelect.addEventListener('change', filterMatches);

    // Initial load
    fetchMatches();
});
