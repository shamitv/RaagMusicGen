import './App.css'
import WebMscore from 'webmscore'

import {useState} from "react";
import { useRef } from 'react';

import toWav from 'audiobuffer-to-wav'

let soundFontBuffer: Uint8Array;
let imgUrl = "./img/cassete.png";
let selectedRaagID = "120000";

async function getAudioURL(score: WebMscore) {
    const metadata = await score.metadata()
    console.log(metadata)
    //
    // synthesize audio, and output using the Web Audio API
    //
    const CHANNELS = 2
    const FRAME_LENGTH = 512
    const audioCtx = new (AudioContext || AudioContext)()
    const audioBuf = audioCtx.createBuffer(CHANNELS, (metadata.duration + 1) * 44100, 44100)


    const fn = await score.synthAudio(0)
    for (let i = 0; ; i += FRAME_LENGTH) {
        const res = await fn()
        const frames = new Float32Array(res.chunk.buffer)

        // audio frames are non-interleaved
        // Float32Array[ channelA 512 frames, channelB 512 frames ]
        for (let c = 0; c < CHANNELS; c++) {
            const buf = frames.subarray(c * FRAME_LENGTH, (c + 1) * FRAME_LENGTH)
            audioBuf.copyToChannel(buf, c, i)
        }

        if (res.done) {
            break
        }
    }
    const blob = new Blob([toWav(audioBuf)], {type: "audio/wav"});
    const url = window.URL.createObjectURL(blob);
    return url;
}

function App() {

    const [imageUrl, setImageUrl] = useState(imgUrl);
    const [raagID, setRaagID] = useState(selectedRaagID);
    const [audioUrl, setAudioUrl] = useState("");
    const audioPlayerRef = useRef(null);

    WebMscore.ready.then(async () => {
        console.log('WebMscore is loaded');
        const soundFontURL = './sound/MS%20Basic.sf3';
        if(!soundFontBuffer){
            fetch(soundFontURL).then
            (soudfontData => {
                soudfontData.arrayBuffer().then(buffer => {
                    soundFontBuffer = new Uint8Array(buffer);
                });
    
            })
        }
    })

    /*
    Generated from :
    Large heading "Generate Music"
    4 selects and 1 file download button. Each select has a label. Header has hero image of guitar.

    Middle part of page has music sheet.

    There is an audio player

    */
    return (
        <div id="ui-container" className="h-auto min-h-screen grid justify-center items-center">
            <div className="max-w-3xl mx-auto p-8 bg-white rounded-md shadow-md">
                <header className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Generate Music</h1>
                    <img src="./img/music_abstract_1.png" alt="Guitar" className="w-20 h-20 rounded-full object-cover"/>
                </header>
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                        <label htmlFor="raag_select" className="block mb-2 font-semibold">Raag</label>
                        <select id="raag_select" className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        onChange={event => setRaagID(event.target.value)}
                                        defaultValue={selectedRaagID}
                        >
                            <option value="16000">Bhupali</option>
                            <option value="33000">Durga</option>
                            <option value="75000">Malkauns</option>
                            <option value="120000">Yaman</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="instrument_select" className="block mb-2 font-semibold">Instrument</label>
                        <select id="instrument_select" className="w-full border border-gray-300 rounded-md px-3 py-2">
                            <option value="1">Flute</option>
                            <option value="2">Violin</option>
                            <option value="3">Grand Piano</option>
                            <option value="4">Harmonium</option>

                        </select>
                    </div>
                    <div>
                        <label htmlFor="select3" className="block mb-2 font-semibold">Key/Scale</label>
                        <select id="select3" className="w-full border border-gray-300 rounded-md px-3 py-2">
                            <option value="1">C</option>
                            <option value="2">C#</option>
                            <option value="3" selected>D</option>
                            <option value="4">D#</option>
                            <option value="5">E</option>
                            <option value="6">F</option>
                            <option value="7">F#</option>
                            <option value="8">G</option>
                            <option value="9">G#</option>
                            <option value="10">A</option>
                            <option value="11">A#</option>
                            <option value="12">B</option>
                        </select>
                    </div>
                    <div>

                    </div>
                </div>
                <div className="mb-8">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                            onClick={() => {

                                console.log("Fething Tune from API");
                                const api_url = `http://localhost:8000/GenerateTune/Raag/${raagID}/Instrument/2`;
                                fetch(api_url, {method: 'GET'})
                                    .then(response => response.json())
                                    .then(data => {
                                        console.log(data)
                                        var xml = data.xml
                                        console.log("Got XML");
                                        var enc = new TextEncoder();
                                        var xmlBuffer = enc.encode(xml)
                                        WebMscore.load('xml', xmlBuffer, [], false)
                                            .then(score => {
                                                console.log("Score loaded, fetching metadata");
                                                score.metadata().then(meta => {
                                                    console.log(meta)
                                                    score.setSoundFont(soundFontBuffer)
                                                    console.log("Rendering SVG")
                                                    score.saveSvg(0, false).then(svg => {
                                                        console.log("Got SVG, displaying it")
                                                        let blob = new Blob([svg], {type: 'image/svg+xml'});
                                                        let url = URL.createObjectURL(blob);
                                                        setImageUrl(url)
                                                        console.log(imgUrl)
                                                        getAudioURL(score).then(url => {
                                                            console.log(url)
                                                            setAudioUrl(url)
                                                            if(audioPlayerRef.current != null){
                                                                let tempVar:any = audioPlayerRef.current;
                                                                tempVar.load();
                                                                tempVar.play();
                                                            }
                                                        })
                                                    })
                                                })
                                            })
                                    })


                            }}>Generate Tune
                    </button>
                </div>
                <audio controls className="w-full" ref={audioPlayerRef}>
                    <source src={audioUrl}/>
                </audio>
                <div className="mb-8">
                    <img src={imageUrl} alt="Music Sheet" className="w-full aspect-w-1 aspect-h-1"/>
                </div>
            </div>
        </div>
    )
}


export default App
