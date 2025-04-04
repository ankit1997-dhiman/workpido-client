import axios from "axios";
import { API_BASE_URL } from "./constants";
import useAuth from "@/hooks/useAuth";
import Cookies from "js-cookie";
// import store from "./../store/index";

const getToken = () => {
  const token = Cookies.get("token");
  return token;
}; // not working

const store = { token: getToken() };

const REACT_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
// const X_API_KEY = process.env.REACT_APP_X_API_KEY;

/**
 * API service methods to make life easier
 */
export const API = {
  /**
   * Execute a query
   * @param url
   * @param method
   * @param body
   * @returns
   */
  execute: async (url, method = "GET", data = null, withToken = true) => {
    let body = null;
    let value = null;
    if (data) {
      body = new FormData();
      for (const key in data) {
        // console.log({ key: key, value: data[key], type: typeof (data[key]) });
        value = data[key];
        if (typeof value == "object") {
          var fileURI = value.path;
          let filename = fileURI?.split("/").pop();
          body.append("image", {
            uri: fileURI,
            name: filename,
            type: value.mime,
            mime: value.mime,
          });
          // console.log(filename);
        } else {
          body.append(key, data[key]);
        }
        body.append(key, data[key]);
      }
    }
    
    // let token = store.getState().auth.token;
    let token = store.token;
    if (!token) {
      token = sessionStorage.getItem("token");
    }

    let headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    if (token && withToken) {
      headers.Authorization = `Bearer ${token}`;
    }

    let res = await fetch(`${REACT_API_BASE_URL}${url}`, {
      method: method,
      headers,
      credentials: "include",
      body: data ? JSON.stringify(data) : null,
    });

    return Promise.all([res.status, res.json(), res.ok]);
  },

  /**
   * Process the response after the query has been executed
   * @param res
   * @returns
   */
  processResponse: (res) => {
    if (!res[2]) {
      console.error({ error: res });
      // throw new Error(res[1]?.error);
      throw new Error(`Err while processing request`);
    }
    return res[1];
  },

  // Actual APIs

  getCurrencies: async () => {
    let res = await API.execute(`/currencies`, "GET", false);
    return API.processResponse(res);
  },
  getUsers: async () => {
    let res = await API.execute(`/users`, "GET", false);
    return API.processResponse(res);
  },

  getAllCategories: async () => {
    let res = await API.execute(`/categories/view/all`, "GET", false);
    return API.processResponse(res);
  },

  getSubcategoryServices: async (subcategory) => {
    let res = await API.execute(
      `/subcategory-services/${subcategory}`,
      "GET",
      false
    );
    return API.processResponse(res);
  },

  getGigs: async (category, query) => {
    let res = await API.execute(
      `/gigs/view${category ? `/${category}` : "/all"}${
        query ? `?${query}` : ""
      }`,
      "GET",
      false
    );
    return API.processResponse(res);
  },

  getGigInfo: async (id) => {
    let res = await API.execute(`/gigs/info/${id}`, "GET", false);
    return API.processResponse(res);
  },

  previewGig: async (id) => {
    let res = await API.execute(`/gigs/preview/${id}`, "GET", false);
    return API.processResponse(res);
  },

  signup: async (data) => {
    let res = await API.execute(`/auth/local/register`, "POST", data, false);
    return API.processResponse(res);
  },

  login: async (data) => {
    let res = await API.execute(`/auth/local`, "POST", data, false);
    return API.processResponse(res);
  },

  me: async () => {
    let res = await API.execute(
      `/users/me?populate[0]=avatar&populate[1]=currency`,
      "GET"
    );
    return API.processResponse(res);
  },

  wallet: async () => {
    let res = await API.execute(`/wallet`, "GET");
    return API.processResponse(res);
  },

  overview: async (id) => {
    let res = await API.execute(`/overview/${id}`, "GET");
    return API.processResponse(res);
  },

  updateMe: async (data) => {
    let res = await API.execute("/users/update/me", "PUT", data);
    return API.processResponse(res);
  },

  deleteAvatar: async (data) => {
    let res = await API.execute(`/avatar`, "DELETE");
    return API.processResponse(res);
  },

  getUserInfo: async ({ username }) => {
    let res = await API.execute(`/users/view/${username}`, "GET");
    return API.processResponse(res);
  },

  getChats: async () => {
    let res = await API.execute(`/my-chats`, "GET");
    return API.processResponse(res);
  },

  newChat: async (data) => {
    let res = await API.execute(`/new-chat`, "POST", data);
    return API.processResponse(res);
  },

  getChatInfo: async ({ roomId }) => {
    let res = await API.execute(`/chat-info/${roomId}`, "GET");
    return API.processResponse(res);
  },

  sendMessage: async (data) => {
    let res = await API.execute(`/send-message`, "POST", data);
    return API.processResponse(res);
  },

  typingStatus: async (data) => {
    let res = await API.execute(`/typing-status`, "POST", data);
    return API.processResponse(res);
  },

  getMessages: async ({ roomId, from, to }) => {
    let res = await API.execute(
      `/chat/messages/${roomId}?from=${from}&to=${to}`,
      "GET"
    );
    return API.processResponse(res);
  },

  createGig: async (data) => {
    let res = await API.execute(`/gigs/create-gig`, "POST", data);
    return API.processResponse(res);
  },

  getGig: async (id) => {
    let res = await API.execute(`/gigs/${id}`, "GET", false);
    return API.processResponse(res);
  },

  // myGigs: async (status,query) => {
  //   let res = await API.execute(`/my-gigs?status=${status}`, "GET");
  //   return API.processResponse(res);
  // },
  myGigs: async (status, query) => {
    // Construct the base URL with the status and any additional query parameters (category, subcategory, etc.)
    const url = `/my-gigs?status=${status}&${query}`;

    // Make the API request
    let res = await API.execute(url, "GET");
    return API.processResponse(res);
  },

  updateGig: async (id, data) => {
    let res = await API.execute(`/update-gig/${id}`, "PUT", data);
    return API.processResponse(res);
  },

  myOrders: async (status) => {
    let res = await API.execute(`/my-orders?status=${status}`, "GET");
    return API.processResponse(res);
  },

  createOrder: async (data) => {
    let res = await API.execute(`/create-order`, "POST", data);
    return API.processResponse(res);
  },

  sendOrder: async (data) => {
    let res = await API.execute(`/send-order`, "POST", data);
    return API.processResponse(res);
  },

  updateOrder: async (id, data) => {
    let res = await API.execute(`/orders/${id}`, "PUT", data);
    return API.processResponse(res);
  },

  getOrderInfo: async (id) => {
    let res = await API.execute(`/orders/info/${id}`, "GET", false);
    return API.processResponse(res);
  },

  postReview: async (data) => {
    let res = await API.execute(`/order-review`, "POST", data);
    return API.processResponse(res);
  },

  getOrderReview: async (id) => {
    let res = await API.execute(`/order-review/${id}`, "GET");
    return API.processResponse(res);
  },

  addNote: async (data) => {
    let res = await API.execute(`/add-order-note`, "POST", data);
    return API.processResponse(res);
  },

  deleteNote: async (id) => {
    let res = await API.execute(`/order-notes/${id}`, "DELETE");
    return API.processResponse(res);
  },

  getOrderUpdates: async (id) => {
    let res = await API.execute(`/get-order-updates/${id}`, "GET");
    return API.processResponse(res);
  },

  postOrderUpdate: async (data) => {
    let res = await API.execute(`/send-order-update`, "POST", data);
    return API.processResponse(res);
  },

  getTransactions: async (id) => {
    let res = await API.execute(`/my-transactions`, "GET");
    return API.processResponse(res);
  },

  withdrawalRequest: async (data) => {
    let res = await API.execute(`/withdrawal-request`, "POST", data);
    return API.processResponse(res);
  },
};
