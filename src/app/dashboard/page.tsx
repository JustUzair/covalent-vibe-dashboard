"use client";
import React, { useEffect, useEffectEvent, useState } from "react";
import LoadingSpinner from "../components/Loader/page";

const DashboardPage = () => {
  const [loaded, setLoaded] = useState<boolean>(false);

  const handleLoaded = useEffectEvent((loaded: boolean) => {
    if (!loaded) {
      setLoaded(true);
    }
  });
  useEffect(() => {
    handleLoaded(loaded);
  }, [loaded]);
  {
    return loaded ? <div>DashboardPage</div> : <LoadingSpinner />;
  }
};

export default DashboardPage;
