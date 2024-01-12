// Immediately-invoked function to avoid polluting the global scope
(function() {
    // Function to handle the login
    function handleLogin() {
        const username = document.getElementById('usernameInput').value.trim();
        if (username) {
            // Save the username in localStorage for use in the game
            localStorage.setItem('username', username);
            // Redirect to the game page
            window.location.href = 'game.html';
        } else {
            // Alert the user if the username field is empty
            alert('Please enter a username to start the game!');
        }
    }

    // Attach event listeners once the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Attach the login function to the "Start Game" button
        document.getElementById('startButton').addEventListener('click', handleLogin);
        // Attach the login function to the Enter key within the username input
        document.getElementById('usernameInput').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                handleLogin();
            }
        });
        // Focus the username input for immediate user input
        document.getElementById('usernameInput').focus();
    });
})();