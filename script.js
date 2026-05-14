document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll reveal animation
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.card, .token-card, .section-header');
    cards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });

    // Header transparency on scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(15, 23, 42, 0.95)';
            header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
        } else {
            header.style.background = 'rgba(15, 23, 42, 0.8)';
            header.style.boxShadow = 'none';
        }
    });

    // Modal Logic
    const modal = document.getElementById('docModal');
    const modalBody = document.getElementById('modalBody');
    const modalTitle = document.getElementById('modalTitle');
    const closeBtn = document.querySelector('.close-modal');
    const viewButtons = document.querySelectorAll('.doc-item .btn');

    viewButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const filePath = button.getAttribute('href');
            const docTitle = button.parentElement.querySelector('span').innerText;

            modalTitle.innerText = docTitle;
            modalBody.innerHTML = '<p>Loading document...</p>';
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scroll

            try {
                const response = await fetch(filePath);
                if (!response.ok) throw new Error('Failed to load document');
                const markdown = await response.text();
                
                // Use marked.js to render markdown (if loaded)
                if (window.marked) {
                    modalBody.innerHTML = marked.parse(markdown);
                } else {
                    modalBody.innerHTML = `<pre style="white-space: pre-wrap;">${markdown}</pre>`;
                }
            } catch (error) {
                modalBody.innerHTML = `<p style="color: #ef4444;">Error: ${error.message}</p>`;
            }
        });
    });

    // Close modal
    closeBtn.onclick = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };
});
