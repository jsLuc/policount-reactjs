import './styles/App.css';
import * as tf from '@tensorflow/tfjs';
import * as tmPose from '@teachablemachine/pose';
import webcamComponent from './components/webcam'
import { useState, useEffect } from 'react'

function App() {

  const URL = "https://teachablemachine.withgoogle.com/models/8gwzKdUea/";
  let model, webcam, ctx, labelContainer, maxPredictions;

  const [poliCount, setPolicount] = useState(0)
  const [lastPositionPoli, setLastPositionPoli] = useState(false)

  async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // Note: the pose library adds a tmPose object to your window (window.tmPose)
    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    // Convenience function to setup a webcam
    const size = 200;
    const flip = true; // whether to flip the webcam
    webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append/get elements to the DOM
    const canvas = document.getElementById("canvas");
    canvas.width = size; canvas.height = size;
    ctx = canvas.getContext("2d");
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
  }

  async function loop(timestamp) {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
  }

  async function predict() {
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    // Prediction 2: run input through teachable machine classification model
    const prediction = await model.predict(posenetOutput);

    if(prediction[1].probability.toFixed(2) >= 0.98 && lastPositionPoli === false)
    {
      setPolicount(poliCount+1)
      setLastPositionPoli(true)
    }
    if(prediction[0].probability.toFixed(2) >= 0.98 && lastPositionPoli === true)
    {
      setLastPositionPoli(false)
    }
    // finally draw the poses
    drawPose(pose);
  }

  function drawPose(pose) {
    if (webcam.canvas)
     {
        ctx.drawImage(webcam.canvas, 0, 0);
        // draw the keypoints and skeleton
        // if (pose) {
        //     const minPartConfidence = 0.5;
        //     tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
        //     tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
        // }
    }
  }

  const handleRecount = () => {
    setPolicount(0)
  }

  window.onload = init()

  return (
    <div className="App">
      <h1>Polichinelos: {poliCount}</h1>
      <button onClick={handleRecount}>Reiniciar!</button>
      <div><canvas id="canvas"></canvas></div>
      <div id="label-container"></div>
    </div>
  );
}

export default App;
