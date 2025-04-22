const db = require("../db/mysql");
const getDistance = require("../utils/calculateDistance");

exports.addSchool = async (req, res, next) => {
  try {
    const { name, address, latitude, longitude } = req.body;
    const [result] = await db.execute(
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
      [name, address, latitude, longitude]
    );
    res
      .status(201)
      .json({ message: "School added successfully", id: result.insertId });
  } catch (err) {
    next(err);
  }
};

exports.listSchools = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required" });
    }

    const userLat = parseFloat(latitude);
    const userLong = parseFloat(longitude);

    if (isNaN(userLat) || isNaN(userLong)) {
      return res.status(400).json({ message: "Invalid latitude or longitude" });
    }

    if (userLat < -90 || userLat > 90 || userLong < -180 || userLong > 180) {
      return res
        .status(400)
        .json({ message: "Latitude or longitude out of range" });
    }

    const [schools] = await db.execute("SELECT * FROM schools");

    if (!schools.length) {
      return res.status(404).json({ message: "No schools found" });
    }
    const sortedSchools = schools
      .map((school) => ({
        ...school,
        distance: getDistance(
          userLat,
          userLong,
          school.latitude,
          school.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance);

    res.json(sortedSchools);
  } catch (err) {
    next(err); 
  }
};
