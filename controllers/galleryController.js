import Gallery from '../models/Gallery.js';
import fs from 'fs';
import path from 'path';

export const getGallery = async (req, res) => {
  try {
    const data = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSystemAssets = async (req, res) => {
  try {
    // Note: This path logic is for development. 
    // In production, assets might be served differently.
    const publicDir = path.join(process.cwd(), '..', 'frontend', 'public');
    
    if (!fs.existsSync(publicDir)) {
      // Fallback: common static assets if dir not found (e.g. in some serverless envs)
      const commonAssets = [
        { url: '/building_exterior.jpeg', title: 'Building Exterior', category: 'System' },
        { src: '/reception.jpeg', title: 'Reception', category: 'System' },
        { src: '/classroom.jpeg', title: 'Smart Classroom', category: 'System' },
        { src: '/interior_seating.jpeg', title: 'Student Lounge', category: 'System' },
        { src: '/seminar_hall.jpeg', title: 'Seminar Hall', category: 'System' },
        { src: '/branding_wall.jpeg', title: 'Inspiration Wall', category: 'System' },
      ];
      return res.status(200).json(commonAssets);
    }

    const files = fs.readdirSync(publicDir);
    const images = files
      .filter(f => /\.(jpg|jpeg|png|webp|ico|svg)$/i.test(f))
      .map(f => ({ 
        _id: f, 
        url: `/${f}`, 
        title: f.split('.')[0].replace(/_/g, ' ').toUpperCase(), 
        category: 'System' 
      }));

    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addGalleryImage = async (req, res) => {
  try {
    const { url, title, category } = req.body;
    const newImage = new Gallery({ url, title, category });
    const savedImage = await newImage.save();
    res.status(201).json(savedImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteGalleryImage = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
