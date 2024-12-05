import { CircleStop, Loader2, Pause, Play, StepBack, StepForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import WaveSurfer from "wavesurfer.js";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";

const btnStyle = "bg-primary border-0 text-neutral-800 p-2 rounded-md text-center text-sm inline-block cursor-pointer hover:bg-primary/80";


const AudioPlayer = () => {
    const dispatch = useDispatch();
    const waveformRef = useRef(null);
    const wavesurfer = useRef(null);
    const file = useSelector(state => state.files.file);
    const [loading, setLoading] = useState(true);

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
            ],
            backend: "WebAudio"
        });

        if (file.streamUrl) {
            // Load the audio file into wavesurfer
            wavesurfer.current.load(file.streamUrl);
            setLoading(true);
            wavesurfer.current.on("ready", () => {
                setLoading(false);
            });
        }


        // Clean up wavesurfer when the component unmounts
        return () => {
            if (wavesurfer.current) {
                wavesurfer.current.destroy();
                dispatch({ type: "UNLOAD_FILE" });
            }
        };
    }, [file.streamUrl, dispatch]);

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

    if (loading) {

    }

    return (
        <>
            {loading && <div className="flex items-center justify-center my-8">
                <Loader2 className="animate-spin" size={64} />
            </div>}
            <div className="container">
                <div ref={waveformRef} className="cursor-pointer" />
                {/* Audio controls */}
                <div className="flex items-center justify-center gap-3 my-4">
                    <button type="button" className={btnStyle} onClick={handleSkipBack}><StepBack /></button>
                    <button type="button" className={`${btnStyle} flex items-center`} onClick={handlePlayPause}><Play /><Pause /></button>
                    <button type="button" className={btnStyle} onClick={handleSkipForward}><StepForward /></button>
                    <button className={btnStyle} onClick={handleStop}><CircleStop /></button>
                </div>
            </div>
        </>
    );
};
export default AudioPlayer;