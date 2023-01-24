
window.addEventListener('DOMContentLoaded', (_) => {
    if (
      document.location.hash.includes("access_token") &&
      document.location.hash.includes("token_type") &&
      document.location.hash.includes("expires_in") &&
      document.location.hash.includes("refresh_token") &&
      document.location.hash.includes("confirmation_token")
    ) {
      const redirectUrl = "/notes";
      window.location = redirectUrl + document.location.hash;
    }
});