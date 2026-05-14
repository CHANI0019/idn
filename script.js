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
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const markdown = await response.text();
                
                // Use marked.js to render markdown (if loaded)
                if (window.marked) {
                    modalBody.innerHTML = marked.parse(markdown);
                } else {
                    modalBody.innerHTML = `<pre style="white-space: pre-wrap;">${markdown}</pre>`;
                }
            } catch (error) {
                console.error('Document load error:', error);
                let errorMsg = `<p style="color: #ef4444; font-weight: bold;">Error: ${error.message}</p>`;
                
                if (window.location.protocol === 'file:') {
                    errorMsg += `
                    <div style="margin-top: 2rem; padding: 1.5rem; background: #fef2f2; border-radius: 8px; color: #991b1b; font-size: 0.95rem; border: 1px solid #fee2e2;">
                        <p><strong>💡 로컬 파일 보안 이슈 안내 (CORS)</strong></p>
                        <p style="margin-top: 0.5rem;">브라우저 보안 정책상 <code>file://</code> 프로토콜에서는 직접적인 문서 읽기가 제한될 수 있습니다.</p>
                        <ul style="margin-top: 1rem; list-style-position: inside;">
                            <li>VS Code의 <b>Live Server</b> 확장 프로그램을 사용해 실행하세요.</li>
                            <li>또는 터미널에서 <code>npx serve</code> 명령어로 로컬 서버를 구동하세요.</li>
                            <li>(Edge/Chrome 사용 시) <code>--allow-file-access-from-files</code> 옵션으로 브라우저를 실행해야 합니다.</li>
                        </ul>
                    </div>`;
                }
                modalBody.innerHTML = errorMsg;
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
