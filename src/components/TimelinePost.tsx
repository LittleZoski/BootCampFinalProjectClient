import { useState } from 'react';
import { Avatar} from '@chakra-ui/react';
import { FaPaw, FaRegCommentAlt } from 'react-icons/fa';
import { useSession } from "next-auth/react";
import { UserProfilePhoto } from './UserPage/UserProfilePhoto';
import { useCreateComment } from '@/queries/post.queries';
import { Post } from '@/types/post';
import router from 'next/router';

function TimelinePost(props) {
  const { data: session } = useSession();
  const createCommentMutation = useCreateComment (session?.accessToken);
  const [showComments, setShowComments] = useState(false);
  const [message, setMessage] = useState<Post["message"] | null>(null);
  const [commentId, setCommentId] = useState<Post["commentId"]>(null);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

	async function handleClick() {
		const post: Post = {
			message
		};

    try {
      const createPostResponse = await createCommentMutation.mutateAsync(post);
    } catch {}
  }

  return (
    <center>
      <div className="card">
        <div className="comments">
          <div className="comment-react"></div>
          <div className="comment-container">
            <div className="user">
              <div className="user-pic">
                <Avatar name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
              </div>
              <div className="user-info">
                <span></span>
                <p>Tuesday, May 10th at 6:45pm</p>
              </div>
            </div>
            <p className="timeline-content">
              ISO: The best dog groomer in the Omaha metro? TIA!
            </p>
          </div>
        </div>
        {showComments && (
          <>
            <div className="text-box">
              <div className="box-container">
                <form >
                  <textarea
                    placeholder="Reply"
                    value={comment}
                    // onChange={handleCommentChange}
                  ></textarea>
                  <button type="submit">Submit</button>
                </form>
              </div>
            </div>
          </>
        )}

        <button className="like-button">
          <div className='container' id='like-icon'>
            <span className='like-paw'><FaPaw /></span>
            <span className="like">Like</span>
          </div>
        </button>
        <button className="comment-button" onClick={toggleComments}>
          <div className='container' id='comment-icon'>
            <span className='comment-alt'><FaRegCommentAlt /></span>
            <span className="text">Comment</span>
          </div>
        </button>
      </div>
    </center>
  );
}

export default TimelinePost;
