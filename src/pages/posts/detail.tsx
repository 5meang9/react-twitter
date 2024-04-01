import Loader from "components/loader/Loader";
import PostHeader from "components/posts/Header";
import PostBox from "components/posts/PostBox";
import { doc, getDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";

export default function PostDetail(){
  const [post, setPost] = useState<PostProps | null>(null);
  const params = useParams();

  const getPost = useCallback( async() => {
    if(params.id){
      const docRef = doc(db, 'posts', params.id);
      const docSnap = await getDoc(docRef);

      setPost({...(docSnap.data() as PostProps), id: docSnap?.id})
    }
  }, [params.id]);

  useEffect(()=>{
    if(params.id) getPost();
  },[getPost])

  return(
    <div className="post">
      <PostHeader />
      {post ? <PostBox post={post} /> : <Loader />}
    </div>
  )
}