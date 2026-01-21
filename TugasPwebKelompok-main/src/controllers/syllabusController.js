const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Visitor Counter
exports.getVisitorCount = async (req, res) => {
  try {
    // Find first record or create
    let visitor = await prisma.visitorCounter.findFirst();
    if (!visitor) {
      visitor = await prisma.visitorCounter.create({ data: { count: 0 } });
    }
    res.json({ count: visitor.count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch visitor count' });
  }
};

exports.incrementVisitorCount = async (req, res) => {
  try {
    let visitor = await prisma.visitorCounter.findFirst();
    if (!visitor) {
      visitor = await prisma.visitorCounter.create({ data: { count: 1 } });
    } else {
      visitor = await prisma.visitorCounter.update({
        where: { id: visitor.id },
        data: { count: visitor.count + 1 },
      });
    }
    res.json({ count: visitor.count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to increment visitor count' });
  }
};

// Contact Form
exports.submitContact = async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const newContact = await prisma.contactMessage.create({
      data: { name, email, message },
    });
    res.status(201).json({ message: 'Message sent successfully', data: newContact });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Guestbook
exports.getGuestbookEntries = async (req, res) => {
  try {
    const entries = await prisma.guestbookEntry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch guestbook entries' });
  }
};

exports.addGuestbookEntry = async (req, res) => {
  const { name, message, rating } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }
  try {
    const newEntry = await prisma.guestbookEntry.create({
      data: {
        name,
        message,
        rating: rating ? parseInt(rating) : 5
      },
    });
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add guestbook entry' });
  }
};
