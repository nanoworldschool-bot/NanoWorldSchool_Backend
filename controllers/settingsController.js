import Settings from '../models/Settings.js';

export const getSettings = async (req, res) => {
  try {
    let data = await Settings.findOne();
    if (!data) {
      data = new Settings();
      await data.save();
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const updated = await Settings.findOneAndUpdate(
      {},
      { ...req.body, updatedAt: Date.now() },
      { upsert: true, new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
