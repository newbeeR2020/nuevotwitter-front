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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onReply(tweet.id, replyText);
    setReplyText("");
    setIsReplying(false);
  }

  return (
    <div className="tweetWindow" key = {tweet.id}>
      <p>text: {tweet.text}</p>
      <p>author id: {tweet.authorId}</p>
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
