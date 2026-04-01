(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const incomingId = urlParams.get("id");

  if (incomingId) {
    localStorage.setItem("visitor_registration_id", incomingId);

    window.location.replace("https://vms.cyber2tower.com/Visitor/Access");
  }
})();
