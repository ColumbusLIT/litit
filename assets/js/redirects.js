
window.addEventListener('DOMContentLoaded', (_) => {
    if (
      document.location.hash.includes("confirmation_token") || 
      document.location.hash.includes("recovery_token") 
    ) {
      const redirectUrl = "/notes";
      window.location = redirectUrl + document.location.hash;
    }
});