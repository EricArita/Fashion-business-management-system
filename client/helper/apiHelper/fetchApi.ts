import { config } from "../../config/config";

export const fetchAPI = async (httpMethod: string, api: string, requestBody?: any) => {
  let url = config.url.apiServer + api;

  try {
    if (httpMethod === "GET") {
      if (httpMethod === "GET" && requestBody !== undefined && requestBody !== null) {
        const encodedQueryParams = encodeURI(JSON.stringify(requestBody));
        url += url.includes("count") ? `?where=${encodedQueryParams}` : `?filter=${encodedQueryParams}`;
      }

      const response = await fetch(url, {
        method: httpMethod,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          //'token': token ? token : '',
        },
      });

      if (response.ok) {
        const jsonRespon = await response.json();
        return jsonRespon;
      }
    } else if (httpMethod === "POST" || httpMethod === "PATCH") {
      const response = await fetch(url, {
        method: httpMethod,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
          //'token': token ? token : '',
        },
        body: requestBody !== undefined && requestBody !== null
                ? JSON.stringify(requestBody)
                : JSON.stringify({})  
      });
      if (response.ok) {
        const jsonRespon = await response.json();
        return jsonRespon;
      }
    }
  } catch (err) {
    console.log(err);
  }
};
