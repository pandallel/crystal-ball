document.addEventListener("DOMContentLoaded", () => {
  const fortuneText = document.getElementById("fortune-text");
  const askButton = document.getElementById("ask-button");

  // List of fallback fortunes if the API fails
  const fallbackFortunes = [
    "You will find a mysterious sock today. It is not yours. How did it get there?",
    "Someone will ask you for directions to a place you've never heard of. The place doesn't exist.",
    "A small dog will think about barking at you but decide against it. This is a good omen.",
    "Your next meal will be slightly disappointing, but you'll eat it anyway.",
    "You will have an idea for an app that already exists. It will be worse than the existing app.",
    "A bird will notice you today. It won't be impressed.",
    "You'll feel like you're being watched while showering. It's just your rubber duck judging your life choices.",
    "You will almost trip in public but catch yourself. Three people will notice but pretend they didn't.",
    "Someone will think about texting you but will decide to watch TikTok instead.",
    "You will find money in an old jacket, but it will be exactly enough for half a coffee.",
  ];

  // Function to check if the user has already received a fortune today
  function hasReceivedFortuneToday() {
    const lastFortuneTime = localStorage.getItem("lastFortuneTime");
    if (!lastFortuneTime) return false;

    const lastDate = new Date(parseInt(lastFortuneTime));
    const today = new Date();

    return (
      lastDate.getDate() === today.getDate() &&
      lastDate.getMonth() === today.getMonth() &&
      lastDate.getFullYear() === today.getFullYear()
    );
  }

  // Function to save the time when a fortune was received
  function saveFortuneTime() {
    localStorage.setItem("lastFortuneTime", Date.now().toString());
  }

  // Function to get time until next fortune
  function getTimeUntilNextFortune() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeRemaining = tomorrow - now;
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );

    return `${hours} hours and ${minutes} minutes`;
  }

  // Check on load if user has already received a fortune today
  function updateButtonState() {
    if (hasReceivedFortuneToday()) {
      askButton.disabled = true;
      askButton.textContent = "Return Tomorrow";
      fortuneText.textContent =
        "Your fortune has been revealed for today. The crystal ball needs time to recharge. Return tomorrow for another glimpse into your future.";
    } else {
      askButton.disabled = false;
      askButton.textContent = "Tell My Fortune";

      // Only reset the fortune text if it's currently showing the "return tomorrow" message
      if (
        fortuneText.textContent.includes("crystal ball needs time to recharge")
      ) {
        fortuneText.textContent = "Ask me about your future...";
      }
    }
  }

  // Function to get a random fallback fortune
  function getRandomFallbackFortune() {
    const randomIndex = Math.floor(Math.random() * fallbackFortunes.length);
    return fallbackFortunes[randomIndex];
  }

  // Function to fetch a fortune from the API
  async function getFortuneFromAPI() {
    try {
      // Show loading state
      fortuneText.textContent = "Gazing into the future...";

      const response = await fetch("/api/generate-fortune");
      const data = await response.json();

      if (data.fortune) {
        return data.fortune;
      } else if (data.fallbackFortune) {
        return data.fallbackFortune;
      } else {
        throw new Error("No fortune received");
      }
    } catch (error) {
      console.error("Error fetching fortune:", error);
      return getRandomFallbackFortune();
    }
  }

  // Animation effect when revealing fortune
  async function revealFortune() {
    // Check if user already got a fortune today
    if (hasReceivedFortuneToday()) {
      const timeLeft = getTimeUntilNextFortune();
      fortuneText.textContent = `You've already consulted the crystal ball today. It needs ${timeLeft} to recharge. Return tomorrow for another glimpse into your future.`;
      return;
    }

    // Disable button during animation
    askButton.disabled = true;

    // Fade out
    fortuneText.style.opacity = 0;

    // Ball shake animation
    const ball = document.querySelector(".ball");

    // Add loading class for cloudy effect
    ball.classList.add("loading");

    // Add shake class after a short delay for more natural transition
    setTimeout(() => {
      ball.classList.add("shake");
    }, 300);

    setTimeout(async () => {
      // Get fortune from API
      const fortune = await getFortuneFromAPI();

      // Update text
      fortuneText.textContent = fortune;

      // Fade back in
      fortuneText.style.opacity = 1;

      // Remove shake effect first
      ball.classList.remove("shake");

      // Save that user received fortune today
      saveFortuneTime();

      // Update button to show return tomorrow
      askButton.textContent = "Return Tomorrow";

      // Remove loading class after a delay for smooth transition
      setTimeout(() => {
        ball.classList.remove("loading");

        // Keep button disabled since user already got their fortune
        askButton.disabled = true;
      }, 800);
    }, 2500);
  }

  // Add click event
  askButton.addEventListener("click", revealFortune);

  // Check daily limit on page load
  updateButtonState();

  // Add shake animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    .shake {
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both !important;
    }
    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  `;
  document.head.appendChild(style);
});
