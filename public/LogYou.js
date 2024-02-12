document.addEventListener("DOMContentLoaded", function () {
    const cancelLogin = document.getElementById('cancelLogin')
    const successLogin = document.getElementById('successLogin')

    cancelLogin.addEventListener('click', CancelLogin)
    successLogin.addEventListener('click', SuccessLogin)

    function CancelLogin() {
        window.location.href = window.location.origin
    }

    function SuccessLogin(){
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch("/api/Login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password })
        })
            .then(response => {
                if (response.ok) {
                    window.location.href = 'http://localhost:3000/connected.html';
                    window.location.href = window.location.origin
                } else {
                    alert('Mauvais login et/ou mot de passe.');
                }
            })
            .catch(error => {
                console.error('Erreur lors de la requête:', error);
            });
    }
})