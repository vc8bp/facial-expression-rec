import React, { useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import sampleVideo from './angry.mp4'; // Import your sample video
import "./app.css"
import LineChart from './Chart';


let statusIcons = {
	default: { emoji: '😐', color: '#02c19c' },
	neutral: { emoji: '😐', color: '#54adad' },
	happy: { emoji: '😀', color: '#148f77' },
	sad: { emoji: '😥', color: '#767e7e' },
	angry: { emoji: '😠', color: '#b64518' },
	fearful: { emoji: '😨', color: '#90931d' },
	disgusted: { emoji: '🤢', color: '#1a8d1a' },
	surprised: { emoji: '😲', color: '#1230ce' },
}

const App = () => {
	const [history, setHistory] = useState([]);
	const [status, setStatus] = useState(null);
	const [intervalId, setIntervalId] = useState(null);
  
	useEffect(() => {
	  const video = document.getElementById('video');
	  const canvas = document.getElementById('canvas');
	  const app = document.getElementById('app');
  
	  // Start video
	  const startVideo = async () => {
		try {
		  video.src = sampleVideo;
		  await video.play();
		} catch (err) {
		  console.error('Error loading video:', err);
		}
	  };
  
	  // Load models and start video
	  Promise.all([
		faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
		faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
		faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
		faceapi.nets.faceExpressionNet.loadFromUri('./models')
	  ]).then(startVideo);
  
	  // Real-time expression detection
	  video.addEventListener('play', () => {
		const displaySize = { width: video.width, height: video.height };
		faceapi.matchDimensions(canvas, displaySize);
  
		const id = setInterval(async () => {
		  if (video.paused || video.ended) {
			clearInterval(id);
			return;
		  }
  
		  // Draw video frame onto canvas
		  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

		  const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
		  const resizedDetections = faceapi.resizeResults(detections, displaySize);
		  faceapi.draw.drawDetections(canvas, resizedDetections);
		  faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  
		  if (detections.length > 0) {
			const expressions = detections[0].expressions;
			let maxExpression = '';
			let maxProbability = 0;
			for (const [expression, probability] of Object.entries(expressions)) {
			  if (probability > maxProbability) {
				maxExpression = expression;
				maxProbability = probability;
			  }
			}
			setHistory(p => [...p, { expression: maxExpression, probability: maxProbability }]);
			setStatus(maxExpression);
		  } else {
			setStatus('No face detected');
		  }
		}, 1000);
  
		setIntervalId(id);
	  });
  
	  return () => {
		if (intervalId) {
		  clearInterval(intervalId);
		}
	  };
	}, []);

  console.log(history)

  return (
    <div id="app" className="app">
      <video style={{display: "none"}} id="video" width="540" height="405" muted controls></video>
      <canvas id="canvas"></canvas>
      	<div className='expression' style={{border: `1px solid ${statusIcons[status]?.color}`, color: statusIcons[status]?.color}} >
			<p>{status}</p> {statusIcons[status]?.emoji}
		</div>
		<LineChart finalData={history}/>
   	</div>
  );
};

export default App;
