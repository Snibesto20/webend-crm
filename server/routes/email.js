import express from 'express';
import nodemailer from 'nodemailer';
import { auth } from '../middleware.js';
import { ApiKey, Client } from '../models.js';

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

router.post('/', auth(['admin', 'marketing']), async (req, res) => {
  const { to, name } = req.body;

  if (!to) return res.status(400).json({ error: "Nenurodytas gavėjas." });
  
  const normalizedName = (name || '').trim().toUpperCase();

  const emailContent = `Sveiki,

Pastebėjome, kad jūsų verslas šiuo metu neturi internetinės svetainės.

Šiandien dauguma klientų prieš pasirinkdami paslaugą pirmiausia pasitikrina informaciją internete. Jei svetainės nėra, dalis jų paprasčiausiai pasirenka kitą, labiau matomą variantą.

Esame Webend komanda – kuriame modernias, greitas ir profesionaliai atrodančias svetaines, kurios padeda verslams atrodyti patikimiau ir sulaukti daugiau klientų užklausų.

Ką galime sukurti jūsų verslui:
• Tvarkingą ir pasitikėjimą kuriantį dizainą
• Greitai veikiančią svetainę, pritaikytą telefonams ir kompiuteriams
• Aiškią struktūrą, kuri skatina klientus susisiekti
• Sprendimus, kad jus būtų lengviau rasti Google paieškoje

Svarbiausia – šiuo metu svetaines kuriame visiškai nemokamai.
Tai darome tam, kad kauptume patirtį ir pildytume savo darbų portfolio.
Taip pat padovanojame talpinimą, todėl nereikės mokėti jokių mėnesinių mokesčių.

Mūsų darbus galite pamatyti čia: webend-lt.web.app

Jeigu norėsite, galime nemokamai parodyti, kaip galėtų atrodyti jūsų svetainė.
Ar būtų įdomu pamatyti?`;

  const mailOptions = {
    from: `"Webend Lietuva" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Pasiūlymas dėl nemokamos svetainių darymo paslaugos",
    text: emailContent
  };

  try {
    await transporter.sendMail(mailOptions);

    await ApiKey.findByIdAndUpdate(req.user._id, {
      $inc: { emailsSent: 1 },
    });

    if (normalizedName) {
      try {
        const existingClient = await Client.findOne({ name: normalizedName });
        
        if (!existingClient) {
          await Client.create({
            name: normalizedName,
            contacts: [to.trim()],
            tag: 'pending',
            serviceNeeded: '-',
            notes: '',
            moneyMade: 0,
            marketer: req.user.username || 'Nenurodytas'
          });
        } else {
          if (!existingClient.contacts.includes(to.trim())) {
            await Client.findByIdAndUpdate(existingClient._id, {
              $push: { contacts: to.trim() }
            });
          }
        }
      } catch (dbErr) {
        console.error('Klaida sinchronizuojant klientą fone:', dbErr.message);
      }
    }

    res.json({ success: true, message: "Išsiųsta!" });
  } catch (err) {
    console.error('Email error:', err.message);
    res.status(500).json({ error: "Sistemos klaida siunčiant laišką." });
  }
});

export default router;