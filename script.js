document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const loginMessage = document.getElementById("login-message");
    
    const loginContainer = document.getElementById("login-container");
    const teacherDashboard = document.getElementById("teacher-dashboard");
    const studentDashboard = document.getElementById("student-dashboard");
    const adminDashboard = document.getElementById("admin-dashboard");
    
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;
        
        if (username === "admin" && password === "admin") {
            showDashboard(role);
        } else {
            loginMessage.textContent = "Invalid credentials. Try again.";
            loginMessage.style.color = "red";
        }
    });
    
    function showDashboard(role) {
        loginContainer.classList.add("hidden");
        if (role === "teacher") {
            teacherDashboard.classList.remove("hidden");
        } else if (role === "student") {
            studentDashboard.classList.remove("hidden");
        } else if (role === "admin") {
            adminDashboard.classList.remove("hidden");
        }
    }
    
    document.querySelectorAll(".btn-logout").forEach(button => {
        button.addEventListener("click", function () {
            loginContainer.classList.remove("hidden");
            teacherDashboard.classList.add("hidden");
            studentDashboard.classList.add("hidden");
            adminDashboard.classList.add("hidden");
        });
    });
});
