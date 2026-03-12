
  // Filter products
  function filterProducts(cat, btn) {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
      if (cat === 'all' || card.dataset.cat === cat) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });

    // Update active filter button
    if (btn) {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }

    // Scroll to shop only if triggered by user click (btn exists)
    if (btn) {
      document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
    }
  }

  // On page load: make all product cards visible immediately
  document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('products-grid');
    if (grid) {
      // Force all cards visible and add visible class to grid for fade-in
      grid.classList.add('visible');
      document.querySelectorAll('.product-card').forEach(card => {
        card.style.display = 'block';
      });
    }
    // Also trigger fade-in for elements already in view
    document.querySelectorAll('.fade-in').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('visible');
      }
    });
  });

  // Order a specific product via WhatsApp
  function orderItem(name, price) {
    const msg = encodeURIComponent(`Hi Riri! 💖 I'd like to order:\n\n*${name}* - ${price}\n\nPlease confirm availability and delivery details. Thank you!`);
    window.open(`https://wa.me/2347032973656?text=${msg}`, '_blank');
  }

  // Send full order form via WhatsApp
  function sendWhatsAppOrder() {
    const name = document.getElementById('fname').value || 'Not provided';
    const phone = document.getElementById('fphone').value || 'Not provided';
    const item = document.getElementById('fitem').value || 'Not specified';
    const address = document.getElementById('faddress').value || 'Not provided';
    const notes = document.getElementById('fnotes').value || 'None';

    const msg = encodeURIComponent(
      `Hi Riri! 💖 I'd like to place an order:\n\n` +
      `👤 Name: ${name}\n` +
      `📞 Phone: ${phone}\n` +
      `🛍️ Item: ${item}\n` +
      `📍 Address: ${address}\n` +
      `📝 Notes: ${notes}\n\n` +
      `Please confirm and let me know the total. Thank you!`
    );

    window.open(`https://wa.me/2347032973656?text=${msg}`, '_blank');
  }

  // Scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));