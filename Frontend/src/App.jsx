import { Box, Button, Container } from "@chakra-ui/react";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Userpage from "./pages/Userpage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";

import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";
import { SettingsPage } from "./pages/SettingsPage";

function App() {
  const user = useRecoilValue(userAtom);
  console.log(user);
  return (
    <>
    <Box position ={'relative'} w="full">

      <Container maxW="620px">
        <Header />
        <Routes>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to={"/auth"} />}
            />
          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to={"/"} />}
            />
          <Route
            path="/update"
            element={user ? <UpdateProfilePage /> : <Navigate to={"/auth"} />}
            />

          <Route
            path="/:username"
            element={
              user ? (
                <>
                  <Userpage />
                  <CreatePost />
                </>
              ) : (
                <Userpage />
                )
              }
              />
          <Route path="/:username/post/:pid" element={<PostPage />} />
          <Route path="/chat" element={user ? <ChatPage/> : <Navigate to={"/auth"} />} />
          <Route
            path="/settings"
            element={user ? <SettingsPage /> : <Navigate to={"/auth"} />}
          />
        </Routes>
        
      </Container>
              </Box>
    </>
  );
}

export default App;
