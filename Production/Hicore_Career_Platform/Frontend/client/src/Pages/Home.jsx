import React from "react";
import { homeRoutes } from "../Routes/HomeConfig";
import Layout from "../Components/Layout";
import ScrollToTopButton from "../Components/ScrollToTopButton";

const Home = () => {
  return (
    <div className="relative">
      <Layout>
        {homeRoutes.layoutConfig.map(
          ({ component: Component, props = {} }, index) => (
            <Component key={index} {...props} />
          )
        )}
      </Layout>

      {/* ✅ Keep button outside Layout so it's not clipped by overflow */}
      <ScrollToTopButton />
    </div>
  );
};

export default Home;
