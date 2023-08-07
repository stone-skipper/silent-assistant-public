const API_HOST = process.env.REPLICATE_API_HOST || "https://api.replicate.com";

export default async function handler(req, res) {
  const body = JSON.stringify({
    // Pinned to a specific version of Stable Diffusion, fetched from:
    version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4", //stable diffusion
    input: req.body,
    // prompt: req.body.prompt,
    // width: req.body.width,
    // height: req.body.height,
    // num_outputs: req.body.num_outputs,
  });
  console.log(body);
  try {
    console.log(req);

    const response = await fetch(`${API_HOST}/v1/predictions`, {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body,
    });

    // if (response.status !== 201) {
    //   let error = await response.json();
    //   res.statusCode = 500;
    //   res.end(JSON.stringify({ detail: error.detail }));
    //   return;
    // }

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
