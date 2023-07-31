export default async (req, res) => {
  try {
    console.log(req.body);
    const response = await fetch(req.body, {
      method: "GET", // or 'POST'
      headers: {
        accept: "application/json",
      },
    });
    const data = await response.json(); // Assuming the response is JSON
    res.status(200).json(data); // Send the JSON data as the response
  } catch (err) {
    res.status(500).send({ error: "failed to fetch data" });
  }
};
