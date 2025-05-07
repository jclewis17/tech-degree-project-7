const alertContainer = document.getElementById('alert');

setTimeout(() => {
    alertContainer.innerHTML = `
        <div class="alert-banner" style="opacity: 0; transform: translateY(-100%);">
            <p><strong>Alert:</strong> You have <strong>6</strong> overdue tasks to complete</p>
            <p class="alert-banner-close">x</p>
        </div>
    `;

    const banner = document.querySelector('.alert-banner');

    requestAnimationFrame(() => {
        setTimeout(() => {
            banner.style.opacity = '';
            banner.style.transform = '';
            banner.classList.add('show');
        }, 20);
    });

    banner.addEventListener('click', e => {
        if (e.target.classList.contains("alert-banner-close")) {
            banner.style.display = "none";
        }
    });
}, 1500);
