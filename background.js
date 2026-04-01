browser.runtime.onMessage.addListener((message) => {
    if (message.action === "startRegistration") {
        performRegistration(); 
    }
});

async function performRegistration() {
    const stored = await browser.storage.local.get([
        "name", "companyId", "ktp", "face", "phone"
    ]);

    if (!stored.name || !stored.ktp) {
        console.error("Missing data!");
        return;
    }

    const MY_DATA = {
        Name: stored.name,
        CompanyId: stored.companyId,
        Reason: "Intern",
        PhoneNumber: stored.phone || "",
        IdBase64: stored.ktp,
        FaceBase64: stored.face,
    };

    try {
        const response = await fetch(
            "https://vms.cyber2tower.com/VisitorRequest/SaveVisitorRequestGeneral",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(MY_DATA),
            }
        );
        const data = await response.json();
        if (data.success) {
            browser.tabs.create({
                url: "https://vms.cyber2tower.com/Visitor/Access?id=" + data.id,
            });
        }
    } catch (error) {
        console.error("Network Error:", error);
    }
}