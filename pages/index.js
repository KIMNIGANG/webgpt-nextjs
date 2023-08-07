import React, { useState } from "react";
import { api_get, api_get_after } from "../components/api_get";

const employeeOptions = [
  "従業員の制約なし",
  "5名以下",
  "20名以下",
  "50名以下",
  "100名以下",
  "300名以下",
  "900名以下",
  "901名以上",
];

const placeOptions = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川",
  "新潟県",
  "山梨県",
  "長野県",
  "富山県",
  "石川県",
  "福井県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島",
  "沖縄県",
];

const industryOptions = [
  "農業，林業",
  "漁業",
  "鉱業，採石業，砂利採取業",
  "建設業",
  "製造業",
  "電気・ガス・熱供給・水道業",
  "情報通信業",
  "運輸業，郵便業",
  "卸売業，小売業",
  "金融業，保険業",
  "不動産業，物品賃貸業",
  "学術研究，専門・技術サービス業",
  "宿泊業，飲食サービス業",
  "生活関連サービス業，娯楽業",
  "教育，学習支援業",
  "医療，福祉",
  "複合サービス事業",
  "サービス業（他に分類されないもの）",
  "公務（他に分類されるものを除く）",
  "分類不能の産業",
];

const themeOptions = [
  "新たな事業を行いたい",
  "販路拡大・海外展開をしたい",
  "イベント・事業運営支援がほしい",
  "事業を引き継ぎたい",
  "研究開発・実証事業を行いたい",
  "人材育成を行いたい",
  "資金繰りを改善したい",
  "設備整備・IT導入したい",
  "雇用・職場環境を改善したい",
  "エコ・SDG’s活動支援がほしい",
  "災害(自然災害、感染症等）支援がほしい",
  "教育・子育て・少子化への支援がほしい",
  "スポーツ・文化への支援がほしい",
  "安全・防災対策支援がほしい",
  "まちづくり・地域振興支援がほしい",
];

function Home() {
  const [submitCount, setSubmitCount] = useState(false);

  const [selectedEmployees, setSelectedEmployees] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatGPTResponse, setChatGPTResponse] = useState("");
  const [chatList, setChatList] = useState([]);
  const [jGrantsResponse, setJGrantsResponse] = useState([]);

  const handleSubmit = async (value) => {
    try {
      setLoading(true);

      if (submitCount === false) {
        const text = `selectedEmployees:${selectedEmployees},selectedPlace:${selectedPlace},selectedIndustry:${selectedIndustry},selectedTheme:${selectedTheme}`;
        const context = {
          employees: selectedEmployees,
          place: selectedPlace,
          industry: selectedIndustry,
          theme: selectedTheme,
        };
        api_get(text, context)
          .then((result) => {
            console.log(result);
            setChatGPTResponse(result.processedText.content);
            // console.log(response.data.processedText);

            let chatlist2 = chatList;
            chatlist2.push([result.processedText.content]);
            setChatList(chatlist2);
            console.log(chatList);
            // console.log(response.data.jgrantsResponse.props.result);

            let newJGrantsResponse = jGrantsResponse;
            result.jgrantsResponse.props.result.map((item, index) => {
              newJGrantsResponse[index] = item;
            });
            setJGrantsResponse(newJGrantsResponse);
            setLoading(false);
          })
          .catch((err) => console.error(err));
        setSubmitCount(true);
      } else {
        api_get_after(value)
          .then((result) => {
            setChatGPTResponse(result.processedText.content);
            // console.log(result.processedText);

            let chatlist2 = chatList;
            chatlist2.push([result.processedText.content]);

            setChatList(chatlist2);
            // console.log(response.jgrantsResponse.props.result);

            // let newJGrantsResponse = jGrantsResponse;
            // result.jgrantsResponse.props.result.map((item, index) => {
            //   newJGrantsResponse[index] = item;
            // });
            // setJGrantsResponse(newJGrantsResponse);
            setLoading(false);
          })
          .catch((err) => console.error(err));
      }
    } catch (error) {
      console.error("Error processing the text:", error);
    }
  };

  return (
    <div className="App">
      <h1 className="title">補助金 Chatbot</h1>
      {submitCount === false && (
        <div className="form-container">
          <div className="select-container">
            <select
              className="select"
              value={selectedEmployees}
              onChange={(e) => setSelectedEmployees(e.target.value)}
            >
              <option value="">Select Number of Employees</option>
              {employeeOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              className="select"
              value={selectedPlace}
              onChange={(e) => setSelectedPlace(e.target.value)}
            >
              <option value="">Select Place</option>
              {placeOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              className="select"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
            >
              <option value="">Select Industry</option>
              {industryOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              className="select"
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
            >
              <option value="">Select Theme</option>
              {themeOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      )}

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="chat-response">
          {submitCount > 0 ? (
            <table>
              <thead>
                <tr>
                  {/* <th>ID</th>
                  <th>Name</th> */}
                  <th>補助金名</th>
                  <th>募集期限</th>
                  <th>補助金上限額</th>
                </tr>
              </thead>
              <tbody>
                {jGrantsResponse.map((item, index) => {
                  let s_date = new Date(item.acceptance_start_datetime);

                  let s_year = s_date.getUTCFullYear();
                  let s_month = s_date.getUTCMonth() + 1; // JavaScript counts months from 0-11, so add 1 to get the correct month
                  let s_day = s_date.getUTCDate();

                  let e_date = new Date(item.acceptance_end_datetime);

                  let e_year = e_date.getUTCFullYear();
                  let e_month = e_date.getUTCMonth() + 1; // JavaScript counts months from 0-11, so add 1 to get the correct month
                  let e_day = e_date.getUTCDate();

                  return (
                    <tr key={index}>
                      {/* <td>{item.id}</td>
                      <td>{item.name}</td> */}
                      <td>
                        <a
                          href={item.front_subsidy_detail_page_url}
                          target="_blank"
                        >
                          {item.title}
                        </a>
                      </td>
                      <td>
                        {s_year +
                          "年" +
                          s_month +
                          "月" +
                          s_day +
                          "日 ~ " +
                          e_year +
                          "年" +
                          e_month +
                          "月" +
                          e_day +
                          "日"}
                      </td>
                      {/* <td>{e_year + "年" + e_month + "月" + e_day + "日"}</td> */}
                      <td>{item.subsidy_max_limit}円</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p></p>
          )}
        </div>
      )}
      <h2>ChatGPT Response:</h2>
      {/* <p>{chatGPTResponse}</p> */}
      {chatList.map((item, index) => {
        return (
          <div key={index} className="chat-item">
            <pre>{item}</pre>
          </div>
        );
      })}

      {submitCount === true && !loading ? (
        <div className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            placeholder="Type your message..."
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSubmit(event.target.value);
                console.log(event.target.value);
              }
            }}
          />
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      ) : (
        <p>Select and Submit for chat</p>
      )}
    </div>
  );
}

export default Home;

//僕の会社はおもちゃ会社です、長崎県で5年前に設立した会社です、今コロナによりちょっと会社がきつい感じです、従業員は２３人ぐらいの小さめの企業です
//私の会社は東京にある、ショッピングサイトを作る会社です。何人が働いてるかは知らないけど、でもたぶん３０人は超えると思う。今新しく他の会社と協力して渋谷にオフラインの店を開こうとしている。
//as
