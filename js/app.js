document.addEventListener('DOMContentLoaded', () => {
    // Elements for index-copy.html
    const matchesGrid = document.getElementById('matches-grid');
    const searchInput = document.getElementById('search');
    const filterSelect = document.getElementById('status-filter');
    const stageTabs = document.querySelectorAll('.stage-tab');

    // Elements for index.html (Home)
    const nextMatchSection = document.getElementById('next-match-section');
    const prevMatchSection = document.getElementById('prev-match-section');
    const upcomingMatchesGrid = document.getElementById('upcoming-matches-grid');

    let matchesData = [];
    let currentStageFilter = 'all';

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

    const generateFeaturedMatchHTML = (featured, title) => {
        const statusClass = featured.status === 'live' ? 'status-live' : (featured.status === 'finished' ? 'status-finished' : 'status-upcoming');
        let statusText = 'Sắp diễn ra';
        if (featured.status === 'live') statusText = '🔴 Đang diễn ra';
        if (featured.status === 'finished') statusText = 'Kết thúc';
        
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
        if (featured.links && featured.links.replay) {
            linksHTML += `<a href="${featured.links.replay}" target="_blank" class="btn btn-secondary" title="Xem lại toàn trận">⏪ Xem lại</a>`;
        }

        return `
            <div class="featured-header">${title}</div>
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
    };

    const generateMatchListItemHTML = (match) => {
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

        return `
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
                    ${stageDisplay} &bull; ${formatDay(match.date)}
                </div>
                ${linksHTML ? `<div class="links-container">${linksHTML}</div>` : ''}
            </div>
        `;
    };

    const renderHomePage = (matches) => {
        const now = new Date();
        const sortedMatches = [...matches].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        const upcomingMatches = sortedMatches.filter(m => m.status === 'upcoming' && new Date(m.date) >= now);
        let liveMatch = sortedMatches.find(m => m.status === 'live');
        
        // 1. Next match
        let nextMatch = liveMatch || (upcomingMatches.length > 0 ? upcomingMatches[0] : null);
        if (nextMatch) {
            nextMatchSection.innerHTML = generateFeaturedMatchHTML(nextMatch, 'Trận đấu tiếp theo');
            nextMatchSection.style.display = 'block';
        }

        // 2. Previous match
        const pastMatches = sortedMatches.filter(m => m.status === 'finished' || (new Date(m.date) < now && m.status !== 'live')).reverse();
        const prevMatch = pastMatches.length > 0 ? pastMatches[0] : null;
        if (prevMatch) {
            prevMatchSection.innerHTML = generateFeaturedMatchHTML(prevMatch, 'Trận đấu trước đó');
            prevMatchSection.style.display = 'block';
        }

        // 3. 4 matches after next match
        const upcoming4 = nextMatch && !liveMatch ? upcomingMatches.slice(1, 5) : upcomingMatches.slice(0, 4);
        if (upcoming4.length > 0) {
            upcomingMatchesGrid.innerHTML = upcoming4.map(m => generateMatchListItemHTML(m)).join('');
        } else {
            document.getElementById('upcoming-matches-section').style.display = 'none';
        }
    };

    const renderFullPage = (matches) => {
        if (!matchesGrid) return;
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
                        ${dayMatches.map(m => generateMatchListItemHTML(m)).join('')}
                    </div>
                </div>
            `;
        }
        matchesGrid.innerHTML = html;
    };

    const filterMatches = () => {
        if (!matchesGrid) return;
        const searchTerm = searchInput.value.toLowerCase();
        const statusFilter = filterSelect.value;

        const filtered = matchesData.filter(match => {
            const matchesSearch = match.home_team.toLowerCase().includes(searchTerm) || 
                                match.away_team.toLowerCase().includes(searchTerm);
            const matchesStatus = statusFilter === 'all' || match.status === statusFilter;
            const matchesStage = currentStageFilter === 'all' || match.stage === currentStageFilter;
            
            return matchesSearch && matchesStatus && matchesStage;
        });

        renderFullPage(filtered);
    };

    const fetchMatches = async () => {
        try {
            if (matchesGrid) matchesGrid.innerHTML = '<div class="loading">Đang tải dữ liệu trận đấu...</div>';
            
            const response = await fetch('data/matches.json');
            if (!response.ok) throw new Error('Không thể tải dữ liệu');
            
            matchesData = await response.json();
            
            if (nextMatchSection) {
                renderHomePage(matchesData);
            } else if (matchesGrid) {
                renderFullPage(matchesData);

                // Auto-scroll to the day of the last finished match
                setTimeout(() => {
                    const now = new Date();
                    const sorted = [...matchesData].sort((a, b) => new Date(a.date) - new Date(b.date));
                    const pastMatches = sorted.filter(m => m.status === 'finished' || (new Date(m.date) < now && m.status !== 'live')).reverse();
                    const prevMatch = pastMatches.length > 0 ? pastMatches[0] : null;
                    
                    if (prevMatch) {
                        const targetDayStr = formatDay(prevMatch.date);
                        const dateHeaders = document.querySelectorAll('.date-header');
                        for (let header of dateHeaders) {
                            if (header.innerText.includes(targetDayStr)) {
                                // Offset by 180px to account for the sticky header
                                const y = header.getBoundingClientRect().top + window.scrollY - 180;
                                window.scrollTo({top: y, behavior: 'smooth'});
                                break;
                            }
                        }
                    }
                }, 100);
            }
        } catch (error) {
            console.error('Error fetching matches:', error);
            if (matchesGrid) matchesGrid.innerHTML = '<div class="error">Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.</div>';
        }
    };

    // Event listeners for index-copy.html
    if (searchInput) searchInput.addEventListener('input', filterMatches);
    if (filterSelect) filterSelect.addEventListener('change', filterMatches);
    
    if (stageTabs.length > 0) {
        stageTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                stageTabs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                currentStageFilter = e.target.getAttribute('data-stage');
                filterMatches();
            });
        });
    }

    // Initial load
    fetchMatches();
});
