document.getElementById('forgotBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;

    if (!email) {
        alert('Please enter your email');
        return;
    }

    try {
        const response = await axios.post('http://localhost:3000/api/users/forgot-password', { email });

        document.getElementById('forgotForm').style.display = 'none';
        document.getElementById('heading').style.display = 'none';
        const messageContainer = document.getElementById('messageContainer');
        const messageText = document.getElementById('messageText');
        if (response.data.resetLink) {
            messageText.innerHTML += `Click here to reset your password: <a href="${response.data.resetLink}" style="color: blue; text-decoration: underline;">Reset Password</a>`;
        } else {
            messageText.innerHTML += 'Please check your email for the reset link.';
        }
        messageContainer.style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});
