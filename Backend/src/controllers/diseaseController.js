const prisma = require("../config/prisma");

const createDisease = async (req, res) => {
  try {
    const { name, cropType, description, symptoms, treatment } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Disease name is required." });
    }

    const existing = await prisma.disease.findUnique({ where: { name } });

    if (existing) {
      return res.status(409).json({ message: "A disease with this name already exists." });
    }

    const disease = await prisma.disease.create({
      data: { name, cropType, description, symptoms, treatment },
    });

    return res.status(201).json({ disease });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong while creating the disease." });
  }
};

const getDiseases = async (req, res) => {
  try {
    const { cropType } = req.query;

    const diseases = await prisma.disease.findMany({
      where: cropType ? { cropType } : undefined,
      orderBy: { name: "asc" },
    });

    return res.status(200).json({ diseases });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong while fetching diseases." });
  }
};

const getDiseaseById = async (req, res) => {
  try {
    const { id } = req.params;

    const disease = await prisma.disease.findUnique({ where: { id } });

    if (!disease) {
      return res.status(404).json({ message: "Disease not found." });
    }

    return res.status(200).json({ disease });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong while fetching the disease." });
  }
};

const updateDisease = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, cropType, description, symptoms, treatment } = req.body;

    const existing = await prisma.disease.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ message: "Disease not found." });
    }

    // if the name is being changed, make sure it doesn't collide with another record
    if (name && name !== existing.name) {
      const nameTaken = await prisma.disease.findUnique({ where: { name } });
      if (nameTaken) {
        return res.status(409).json({ message: "A disease with this name already exists." });
      }
    }

    const disease = await prisma.disease.update({
      where: { id },
      data: { name, cropType, description, symptoms, treatment },
    });

    return res.status(200).json({ disease });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong while updating the disease." });
  }
};

const deleteDisease = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.disease.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ message: "Disease not found." });
    }

    await prisma.disease.delete({ where: { id } });

    return res.status(200).json({ message: "Disease deleted successfully." });
  } catch (err) {
    console.error(err);
    // if scans reference this disease, Prisma will throw a foreign key error here
    return res.status(500).json({ message: "Something went wrong while deleting the disease." });
  }
};

module.exports = { createDisease, getDiseases, getDiseaseById, updateDisease, deleteDisease };