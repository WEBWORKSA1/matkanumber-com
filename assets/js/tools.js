(function () {
  "use strict";
  var rnd = window.MNrnd;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function fmt(n) { return Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 }); }
  function copy(text, btn) {
    var done = function () { var t = btn.textContent; btn.textContent = "Copied"; setTimeout(function () { btn.textContent = t; }, 1200); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {}); else { var ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); done(); } catch (e) {} ta.remove(); }
  }
  function download(name, text) { var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: "text/csv" })); a.download = name; a.click(); }
  function on(id, fn) { var el = document.getElementById(id); if (el) fn(el); }

  /* ---------- Random number generator ---------- */
  on("rng", function (el) {
    var last = [];
    $("form", el).addEventListener("submit", function (e) {
      e.preventDefault();
      var f = e.target.elements, min = Math.round(+f.min.value), max = Math.round(+f.max.value), count = Math.min(10000, Math.max(1, Math.round(+f.count.value))), uniq = f.unique.checked, out = $(".result", el);
      if (!(min <= max)) { out.textContent = "The minimum must not be larger than the maximum."; return; }
      var span = max - min + 1;
      if (uniq && count > span) { out.textContent = "Only " + fmt(span) + " different numbers exist in that range. Lower the count or allow repeats."; return; }
      var res = [];
      if (uniq) {
        if (span <= 200000) { var pool = []; for (var i = 0; i < span; i++) pool.push(min + i); for (var j = 0; j < count; j++) { var k = j + rnd(span - j), t = pool[j]; pool[j] = pool[k]; pool[k] = t; res.push(pool[j]); } }
        else { var seen = {}; while (res.length < count) { var v = min + rnd(span); if (!seen[v]) { seen[v] = 1; res.push(v); } } }
      } else for (var m = 0; m < count; m++) res.push(min + rnd(span));
      if (f.sort.checked) res.sort(function (a, b) { return a - b; });
      last = res;
      out.innerHTML = count === 1 ? '<div class="big">' + res[0] + "</div>" : '<div class="chips">' + res.map(function (x) { return "<span>" + x + "</span>"; }).join("") + "</div>";
      $(".actions", el).hidden = false;
    });
    $("[data-copy]", el).addEventListener("click", function () { copy(last.join(", "), this); });
    $("[data-csv]", el).addEventListener("click", function () { download("random-numbers.csv", last.join("\n")); });
  });

  /* ---------- Matka draw (name and ticket picker) ---------- */
  on("draw", function (el) {
    var box = $("[data-pot]", el), ta = $("textarea", el), out = $(".result", el), log = [], record = "";
    function entries() { return ta.value.split(/[\n,]+/).map(function (s) { return s.trim(); }).filter(Boolean); }
    function hash(text) {
      if (!(window.crypto && crypto.subtle)) return Promise.resolve("not available in this browser");
      return crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)).then(function (b) { return Array.prototype.map.call(new Uint8Array(b), function (x) { return ("0" + x.toString(16)).slice(-2); }).join(""); });
    }
    ta.addEventListener("input", function () { $(".count-entries", el).textContent = entries().length; });
    $("[data-run]", el).addEventListener("click", function () {
      var list = entries(), n = Math.max(1, Math.round(+$("[name=winners]", el).value || 1));
      if ($("[name=dedupe]", el).checked) list = list.filter(function (x, i) { return list.indexOf(x) === i; });
      if (list.length < 2) { out.textContent = "Add at least two entries, one per line."; return; }
      if (n > list.length) { out.textContent = "You asked for more winners than there are entries."; return; }
      var pool = list.slice(), win = [];
      for (var i = 0; i < n; i++) win.push(pool.splice(rnd(pool.length), 1)[0]);
      var when = new Date();
      window.MNpot(box, win[0].length > 9 ? win[0].slice(0, 8) + "…" : win[0], function () {
        out.innerHTML = "<strong>Winner" + (n > 1 ? "s" : "") + ":</strong><div class='chips'>" + win.map(function (w, i) { return "<span>" + (i + 1) + ". " + esc(w) + "</span>"; }).join("") + "</div>";
        log.unshift(when.toLocaleTimeString() + ": " + win.join(", "));
        $(".history", el).innerHTML = log.slice(0, 10).map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("");
        if ($("[name=remove]", el).checked) { ta.value = pool.join("\n"); $(".count-entries", el).textContent = pool.length; }
        hash(list.join("\n")).then(function (h) {
          record = "MATKA DRAW RECORD\nDate and time: " + when.toString() + "\nEntries in the pot: " + list.length + "\nWinners drawn: " + n + "\nResult: " + win.join("; ") + "\nEntry list fingerprint (SHA-256): " + h + "\nMethod: browser cryptographic random source, every entry with equal chance\nTool: MatkaNumber.com Matka Draw";
          $(".actions", el).hidden = false;
        });
      });
    });
    $("[data-record]", el).addEventListener("click", function () { copy(record, this); });
  });

  /* ---------- Dice ---------- */
  on("dice", function (el) {
    $("button", el).addEventListener("click", function () {
      var n = +$("[name=n]", el).value, s = +$("[name=sides]", el).value, r = [], sum = 0;
      for (var i = 0; i < n; i++) { var v = 1 + rnd(s); r.push(v); sum += v; }
      $(".result", el).innerHTML = '<div class="chips">' + r.map(function (x) { return "<span>" + x + "</span>"; }).join("") + "</div>" + (n > 1 ? '<p>Total: <strong>' + sum + "</strong></p>" : "");
    });
  });

  /* ---------- Coin ---------- */
  on("coin", function (el) {
    var h = 0, t = 0, streak = 0, lastSide = "", best = 0, coin = $(".coin", el);
    $("button", el).addEventListener("click", function () {
      var side = rnd(2) ? "Heads" : "Tails";
      coin.classList.remove("flip"); void coin.offsetWidth; coin.classList.add("flip");
      setTimeout(function () {
        coin.textContent = side; side === "Heads" ? h++ : t++;
        streak = side === lastSide ? streak + 1 : 1; lastSide = side; best = Math.max(best, streak);
        var tot = h + t;
        $(".result", el).innerHTML = "Flips: <strong>" + tot + "</strong> · Heads: " + h + " (" + (100 * h / tot).toFixed(1) + "%) · Tails: " + t + " (" + (100 * t / tot).toFixed(1) + "%) · Longest streak: " + best;
      }, 600);
    });
  });

  /* ---------- Number to words ---------- */
  var ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split(" ");
  var TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  function under1000(n) {
    var s = [];
    if (n >= 100) { s.push(ONES[Math.floor(n / 100)] + " hundred"); n %= 100; }
    if (n >= 20) s.push(TENS[Math.floor(n / 10)] + (n % 10 ? "-" + ONES[n % 10] : "")); else if (n > 0) s.push(ONES[n]);
    return s.join(" ");
  }
  function wordsIntl(n) {
    if (n === 0) return "zero";
    var sc = ["", " thousand", " million", " billion", " trillion"], parts = [], i = 0;
    while (n > 0) { var c = n % 1000; if (c) parts.unshift(under1000(c) + sc[i]); n = Math.floor(n / 1000); i++; }
    return parts.join(" ");
  }
  function wordsIndian(n) {
    if (n === 0) return "zero";
    var parts = [], crore = Math.floor(n / 1e7), rest = n % 1e7;
    if (crore) parts.push(wordsIndian(crore) + " crore");
    var lakh = Math.floor(rest / 1e5), th = Math.floor(rest % 1e5 / 1000), h = rest % 1000;
    if (lakh) parts.push(under1000(lakh) + " lakh");
    if (th) parts.push(under1000(th) + " thousand");
    if (h) parts.push(under1000(h));
    return parts.join(" ");
  }
  function groupIndian(n) { return Number(n).toLocaleString("en-IN"); }
  on("words", function (el) {
    var inp = $("input", el);
    function run() {
      var raw = inp.value.replace(/[,\s]/g, ""), out = $(".result", el);
      if (!/^\d{1,15}$/.test(raw)) { out.textContent = "Enter a whole number with up to 15 digits."; return; }
      var n = +raw;
      out.innerHTML = "<p><strong>International:</strong> " + wordsIntl(n) + "<br><small>" + n.toLocaleString("en-US") + "</small></p><p><strong>Indian system:</strong> " + wordsIndian(n) + "<br><small>" + groupIndian(n) + "</small></p>";
    }
    inp.addEventListener("input", run); run();
  });

  /* ---------- Roman numerals ---------- */
  var RM = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  function toRoman(n) { var s = ""; RM.forEach(function (p) { while (n >= p[0]) { s += p[1]; n -= p[0]; } }); return s; }
  function fromRoman(s) { var n = 0, i = 0; s = s.toUpperCase(); RM.forEach(function (p) { while (s.substr(i, p[1].length) === p[1]) { n += p[0]; i += p[1].length; } }); return i === s.length && toRoman(n) === s ? n : NaN; }
  on("roman", function (el) {
    var inp = $("input", el);
    function run() {
      var v = inp.value.trim(), out = $(".result", el);
      if (!v) { out.textContent = "Type a number from 1 to 3999 or a Roman numeral such as MMXXVI."; return; }
      if (/^\d+$/.test(v)) { var n = +v; out.innerHTML = n >= 1 && n <= 3999 ? '<div class="big">' + toRoman(n) + "</div>" : "Roman numerals in standard form cover 1 to 3999."; }
      else { var r = fromRoman(v); out.innerHTML = isNaN(r) ? "That is not a valid standard Roman numeral." : '<div class="big">' + r + "</div>"; }
    }
    inp.addEventListener("input", run); run();
  });

  /* ---------- Number checker ---------- */
  on("checker", function (el) {
    var inp = $("input", el);
    function run() {
      var raw = inp.value.replace(/[,\s]/g, ""), out = $(".result", el);
      if (!/^\d{1,12}$/.test(raw)) { out.textContent = "Enter a whole number with up to 12 digits."; return; }
      var n = +raw, m = n, f = [], p = 2;
      while (m > 1 && p * p <= m) { while (m % p === 0) { f.push(p); m /= p; } p += p === 2 ? 1 : 2; }
      if (m > 1) f.push(m);
      var prime = n > 1 && f.length === 1, divs = [];
      if (n > 0 && n <= 1e7) { for (var i = 1; i * i <= n; i++) if (n % i === 0) { divs.push(i); if (i !== n / i) divs.push(n / i); } divs.sort(function (a, b) { return a - b; }); }
      var sq = Math.round(Math.sqrt(n)), ds = raw.split("").reduce(function (a, b) { return a + +b; }, 0);
      var rows = [["Type", n < 2 ? "Neither prime nor composite" : prime ? "Prime" : "Composite"], ["Even or odd", n % 2 ? "Odd" : "Even"],
        ["Prime factors", n < 2 ? "none" : f.join(" × ")], ["Divisors", divs.length ? (divs.length > 60 ? divs.length + " divisors" : divs.join(", ") + " (" + divs.length + ")") : "not listed for this size"],
        ["Perfect square?", sq * sq === n ? "Yes, " + sq + "²" : "No"], ["Sum of digits", ds], ["Binary", n.toString(2)], ["Hexadecimal", n.toString(16).toUpperCase()],
        ["Roman numeral", n >= 1 && n <= 3999 ? toRoman(n) : "outside 1 to 3999"], ["In words", wordsIntl(n)], ["Indian system", wordsIndian(n)]];
      out.innerHTML = "<table>" + rows.map(function (r) { return "<tr><th>" + r[0] + "</th><td>" + r[1] + "</td></tr>"; }).join("") + "</table>";
    }
    inp.addEventListener("input", run); run();
  });

  /* ---------- Odds and expected value ---------- */
  on("odds", function (el) {
    var f = $("form", el), out = $(".result", el);
    var fe = f.elements;
    function vals() { return { N: Math.max(1, +fe.oneIn.value), R: Math.max(0, +fe.pays.value), S: Math.max(0, +fe.stake.value), K: Math.min(100000, Math.max(1, Math.round(+fe.rounds.value))) }; }
    function run(sim) {
      var v = vals(), p = 1 / v.N, ret = p * v.R, edge = 1 - ret, staked = v.S * v.K, exp = staked * ret;
      var html = "<p>Chance of winning one round: <strong>" + (100 * p).toFixed(3).replace(/\.?0+$/, "") + "%</strong>. A fair payout would be <strong>" + fmt(v.N) + "×</strong> the stake. This game pays " + fmt(v.R) + "×.</p>" +
        "<p>Return to player: <strong>" + (100 * ret).toFixed(1) + "%</strong>. " + (edge > 0 ? "The organiser keeps <strong>" + (100 * edge).toFixed(1) + "%</strong> of everything staked." : edge === 0 ? "This is a fair game with no edge." : "This pays more than fair odds, which no real operator offers.") + "</p>" +
        '<div class="bar2"><i style="width:' + Math.max(0, Math.min(100, 100 * ret)) + '%"></i></div>' +
        "<p>Over " + fmt(v.K) + " rounds you stake <strong>" + fmt(staked) + "</strong> and can expect to get back about <strong>" + fmt(exp) + "</strong>: an average " + (edge >= 0 ? "loss" : "gain") + " of <strong>" + fmt(Math.abs(staked - exp)) + "</strong>.</p>";
      if (sim) {
        var wins = 0; for (var i = 0; i < v.K; i++) if (rnd(1e6) < p * 1e6) wins++;
        var back = wins * v.R * v.S, net = back - staked;
        html += "<p><strong>Simulation:</strong> " + fmt(wins) + " wins in " + fmt(v.K) + " rounds. Got back " + fmt(back) + " from " + fmt(staked) + " staked. Net result: <strong style='color:" + (net < 0 ? "#b3261e" : "#1d7a4f") + "'>" + (net < 0 ? "−" : "+") + fmt(Math.abs(net)) + "</strong>. Run it again: short runs swing, long runs settle near the expected loss.</p>";
      }
      out.innerHTML = html;
    }
    f.addEventListener("input", function () { run(false); });
    f.addEventListener("submit", function (e) { e.preventDefault(); run(true); });
    run(false);
  });

  /* ---------- Numerology ---------- */
  on("numero", function (el) {
    function reduce(n) { while (n > 9 && n !== 11 && n !== 22 && n !== 33) n = String(n).split("").reduce(function (a, b) { return a + +b; }, 0); return n; }
    var MEAN = { 1: "the starter", 2: "the partner", 3: "the communicator", 4: "the builder", 5: "the explorer", 6: "the carer", 7: "the thinker", 8: "the organiser", 9: "the giver", 11: "a master number tied to intuition", 22: "a master number tied to big projects", 33: "a master number tied to teaching" };
    $("form", el).addEventListener("submit", function (e) {
      e.preventDefault();
      var name = e.target.elements.fullname.value.toUpperCase().replace(/[^A-Z]/g, ""), dob = e.target.elements.dob.value.replace(/\D/g, ""), h = "";
      if (name) { var s = 0; for (var i = 0; i < name.length; i++) s += (name.charCodeAt(i) - 65) % 9 + 1; var nn = reduce(s); h += "<p>Name number: <span class='big'>" + nn + "</span><br>Letters add to " + s + ". Tradition calls " + nn + " " + MEAN[nn] + ".</p>"; }
      if (dob.length === 8) { var d = dob.split("").reduce(function (a, b) { return a + +b; }, 0), lp = reduce(d); h += "<p>Life path number: <span class='big'>" + lp + "</span><br>Date digits add to " + d + ". Tradition calls " + lp + " " + MEAN[lp] + ".</p>"; }
      $(".result", el).innerHTML = h || "Enter a name, a birth date, or both.";
    });
  });
})();
