import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());
dotenv.config();

app.post("/", async (req, res) => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const size = "500x500";

  const response = await fetch(
    `https://api.foursquare.com/v2/venues/explore/?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.API_SECRET}&venuePhotos=1&v=${date}&ll=${req.body.lat},${req.body.long}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY,
      },
    }
  );
  const data = await response.json();

  const venues = data.response.groups[0].items.map((item) => {
    const photoPrefix = item.venue.photos.groups[0]?.items[0].prefix;
    const photoSuffix = item.venue.photos.groups[0]?.items[0].suffix;

    return {
      id: item.venue.id,
      name: item.venue.name,
      photo:
        photoPrefix && photoSuffix
          ? `${photoPrefix}${size}${photoSuffix}`
          : undefined,
    };
  });

  res.send({ status: 200, msg: venues });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
