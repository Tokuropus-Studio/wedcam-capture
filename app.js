'use strict';
// The camera a partner opens from a link, on their own phone, without an account. Same five
// frames and the same guidance as the app. The preview is mirrored for the front camera, as
// every phone shows a selfie, but the saved file is never mirrored: that is the whole reason
// this page exists instead of the phone's own camera (K22).
(() => {
  const LOCAL = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  const API = LOCAL ? 'http://127.0.0.1:54321' : 'https://jacrtrmnqinjulmvxcbw.supabase.co';
  const CONSENT_VERSION = '2026-11-02';
  const token = location.hash.slice(1);
  const app = document.getElementById('app');

  const ROLES = [
    { key: 'front_smile', guide: 'front-smile', turn: 'front', camera: 'front', countdown: 3 },
    { key: 'front_neutral', guide: 'front-smile', turn: 'front', camera: 'front', countdown: 3 },
    { key: 'quarter_right', guide: 'quarter-right', turn: 'right', camera: 'front', countdown: 3 },
    { key: 'quarter_left', guide: 'quarter-left', turn: 'left', camera: 'front', countdown: 3 },
    { key: 'full_body', guide: 'full-body', turn: 'body', camera: 'back', countdown: 10 },
  ];

  const TEXT = {
    tr: {
      bride: 'Gelin', groom: 'Damat', title: 'Beş kare, iki dakika',
      intro: 'Bu beş kare yüzünüzü tanımamızı sağlar. Her karede ne yapmanız gerektiğini tek tek söyleyeceğiz.',
      checklist: (side) => [
        'Pencere ışığına dönün; yüzünüze düz ışık gelsin.',
        'Saçınızı geriye toplayın — alın, kulaklar ve çene açık olsun.',
        'Gözlük, şapka ve takı çıkarılsın.',
        side === 'bride' ? 'Vücuda oturan sade bir üst giyin — bol kıyafet tam boy karede vücut hatlarını gizler.' : 'Sade, yakası kapalı olmayan bir üst giyin.',
        'Dövmeniz varsa dövmenin tamamını gösteren bir kıyafet seçin.',
        'Son kare tam boy: telefonu yaslayabileceğiniz bir yer ve birkaç adım boşluk gerekir.',
      ],
      privacy: 'Fotoğraflarınız ve üretilen kareler 1 yıl saklanır. Başka uygulamalarla veya kişilerle paylaşılmaz; yalnız karelerinizi üretmek için yapay zeka hizmet sağlayıcımıza gönderilir.',
      consent: 'Fotoğraflarımın, karelerimi üretmek için yapay zeka görsel üretim sağlayıcısına gönderilmesine ve 1 yıl saklanmasına izin veriyorum.',
      start: 'Hazırım, Başlayalım', example: 'ÖRNEK', timer: 'ZAMANLAYICI', on: 'AÇIK', off: 'KAPALI', flip: 'ÇEVİR',
      names: ['Önden gülümseme', 'Önden nötr', 'Sağ 45°', 'Sol 45°', 'Tam boy'],
      cues: ['Rahat bir gülümseme — zorlamayın.', 'Tam karşıya bakın, ağzınız kapalı dursun.', 'Başınızı sağa çevirin, gülümsemeyin.', 'Başınızı sola çevirin, gülümsemeyin.', 'Telefonu bel hizasına yaslayın ve geri çekilin; ayaklarınız da kadrajda olsun.'],
      right: 'SAĞA', left: 'SOLA', question: 'Yüzünüz net ve tamamen kadrajda mı?', retake: 'Tekrar çek', use: 'Kullan',
      sending: 'Gönderiliyor…', sendFailed: 'Fotoğraf gönderilemedi. Bağlantınızı kontrol edip tekrar deneyin.', tryAgain: 'Tekrar Dene',
      doneTitle: 'Teşekkürler, hepsi geldi!', doneBody: 'Beş kareniz gönderildi. Bu sayfayı kapatabilirsiniz.', doneRetake: 'Bir kareyi yeniden çekmek isterseniz dokunun:', redo: 'Yeniden çek',
      camBlocked: 'Kamera izni verilmedi. Adres çubuğundaki ayarlardan kameraya izin verip tekrar deneyin.',
      camInApp: 'Kamera bu pencerede açılamadı. Bağlantıyı Safari veya Chrome’da açın.',
      camFailed: 'Kamera başlatılamadı. Sayfayı yenileyip tekrar deneyin.', shotFailed: 'Kare alınamadı, tekrar deneyin.', open: 'Kamerayı Aç', copy: 'Bağlantıyı Kopyala', copied: 'Kopyalandı',
      invalid: 'Bu bağlantı geçerli değil.', expired: 'Bu bağlantının süresi doldu.', revoked: 'Bu bağlantı iptal edildi.', askNew: 'Size bağlantıyı gönderen kişiden yenisini isteyin.',
      limit: 'Bu bağlantının yükleme hakkı doldu. Yeni bir bağlantı isteyin.', offline: 'Bağlantı kurulamadı. İnternetinizi kontrol edip tekrar deneyin.', reload: 'Tekrar Dene',
      notPhoto: 'Bu dosya bir fotoğraf olarak okunamadı. Tekrar çekin.',
    },
    en: {
      bride: 'Bride', groom: 'Groom', title: 'Five frames, two minutes',
      intro: 'These five frames teach the studio your face. We will ask for one thing at a time.',
      checklist: (side) => [
        'Face a window so the light falls evenly on your face.',
        'Tie your hair back — forehead, ears and jaw visible.',
        'Remove glasses, hats and jewellery.',
        side === 'bride' ? 'Wear a simple fitted top — a loose one hides your shape in the full-length frame.' : 'Wear a simple top with an open neckline.',
        'If you have a tattoo, wear something that shows all of it.',
        'The last frame is full length: you will need somewhere to prop the phone and a few steps of space.',
      ],
      privacy: 'Your photos and generated frames are kept for 1 year. They are not shared with other apps or people; they are sent only to our AI service provider to create your frames.',
      consent: 'I allow my photos to be sent to the AI image generation provider to create my frames, and to be kept for 1 year.',
      start: "I'm Ready, Let's Go", example: 'EXAMPLE', timer: 'TIMER', on: 'ON', off: 'OFF', flip: 'FLIP',
      names: ['Front, smile', 'Front, neutral', 'Right 45°', 'Left 45°', 'Full length'],
      cues: ['An easy smile — nothing forced.', 'Look straight at the lens, mouth closed.', 'Turn your head to the right, no smile.', 'Turn your head to the left, no smile.', 'Prop the phone at waist height and step back; keep your feet in frame.'],
      right: 'RIGHT', left: 'LEFT', question: 'Is your face sharp and fully in frame?', retake: 'Retake', use: 'Use it',
      sending: 'Sending…', sendFailed: 'The photo could not be sent. Check your connection and try again.', tryAgain: 'Try Again',
      doneTitle: 'Thank you, all set!', doneBody: 'Your five frames are in. You can close this page.', doneRetake: 'Tap one to shoot it again:', redo: 'Retake',
      camBlocked: 'Camera access was denied. Allow the camera in your browser settings and try again.',
      camInApp: 'The camera cannot open in this window. Open the link in Safari or Chrome.',
      camFailed: 'The camera could not start. Reload the page and try again.', shotFailed: 'Could not take the frame, try again.', open: 'Open Camera', copy: 'Copy Link', copied: 'Copied',
      invalid: 'This link is not valid.', expired: 'This link has expired.', revoked: 'This link was cancelled.', askNew: 'Ask the person who sent it for a new one.',
      limit: 'This link has used up its uploads. Ask for a new one.', offline: 'Could not connect. Check your internet and try again.', reload: 'Try Again',
      notPhoto: 'This file could not be read as a photo. Please retake it.',
    },
  };

  const browserLang = (navigator.language || '').toLowerCase().startsWith('tr') ? 'tr' : 'en';
  const state = { lang: browserLang, side: 'groom', done: [], index: 0, timer: true, facing: 'front', blob: null, url: null, width: 0, height: 0, stage: 'loading', message: '' };
  let stream = null;
  let count = null;
  let countTimer = null;
  let wake = null;

  const t = () => TEXT[state.lang];
  const el = (tag, attrs = {}, ...children) => {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (key === 'onclick') node.onclick = value;
      else if (key === 'text') node.textContent = value;
      else if (value !== false && value != null) node.setAttribute(key, value === true ? '' : value);
    }
    node.append(...children.filter(Boolean));
    return node;
  };
  const show = (...nodes) => app.replaceChildren(...nodes.filter(Boolean));

  async function api(action, body = {}) {
    let response;
    try {
      response = await fetch(`${API}/functions/v1/partner-capture`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action, token, ...body }),
      });
    } catch {
      throw new Error('offline');
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'offline');
    return data;
  }

  function upload(path, blob, onProgress) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('PUT', API + '/storage/v1' + path.replace(/^\/storage\/v1/, ''));
      request.setRequestHeader('content-type', 'image/jpeg');
      request.setRequestHeader('x-upsert', 'true');
      request.upload.onprogress = (event) => event.lengthComputable && onProgress(event.loaded / event.total);
      request.onload = () => (request.status < 300 ? resolve() : reject(new Error('offline')));
      request.onerror = () => reject(new Error('offline'));
      request.send(blob);
    });
  }

  const nextMissing = () => ROLES.findIndex((role) => !state.done.includes(role.key));
  const header = () => el('div', { class: 'top' },
    el('span', { class: 'brand', text: `WedCam · ${t()[state.side]}` }),
    el('div', { class: 'dots', 'aria-label': `${state.done.length}/5` },
      ...ROLES.map((role, i) => el('i', { class: [state.done.includes(role.key) ? 'on' : '', i === state.index && state.stage !== 'done' ? 'now' : ''].join(' ') }))));

  function renderFailure(kind) {
    const known = { invalid: 1, expired: 1, revoked: 1 };
    show(el('div', { class: 'grow' }),
      el('h1', { class: 'center', text: t()[known[kind] ? kind : 'offline'] }),
      known[kind] ? el('p', { class: 'center muted', text: t().askNew }) : el('button', { class: 'btn', text: t().reload, onclick: boot }),
      el('div', { class: 'grow' }));
  }

  function renderBrief() {
    state.stage = 'brief';
    const box = el('input', { type: 'checkbox', id: 'consent' });
    const start = el('button', { class: 'btn', text: t().start, disabled: true, onclick: async () => {
      start.disabled = true;
      try {
        await api('consent', { version: CONSENT_VERSION });
        state.consented = true;
        openShoot();
      } catch (failure) {
        start.disabled = false;
        message.textContent = t().offline;
      }
    } });
    box.onchange = () => { start.disabled = !box.checked; };
    const message = el('p', { class: 'error' });
    show(header(), el('h1', { text: t().title }), el('p', { class: 'muted', text: t().intro }),
      el('ul', { class: 'list' }, ...t().checklist(state.side).map((line) => el('li', { text: line }))),
      el('p', { class: 'note', text: t().privacy }),
      el('p', { class: 'note' }, el('a', { href: state.lang === 'tr' ? 'legal/tr/yuz-verisi.html' : 'legal/face-data.html', target: '_blank', rel: 'noopener', text: state.lang === 'tr' ? 'Yüz Verisi Politikası' : 'Face Data Policy' })),
      el('label', { class: 'check', for: 'consent' }, box, el('span', { text: t().consent })),
      message, el('div', { class: 'grow' }), start);
  }

  function stopCamera() {
    if (stream) stream.getTracks().forEach((track) => track.stop());
    stream = null;
    if (wake) wake.release().catch(() => {});
    wake = null;
    clearTimeout(countTimer);
    count = null;
  }

  async function startCamera() {
    stopCamera();
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: state.facing }, width: { ideal: 4032 }, height: { ideal: 3024 } },
      });
    } catch (failure) {
      state.message = failure.name === 'NotAllowedError' ? t().camBlocked
        : !navigator.mediaDevices ? t().camInApp : t().camFailed;
      renderCameraProblem();
      return;
    }
    const track = stream.getVideoTracks()[0];
    const limits = track.getCapabilities ? track.getCapabilities() : {};
    if (limits.width && limits.width.max) {
      await track.applyConstraints({ width: { ideal: limits.width.max }, height: { ideal: limits.height.max } }).catch(() => {});
    }
    // The full-length timer is long enough for a phone to dim itself.
    if (navigator.wakeLock) wake = await navigator.wakeLock.request('screen').catch(() => null);
    renderShoot();
  }

  function renderCameraProblem() {
    const copy = el('button', { class: 'btn ghost', text: t().copy, onclick: async () => {
      await navigator.clipboard.writeText(location.href).catch(() => {});
      copy.textContent = t().copied;
    } });
    show(header(), el('div', { class: 'grow' }), el('p', { class: 'error center', text: state.message }),
      el('button', { class: 'btn', text: t().open, onclick: startCamera }), el('div', { class: 'foot' }, copy), el('div', { class: 'grow' }));
  }

  function openShoot(index = nextMissing()) {
    state.index = index;
    state.facing = ROLES[index].camera;
    state.stage = 'shoot';
    startCamera();
  }

  function renderShoot() {
    const role = ROLES[state.index];
    const text = t();
    const video = el('video', { playsinline: true, autoplay: true, muted: true, class: state.facing === 'front' ? 'mirror' : '' });
    video.muted = true;
    video.srcObject = stream;
    const countNode = el('div', { class: 'count', hidden: true });
    const shutter = el('button', { class: 'shutter', 'aria-label': text.names[state.index], onclick: () => armShutter(role, video, countNode, shutter) }, el('i'));
    const turn = role.turn === 'right' || role.turn === 'left'
      ? el('div', { class: `turn ${role.turn}` }, el('b', { text: role.turn === 'left' ? '‹' : '›' }), el('span', { text: role.turn === 'right' ? text.right : text.left }))
      : null;
    show(header(),
      el('div', { class: 'cue' },
        el('div', {}, el('p', { class: 'kick', text: `${String(state.index + 1).padStart(2, '0')} / 05 · ${text.names[state.index]}` }), el('h2', { text: text.cues[state.index] })),
        el('div', { class: 'example' }, el('img', { src: `guide/${state.side}-${role.guide}.jpg`, alt: '', class: role.turn === 'body' ? 'tall' : '' }), el('span', { text: text.example }))),
      el('div', { class: 'vf' }, video,
        ...['tl', 'tr', 'bl', 'br'].map((corner) => el('div', { class: `corner ${corner}` })),
        el('div', { class: `guide ${role.turn === 'body' ? 'box' : 'oval'}` }), turn, countNode),
      state.message ? el('p', { class: 'error center', text: state.message }) : null,
      el('div', { class: 'controls' },
        el('button', { class: `pill ${state.timer ? 'on' : ''}`, 'aria-label': text.timer, text: `${role.countdown}s ${state.timer ? text.on : text.off}`, onclick: () => { state.timer = !state.timer; renderShoot(); } }),
        shutter,
        el('button', { class: 'pill', text: text.flip, onclick: () => { state.facing = state.facing === 'front' ? 'back' : 'front'; startCamera(); } })));
    state.message = '';
    video.play().catch(() => {});
  }

  function armShutter(role, video, countNode, shutter) {
    shutter.disabled = true;
    if (!state.timer) { capture(video, shutter); return; }
    count = role.countdown;
    const tick = () => {
      if (count === 0) { countNode.hidden = true; capture(video, shutter); return; }
      countNode.hidden = false;
      countNode.textContent = count;
      if (navigator.vibrate) navigator.vibrate(10);
      count -= 1;
      countTimer = setTimeout(tick, 1000);
    };
    tick();
  }

  async function grabFullResolution() {
    // takePhoto reads the sensor at full size; a video frame is softer. Both come out unmirrored.
    if (typeof ImageCapture === 'undefined') return null;
    try {
      const capture = new ImageCapture(stream.getVideoTracks()[0]);
      const limits = await capture.getPhotoCapabilities().catch(() => null);
      const photo = await capture.takePhoto(limits && limits.imageWidth ? { imageWidth: limits.imageWidth.max, imageHeight: limits.imageHeight.max } : {});
      return photo.type === 'image/jpeg' ? photo : null;
    } catch {
      return null;
    }
  }

  async function capture(video, shutter) {
    let blob = await grabFullResolution();
    if (!blob) {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.95));
    }
    if (!blob) {
      shutter.disabled = false;
      state.message = t().shotFailed;
      renderShoot();
      return;
    }
    if (state.url) URL.revokeObjectURL(state.url);
    state.blob = blob;
    state.url = URL.createObjectURL(blob);
    state.shotFacing = state.facing;
    state.stage = 'review';
    stopCamera();
    renderReview();
  }

  function renderReview() {
    const text = t();
    const image = el('img', { class: 'shot', src: state.url, alt: text.names[state.index] });
    const bar = el('i');
    const barBox = el('div', { class: 'bar', hidden: true }, bar);
    const message = el('p', { class: 'error center', hidden: true });
    const retake = el('button', { class: 'btn ghost', text: text.retake, onclick: () => openShoot(state.index) });
    const use = el('button', { class: 'btn', text: text.use, onclick: () => send() });

    const send = async () => {
      use.disabled = retake.disabled = true;
      use.textContent = text.sending;
      message.hidden = true;
      barBox.hidden = false;
      const role = ROLES[state.index];
      try {
        const { uploadPath } = await api('upload', { role: role.key });
        await upload(uploadPath, state.blob, (share) => { bar.style.width = `${Math.round(share * 100)}%`; });
        const { done } = await api('finish', { role: role.key, camera: state.shotFacing, width: image.naturalWidth, height: image.naturalHeight });
        state.done = done;
        const next = nextMissing();
        if (next === -1) renderDone();
        else openShoot(next);
      } catch (failure) {
        use.disabled = retake.disabled = false;
        use.textContent = text.tryAgain;
        barBox.hidden = true;
        message.hidden = false;
        message.textContent = failure.message === 'too_many_uploads' ? text.limit
          : failure.message === 'not_a_photo' ? text.notPhoto
          : failure.message === 'expired' || failure.message === 'revoked' ? text[failure.message]
          : text.sendFailed;
      }
    };

    show(header(), el('p', { class: 'kick center', text: `${String(state.index + 1).padStart(2, '0')} · ${text.names[state.index]}` }),
      el('div', { class: 'vf' }, image), el('p', { class: 'muted center small foot', text: text.question }), barBox, message,
      el('div', { class: 'row foot' }, retake, use));
  }

  function renderDone() {
    state.stage = 'done';
    stopCamera();
    const text = t();
    show(header(), el('h1', { class: 'center', text: text.doneTitle }), el('p', { class: 'center muted', text: text.doneBody }),
      el('p', { class: 'small muted foot', text: text.doneRetake }),
      el('div', { class: 'chips' }, ...ROLES.map((role, i) => el('button', { class: 'chip', onclick: () => openShoot(i) },
        el('span', { text: text.names[i] }), el('em', { text: text.redo })))));
  }

  async function boot() {
    if (token.length < 32) { renderFailure('invalid'); return; }
    show(el('p', { class: 'center muted pad', text: '…' }));
    try {
      const status = await api('status');
      Object.assign(state, { lang: status.lang, side: status.side, done: status.done, consented: status.consented });
      document.documentElement.lang = state.lang;
      if (!status.consented) renderBrief();
      else if (nextMissing() === -1) renderDone();
      else openShoot();
    } catch (failure) {
      renderFailure(failure.message);
    }
  }

  // Coming back from another app with a dead camera stream would show a frozen frame.
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && state.stage === 'shoot' && stream && stream.getVideoTracks()[0].readyState === 'ended') startCamera();
  });
  boot();
})();
