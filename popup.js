const set = (id, text, cls) => {
    const el = document.getElementById(id);
    el.textContent = text;
    el.className = 'val ' + (cls || '');
};

const showError = (msg) => {
    const box = document.getElementById('errorBox');
    box.textContent = msg;
    box.style.display = 'block';
};

const refreshStatus = async () => {
    const stored = await browser.storage.local.get(['name', 'ktp', 'face']);
    set('stName', stored.name || 'Missing', stored.name ? 'ok' : 'missing');
    set('stKtp',  stored.ktp  ? '✓ Saved' : 'Missing', stored.ktp  ? 'ok' : 'missing');
    set('stFace', stored.face ? '✓ Saved' : 'Missing', stored.face ? 'ok' : 'missing');
    const allReady = stored.name && stored.ktp && stored.face;
    document.getElementById('registerNow').disabled = !allReady;
    document.getElementById('hint').textContent = allReady ? '' : 'Tap ⚙ Setup to configure.';
};

document.addEventListener('DOMContentLoaded', refreshStatus);

document.getElementById('openSettings').addEventListener('click', () => {
    browser.tabs.create({
        url: browser.runtime.getURL('options.html')
    });
    window.close();
});

document.getElementById('registerNow').addEventListener('click', async () => {
    const btn = document.getElementById('registerNow');
    const errorBox = document.getElementById('errorBox');
    errorBox.style.display = 'none';
    btn.textContent = 'Registering...';
    btn.disabled = true;

    const stored = await browser.storage.local.get(['name', 'companyId', 'phone', 'ktp', 'face']);

    try {
        const res = await fetch(
            'https://vms.cyber2tower.com/VisitorRequest/SaveVisitorRequestGeneral',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Name: stored.name,
                    CompanyId: stored.companyId || '',
                    Reason: 'Intern',
                    PhoneNumber: stored.phone || '',
                    IdBase64: stored.ktp,
                    FaceBase64: stored.face,
                }),
            }
        );

        const data = await res.json();

        if (data.success) {
            browser.tabs.create({
                url: 'https://vms.cyber2tower.com/Visitor/Access?id=' + data.id
            });
            window.close();
        } else {
            btn.textContent = 'REGISTER & GET QR';
            btn.disabled = false;
            showError('Server: ' + (data.message || JSON.stringify(data)));
        }
    } catch (err) {
        btn.textContent = 'REGISTER & GET QR';
        btn.disabled = false;
        showError('Network error: ' + err.message);
    }
});
