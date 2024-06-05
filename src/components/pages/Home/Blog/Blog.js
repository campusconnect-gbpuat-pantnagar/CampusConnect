import React, { useContext, useEffect, useState } from "react";
import { Home } from "../../../common/Base/Home";
import { BlogContext } from "../../../../context/blogContext/BlogContext";
import { LoadingBlog } from "./LoadingBlog";
import { BlogCard } from "./BlogCard";
import { Grid } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../../../../context/userContext/UserContext";
import ServiceConfig from "../../../../helpers/service-endpoint";
import { NewAuthContext } from "../../../../context/newAuthContext";
import HttpRequestPrivate from "../../../../helpers/private-client";
import { toast } from "react-toastify";
import { ThemeContext } from "../../../../context/themeContext";

export const Blog = () => {
  // const blogContext = useContext(BlogContext);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, tokens } = useContext(NewAuthContext);
  const userContext = useContext(UserContext);
  const { theme } = useContext(ThemeContext);

  async function getBlogs() {
    setIsLoading(true);
    try {
      const requestOptions = {
        url: ServiceConfig.blogEndpoint,
        method: "GET",
        showActual: true,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${tokens?.access_token}`, // Assuming 'userToken' holds the token
        },
      };
      const response = await HttpRequestPrivate(requestOptions);
      console.log(response);
      setIsLoading(false);

      if (response.data.data) {
        setBlogs(response.data.data);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }

  useEffect(() => {
    getBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteBlog = async (blogId) => {
    try {
      const updatedPosts = blogs.filter((blog) => blog.id !== blogId);
      setBlogs(updatedPosts);
      const requestOptions = {
        url: `${ServiceConfig.blogEndpoint}/${blogId}`,
        method: "DELETE",
        showActual: true,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${tokens?.access_token}`, // Assuming 'userToken' holds the token
        },
      };
      const response = await HttpRequestPrivate(requestOptions);
      if (response.data.data) {
        toast.success(response.data.message, {
          theme: `${theme === "dark" ? "dark" : "light"}`,
        });
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message, {
        theme: `${theme === "dark" ? "dark" : "light"}`,
      });
    }
  };

  const updateBlogList = (updatedBlog) => {
    if (updatedBlog) {
      const updatedPosts = blogs.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog
      );
      setBlogs(updatedPosts);
    }
  };
  return (
    <Home>
      <div className="px-2">
        {isLoading ? (
          <LoadingBlog />
        ) : blogs.length > 0 ? (
          blogs.map((blog) => {
            return (
              <div key={blog._id}>
                <BlogCard
                  updatedBlog={updateBlogList}
                  deleteBlog={deleteBlog}
                  blog={blog}
                />
              </div>
            );
          })
        ) : (
          <div
            className="m-auto"
            style={{
              height: "30vh",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Grid
              container
              spacing={3}
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <FontAwesomeIcon icon={faPencilAlt} fontSize="large" />
              <h6 className="mt-2">No blog out there</h6>
            </Grid>
          </div>
        )}
      </div>
    </Home>
  );
};
