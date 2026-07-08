const prisma = require("../config/prisma");

const createFarm = async (req, res) => {
  try {
    const { name, district, municipality, latitude, longitude, sizeInRopani } = req.body;

    if (!name || !district) {
      return res.status(400).json({ message: "Name and district are required." });
    }

    const farm = await prisma.farm.create({
      data: {
        name,
        district,
        municipality,
        latitude,
        longitude,
        sizeInRopani,
        userId: req.user.sub,
      },
    });

    return res.status(201).json({ farm });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong while creating the farm." });
  }
};

const getFarms = async (req, res) => {
  try {
    const farms = await prisma.farm.findMany({
      where: { userId: req.user.sub },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ farms });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong while fetching farms." });
  }
};

const getFarmById = async (req, res) => {
  try {
    const { id } = req.params;

    const farm = await prisma.farm.findFirst({
      where: { id, userId: req.user.sub },
      include: { crops: true },
    });

    if (!farm) {
      return res.status(404).json({ message: "Farm not found." });
    }

    return res.status(200).json({ farm });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong while fetching the farm." });
  }
};

const updateFarm = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, district, municipality, latitude, longitude, sizeInRopani } = req.body;

    const existingFarm = await prisma.farm.findFirst({
      where: { id, userId: req.user.sub },
    });

    if (!existingFarm) {
      return res.status(404).json({ message: "Farm not found." });
    }

    const farm = await prisma.farm.update({
      where: { id },
      data: { name, district, municipality, latitude, longitude, sizeInRopani },
    });

    return res.status(200).json({ farm });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong while updating the farm." });
  }
};

const deleteFarm = async (req, res) => {
  try {
    const { id } = req.params;

    const existingFarm = await prisma.farm.findFirst({
      where: { id, userId: req.user.sub },
    });

    if (!existingFarm) {
      return res.status(404).json({ message: "Farm not found." });
    }

    await prisma.farm.delete({ where: { id } });

    return res.status(200).json({ message: "Farm deleted successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong while deleting the farm." });
  }
};

module.exports = { createFarm, getFarms, getFarmById, updateFarm, deleteFarm };