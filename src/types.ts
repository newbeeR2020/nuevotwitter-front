export type Visibility = 'public' | 'private' | 'followers'

export interface Tweet {
  id: string;                   // ツイートのid
  text: string;                 // full text
  createdAt: string;            // created-at-time (ISO 8601 推奨)
  authorId: string;             // 投稿者ユーザーのID
  conversationId: string;       // スレッド単位 ID（ツリー構造のルート ID）
  replyToId?: string | null;    // in_reply_to_status_id_str
  quotedId?: string | null;     // 引用しているツイートのID
  replyCount: number;           // 返信数（DB集計フィールド）
  likeCount: number;            // favorite_count
  retweetCount: number;         // retweet count
  hashtags: string[];           // #
  mentions: string[];           // リプライと＠によるメンション
  mediaUrls?: string[];         // 画像・動画 URL（将来の拡張用）
  visibility: Visibility;       // 公開や鍵などの視認性を示す属性
}

// tweetするときにユーザーが送るpayload
export interface TweetPayload {
  text: string;                 // full text
  replyToId?: string | null;    // in_reply_to_status_id_str
  quotedId?: string | null;     // 引用しているツイートのID
  hashtags?: string[];           // #
  mentions?: string[];           // リプライと＠によるメンション
  mediaUrls?: string[];         // 画像・動画 URL（将来の拡張用）
  visibility?: Visibility;       // 公開や鍵などの視認性を示す属性
}

export interface User {
  id: string;                   // user.id_str
  screenName: string;           // user.screen_name
  name: string;                 // user.name
  avatarUrl: string;            // user.profile_image_url_https
  bio?: string;                 // user.description
  createdAt: string;            // user.created_at
  followersCount: number;       // user.followers_count
  followingCount: number;       // user.friends_count
  isFollowingMe: boolean;       // 相互フォロー判定
}