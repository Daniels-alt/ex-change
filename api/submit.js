module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Missing name or email' });
  }

  const html = `
<div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;background:#0a0a0a;color:#F5F0E8;padding:40px 32px;">

  <h1 style="font-size:1.6rem;color:#C9A84C;letter-spacing:0.05em;margin-bottom:4px;">EX-CHANGE!</h1>
  <p style="color:#9A9590;font-size:0.75rem;letter-spacing:0.2em;text-transform:uppercase;margin-top:0;">The Card Game</p>

  <hr style="border:none;border-top:1px solid #8A7535;margin:24px 0;">

  <p style="font-size:1rem;line-height:1.7;">Hi ${name},</p>
  <p style="font-size:1rem;line-height:1.7;">Welcome to the trading floor. Here's everything we promised:</p>

  <div style="background:#111;border:1px solid #8A7535;padding:24px;margin:24px 0;">
    <p style="margin:0 0 16px;font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;color:#9A9590;">Your Links</p>

    <p style="margin:0 0 16px;">
      🎮 &nbsp;<strong style="color:#C9A84C;">Play Online</strong><br>
      <a href="https://stock-exchange-game-gh4b.onrender.com/" style="color:#D4BA6A;font-size:0.9rem;">Click here to play Ex-Change! online</a>
    </p>

    <p style="margin:0 0 16px;">
      💬 &nbsp;<strong style="color:#C9A84C;">Discord</strong><br>
      <a href="https://discord.gg/cJRfSAsR" style="color:#D4BA6A;font-size:0.9rem;">Click here to join the Ex-Change! Discord server</a>
    </p>

  </div>

  <p style="font-size:0.95rem;line-height:1.7;color:#9A9590;">
    Played a round? We'd love to hear what you think — just reply to this email.
  </p>

  <hr style="border:none;border-top:1px solid #8A7535;margin:24px 0;">
  <p style="font-size:0.75rem;color:#9A9590;margin:0;">© 2025 Ex-Change! Card Game</p>

</div>
  `;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Ex-Change!', email: 'exchangegame.info@gmail.com' },
        to: [{ email }],
        subject: 'Your Ex-Change! links are here 🎯',
        htmlContent: html,
      }),
    });

    if (response.ok) {
      return res.status(200).json({ ok: true });
    } else {
      const err = await response.json();
      console.error('Brevo error:', JSON.stringify(err));
      return res.status(500).json({ error: 'Failed to send email', detail: err });
    }
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
