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
            renderMatches(matchesData);
        } catch (error) {
            console.error('Error fetching matches:', error);
            matchesGrid.innerHTML = '<div class="error">Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.</div>';
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
                                <span class="team-name">${match.home_team}</span>
                                ${homeFlagHTML}
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
