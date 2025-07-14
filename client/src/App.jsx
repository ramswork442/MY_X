import React, { Suspense, lazy } from "react";
import { Loader } from "lucide-react";

// files imports --
const SpeechComponent = lazy(() => import("./components/SpeechComponent"));

const App = () => {
  return (
    <>
      <Suspense
        fallback={
          <div className="bg-black min-h-screen flex justify-center items-center">
            <Loader className="animate-spin" color="blue" size={20} />
          </div>
        }
      >
        <SpeechComponent />
      </Suspense>
    </>
  );
};

export default App;
