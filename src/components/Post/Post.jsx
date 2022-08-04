import React, { useEffect, useState } from 'react';
import './Post.css';
import { Avatar } from '@mui/material';
import { addDoc, collection, getDocs, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import db from '../../firebase';



const Post = ({postId, username, caption, imageUrl, user }) => {

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  // useEffect(() => {
  //     let commentRef =  query(collectionGroup(db, 'comments' ));
  //     getDocs(commentRef)
  //       .then((snapshot) => {
  //         setComments(snapshot.docs.map((doc) => (
  //             {
  //               commentId: doc.id,
  //               comment: doc.data()
  //             }
  //           )));
  //       })
  //       .catch((error) => console.log(error))
  // }, []); // THis codes displayes the comment for a particular post in all the posts

  useEffect(() => {
    if(postId) {
        const commentRef = query(collection(db, 'posts'));
        getDocs(commentRef)
          .then((snapshot) => {
            const commentSubRef = query(collection(db, 'posts/' + postId + '/comments'),  orderBy('timestamp', 'desc'));
            let unsubscribe = onSnapshot(commentSubRef, (snapshot) => {
                  setComments(snapshot.docs.map((doc) => (
                      {
                        commentId: doc.id,
                        commentPost: doc.data()
                      }
                  )));
            });
            return unsubscribe;
          });    
    }
  }, [postId]);

  const postComment = (e) => {
      e.preventDefault();
      // console.log(comments);
      const postCommentRef = collection(db, 'posts');
      addDoc(collection(postCommentRef, postId, 'comments' ), {
        text: comment,
        username: user.displayName,
        timestamp: serverTimestamp()
      });
      setComments('');
  };

  return (

    <div className='post'>

        <div className="postHeader">

            <Avatar 
                src={user?.photoURL}
                alt={username}
                className='postAvatar'
            />
            
            <h3>{username}</h3>  

        </div>

        <img 
            src={imageUrl}
            alt="IG post"
            className='postImage' 
        />

        <h4 className='postText'> <strong>{username} </strong>{caption}</h4>

        <div className="postComments">
            { comments && (
                comments.map(({commentId, commentPost}) => (
                    <p key={commentId}>
                      <strong> {commentPost.username} </strong> {commentPost.text}
                    </p>
                ))
              )
            }
        </div> 

         {
          user && (
          
            <form className='postCommentBox'>

                <input 
                    type="text" 
                    placeholder='Add a comment...'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className='postInput'
                />

                <button
                  className='postButton'
                  disabled={!comment}
                  type='submit'
                  onClick={postComment}
                > 
                  Post 
                </button>

            </form>
          )
        }

    </div>

  )

};

export default Post;