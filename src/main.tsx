import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { store } from "./app/store";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";



const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000
          }}
        />
        <App />
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
