(function() {
  emailjs.init("pVaDaGLiBVOrvdkVH"); // tu PUBLIC KEY
})();

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('surveyForm');
  const confirmation = document.getElementById('confirmation');
  const progressBar = document.getElementById('progressBar');
  const progressPercent = document.getElementById('progressPercent');

  const questionNames = ['q1','q2','q3','q4','q5','q6','q7'];

  function computeProgress() {
    let answered = 0;
    questionNames.forEach(name => {
      if ([...form.querySelectorAll(`input[name="${name}"]`)].some(r => r.checked)) answered++;
    });
    const pct = Math.round((answered / questionNames.length) * 100);
    progressBar.style.width = pct + '%';
    progressPercent.textContent = pct + '%';
  }

  form.addEventListener('change', e => {
    if (e.target && e.target.type === 'radio') computeProgress();
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const name = nameInput ? nameInput.value.trim() : "Anonymous";
    const email = emailInput ? emailInput.value.trim() : "No email";

    if (!name || !email) {
      alert('Please enter your name and email.');
      return;
    }

    const missing = questionNames.filter(q =>
      ![...form.querySelectorAll(`input[name="${q}"]`)].some(r => r.checked)
    );
    if (missing.length) {
      alert('Please answer all questions.');
      return;
    }

    const answers = {};
    questionNames.forEach(q => {
      answers[q] = form.querySelector(`input[name="${q}"]:checked`).value;
    });

    confirmation.classList.remove('hidden');
    confirmation.textContent = "✉️ Sending your response...";
    confirmation.style.color = "#1e40af";

    emailjs.send("service_qhe9wgl", "template_vrhnhmp", {
      from_name: name,
      from_email: email,
      ...answers
    })
    .then(() => {
      confirmation.textContent = "✅ Thank you! Your response has been sent successfully.";
      confirmation.style.color = "#16a34a";
      form.reset();
      computeProgress();
    })
    .catch((error) => {
      confirmation.textContent = "❌ Oops! Something went wrong. Please try again.";
      confirmation.style.color = "red";
      console.error("EmailJS Error:", error);
    });
  });

  computeProgress();
});
