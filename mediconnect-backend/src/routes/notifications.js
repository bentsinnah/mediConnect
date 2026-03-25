const express = require('express');
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/', authMiddleware(), async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to latest 50
    });
    res.json(notifications);
  } catch (error) {
    console.error('GET /notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark single notification as read
router.patch('/:id/read', authMiddleware(), async (req, res) => {
  try {
    const notification = await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true }
    });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Mark ALL notifications as read
router.patch('/read-all', authMiddleware(), async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, isRead: false },
      data: { isRead: true }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

// Get unread count (for badge)
router.get('/unread-count', authMiddleware(), async (req, res) => {
  try {
    const count = await prisma.notification.count({
      where: { userId: req.user.id, isRead: false }
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get count' });
  }
});

module.exports = router;
