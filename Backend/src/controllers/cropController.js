const prisma = require("../config/prisma");

// helper to confirm the farm belongs to the logged-in user before touching its crops
const verifyFarmOwnership = async (farmId, userId) => {
  return prisma.farm.findFirst({ where: { id: farmId, userId } });
};

const createCrop = async (req, res) => {
  try {
    const { farmId } = req.params;
    const { cropType, plantingDate, growthStage, expectedHarvest, cultivationArea } = req.body;

    if (!cropType) {
      return res.status(400).json({ message: "Crop type is required." });
    }

    const farm = await verifyFarmOwnership(farmId, req.user.sub);

    if (!farm) {
      return res.status(404).json({ message: "Farm not found." });
    }

    const crop = await prisma.crop.create({
      data: {
        cropType,
        plantingDate,
        growthStage,
        expectedHarvest,
        cultivationArea,
        farmId,
      },
    });

    return res.status(201).json({ crop });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong while creating the crop." });
  }
};

const getCropsByFarm = async (req, res) => {
  try {
    const { farmId } = req.params;

    const farm = await verifyFarmOwnership(farmId, req.user.sub);

    if (!farm) {
      return res.status(404).json({ message: "Farm not found." });
    }

    const crops = await prisma.crop.findMany({
      where: { farmId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ crops });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong while fetching crops." });
  }
};

const getCropById = async (req, res) => {
  try {
    const { id } = req.params;

    const crop = await prisma.crop.findFirst({
      where: { id, farm: { userId: req.user.sub } },
      include: { scans: true, farm: true },
    });

    if (!crop) {
      return res.status(404).json({ message: "Crop not found." });
    }

    return res.status(200).json({ crop });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong while fetching the crop." });
  }
};

const updateCrop = async (req, res) => {
  try {
    const { id } = req.params;
    const { cropType, plantingDate, growthStage, expectedHarvest, cultivationArea } = req.body;

    const existingCrop = await prisma.crop.findFirst({
      where: { id, farm: { userId: req.user.sub } },
    });

    if (!existingCrop) {
      return res.status(404).json({ message: "Crop not found." });
    }

    const crop = await prisma.crop.update({
      where: { id },
      data: { cropType, plantingDate, growthStage, expectedHarvest, cultivationArea },
    });

    return res.status(200).json({ crop });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong while updating the crop." });
  }
};

const deleteCrop = async (req, res) => {
  try {
    const { id } = req.params;

    const existingCrop = await prisma.crop.findFirst({
      where: { id, farm: { userId: req.user.sub } },
    });

    if (!existingCrop) {
      return res.status(404).json({ message: "Crop not found." });
    }

    await prisma.crop.delete({ where: { id } });

    return res.status(200).json({ message: "Crop deleted successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong while deleting the crop." });
  }
};

module.exports = { createCrop, getCropsByFarm, getCropById, updateCrop, deleteCrop };