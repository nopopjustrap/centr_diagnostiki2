// Мобильное меню 
document.getElementById('burger').addEventListener('click', function () {
  document.getElementById('menu').classList.toggle('open');
});

// Форма экспресс-диагностики
const diagnosticForm = document.getElementById('diag-form-el');
const formStatus = document.getElementById('form-status');

diagnosticForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  if (!diagnosticForm.reportValidity()) return;

  const button = diagnosticForm.querySelector('button[type="submit"]');
  const data = Object.fromEntries(new FormData(diagnosticForm).entries());
  button.disabled = true;
  button.textContent = 'Отправляем…';
  formStatus.classList.remove('error');
  formStatus.textContent = '';

  try {
    const response = await fetch('/api/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Telegram delivery failed');
    diagnosticForm.reset();
    formStatus.textContent = 'Спасибо! Заявка отправлена. Мы свяжемся с вами.';
  } catch (error) {
    formStatus.classList.add('error');
    formStatus.textContent = 'Не удалось отправить заявку. Пожалуйста, позвоните нам по номеру в разделе «Контакты».';
  } finally {
    button.disabled = false;
    button.textContent = 'Получить диагностику';
  }
});
