const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
const message = urlParams.get('message');
const link = urlParams.get('link');

const messageContainer = document.getElementById('messageContainer');
const messageText = document.getElementById('messageText');
const resetForm = document.getElementById('resetForm');

if (message === 'check_email') {
    messageText.innerHTML = 'Password reset link has been sent to your email.<br><br>';
    if (link) {
        messageText.innerHTML += `For testing, click here: <a href="${link}" style="color: blue; text-decoration: underline;">Reset Password</a>`;
    }
    messageContainer.style.display = 'block';
    resetForm.style.display = 'none';
} else if (token) {
    messageContainer.style.display = 'none';
    resetForm.style.display = 'block';
} else {
    alert('Invalid reset link');
    window.location.href = 'login.html';
}

document.getElementById('resetBtn').addEventListener('click', async () => {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!newPassword || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }

    if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    try {
        const response = await axios.post('http://localhost:3000/api/users/reset-password', {
            token,
            newPassword
        });

        alert(response.data.message);
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error:', error);
        alert(error.response?.data?.message || 'An error occurred. Please try again.');
    }
});
