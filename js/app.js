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

        const grouped = {};
        matches.forEach(match => {
            const dayStr = formatDay(match.date);
            if (!grouped[dayStr]) {
                grouped[dayStr] = [];
            }
            grouped[dayStr].push(match);
        });

        // Determine if we are filtering
        const isFiltered = searchInput.value.trim() !== '' || 
                           filterSelect.value !== 'all' || 
                           currentStageFilter !== 'all';

        // Find target date (today or most recent past) for splitting
        let targetDateStr = null;
        if (!isFiltered) {
            const today = new Date();
            today.setHours(23, 59, 59, 999);
            let targetDateObj = new Date(0);

            for (const [dayStr, dayMatches] of Object.entries(grouped)) {
                const matchDate = new Date(dayMatches[0].date);
                matchDate.setHours(0, 0, 0, 0);
                if (matchDate <= today && matchDate > targetDateObj) {
                    targetDateObj = matchDate;
                    targetDateStr = dayStr;
                }
            }
            if (!targetDateStr && Object.keys(grouped).length > 0) {
                targetDateStr = Object.keys(grouped)[0];
            }
        }

        let pastHtml = '';
        let futureHtml = '';
        let pastMatchesCount = 0;
        let isPast = !isFiltered; // If filtered, nothing is "past" (we show everything)

        for (const [dayStr, dayMatches] of Object.entries(grouped)) {
            if (isPast && dayStr === targetDateStr) {
                isPast = false;
            }

            let dayHtml = `
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

                dayHtml += `
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

                if (isPast) {
                    pastMatchesCount++;
                }
            });
            
            dayHtml += `
                    </div>
                </div>
            `;

            if (isPast) {
                pastHtml += dayHtml;
            } else {
                futureHtml += dayHtml;
            }
        }

        let finalHtml = '';
        
        if (pastMatchesCount > 0) {
            finalHtml += `
                <div class="past-matches-wrapper">
                    <button id="toggle-past-matches" class="btn btn-secondary toggle-past-btn" style="width: 100%; margin-bottom: 2rem; padding: 1rem; font-size: 1rem;">
                        ⏬ Xem các trận đấu trước đó (${pastMatchesCount} trận)
                    </button>
                    <div id="past-matches-container" style="display: none;">
                        ${pastHtml}
                    </div>
                </div>
            `;
        }

        finalHtml += futureHtml;

        matchesGrid.innerHTML = finalHtml;

        // Attach event listener to the toggle button if it exists
        const toggleBtn = document.getElementById('toggle-past-matches');
        const pastContainer = document.getElementById('past-matches-container');
        
        if (toggleBtn && pastContainer) {
            toggleBtn.addEventListener('click', () => {
                const isHidden = pastContainer.style.display === 'none';
                if (isHidden) {
                    pastContainer.style.display = 'block';
                    toggleBtn.innerHTML = `⏫ Thu gọn các trận đấu trước đó`;
                } else {
                    pastContainer.style.display = 'none';
                    toggleBtn.innerHTML = `⏬ Xem các trận đấu trước đó (${pastMatchesCount} trận)`;
                    // Scroll back up slightly to avoid losing context when collapsing
                    toggleBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
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
