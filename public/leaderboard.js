document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const showBtn = document.getElementById('showLeaderboardBtn');
    const container = document.getElementById('leaderboardContainer');
    const list = document.getElementById('leaderboardList');
    const errorDiv = document.getElementById('leaderboardError');

    if (!token) {
        errorDiv.textContent = 'Please log in first.';
        errorDiv.classList.remove('hidden');
        showBtn.disabled = true;
        return;
    }

    showBtn.addEventListener('click', async () => {
        errorDiv.classList.add('hidden');
        showBtn.disabled = true;
        showBtn.textContent = 'Loading...';

        try {
            const response = await axios.get('http://localhost:3000/api/leaderboard', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            displayLeaderboard(response.data);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 403) {
                    errorDiv.textContent = 'Access denied. This is a premium feature.';
                } else {
                    errorDiv.textContent = 'Error loading leaderboard. Please try again.';
                }
            } else {
                errorDiv.textContent = 'Network error. Check your connection.';
            }
            errorDiv.classList.remove('hidden');
        } finally {
            showBtn.disabled = false;
            showBtn.textContent = 'Show Leaderboard';
        }
    });

    function displayLeaderboard(data) {
        list.innerHTML = '';
        data.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
        <span class="rank">#${index + 1}</span>
        <span>${item.name}</span>
        <span>$${item.totalExpenses.toFixed(2)}</span>
      `;
            list.appendChild(li);
        });
        container.classList.remove('hidden');
    }
});