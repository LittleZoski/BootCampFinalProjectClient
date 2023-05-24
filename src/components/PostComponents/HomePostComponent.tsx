import { useState } from "react";
import {
  Spinner,
  StackDivider,
  VStack,
} from "@chakra-ui/react";
import { useGetAllPosts } from "@/queries/post.queries";
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
              <VStack
  divider={<StackDivider borderColor='gray.200' />}
  spacing={4}
  align='stretch'
>
                {getAllPosts.data.map((post) =>
                  post.commentId ? null : (
                    <>
                      <PostComponent session={session} post={post} />
                    </>
                  )
                )}
              </VStack>
            );
          }
        }
  }

export default Timeline;
