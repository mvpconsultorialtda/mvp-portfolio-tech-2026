/* MVP Contact Modal — universal contact CTA
 * Usage:
 *   1. Include this script: <script src="assets/js/contact-modal.js" defer></script>
 *   2. Mark any element as trigger: <button data-open-contact>Entrar em contato</button>
 *   3. Optional overrides via data-attrs on the trigger:
 *        data-contact-email="..."     (default: mvpconsultorialtda@gmail.com)
 *        data-contact-whatsapp="..."  (E.164 without +, default: 5571992924263)
 *        data-contact-subject="..."   (default: "Contato pelo portfolio MVP")
 *        data-contact-body="..."      (default: empty)
 */
(function () {
  const DEFAULTS = {
    email: "mvpconsultorialtda@gmail.com",
    whatsapp: "5571992924263",
    whatsappLabel: "+55 71 99292-4263 · Julia Pedroso",
    subject: "Contato pelo portfolio MVP",
    body: "",
  };

  const CSS = `
  .mvp-contact-dialog { border: none; padding: 0; background: transparent; max-width: 480px; width: calc(100% - 32px); }
  .mvp-contact-dialog::backdrop { background: rgba(10, 12, 16, 0.72); backdrop-filter: blur(4px); }
  .mvp-contact-card { background: #f5efe4; color: #12140f; border-radius: 20px; padding: 28px 24px; box-shadow: 0 30px 80px rgba(0,0,0,0.35); font-family: system-ui, -apple-system, "Segoe UI", Inter, sans-serif; }
  .mvp-contact-title { font-family: "Fraunces", "Instrument Serif", Georgia, serif; font-weight: 700; font-size: 1.55rem; margin: 0 0 6px; letter-spacing: -0.01em; }
  .mvp-contact-sub { margin: 0 0 20px; font-size: 0.92rem; opacity: 0.72; }
  .mvp-contact-opts { display: grid; gap: 10px; }
  .mvp-contact-opt { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 12px; background: #fff; color: #12140f; text-decoration: none; border: 1px solid rgba(0,0,0,0.06); transition: transform 0.15s ease, background 0.15s ease; font-size: 0.98rem; cursor: pointer; font-family: inherit; text-align: left; }
  .mvp-contact-opt:hover { background: #12140f; color: #f5efe4; transform: translateX(2px); }
  .mvp-contact-opt strong { font-weight: 600; }
  .mvp-contact-opt small { display: block; opacity: 0.6; font-size: 0.78rem; margin-top: 2px; }
  .mvp-contact-opt:hover small { opacity: 0.72; }
  .mvp-contact-ico { flex: 0 0 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; }
  .mvp-contact-close { position: absolute; top: 12px; right: 14px; background: none; border: none; color: inherit; font-size: 1.4rem; cursor: pointer; opacity: 0.55; line-height: 1; padding: 4px 8px; font-family: inherit; }
  .mvp-contact-close:hover { opacity: 1; }
  .mvp-contact-footer { margin-top: 18px; padding-top: 14px; border-top: 1px solid rgba(0,0,0,0.08); font-size: 0.78rem; opacity: 0.6; text-align: center; }
  .mvp-contact-toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #12140f; color: #f5efe4; padding: 10px 18px; border-radius: 999px; font-size: 0.88rem; font-family: system-ui, sans-serif; z-index: 9999; opacity: 0; transition: opacity 0.25s ease; pointer-events: none; }
  .mvp-contact-toast.show { opacity: 1; }
  `;

  function inject() {
    if (document.getElementById("mvp-contact-style")) return;
    const style = document.createElement("style");
    style.id = "mvp-contact-style";
    style.textContent = CSS;
    document.head.appendChild(style);

    const dialog = document.createElement("dialog");
    dialog.className = "mvp-contact-dialog";
    dialog.id = "mvp-contact-dialog";
    dialog.innerHTML = `
      <div class="mvp-contact-card" style="position: relative;">
        <button type="button" class="mvp-contact-close" aria-label="Fechar">×</button>
        <h3 class="mvp-contact-title">Como prefere falar com a gente?</h3>
        <p class="mvp-contact-sub">Escolha o canal — respondemos em até 24h úteis.</p>
        <div class="mvp-contact-opts">
          <a class="mvp-contact-opt" data-act="whatsapp" target="_blank" rel="noopener">
            <span class="mvp-contact-ico">💬</span>
            <span><strong>WhatsApp</strong><small data-slot="whatsapp"></small></span>
          </a>
          <a class="mvp-contact-opt" data-act="gmail" target="_blank" rel="noopener">
            <span class="mvp-contact-ico">✉️</span>
            <span><strong>Abrir no Gmail</strong><small>Compose direto no navegador</small></span>
          </a>
          <a class="mvp-contact-opt" data-act="outlook" target="_blank" rel="noopener">
            <span class="mvp-contact-ico">📧</span>
            <span><strong>Abrir no Outlook</strong><small>Compose Outlook Web</small></span>
          </a>
          <a class="mvp-contact-opt" data-act="mailto">
            <span class="mvp-contact-ico">📮</span>
            <span><strong>Cliente de email padrão</strong><small>Abre o app instalado (Mail, Thunderbird…)</small></span>
          </a>
          <button type="button" class="mvp-contact-opt" data-act="copy">
            <span class="mvp-contact-ico">📋</span>
            <span><strong>Copiar endereço</strong><small data-slot="email"></small></span>
          </button>
        </div>
        <div class="mvp-contact-footer">MVP Consultoria em Tecnologia · Salvador · Bahia</div>
      </div>
    `;
    document.body.appendChild(dialog);

    dialog.querySelector(".mvp-contact-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (e) => {
      const rect = dialog.querySelector(".mvp-contact-card").getBoundingClientRect();
      const inside = e.clientY >= rect.top && e.clientY <= rect.bottom && e.clientX >= rect.left && e.clientX <= rect.right;
      if (!inside) dialog.close();
    });
  }

  function toast(msg) {
    let t = document.getElementById("mvp-contact-toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "mvp-contact-toast";
      t.className = "mvp-contact-toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 1800);
  }

  function open(trigger) {
    inject();
    const dialog = document.getElementById("mvp-contact-dialog");
    const email = trigger.dataset.contactEmail || DEFAULTS.email;
    const wa = trigger.dataset.contactWhatsapp || DEFAULTS.whatsapp;
    const waLabel = trigger.dataset.contactWhatsappLabel || DEFAULTS.whatsappLabel;
    const subject = trigger.dataset.contactSubject || DEFAULTS.subject;
    const body = trigger.dataset.contactBody || DEFAULTS.body;

    const encS = encodeURIComponent(subject);
    const encB = encodeURIComponent(body);
    const waText = encodeURIComponent(`Olá! ${subject}`);

    dialog.querySelector('[data-act="gmail"]').href =
      `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encS}&body=${encB}`;
    dialog.querySelector('[data-act="outlook"]').href =
      `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(email)}&subject=${encS}&body=${encB}`;
    dialog.querySelector('[data-act="mailto"]').href =
      `mailto:${email}?subject=${encS}&body=${encB}`;
    dialog.querySelector('[data-act="whatsapp"]').href =
      `https://wa.me/${wa}?text=${waText}`;

    dialog.querySelector('[data-slot="whatsapp"]').textContent = waLabel;
    dialog.querySelector('[data-slot="email"]').textContent = email;

    dialog.querySelector('[data-act="copy"]').onclick = async () => {
      try {
        await navigator.clipboard.writeText(email);
        toast("Email copiado ✓");
      } catch {
        toast(email);
      }
    };

    dialog.showModal();
  }

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-open-contact]");
    if (!trigger) return;
    e.preventDefault();
    open(trigger);
  });
})();
