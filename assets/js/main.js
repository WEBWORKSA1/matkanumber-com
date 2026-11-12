(function () {
  "use strict";
  var MN = window.MN || {}, BASE = window.MN_BASE || "";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* Unbiased random integer in [0, n) */
  function rnd(n) {
    if (n <= 1) return 0;
    if (!window.crypto || n > 4294967296) return Math.floor(Math.random() * n);
    var lim = Math.floor(4294967296 / n) * n, a = new Uint32Array(1);
    do { crypto.getRandomValues(a); } while (a[0] >= lim);
    return a[0] % n;
  }
  window.MNrnd = rnd;

  /* Nav, year, cookie notice */
  var nb = $(".navbtn"), nav = $("#nav");
  if (nb) nb.addEventListener("click", function () { var o = nav.classList.toggle("open"); nb.setAttribute("aria-expanded", o); });
  $$(".year").forEach(function (e) { e.textContent = new Date().getFullYear(); });
  var ck = $(".cookie");
  if (ck && !store("mn_cookie")) { ck.hidden = false; $("[data-cookie]", ck).addEventListener("click", function () { store("mn_cookie", "1"); ck.hidden = true; }); }

  /* Number of the day: same for everyone on a given UTC date, changes daily */
  var now = new Date(), dayNo = Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 864e5);
  var nod = (dayNo * 37 + 11) % 100;
  $$(".nod").forEach(function (e) { e.textContent = nod; });
  $$(".nod-link").forEach(function (e) { e.href = BASE + "/numbers/" + nod + ".html"; });
  $$(".numgrid a").forEach(function (a) { if (a.textContent.trim() === String(nod)) a.classList.add("today"); });
  $$(".nod-facts").forEach(function (e) { if (e.getAttribute("data-nod") !== String(nod)) e.hidden = true; });
  $$(".today-date").forEach(function (e) { e.textContent = now.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" }); });

  /* Pot draw animation, shared by the home page and the draw tool */
  window.MNpot = function (box, text, done) {
    var chit = $(".chit", box), span = $("span", chit);
    chit.classList.remove("out"); box.classList.remove("shake");
    void box.offsetWidth; box.classList.add("shake");
    setTimeout(function () { span.textContent = text; chit.classList.add("out"); if (done) done(); }, 600);
  };
  var hd = $("[data-homedraw]");
  if (hd) {
    var box = $("[data-pot]", hd), sel = $("select", hd), out = $(".homeout", hd);
    $("button", hd).addEventListener("click", function () {
      var digits = +sel.value, v = String(rnd(Math.pow(10, digits)));
      while (v.length < digits) v = "0" + v;
      window.MNpot(box, v, function () {
        out.innerHTML = digits <= 2 ? 'You drew <a href="' + BASE + "/numbers/" + (+v) + '.html">' + v + "</a>. Chance: 1 in " + Math.pow(10, digits) + "." : "You drew " + v + ". Chance: 1 in 1,000.";
      });
    });
  }

  /* Forms: every form posts to the owner inbox through FormSubmit. The address is decoded at send time only. */
  function endpoint() {
    var id = MN.formAlias || atob((MN.relay || []).join("").split("").reverse().join(""));
    return "https://formsubmit.co/ajax/" + id;
  }
  $$("form.mn-form").forEach(function (f) {
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var msg = $(".form-msg", f), btn = $("button[type=submit]", f), data = {};
      new FormData(f).forEach(function (v, k) { data[k] = data[k] ? data[k] + ", " + v : v; });
      if (data._honey) return;
      delete data._honey;
      data._subject = "MatkaNumber.com: " + (f.getAttribute("data-form") || "Form");
      data._template = "table";
      data.page = location.href;
      data.first_landing = store("mn_land") || location.pathname;
      msg.className = "form-msg"; msg.textContent = "Sending…"; btn.disabled = true;
      fetch(endpoint(), { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
        .then(function () {
          var next = f.getAttribute("data-next");
          if (next) { location.href = BASE + next; return; }
          f.reset(); msg.className = "form-msg ok"; msg.textContent = "Thank you. Your message is on its way and we will reply by email.";
        })
        .catch(function () {
          msg.className = "form-msg bad";
          msg.innerHTML = 'That did not go through. Please try again, or use <a href="' + (MN.ownerContact || "#") + '" target="_blank" rel="noopener">this contact page</a>.';
        })
        .then(function () { btn.disabled = false; });
    });
  });
  if (!store("mn_land")) store("mn_land", location.pathname + location.search);

  /* Click-to-load YouTube players (privacy-enhanced mode) */
  $$(".video").forEach(function (v) {
    var id = v.getAttribute("data-yt");
    v.style.backgroundImage = "url(https://i.ytimg.com/vi/" + id + "/hqdefault.jpg)";
    v.addEventListener("click", function () {
      v.classList.add("on");
      v.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1" title="YouTube video player" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
    });
  });

  /* Tool filter on the tools index */
  $$(".filter button").forEach(function (b) {
    b.addEventListener("click", function () {
      $$(".filter button").forEach(function (x) { x.classList.toggle("on", x === b); });
      var t = b.getAttribute("data-tag");
      $$("[data-tooltag]").forEach(function (c) { c.hidden = t !== "all" && c.getAttribute("data-tooltag") !== t; });
    });
  });

  /* Contest: this month's puzzle and a countdown to the end of the month */
  var pz = $(".puzzle");
  if (pz && MN.puzzles) {
    pz.textContent = MN.puzzles[now.getMonth() % MN.puzzles.length];
    $$(".contest-month").forEach(function (e) { e.textContent = now.toLocaleDateString(undefined, { month: "long", year: "numeric" }); });
    $$(".prize").forEach(function (e) { e.textContent = MN.prize; });
    $$("input[name=contest_month]").forEach(function (e) { e.value = now.getFullYear() + "-" + (now.getMonth() + 1); });
    var end = new Date(now.getFullYear(), now.getMonth() + 1, 1), cd = $(".count");
    var tick = function () {
      var s = Math.max(0, Math.floor((end - new Date()) / 1000));
      cd.innerHTML = [["days", Math.floor(s / 86400)], ["hours", Math.floor(s % 86400 / 3600)], ["min", Math.floor(s % 3600 / 60)], ["sec", s % 60]]
        .map(function (p) { return "<div><b>" + p[1] + "</b>" + p[0] + "</div>"; }).join("");
    };
    if (cd) { tick(); setInterval(tick, 1000); }
  }

  /* Support page: show payment buttons that have a link configured */
  var pay = $(".pay");
  if (pay) {
    var names = { paypal: "PayPal", stripe: "Card (Stripe)", buymeacoffee: "Buy Me a Coffee", kofi: "Ko-fi", razorpay: "Razorpay", upi: "UPI" }, any = false;
    Object.keys(MN.payments || {}).forEach(function (k) {
      if (!MN.payments[k]) return; any = true;
      var a = document.createElement("a"); a.className = "btn gold"; a.href = MN.payments[k]; a.target = "_blank"; a.rel = "noopener"; a.textContent = names[k] || k; pay.appendChild(a);
    });
    if (!any) pay.innerHTML = "<p>Online payment buttons are being set up. Until then, send a pledge below and we will reply with a secure payment link.</p>";
  }
  $$("[data-amount]").forEach(function (b) { b.addEventListener("click", function () { var i = $("input[name=amount]"); if (i) { i.value = b.getAttribute("data-amount"); i.focus(); } }); });

  /* Welcome note after a kit signup */
  if (/welcome=1/.test(location.search)) { var w = $(".welcome"); if (w) w.hidden = false; }
})();
