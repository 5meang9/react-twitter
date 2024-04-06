import PostBox from 'components/posts/PostBox';
import AuthContext from 'context/AuthContext';
import { collection, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from 'firebaseApp';
import { PostProps } from 'pages/home';
import { useContext, useEffect, useState } from 'react';
import { onChange } from 'react-toastify/dist/core/store';

export default function SearchPage() {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [tagQuery, setTagQuery] = useState<string>('');
  const { user } = useContext(AuthContext);

  const onChange = (e: any) => {
    setTagQuery(e?.target?.value.trim());
  };

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, 'posts');
      let postsQeury = query(
        postsRef,
        where('hashTags', 'array-contains-any', [tagQuery]),
        orderBy('createdAt', 'desc')
      );

      onSnapshot(postsQeury, (snapShot) => {
        let dataObj = snapShot?.docs?.map((doc) => ({
          ...doc?.data(),
          id: doc?.id,
        }));

        setPosts(dataObj as PostProps[]);
      });
    }
  }, [[tagQuery, user]]);

  return (
    <div className="home">
      <div className="home__title">
        <div className="home__title-text">Search</div>
      </div>
      <div className="home__search-div">
        <input
          type="text"
          className="home__search"
          placeholder="해시태그 검색"
          onChange={onChange}
        />
      </div>
      <div className="post">
        {posts?.length > 0 ? (
          posts?.map((post) => <PostBox post={post} />)
        ) : (
          <div className="post__no-posts">
            <div className="post__text">게시글이 없습니다.</div>
          </div>
        )}
      </div>
    </div>
  );
}
