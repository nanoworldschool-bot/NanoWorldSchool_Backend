import Content from '../models/Content.js';

export const getPageContent = async (req, res) => {
  try {
    const { page } = req.params;
    const data = await Content.findOne({ pageId: page });
    if (!data) return res.status(404).json({ message: 'Page not found' });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePageContent = async (req, res) => {
  try {
    const { page } = req.params;
    const { content } = req.body;
    const updated = await Content.findOneAndUpdate(
      { pageId: page },
      { content, updatedAt: Date.now() },
      { upsert: true, new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
