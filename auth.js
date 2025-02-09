require('dotenv').config();  // Lädt die Variablen aus der .env-Datei

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectURI = 'http://localhost:5500/callback.html'; // Deine Redirect URI auf localhost

// Funktion zum Abrufen des Access Tokens
async function getAccessToken(code) {
  const response = await fetch('https://apis.roblox.com/oauth/v1/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code: code,
      client_id: clientID,
      client_secret: clientSecret,
      redirect_uri: redirectURI,
      grant_type: 'authorization_code'
    }),
  });

  const data = await response.json();
  if (data.access_token) {
    // Token im Cookie speichern
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 10); // Setzt das Ablaufdatum auf 10 Jahre in der Zukunft
    document.cookie = `roblox_token=${data.access_token}; expires=${expirationDate.toUTCString()}; path=/; secure; samesite=strict;`;
    window.location.href = '/swiper.html';  // Weiterleitung zur Swiper-Seite
  } else {
    alert('Fehler beim Abrufen des Tokens');
  }
}

// Extrahiere den Code aus der URL
function getCodeFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('code');
}

window.onload = async () => {
  const code = getCodeFromURL();
  if (code) {
    await getAccessToken(code);  // Token abrufen und im Cookie speichern
  } else {
    alert('Kein Code in der URL');
  }
};
