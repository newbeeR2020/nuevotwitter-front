import axios from "axios";
import type { Tweet, TweetPayload, UserPayload} from "./types";
import { auth } from './firebase.tsx';

// vite では import.meta.env で読む
const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 5_000,
});
// ★ ここで毎リクエスト Authorization を付与
api.interceptors.request.use(async cfg => {
  const user = auth.currentUser;
  if (user) {
    cfg.headers.Authorization = `Bearer ${await user.getIdToken(true)}`;
  }
  return cfg;
});
export const createAccount = (user: UserPayload) => api.post("/api/newaccount", user);
export const fetchTweets = () => api.get<Tweet[]>("/api/tweets");
export const addTweet  = (data: TweetPayload) => api.post<Tweet>("/api/tweets", data);
export const replyTweet = (parentId: string, data: TweetPayload) => api.post<Tweet>(`/api/tweets/${parentId}/reply`, data)
export const likeTweet = (id: string) => api.post(`/api/tweets/${id}/like`)
