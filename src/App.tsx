import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./components/Chat";
import { Login } from "./components/Auth/Login";
import { Navbar } from "./components/Navbar";
import { AuthContextProvider } from "./contexts/AuthContext";
import { NotificationContextProvider } from "./contexts/NotificationContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ConversationChat } from "./components/ConversationChat";
import { ActiveConversationsStart } from "./components/ActiveConversationsStart";
import { Register } from "./components/Auth/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AuthContextProvider>
              <NotificationContextProvider>
                <Navbar />
              </NotificationContextProvider>
            </AuthContextProvider>
          }
        >
          <Route
            path=""
            element={
              <ProtectedRoute>
                <ActiveConversationsStart />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="conversations/"
            element={
              <ProtectedRoute>
                <ActiveConversationsStart />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="chats/:conversationName"
            element={
              <ProtectedRoute>
                <ConversationChat />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="registration" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
