// "use client";
// import { Html5QrcodeScanner } from "html5-qrcode";
// import Link from "next/link";
// import { useEffect, useState } from "react";

// export default function Home() {
//   const [scanResult, setScanResult] = useState<string | null>(null);
//   useEffect(() => {
//     const scanner = new Html5QrcodeScanner(
//       "reader",
//       {
//         qrbox: {
//           width: 250,
//           height: 250,
//         },
//         fps: 5,
//       },
//       true // Add verbose as the third argument
//     );

//     scanner.render(success, error);

//     function success(result: any) {
//       scanner.clear();
//       setScanResult(result);
//     }

//     function error(error: any) {
//       console.warn(error);
//     }
//   }, []);

//   return (
//     <div className="max-w-4xl mx-auto">
//       {scanResult ? (
//         <div id="reader">
//           <span className="text-center">Success: <Link className="underline text-sky-500" href={scanResult}>{scanResult}</Link></span>
//         </div>
//       ) : (
//         <div id="reader" />
//       )}
//       <div id="reader" />
//     </div>
//   );
// }

"use client"
import { useState, useRef, useEffect } from "react";

const Camera = () => {
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [facingMode, setFacingMode] = useState("environment"); // Default to back camera

  const getVideo = () => {
    // Kiểm tra xem truy cập vào camera đã được phép hay không
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Yêu cầu truy cập vào camera với constraints mong muốn
      navigator.mediaDevices
        .getUserMedia({
          video: {
            width: 1280,
            height: 720,
            facingMode: facingMode // Chọn camera trước hoặc sau
          },
        })
        .then((stream) => {
          let video = videoRef.current as HTMLVideoElement | null; 
          if (video) {
            video.srcObject = stream;
            video.play();
          } else {
            console.error("Video element not found.");
          }
        })
        .catch((err) => {
          console.error("Error accessing camera:", err);
        });
    } else {
      console.error("getUserMedia is not supported by this browser");
    }
  };

  const takePhoto = () => {
    const width = 414;
    const height = width / (16 / 9);

    let video = videoRef.current;
    let photo = photoRef.current as HTMLCanvasElement | null;

    if (photo) {
      photo.width = width;
      photo.height = height;

      let ctx = photo.getContext("2d");

      if (ctx) {
        if (video) {
          ctx.drawImage(video, 0, 0, width, height);
          setHasPhoto(true);
        } else {
          console.error("videoRef.current is null");
        }
      } else {
        console.error("Failed to get 2D context for photo canvas");
      }
    } else {
      console.error("photoRef.current is null");
    }
  };

  const closePhoto = () => {
    let photo = photoRef.current as HTMLCanvasElement | null;
    if (photo) {
      let ctx = photo.getContext("2d");

      ctx?.clearRect(0, 0, photo.width, photo.height);
    }

    setHasPhoto(false);
  };

  const switchCamera = () => {
    setFacingMode(facingMode === "user" ? "environment" : "user"); // Toggle between front and back camera
    setHasPhoto(false); // Reset photo state when switching cameras
  };

  useEffect(() => {
    getVideo();
  }, [facingMode]);

  return (
    <div className="container">
      <div className="camera mt-48">
        <video ref={videoRef}></video>
        <button onClick={takePhoto}>SNAP</button>
        <label onClick={switchCamera} className="text-white">SWITCH CAMERA</label>
      </div>
      <div className={"result " + (hasPhoto ? "hasPhoto" : "")}>
        <canvas ref={photoRef}></canvas>
        {hasPhoto && <button onClick={closePhoto}>CLOSE!</button>}
      </div>
    </div>
  );
};

export default Camera;

