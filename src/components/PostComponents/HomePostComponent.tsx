import { useState } from "react";
import {
  Avatar,
  Box,
  Card,
  Flex,
  Heading,
  HStack,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Post } from "@/types/post";
import UserPostProfilePhoto from "./UserPostProfilePhoto";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import { useGetUserById, useGetUserProfile } from "@/queries/user.queries";
import { useGetAllPosts } from "@/queries/post.queries";
import { Session } from "next-auth";
import { toDate, formatDistanceToNow, intlFormatDistance } from "date-fns";
import Loader from "../CustomComponents/Loader";
import PostComponent from "./PostComponent";
import { useSession } from "next-auth/react";

function Timeline() {
  const { data: session } = useSession();
  const getAllPosts = useGetAllPosts(session?.accessToken);

  if (getAllPosts.status === "loading") {
    return <Spinner />;
  }
  if (getAllPosts.status === "success") {
    const posts = getAllPosts.data;
        if (getAllPosts.isSuccess) {
            getAllPosts.data.sort(function (x, y) {
              return y.postId - x.postId;
            });
        
            return (
              <Stack>
                {getAllPosts.data.map((post) =>
                  post.commentId ? null : (
                    <>
                      <PostComponent session={session} post={post} />
                    </>
                  )
                )}
              </Stack>
            );
          }
        }
  }

export default Timeline;
