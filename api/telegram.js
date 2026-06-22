// Vercel serverless function. Set secrets in the hosting environment, never in the browser.
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const name = String(payload.name || '').trim().slice(0, 120);
  const phone = String(payload.phone || '').trim().slice(0, 80);

  if (!name || !phone) return res.status(400).json({ error: 'Name and phone are required' });
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    return res.status(503).json({ error: 'Telegram notifications are not configured' });
  }

  const message = [
    'Новая заявка с лендинга',
    '',
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    `Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`
  ].join('\n');

  try {
    const telegram = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: message })
    });
    if (!telegram.ok) throw new Error('Telegram returned an error');
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ error: 'Could not deliver the request' });
  }
};
