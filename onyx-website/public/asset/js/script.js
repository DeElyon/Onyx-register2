document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registration-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const mobile = document.getElementById('mobile').value;
            const courseCode = document.getElementById('course-code').value;
            
            // Store in localStorage (for demo purposes)
            localStorage.setItem('onyxRegistration', JSON.stringify({
                name,
                email,
                mobile,
                courseCode,
                timestamp: new Date().toISOString()
            }));
            
            // Add a slight delay for animation
            form.classList.add('processing');
            setTimeout(() => {
                window.location.href = 'success.html';
            }, 800);
        });
    }
    
    // Add floating animation to particles
    const particles = document.querySelector('.particles');
    if (particles) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            particles.style.transform = translate(-${x * 30}px, -${y * 30}px);
        });
    }
});
