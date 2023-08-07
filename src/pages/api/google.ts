import { Configuration, OpenAIApi } from "openai";

const API_HOST = "https://www.googleapis.com/customsearch/v1";

export default async function handler(req, res) {
  try {
    // console.log(req.body);
    const cx = "f1e5b79545c3f4a3d"; //custom search engine id
    console.log(
      `${API_HOST}?key=${process.env.GOOGLE_CUSTOM_SEARCH_API}&cx=${cx}&searchType=image&q=${req.body.query}&num=${req.body.number}`
    );
    const response = await fetch(
      `${API_HOST}?key=${process.env.GOOGLE_CUSTOM_SEARCH_API}&cx=${cx}&searchType=image&q=${req.body.query}&num=${req.body.number}`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${process.env.GOOGLE_CUSTOM_SEARCH_API}`,
          "Content-Type": "application/json",
        },
      }
    );

    const prediction = await response.json();
    res.statusCode = 201;
    res.end(JSON.stringify(prediction));
    console.log(prediction);
    // console.log(completion.data);
    // res.status(200).json({ result: completion.data });
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
}
