const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: "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",
  // apiKey: process.env.REACT_APP_OPENAI_APIKEY,
});
delete configuration.baseOptions.headers["User-Agent"];
const openai = new OpenAIApi(configuration);

// const express = require("express");
// const cors = require("cors");
// const app = express();

// app.use(cors());

let messages = [];

export async function api_get(text, context) {
  try {
    const jgrantsResponse = await getJgrants(context);
    console.log(jgrantsResponse.props.result);

    const prompt = `
      I want you to act as a financial advisor.
      My company is like this ${text}, which do you think is the best for my company from the financial list?
      This is a financial list ${JSON.stringify(jgrantsResponse.props.result)}
      Answer in Japanese
      And, You do not need to attach a link of grants to your answer.
      `;
    messages.push({ role: "system", content: prompt });

    let snsSentence = await generateSnsSentence(); // Ensure generateSnsSentence function exists and properly implemented

    console.log(snsSentence);
    messages.push({ role: "assistant", content: snsSentence.content });
    console.log(messages);
    return { processedText: snsSentence, jgrantsResponse: jgrantsResponse };
  } catch (error) {
    console.error("Error processing the text:", error);
    throw new Error("Internal server error");
  }
}

export async function api_get_after(text) {
  try {
    messages.push({ role: "user", content: text });

    console.log("messages is this~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~" + messages);
    let snsSentence = await generateSnsSentence();
    console.log(snsSentence);
    messages.push({ role: "assistant", content: snsSentence.content });

    return { processedText: snsSentence }; // You can return the value, which can be caught by '.then()'
  } catch (error) {
    console.error("Error processing the text:", error);
    return { error: "Internal server error" }; // In case of error, return error message
  }
}

async function generateSnsSentence() {
  const openaiResponse = await openai.createChatCompletion({
    model: "gpt-4",
    messages: messages,
  });

  return openaiResponse.data.choices[0].message;
}

const getJgrants = async (context) => {
  // const theme = "新たな事業を行いたい";
  const theme = context.theme;
  const numberOfEmployees = context.employees
    ? context.employees
    : "従業員の制約なし";
  const industry = context.industry;
  const place = context.place;

  let url;
  let initialFlag;

  url = `https://api.jgrants-portal.go.jp/exp/v1/public/subsidies?keyword="事業"&${
    // url = `https://api.jgrants-portal.go.jp/exp/v1/public/subsidies?keyword="事業"&${
    theme ? `use_purpose=${theme}&` : "&"
  }sort=created_date&order=DESC&acceptance=1&target_number_of_employees=${numberOfEmployees}${
    industry ? `&industry=${industry}` : ""
  }${place ? `&target_area_search=${place}` : ""}`;
  initialFlag = false;

  if (url) {
    // console.log(url);
    let res = await getData(url);

    // res.result.map((item, index) => {
    //   item.detail = getDetailData("/exp/v1/public/subsidies/id/" + item.id);

    //   console.log(item, index);
    // });
    return {
      props: {
        result: res.result,
        flag: initialFlag,
      },
    };
  } else {
    return;
  }
};

const getData = async (url) => {
  const response = await fetch("/api/jgrants", {
    method: "POST",
    body: url,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    let data = await response.json();
    console.log(data);
    const detailedData = await Promise.all(
      data.result.map((item) =>
        getDetailData(
          "https://api.jgrants-portal.go.jp/exp/v1/public/subsidies/id/" +
            item.id
        )
      )
    );

    console.log(detailedData);

    detailedData.map((item, index) => {
      data.result[index].front_subsidy_detail_page_url =
        item.result[0].front_subsidy_detail_page_url;
    });
    console.log(data);

    return data;
  }
};

const getDetailData = async (url) => {
  const response = await fetch("/api/jgrants_detail", {
    method: "POST",
    body: url,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    const data = await response.json();

    return data;
  }
};
