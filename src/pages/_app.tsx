import {AppProps} from "next/app";
import Head from "next/head";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react"; // Import PersistGate
import Layout from "layouts";
import store, {persistor} from "store";
import Router from "next/router";
import NProgress from "nprogress";
import "css/tailwind.css";
import "css/main.css";
import "css/layouts/layout-1.css";
import "css/layouts/e-commerce.css";
import "css/animate.css";
import "css/components/left-sidebar-1/styles-lg.css";
import "css/components/left-sidebar-1/styles-sm.css";
import "css/components/nprogress.css";
import "css/components/recharts.css";
import "react-toastify/dist/ReactToastify.css";
import "css/components/steps.css";
import "css/components/left-sidebar-3.css";
import "css/print.css";
import {ToastContainer} from "react-toastify";
import {SWRConfig} from "swr";
import api from "api";

const swrConfig = {
  fetcher: (url: string) => api.get(url).then((res) => res.data),
};

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function App({Component, pageProps}: AppProps): React.ReactElement {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <Provider store={store}>
        {/* Wrap your Layout with PersistGate */}
        <PersistGate loading={null} persistor={persistor}>
          <ToastContainer />
          <Layout>
            <SWRConfig value={swrConfig}>
              <Component {...pageProps} />
            </SWRConfig>
          </Layout>
        </PersistGate>
      </Provider>
    </>
  );
}
export default App;
