import React, { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";

import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import PostsAtom from "../atoms/PostsAtom";
function Userpage() {
  const {user,loading}=useGetUserProfile()
  const { username } = useParams();
  const showToast = useShowToast();

  const [posts, setPosts] = useRecoilState(PostsAtom)
  const [fetchingPosts, setFetchingPosts] = useState(true);

  useEffect(() => {

    const getPosts = async () => {
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        console.log(data);
        setPosts(data);
      } catch (error) {
        showToast("error", error, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };


    getPosts();
  }, [username, showToast,setPosts]);
console.log(posts)
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!user && !loading) {
    return <h1> user not found !!</h1>;
  }
  return (
    <>
      <UserHeader user={user}></UserHeader>
      {!fetchingPosts && posts.length === 0 && <h1>user has no posts </h1>}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"}></Spinner>
        </Flex>
      )}
      {posts.map((post)=>{
        return <Post key={post._id} post={post} postedBy={post.postedBy} />
      })}
    </>
  );
}

export default Userpage;
