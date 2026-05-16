
/* ============================================================
   DYNAMIC SIDENOTE CLEARANCE (Global Portfolio Mandate)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const sidenoteParagraphs = document.querySelectorAll('.col-with-sidenotes');
    sidenoteParagraphs.forEach(p => {
        const sn = p.querySelector('.sn');
        if (sn) {
            const updateHeight = () => {
                if (window.innerWidth >= 1240) {
                    // Calculate exact clearance needed based on the sidenote's absolute top position
                    const neededHeight = sn.offsetTop + sn.offsetHeight + 40;
                    p.style.minHeight = neededHeight + 'px';
                } else {
                    p.style.minHeight = 'auto';
                }
            };
            updateHeight();
            setTimeout(updateHeight, 250);
            window.addEventListener('resize', updateHeight);
        }
    });
});
