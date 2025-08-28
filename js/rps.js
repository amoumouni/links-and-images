(function () {
  const KEY = "rps_played"; // sessionStorage gate key

  // ===== Custom debug logger =====
  function debugRPS(...args) {
    console.log("%c[RPS]", "color: gold; font-weight: bold;", ...args);
  }

  debugRPS("script loaded");

  // ===== Grab DOM elements =====
  const modal    = document.getElementById("rps-modal");
  const closeBtn = document.getElementById("rps-close");
  const backdrop = document.getElementById("rps-backdrop");
  const output   = document.getElementById("rps-output");
  const homeBtn  = document.getElementById("toHomepage");
  const restartBtn = document.getElementById("rps-restart"); // 👈 NEW

  const moveButtons = () => document.querySelectorAll(".rps-controls button");
  const hasModalBits = () => !!(modal && output);

  function log(msg) {
    if (output) {
      output.textContent += `\n${msg}`;
      output.scrollTop = output.scrollHeight; // keep newest line visible
    }
    debugRPS(msg);
  }
  function clearLog() {
    if (output) {
      output.textContent = "Best of 3 — pick your move.";
      output.scrollTop = 0;
    }
  }

  function openModal() {
    if (!modal) { debugRPS("No modal element—aborting open"); return; }
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("show");
    document.body.classList.add("body-lock");
    if (closeBtn) closeBtn.focus();
    debugRPS("modal opened");
  }
  function closeModal() {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    modal.classList.remove("show");
    document.body.classList.remove("body-lock");
    debugRPS("modal closed");
  }

  function computerPick() {
    return ["rock", "paper", "scissors"][Math.floor(Math.random() * 3)];
  }
  function determineWinner(player, cpu) {
    if (player === cpu) return "tie";
    if (
      (player === "rock" && cpu === "scissors") ||
      (player === "paper" && cpu === "rock") ||
      (player === "scissors" && cpu === "paper")
    ) return "win";
    return "lose";
  }

  // Keep references we can reset on “Play Again”
  let currentGame = null;

  function makeGame() {
    let human = 0, computer = 0, rounds = 0, finished = false;

    function playRound(playerPick) {
      if (finished) return;
      const cpu = computerPick();
      const res = determineWinner(playerPick, cpu);
      rounds++;

      if (res === "win")       { human++;    log(`You win! ${playerPick} beats ${cpu} | Score: ${human} - ${computer}`); }
      else if (res === "lose") { computer++; log(`You lose! ${cpu} beats ${playerPick} | Score: ${human} - ${computer}`); }
      else                     {             log(`It's a tie! (${playerPick} = ${cpu}) | Score: ${human} - ${computer}`); }

      if (human === 2 || computer === 2 || rounds === 3) {
        finished = true;
        log(`\nFinal scores ⇒ You: ${human} | Computer: ${computer}`);
        if (human > computer)      log("🎉 You win the match!");
        else if (computer > human) log("😅 You lose the match.");
        else                       log("😐 Series tied.");
        endGame();
      }
    }

    function endGame() {
      // Disable move buttons now that the match is done
      moveButtons().forEach(b => (b.disabled = true));
      // Reveal end-of-match actions
      if (homeBtn)   { homeBtn.hidden = false;   homeBtn.style.display = "inline-block"; }
      if (restartBtn){ restartBtn.hidden = false; restartBtn.style.display = "inline-block"; restartBtn.focus(); }
    }

    return { playRound };
  }

  // Re-enable buttons and hide end-of-match actions
  function prepareForNewMatch() {
    clearLog();
    moveButtons().forEach(b => { b.disabled = false; });
    if (homeBtn)   { homeBtn.hidden = true;   homeBtn.style.display = ""; }
    if (restartBtn){ restartBtn.hidden = true; restartBtn.style.display = ""; }
  }

  function wireButtons(game) {
    const btns = moveButtons();
    if (!btns.length) { debugRPS("No move buttons found"); return; }
    btns.forEach(btn => {
      btn.disabled = false;
      btn.onclick = () => game.playRound(btn.dataset.move);
    });

    // Home: only visible at end (close + go to home)
    if (homeBtn) {
      homeBtn.hidden = true;
      homeBtn.style.display = "";
      homeBtn.onclick = () => {
        closeModal();
        window.location.href = "index.html"; // adjust if needed
      };
    }

    // Restart: only visible at end
    if (restartBtn) {
      restartBtn.hidden = true;
      restartBtn.style.display = "";
      restartBtn.onclick = () => {
        // Reset UI + start a new match in the same modal
        prepareForNewMatch();
        currentGame = makeGame();
        // Re-wire move buttons to the new game instance
        moveButtons().forEach(btn => {
          btn.onclick = () => currentGame.playRound(btn.dataset.move);
        });
        debugRPS("new match started");
      };
    }
  }

  function startRPSGame() {
    if (!hasModalBits()) { debugRPS("Missing modal or output—won’t start"); return; }
    prepareForNewMatch();     // ensures a fresh log + enabled buttons + hidden home/restart
    currentGame = makeGame();
    wireButtons(currentGame);
    openModal();
  }

  function shouldForceRPS() {
    const q = new URLSearchParams(location.search);
    return q.get("playRPS") === "1" || location.hash === "#playRPS";
  }

  function runOncePerSession() {
    if (shouldForceRPS()) {
      try { sessionStorage.removeItem(KEY); } catch {}
      startRPSGame();
      try { sessionStorage.setItem(KEY, "1"); } catch {}
      return;
    }
    if (!sessionStorage.getItem(KEY)) {
      startRPSGame();
      try { sessionStorage.setItem(KEY, "1"); } catch {}
    }
  }

  // Block early exits
  if (closeBtn) closeBtn.addEventListener("click", e => { e.preventDefault(); e.stopPropagation(); });
  if (backdrop) backdrop.addEventListener("click", e => { e.preventDefault(); e.stopPropagation(); });
  document.addEventListener("keydown", e => {
    // If you want to allow ESC *after* match ends, you can check visibility of restart/home
    if (e.key === "Escape") e.preventDefault();
  });

  window.addEventListener("DOMContentLoaded", runOncePerSession);
})();