// SuperMan Coin - Interactive JavaScript Features
// Handles theme management, copy functionality, presale logic, and UI interactions

class SuperManCoin {
  constructor() {
    this.initializeTheme();
    this.initializeEventListeners();
    this.initializePresale();
    this.startCountdown();
  }

  // Theme Management
  initializeTheme() {
    const savedTheme = localStorage.getItem('superman-theme') || 'dark';
    document.body.className = savedTheme;
  }

  toggleTheme() {
    const currentTheme = document.body.className || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.className = newTheme;
    localStorage.setItem('superman-theme', newTheme);
  }

  // Event Listeners Setup
  initializeEventListeners() {
    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Copy contract address
    const copyButton = document.querySelector('.copy-btn');
    if (copyButton) {
      copyButton.addEventListener('click', () => this.copyContract());
    }

    // Modal controls
    const modalTriggers = document.querySelectorAll('[data-modal]');
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal');
        this.openModal(modalId);
      });
    });

    // Close modal listeners
    const closeButtons = document.querySelectorAll('.modal .close');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => this.closeModal());
    });

    // Click outside modal to close
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        this.closeModal();
      }
    });

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  }

  // Copy Contract Address
  copyContract() {
    const contractAddress = 'SUPERMAN123456789ABCDEF'; // Replace with actual contract
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(contractAddress).then(() => {
        this.showCopyFeedback('Contract address copied!');
      }).catch(() => {
        this.fallbackCopy(contractAddress);
      });
    } else {
      this.fallbackCopy(contractAddress);
    }
  }

  fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.showCopyFeedback('Contract address copied!');
    } catch (err) {
      this.showCopyFeedback('Failed to copy. Please copy manually.');
    }
    
    document.body.removeChild(textArea);
  }

  showCopyFeedback(message) {
    const copyBtn = document.querySelector('.copy-btn');
    if (copyBtn) {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = message;
      copyBtn.style.background = 'linear-gradient(135deg, #14f195, #14f195)';
      
      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.background = '';
      }, 2000);
    }
  }

  // Modal Management
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    const openModal = document.querySelector('.modal.open');
    if (openModal) {
      openModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // Presale Logic
  initializePresale() {
    this.presaleData = {
      goal: 1000000, // 1M SOL goal
      raised: 750000, // 750K SOL raised
      contributors: 5420,
      timeLeft: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      phases: [
        { name: 'Phase 1', price: 0.001, completed: true },
        { name: 'Phase 2', price: 0.002, completed: true },
        { name: 'Phase 3', price: 0.003, completed: false, current: true },
        { name: 'Phase 4', price: 0.004, completed: false }
      ]
    };

    this.updatePresaleUI();
  }

  updatePresaleUI() {
    // Update progress bar
    const progressBar = document.querySelector('.progress span');
    if (progressBar) {
      const percentage = (this.presaleData.raised / this.presaleData.goal) * 100;
      progressBar.style.width = `${percentage}%`;
    }

    // Update stats
    this.updateStat('presale-raised', this.formatSOL(this.presaleData.raised));
    this.updateStat('presale-goal', this.formatSOL(this.presaleData.goal));
    this.updateStat('presale-contributors', this.presaleData.contributors.toLocaleString());

    // Update phase information
    const currentPhase = this.presaleData.phases.find(phase => phase.current);
    if (currentPhase) {
      this.updateStat('current-phase', currentPhase.name);
      this.updateStat('current-price', `${currentPhase.price} SOL`);
    }
  }

  updateStat(className, value) {
    const element = document.querySelector(`.${className}`);
    if (element) {
      element.textContent = value;
    }
  }

  formatSOL(amount) {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M SOL`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K SOL`;
    }
    return `${amount.toLocaleString()} SOL`;
  }

  // Countdown Timer
  startCountdown() {
    const countdownElement = document.querySelector('.countdown');
    if (!countdownElement) return;

    const endTime = Date.now() + this.presaleData.timeLeft;

    const updateCountdown = () => {
      const now = Date.now();
      const timeLeft = endTime - now;

      if (timeLeft <= 0) {
        countdownElement.textContent = 'Presale Ended!';
        return;
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      countdownElement.innerHTML = `
        <div class="countdown-item">
          <span class="countdown-value">${days}</span>
          <span class="countdown-label">Days</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-value">${hours}</span>
          <span class="countdown-label">Hours</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-value">${minutes}</span>
          <span class="countdown-label">Minutes</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-value">${seconds}</span>
          <span class="countdown-label">Seconds</span>
        </div>
      `;
    };

    // Update immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // Utility Functions
  animateValue(element, start, end, duration) {
    if (!element) return;

    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const value = start + (end - start) * progress;
      element.textContent = Math.floor(value).toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  // Initialize on scroll animations
  initializeScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, observerOptions);

    // Observe animated elements
    const animatedElements = document.querySelectorAll('.card, .hero-mark');
    animatedElements.forEach(el => observer.observe(el));
  }

  // Buy token functionality (placeholder)
  buyToken(amount) {
    console.log(`Attempting to buy ${amount} SUPERMAN tokens`);
    // Integration with Solana wallet and DEX would go here
    this.showNotification('Wallet connection required for purchase', 'warning');
  }

  // Show notification
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      color: var(--text);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      z-index: 1000;
      animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// Social Links Data
const socialLinks = {
  twitter: 'https://twitter.com/supermancoin',
  telegram: 'https://t.me/supermancoin',
  discord: 'https://discord.gg/supermancoin',
  github: 'https://github.com/supermancoin',
  medium: 'https://medium.com/@supermancoin'
};

// Chart Integration (placeholder for future implementation)
class ChartManager {
  constructor() {
    this.initializeChart();
  }

  initializeChart() {
    // Placeholder for price chart integration
    // Could integrate with TradingView, Chart.js, or similar
    console.log('Chart initialization placeholder');
  }

  updatePrice(price, change) {
    const priceElement = document.querySelector('.price-ticker');
    if (priceElement) {
      priceElement.textContent = `$${price}`;
    }

    const changeElement = document.querySelector('.price-change');
    if (changeElement) {
      changeElement.textContent = `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
      changeElement.className = `price-change ${change > 0 ? 'positive' : 'negative'}`;
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize main application
  const app = new SuperManCoin();
  
  // Initialize chart manager
  const chartManager = new ChartManager();
  
  // Add scroll animations
  app.initializeScrollAnimations();
  
  // Simulate live price updates (placeholder)
  setInterval(() => {
    const mockPrice = (Math.random() * 0.001 + 0.0005).toFixed(6);
    const mockChange = (Math.random() - 0.5) * 20;
    chartManager.updatePrice(mockPrice, mockChange);
  }, 5000);

  console.log('SuperMan Coin landing page initialized! 🚀');
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  .countdown {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .countdown-item {
    text-align: center;
    padding: 16px;
    background: rgba(153, 69, 255, 0.1);
    border-radius: 12px;
    border: 1px solid var(--border);
  }

  .countdown-value {
    display: block;
    font-size: 32px;
    font-weight: 900;
    background: linear-gradient(135deg, var(--solana-purple), var(--solana-green));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .countdown-label {
    display: block;
    font-size: 14px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .price-change.positive {
    color: var(--solana-green);
  }

  .price-change.negative {
    color: var(--danger);
  }

  .notification {
    animation: slideInRight 0.3s ease;
  }

  .notification.warning {
    border-left: 4px solid var(--warning);
  }

  .notification.error {
    border-left: 4px solid var(--danger);
  }

  .notification.success {
    border-left: 4px solid var(--solana-green);
  }
`;
document.head.appendChild(style);
