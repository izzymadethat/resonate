import { CircleStop, Pause, Play, StepBack, StepForward, Volume } from "lucide-react";
import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";

const btnStyle = "bg-primary border-0 text-neutral-800 p-2 rounded-md text-center text-sm inline-block cursor-pointer hover:bg-primary/80";


const AudioPlayer = ({ audioUrl }) => {
    const waveformRef = useRef(null);
    const wavesurfer = useRef(null);


    useEffect(() => {
        // Initialize wavesurfer when the component mounts
        wavesurfer.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: "#4b4b4b",
            progressColor: "#facc15",
            height: 100,
            responsive: true,
            hideScrollbar: true,
            cursorColor: "#facc15",
            cursorWidth: 3,
            plugins: [
                Hover.create({
                    lineColor: "#facc15",
                    lineWidth: 3,
                    labelBackground: "#555",
                    labelColor: "#fff",
                    labelSize: 12
                })
            ]
        });

        // Load the audio file into wavesurfer
        wavesurfer.current.load(audioUrl);

        // Clean up wavesurfer when the component unmounts
        return () => {
            if (wavesurfer.current) {
                wavesurfer.current.destroy();
            }
        };
    }, [audioUrl]);

    // Button functions
    const handlePlayPause = () => {
        wavesurfer.current.playPause();
    };

    const handleStop = () => {
        wavesurfer.current.stop();
    };

    const handleSkipForward = () => {
        wavesurfer.current.skip(5);
    };

    const handleSkipBack = () => {
        wavesurfer.current.skip(-5);
    };

    return (
        <div className="container">
            <div ref={waveformRef} className="cursor-pointer" />
            {/* Audio controls */}
            <div className="flex items-center justify-center gap-3 mt-4">
                <button type="button" className={btnStyle} onClick={handleSkipBack}><StepBack /></button>
                <button type="button" className={`${btnStyle} flex items-center`} onClick={handlePlayPause}><Play /><Pause /></button>
                <button type="button" className={btnStyle} onClick={handleSkipForward}><StepForward /></button>
                <button className={btnStyle} onClick={handleStop}><CircleStop /></button>
            </div>
        </div>
    );
};
export default AudioPlayer;