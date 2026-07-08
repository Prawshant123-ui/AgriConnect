const axios = require("axios");

// calls the Hugging Face hosted inference endpoint for the plant disease model
const runInference = async (imageBuffer) => {
  const response = await axios.post(
    `https://api-inference.huggingface.co/models/${process.env.HF_MODEL_ID}`,
    imageBuffer,
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
        "Content-Type": "application/octet-stream",
      },
    }
  );

  // Hugging Face image classification models return an array like:
  // [{ label: "Tomato___Late_blight", score: 0.94 }, ...]
  const predictions = response.data;

  if (!Array.isArray(predictions) || predictions.length === 0) {
    throw new Error("Inference returned no predictions.");
  }

  return predictions[0]; // top prediction
};

module.exports = { runInference };