import { useState} from 'react';
import type {Tweet} from './types.ts';

interface Props {
  tweet: Tweet;
  onLike: (id: string) => Promise<void>;
  onReply: (parentId: string, text: string) => Promise<void>;
}
export default function TweetItem({tweet, onLike, onReply}: Props) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] =useState("");
  // high レベル用に「表示許可」を管理する state
  const [showHighContent, setShowHighContent] = useState(false)

  const isHigh = tweet.misinformationLevel === 'high'
  const isMedium = tweet.misinformationLevel === 'medium'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onReply(tweet.id, replyText);
    setReplyText("");
    setIsReplying(false);
  }

  if (isHigh && !showHighContent) {
    return (
      <div className="tweetWindow" key={tweet.id}>
        <p style={{ color: 'red' }}>⚠️ 誤情報の警告があります。</p>
        <button onClick={() => setShowHighContent(true)}>
          ツイートを表示する
        </button>
      </div>
    )
  }

  return (
    <div className="tweetWindow" key = {tweet.id}>
      {(isMedium || isHigh) && (
        <>
          <p style={{ color: 'orange' }}>⚠️ 誤情報の警告があります。</p>
        </>
      )}
      <p>text: {tweet.text}</p>
      <p>author id: {tweet.authorId}</p>
      <p>likes {tweet.likeCount}</p>
      <p>誤情報の度合い: {tweet.misinformationLevel}</p>
      <p>理由：{tweet.misinformationReason}</p>
      <button onClick={ () => onLike(tweet.id)}>Like❤️</button>
      {isReplying ? (
        <form onSubmit={handleSubmit}>
          <input type="text" value={replyText} onChange={e => setReplyText(e.target.value)}
            placeholder="Write your Reply"/>
          <button type="submit">Reply🔥</button>
        </form>
      ) : (
        <button onClick={() => setIsReplying(true)}>Reply🔥</button>
      )}
    </div>
  )

}
