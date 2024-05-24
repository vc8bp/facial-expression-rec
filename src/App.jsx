import React, { useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import "./app.css"
import LineChart from './LineChart';
import { statusData } from './data';
import PieChart from './PieChart';
import AnalyticsUI from './Analitics';
import './analiticsStyle.css';
import Navbar from './NavBar';


const App = () => {
    const [history, setHistory] = useState([]);
    const [status, setStatus] = useState(null);
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        const video = document.getElementById('video');
        console.log(video)
        const canvas = document.getElementById('canvas');
        const app = document.getElementById('app');

        // Start video
        const startVideo = async () => {
            try {
                console.log("askign for permission")
                const stream = await navigator.mediaDevices.getUserMedia({ video: true },);
                console.log("permission")

                video.srcObject = stream;
            } catch (err) {
                console.error('Error accessing webcam:', err);
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
            console.log("Playing")
            const displaySize = { width: video.videoWidth, height: video.videoHeight };
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
                console.log('Hello world')
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
                    setHistory(p => [...p, { expression: maxExpression, probability: maxProbability, time: new Date().toLocaleTimeString() }]);
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
            // Stop webcam stream
            if (video.srcObject) {
                const stream = video.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    console.log(history)

    return (
        <>
        <Navbar/>
        <div id="app" className="app">
            <video 
			style={{ display: "none" }} 
			autoPlay={true}
			id="video" width="540" height="405" muted playsInline></video>
            <div className='top'>
                <canvas id="canvas"></canvas>
                <AnalyticsUI facialExpressionData={history} />
            </div>
                
            <div className='expression' style={{ border: `1px solid ${statusData[status]?.color}`, color: statusData[status]?.color }} >
                <p>{status}</p> {statusData[status]?.emoji}
            </div>
            <div className='graphs'>
                <LineChart finalData={history} />
                <PieChart finalData={history} />
            </div>
        </div>
        </>

    );
};

export default App;
