import React from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

const webcamComponent = () => {


  return (
    <>
      <Webcam
          audio={false}
          height={200}
          screenshotFormat="image/jpeg"
          width={200}
          videoConstraints={videoConstraints}
        />
    </>
  )
}

export default webcamComponent