// === DOM References ===
const homeView = document.getElementById('home-view');
const talksView = document.getElementById('talks-view');
const dayTabs = document.getElementById('day-tabs');
const homeBtn = document.getElementById('home-btn');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

// === Go to calendar home ===
function goHome() {
    homeView.classList.remove('hidden');
    talksView.classList.remove('visible');
    dayTabs.style.display = 'none';
    homeBtn.style.display = 'none';
    if (mobileMenuBtn) mobileMenuBtn.classList.remove('visible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// === Enter talks mode ===
function enterTalksMode() {
    homeView.classList.add('hidden');
    talksView.classList.add('visible');
    dayTabs.style.display = 'flex';
    homeBtn.style.display = 'block';
    if (mobileMenuBtn) mobileMenuBtn.classList.add('visible');
}

// === Show a specific talk (with lazy loading) ===
async function showTalk(id) {
    const el = document.getElementById(id);
    if (!el) return;

    // Lazy load content if empty
    if (el.innerHTML.trim() === '') {
        try {
            el.innerHTML = '<p style="text-align:center;padding:2em;color:#888;">Cargando...</p>';
            const resp = await fetch('charlas/' + id + '.html');
            if (resp.ok) {
                el.innerHTML = await resp.text();
            } else {
                el.innerHTML = '<p style="color:red;">Error al cargar el contenido.</p>';
            }
        } catch (e) {
            el.innerHTML = '<p style="color:red;">Error de conexión.</p>';
        }
    }

    enterTalksMode();

    // Deactivate all talks and buttons
    document.querySelectorAll('.talk-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.talk-btn').forEach(b => b.classList.remove('active'));

    // Activate target
    el.classList.add('active');
    const btn = document.querySelector('.talk-btn[onclick*="' + id + '"]');
    if (btn) btn.classList.add('active');

    // Switch to correct day
    const day = id.startsWith('charla04') ? 'día4' :
                id.startsWith('charla03') ? 'día3' :
                id.startsWith('charla02') ? 'día2' : 'día1';
    switchDay(day, true);

    // Close mobile menu if open
    if (window.innerWidth <= 900) toggleMobile(true);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// === Day tab switching ===
function switchDay(day, skipTalkSwitch) {
    enterTalksMode();

    document.querySelectorAll('.day-tab').forEach((tab, i) => {
        tab.classList.toggle('active',
            (day === 'día1' && i === 0) ||
            (day === 'día2' && i === 1) ||
            (day === 'día3' && i === 2) ||
            (day === 'día4' && i === 3)
        );
    });

    document.getElementById('sidebar-día1').style.display = day === 'día1' ? 'block' : 'none';
    document.getElementById('sidebar-día2').style.display = day === 'día2' ? 'block' : 'none';
    document.getElementById('sidebar-día3').style.display = day === 'día3' ? 'block' : 'none';
    document.getElementById('sidebar-día4').style.display = day === 'día4' ? 'block' : 'none';

    // Auto-select first talk of the day if not skipping
    if (!skipTalkSwitch) {
        const firstTalk = day === 'día1' ? 'charla01-1' :
                          day === 'día2' ? 'charla02-1' :
                          day === 'día3' ? 'charla03-1' : 'charla04-1';
        showTalk(firstTalk);
    }
}

// === Mobile menu toggle ===
function toggleMobile(forceClose) {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (forceClose || sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
    } else {
        sidebar.classList.add('open');
        overlay.classList.add('open');
    }
}

// === Initialize: home view visible, talks hidden ===
document.getElementById('sidebar-día2').style.display = 'none';
document.getElementById('sidebar-día3').style.display = 'none';
document.getElementById('sidebar-día4').style.display = 'none';
