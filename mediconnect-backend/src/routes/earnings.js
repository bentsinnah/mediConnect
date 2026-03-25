const express = require('express');
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/', authMiddleware(['DOCTOR']), async (req, res) => {
  try {
    const docProfile = await prisma.doctorProfile.findUnique({
      where: { userId: req.user.id }
    });

    const transactions = await prisma.transaction.findMany({
      where: { doctorProfileId: docProfile.id },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate total balance
    const balance = transactions.reduce((acc, tx) => {
      return tx.type === 'CREDIT' ? acc + tx.amount : acc - tx.amount;
    }, 0);

    // Calculate this week / month (simplified logic)
    const thisMonth = transactions.filter(tx => tx.type === 'CREDIT').reduce((a, b) => a + b.amount, 0);

    const formattedTxs = transactions.map(tx => ({
      id: tx.id,
      desc: tx.description,
      date: new Date(tx.createdAt).toLocaleDateString(),
      amount: `${tx.type === 'CREDIT' ? '+' : '-'} ₦${tx.amount.toLocaleString()}`,
      type: tx.type.toLowerCase()
    }));

    res.json({
      balance,
      thisWeek: thisMonth, // Mocked
      thisMonth,
      transactions: formattedTxs
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch earnings' });
  }
});

router.post('/withdraw', authMiddleware(['DOCTOR']), async (req, res) => {
  try {
    const docProfile = await prisma.doctorProfile.findUnique({
      where: { userId: req.user.id }
    });

    const { amount } = req.body;

    const tx = await prisma.transaction.create({
      data: {
        doctorProfileId: docProfile.id,
        amount: parseInt(amount),
        type: 'DEBIT',
        description: 'Bank Withdrawal'
      }
    });

    res.status(201).json(tx);
  } catch (error) {
    res.status(500).json({ error: 'Withdrawal failed' });
  }
});

module.exports = router;
