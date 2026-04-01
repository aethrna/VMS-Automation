const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const [header, base64] = reader.result.split(',');
        const mimeType = header.match(/:(.*?);/)[1];
        resolve({ base64, mimeType });
    };
    reader.onerror = reject;
});

const renderPreview = (key, base64, mimeType) => {
    const strip = document.getElementById(key + 'Strip');
    const status = document.getElementById(key + 'Status');
    const oldImg = strip.querySelector('img');
    if (oldImg) oldImg.remove();
    const img = document.createElement('img');
    img.src = `data:${mimeType};base64,${base64}`;
    strip.insertBefore(img, strip.firstChild);
    status.textContent = '✓ Image ready';
    status.className = 'preview-status ok';
};

const showToast = (msg = '✓ Settings saved') => {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2200);
};

document.addEventListener('DOMContentLoaded', async () => {
    const stored = await browser.storage.local.get(['name', 'companyId', 'phone', 'ktp', 'ktpMime', 'face', 'faceMime']);
    if (stored.name) document.getElementById('name').value = stored.name;
    if (stored.companyId) document.getElementById('companyId').value = stored.companyId;
    if (stored.phone) document.getElementById('phone').value = stored.phone;
    if (stored.ktp) renderPreview('ktp', stored.ktp, stored.ktpMime || 'image/jpeg');
    if (stored.face) renderPreview('face', stored.face, stored.faceMime || 'image/jpeg');
});

const handleUpload = async (e, key) => {
    const file = e.target.files[0];
    if (!file) return;
    const status = document.getElementById(key + 'Status');
    status.textContent = 'Processing...';
    status.className = 'preview-status loading';
    try {
        const { base64, mimeType } = await toBase64(file);
        await browser.storage.local.set({ [key]: base64, [key + 'Mime']: mimeType });
        renderPreview(key, base64, mimeType);
    } catch (err) {
        status.textContent = '❌ Failed to read file';
        status.className = 'preview-status';
        status.style.color = '#e94560';
        console.error(err);
    }
};

document.getElementById('ktpInput').addEventListener('change', e => handleUpload(e, 'ktp'));
document.getElementById('faceInput').addEventListener('change', e => handleUpload(e, 'face'));

document.getElementById('saveBtn').addEventListener('click', async () => {
    await browser.storage.local.set({
        name: document.getElementById('name').value.trim(),
        companyId: document.getElementById('companyId').value.trim(),
        phone: document.getElementById('phone').value.trim(),
    });
    showToast('✓ Saved! Returning...');
    setTimeout(() => window.close(), 1000);
});
