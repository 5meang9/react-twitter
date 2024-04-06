import React, { ReactNode, useContext } from 'react';
import { FiImage } from 'react-icons/fi';
import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { db, storage } from 'firebaseApp';
import { toast } from 'react-toastify';
import AuthContext from 'context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import PostHeader from './Header';

export default function PostForm() {
  const [content, setContent] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [hashTags, setHashTag] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<string | null>(null);
  const { user } = useContext(AuthContext);

  const handleFileUpload = (e: any) => {
    const {
      target: { files },
    } = e;

    const file = files?.[0];
    const fileReader = new FileReader();
    fileReader?.readAsDataURL(file);

    fileReader.onloadend = (e: any) => {
      const { result } = e?.currentTarget;
      setImageFile(result);
    };
  };

  const handleKeyUp = (e: any) => {
    if (e.keyCode === 32 && e.target.value.trim() !== '') {
      // 만약 같은 태그가 잇다면 에러를 띄운다.
      // 태그를 생성해준다.
      if (tags?.includes(e.target.value?.trim())) {
        toast.error('같은 태그가 있습니다.');
      } else {
        setTags((prev) => (prev?.length > 0 ? [...prev, hashTags] : [hashTags]));
        setHashTag('');
      }
    }
  };

  const onSubmit = async (e: any) => {
    setIsSubmitting(true);
    const key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);
    e.preventDefault();

    try {
      // 이미지 먼저 업로드
      let imageUrl = '';
      if (imageFile) {
        const data = await uploadString(storageRef, imageFile, 'data_url');
        imageUrl = await getDownloadURL(data?.ref);
      }

      // 업로드된 이미지의 download url 업데이트
      await addDoc(collection(db, 'posts'), {
        content: content,
        createdAt: new Date()?.toLocaleDateString('ko', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        uid: user?.uid,
        email: user?.email,
        hashTags: tags,
        imageUrl: imageUrl,
      });
      setTags([]);
      setHashTag('');
      setContent('');
      toast.success('게시글을 생성했습니다.');
      setImageFile(null);
      setIsSubmitting(false);
    } catch (e: any) {
      console.log(e);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === 'content') {
      setContent(value);
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags?.filter((val) => val !== tag));
  };

  const onChangeHashTag = (e: any) => {
    setHashTag(e?.target?.value?.trim());
  };

  const handleDeleteImage = () => {
    setImageFile(null);
  };

  return (
    <div className="post">
      <PostHeader />
      <form className="post-form" onSubmit={onSubmit}>
        <textarea
          className="post-form__textarea"
          name="content"
          id="content"
          placeholder="what is happening?"
          required
          onChange={onChange}
          value={content}
        />
        <div className="post-form__hashtags">
          <span className="post-form__hashtags-outputs">
            {tags?.map((tag, index) => (
              <span className="post-form__hashtags-tag" key={index} onClick={() => removeTag(tag)}>
                #{tag}
              </span>
            ))}
          </span>
          <input
            type="text"
            className="post-form__input"
            name="hashtag"
            id="hashtag"
            placeholder="해시태그 + 스페이스바 입력"
            onChange={onChangeHashTag}
            onKeyUp={handleKeyUp}
            value={hashTags}
          />
        </div>
        <div className="post-form__submit-area">
          <div className="post-form__image-area">
            <label htmlFor="file-input" className="post-form__file">
              <FiImage className="post-form__file-icon" />
            </label>
            <input
              type="file"
              name="file-input"
              accept="image/*"
              id="file-input"
              onChange={handleFileUpload}
              className="hidden"
            />
            {imageFile && (
              <div className="post-form__attachment">
                <img src={imageFile} alt="attachment" width={100} height={100} />
                <button className="post-form__clear-btn" type="button" onClick={handleDeleteImage}>
                  Clear
                </button>
              </div>
            )}
          </div>
          <input
            type="submit"
            value="Tweet"
            className="post-form__submit-btn"
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}
