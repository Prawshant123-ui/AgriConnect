const prisma = require("../config/prisma");
const { uploadImageBuffer } = require("../utils/uploadToCloudinary");
const { runInference } = require("../utils/inference");

const createScan = async (req, res) => {
  try {
    const { cropId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "An image file is required." });
    }

    const crop = await prisma.crop.findFirst({
      where: { id: cropId, farm: { userId: req.user.sub } },
    });

    if (!crop) {
      return res.status(404).json({ message: "Crop not found." });
    }

    const uploadResult = await uploadImageBuffer(req.file.buffer);
    const prediction = await runInference(req.file.buffer);

    const isHealthy = prediction.label.toLowerCase().includes("healthy");

    let diseaseId = null;

    if (!isHealthy) {
      const disease = await prisma.disease.findUnique({
        where: { name: prediction.label },
      });

      // if the model returns a label we don't have in our Disease table yet,
      // we still save the scan — just without a linked disease record
      diseaseId = disease ? disease.id : null;
    }

    const scan = await prisma.scan.create({
      data: {
        imageUrl: uploadResult.secure_url,
        predictedLabel: prediction.label,
        confidenceScore: prediction.score,
        isHealthy,
        cropId,
        diseaseId,
      },
      include: { disease: true },
    });

    return res.status(201).json({ scan });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong while processing the scan." });
  }
};

const getScansByCrop = async (req, res) => {
  try {
    const { cropId } = req.params;

    const crop = await prisma.crop.findFirst({
      where: { id: cropId, farm: { userId: req.user.sub } },
    });

    if (!crop) {
      return res.status(404).json({ message: "Crop not found." });
    }

    const scans = await prisma.scan.findMany({
      where: { cropId },
      orderBy: { createdAt: "desc" },
      include: { disease: true },
    });

    return res.status(200).json({ scans });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong while fetching scans." });
  }
};

const getScanById = async (req, res) => {
  try {
    const { id } = req.params;

    const scan = await prisma.scan.findFirst({
      where: { id, crop: { farm: { userId: req.user.sub } } },
      include: { disease: true, crop: true },
    });

    if (!scan) {
      return res.status(404).json({ message: "Scan not found." });
    }

    return res.status(200).json({ scan });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong while fetching the scan." });
  }
};

module.exports = { createScan, getScansByCrop, getScanById };