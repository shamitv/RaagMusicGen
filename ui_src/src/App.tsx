import './App.css'
import WebMscore from 'webmscore'

import {useState} from "react";
import {useRef}  from 'react';

import toWav from 'audiobuffer-to-wav'

let imgUrl = "./img/cassete.png";
let selectedRaagID = "120000";
let selectedInstrumentID = "1";

let soundDataAvailable = false;

async function loadSoundData():Promise<boolean>{
    let winRef:any = window;
    if(winRef.newFontBuffer){
        console.log('Sound data availalbe in memory')
        soundDataAvailable = true;
        return soundDataAvailable;
    }else{
        console.log('Downloading sound data')
        const fontUrl = "./sound/MS%20Basic.sf3";
    
        const fontResponse = await fetch(fontUrl)
        const buffer = await fontResponse.arrayBuffer()
        let fontBuffer = new Uint8Array(buffer);
        winRef.newFontBuffer = fontBuffer;
        soundDataAvailable = true;
       return soundDataAvailable;
    }
    
}



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

async function generateTune(raag:number , instrument:number):Promise<any>{
    console.log("Fething Tune from API");
    const api_url = `/GenerateTune/Raag/${raag}/Instrument/${instrument}`;
    const resp = await fetch(api_url,{method: 'GET'})
    const data = await resp.json()
    var xml = data.xml;
    console.log("Got XML");
    var enc = new TextEncoder();
    var xmlBuffer = enc.encode(xml)
    var score = await WebMscore.load('xml', xmlBuffer, [], false)
    console.log("Score loaded, fetching metadata");
    var meta = await score.metadata()
    let winRef:any = window;
    let newBuf:Uint8Array = winRef.newFontBuffer.slice()
    score.setSoundFont(newBuf)
    console.log("Rendering SVG")
    let svg = await score.saveSvg(0,false)
    console.log("Got SVG")
    let blob = new Blob([svg], {type: 'image/svg+xml'});
    let imgUrl = URL.createObjectURL(blob);
    console.log(imgUrl)
    let audioUrl = await getAudioURL(score)
    var ret:any = {}
    ret['imgUrl'] = imgUrl;
    ret['meta'] = meta;
    ret['audioUrl'] = audioUrl;
    return ret;
}

function App() {

    
    const [imageUrl, setImageUrl] = useState(imgUrl);
    const [raagID, setRaagID] = useState(selectedRaagID);
    const [instumentID, setInstrumentID] = useState(selectedInstrumentID);
    const [audioUrl, setAudioUrl] = useState("");
    const [soundDataState, setSoundDataState] = useState(soundDataAvailable);


    const audioPlayerRef = useRef(null);

    if(!soundDataState){
        loadSoundData().then((value) => {setSoundDataState(value)})
    }
    
    

    WebMscore.ready.then(async () => {
        console.log('WebMscore is loaded');
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
                        <select id="instrument_select" className="w-full border border-gray-300 rounded-md px-3 py-2"
                            onChange={event=>{setInstrumentID(event.target.value)}}
                            defaultValue={selectedInstrumentID}
                        >
                            <option value="0">Guitar</option>
                            <option value="1">Flute</option>
                            <option value="2">Sitar</option>
                            <option value="3">Piano</option>
                            <option value="4">Harmonium</option>
                            <option value="5">Violin</option>

                        </select>
                    </div>

                    <div>

                    </div>
                </div>
                <div className="mb-8">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                            
                            onClick={() => {
                                let resp = generateTune(parseInt(raagID),parseInt(instumentID))
                                resp.then(values => {
                                    setImageUrl(values['imgUrl'])
                                    setAudioUrl(values['audioUrl'])
                                    if(audioPlayerRef.current != null){
                                        let audioRef:any = audioPlayerRef.current
                                        audioRef.load();
                                        audioRef.play();
                                    }
                                })


                            }}>{soundDataState ? "Generate Tune" : "Initializing..."}
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
