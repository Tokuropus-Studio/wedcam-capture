'use strict';
// Where the password reset email lands. The publishable key is public by design; the token
// that actually allows the change arrives in the link and leaves the address bar at once.
(() => {
  const LOCAL = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  const API = LOCAL ? 'http://127.0.0.1:54321' : 'https://jacrtrmnqinjulmvxcbw.supabase.co';
  const KEY = LOCAL ? new URLSearchParams(location.search).get('key') : 'sb_publishable_9vhWzPQNqUNiH7g04aJpPw_IDGQHDsG';
  const tr = (navigator.language || '').toLowerCase().startsWith('tr');
  const say = (turkish, english) => (tr ? turkish : english);
  const app = document.getElementById('app');
  const params = new URLSearchParams(location.hash.slice(1));
  const accessToken = params.get('access_token');
  history.replaceState(null, '', location.pathname + location.search);

  const message = (title, body) => {
    const heading = document.createElement('h1');
    heading.className = 'center';
    heading.textContent = title;
    const text = document.createElement('p');
    text.className = 'center muted';
    text.textContent = body;
    app.replaceChildren(heading, text);
  };

  if (!accessToken) {
    message(say('Bu bağlantı geçerli değil', 'This link is not valid'), say('Uygulamadan yeni bir şifre yenileme bağlantısı isteyin.', 'Request a new reset link from the app.'));
    return;
  }

  const heading = document.createElement('h1');
  heading.textContent = say('Yeni şifre', 'New password');
  const label = document.createElement('label');
  label.className = 'field';
  label.htmlFor = 'password';
  label.textContent = say('EN AZ 8 KARAKTER', 'AT LEAST 8 CHARACTERS');
  const input = document.createElement('input');
  input.type = 'password';
  input.id = 'password';
  input.autocomplete = 'new-password';
  const error = document.createElement('p');
  error.className = 'error';
  const button = document.createElement('button');
  button.className = 'btn';
  button.textContent = say('Şifreyi Kaydet', 'Save Password');
  button.disabled = true;
  input.oninput = () => { button.disabled = input.value.length < 8; };
  button.onclick = async () => {
    button.disabled = true;
    error.textContent = '';
    try {
      const response = await fetch(`${API}/auth/v1/user`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json', apikey: KEY, authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ password: input.value }),
      });
      if (response.ok) {
        message(say('Şifreniz değişti', 'Password changed'), say('Uygulamaya dönüp yeni şifrenizle giriş yapın.', 'Go back to the app and log in with your new password.'));
        return;
      }
      const body = await response.json().catch(() => ({}));
      error.textContent = body.error_code === 'weak_password' ? say('Daha güçlü bir şifre seçin.', 'Choose a stronger password.')
        : body.error_code === 'same_password' ? say('Yeni şifre eskisinden farklı olmalı.', 'The new password must be different.')
        : say('Bağlantının süresi dolmuş olabilir. Uygulamadan yenisini isteyin.', 'The link may have expired. Request a new one from the app.');
    } catch {
      error.textContent = say('Bağlantı kurulamadı. Tekrar deneyin.', 'Could not connect. Please try again.');
    }
    button.disabled = false;
  };
  app.replaceChildren(heading, label, input, error, button);
})();
