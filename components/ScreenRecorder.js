import { useEffect, useRef, useState } from "react";

const ScreenRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const maxWidth = window.innerWidth;
      const maxHeight = window.innerHeight;

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: maxWidth },
          height: { ideal: maxHeight },
          frameRate: { ideal: 60 },
        },
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
        bitsPerSecond: 297000000, // 10 Mbps
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setRecording(true);
    } catch (error) {
      console.error("Error starting the recording:", error);
    }
  };

  const stopRecording = async (callback) => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setRecordedBlob(blob);
        setRecording(false);
        if (callback) {
          callback();
        }
      };
      mediaRecorderRef.current.stop();
    }
  };

  const downloadRecordingWithDelay = async () => {
    if (recordedBlob) {
      // Wait for a short period to allow the blob to be processed
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recording.mp4";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    startRecording();

    const timer = setTimeout(async () => {
      await stopRecording(() => {
        downloadRecordingWithDelay();
      });
    }, 5 * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (recordedBlob) {
      downloadRecordingWithDelay();
    }
  }, [recordedBlob]);

  return <div />;
};

export default ScreenRecorder;
