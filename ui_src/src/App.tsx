import './App.css'
import WebMscore from 'webmscore'

import {useState} from "react";
import {useRef}  from 'react';
import ReactGA from "react-ga4";
import { audioBufferToWav } from './utils/audio'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { downloadFromUrl } from './utils/download';

ReactGA.initialize("G-GSS7C0CEKM");

ReactGA.send({hitType:"pageview"})


let imgUrl = "./img/cassete.png";
let selectedRaagID = "120000";
let selectedInstrumentID = "3";

let soundDataAvailable = false;

interface WindowWithNewFont extends Window {
    newFontBuffer?: Uint8Array
}

async function loadSoundData(): Promise<boolean> {
    const winRef = window as WindowWithNewFont
    if (winRef.newFontBuffer) {
        var msg = 'Sound data availalbe in memory'
        ReactGA.event({category:"AppInit",action:msg})
        console.log(msg)
        soundDataAvailable = true;
        return soundDataAvailable;
    }else{
        var msg = 'Downloading sound data'
        ReactGA.event({category:"AppInit",action:msg})
        console.log(msg)
        const fontUrl = "./sound/Emu 9ftgrand-small.sf3";
    
        const fontResponse = await fetch(fontUrl)
        const buffer = await fontResponse.arrayBuffer()
        let fontBuffer = new Uint8Array(buffer);
        winRef.newFontBuffer = fontBuffer;
        soundDataAvailable = true;
       return soundDataAvailable;
    }
  
}

async function getMidiAudioURL(score: WebMscore) {

    let midi: Uint8Array = await score.saveMidi()
    console.log("Got Midi " + midi.length)
    const blob = new Blob([midi.buffer as ArrayBuffer], {type: "audio/midi"})
    const url = window.URL.createObjectURL(blob);
    return url;
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
        function toArrayBuffer(buf: ArrayBufferLike): ArrayBuffer {
            if (buf instanceof ArrayBuffer) return buf
            // SharedArrayBuffer or other ArrayBufferLike - copy into a new ArrayBuffer
            return buf.slice(0) as unknown as ArrayBuffer
        }
        const frames = new Float32Array(toArrayBuffer(res.chunk.buffer))

          // audio frames are non-interleaved
        // Float32Array[ channelA 512 frames, channelB 512 frames ]
        for (let c = 0; c < CHANNELS; c++) {
            const buf = frames.subarray(c * FRAME_LENGTH, (c + 1) * FRAME_LENGTH)
            // copy into a concrete Float32Array backed by an ArrayBuffer to satisfy
            // the Web Audio API typing and ensure compatibility with SharedArrayBuffer
            const tmp = new Float32Array(buf.length)
            tmp.set(buf)
            audioBuf.copyToChannel(tmp, c, i)
        }

        if (res.done) {
            break
        }
    }
    const blob = new Blob([audioBufferToWav(audioBuf)], {type: "audio/wav"});
    const url = window.URL.createObjectURL(blob);
    return url;
}


async function getMusicXMLURL(xml:string){
    let enc = new TextEncoder();
    let xmlBuffer = enc.encode(xml)
    const blob = new Blob([xmlBuffer], { type: "application/xml" });
    let blobSize = blob.size
    console.log("Size of XML Blob :"+blobSize)
    const url = URL.createObjectURL(blob);
    return url
}
type GeneratedTune = {
    imgUrl: string
    meta: unknown
    audioUrl: string
    midiUrl: string
    musicXmlUrl: string
}

async function generateTune(raag: number, instrument: number): Promise<GeneratedTune> {
    var msg = '"Fetching Tune from API"'
    ReactGA.event({category:"AppInit",action:msg})
    console.log(msg)
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
    const winRef = window as WindowWithNewFont
    if (!winRef.newFontBuffer) {
        throw new Error('sound font not loaded')
    }
    let newBuf: Uint8Array = winRef.newFontBuffer.slice()
    score.setSoundFont(newBuf)
    console.log("Rendering SVG")
    let svg = await score.saveSvg(0,false)
    console.log("Got SVG")
    let blob = new Blob([svg], {type: 'image/svg+xml'});
    let imgUrl = URL.createObjectURL(blob);
    console.log(imgUrl)
    let audioUrl = await getAudioURL(score)
    console.log("Got Audio Data")
    let midiUrl = await  getMidiAudioURL(score)
    console.log("Got MIDI Data")
    let xmlUrl=await getMusicXMLURL(xml)

    const ret: GeneratedTune = {
        imgUrl,
        meta,
        audioUrl,
        midiUrl,
        musicXmlUrl: xmlUrl,
    }
    return ret
}

function App() {

    
    const [imageUrl, setImageUrl] = useState<string>(imgUrl)
    const [raagID, setRaagID] = useState<string>(selectedRaagID)
    const [instumentID, setInstrumentID] = useState<string>(selectedInstrumentID)
    const [audioUrl, setAudioUrl] = useState<string>('')
    const [soundDataState, setSoundDataState] = useState<boolean>(soundDataAvailable)
    const [midiUrl, setMidiUrl] = useState<string>('')
    const [musicXmlUrl, setMusicXmlUrl] = useState<string>('')
    const midiDownloadLinkRef = useRef<HTMLAnchorElement | null>(null)
    const xmlDownloadLinkRef = useRef<HTMLAnchorElement | null>(null)

    const audioPlayerRef = useRef<HTMLAudioElement | null>(null)

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
                            <option value="3">Piano</option>
                        </select>
                    </div>

                    <div>

                    </div>
                </div>
                <div className="button-container">
                    <button className={`button ${false ? "button-disabled" : "button-enabled"}`}

                                onClick={() => {
                                    generateTune(parseInt(raagID), parseInt(instumentID)).then(values => {
                                        setImageUrl(values.imgUrl)
                                        setAudioUrl(values.audioUrl)
                                        setMidiUrl(values.midiUrl)
                                        setMusicXmlUrl(values.musicXmlUrl)
                                        const audioRef = audioPlayerRef.current
                                        if (audioRef) {
                                            audioRef.load()
                                            // ignore play promise
                                            void audioRef.play()
                                        }
                                    })

                                }}>{soundDataState ? 'Generate Tune' : 'Initializing...'}</button>
                    <a href={midiUrl} ref={midiDownloadLinkRef} download="tune.mid" style={{display: 'none'}}>Download
                        MID file</a>
                    <button disabled={false} className={`button ${false ? "button-disabled" : "button-enabled"}`}
                            onClick={() => {
                                console.log("Will Download Midi")
                                // prefer direct anchor click when a URL is available (same as before)
                                if (midiDownloadLinkRef.current && midiUrl) {
                                    midiDownloadLinkRef.current.click()
                                    return
                                }
                                // fallback: if we had a blob-based MIDI, create a blob and download
                                // (most callers set midiUrl to an object URL already)
                                if (midiUrl) {
                                    downloadFromUrl(midiUrl, 'tune.mid')
                                }
                            }}>
                        <span style={{marginLeft: '0.5rem'}}>MIDI File</span>
                        <FontAwesomeIcon icon={faDownload}
                                         style={{marginRight: '0.5rem'}}/>
                    </button>

                    <a href={musicXmlUrl} ref={xmlDownloadLinkRef} download="tune.musicxml" style={{display: 'none'}}>Download
                        Music file</a>


                    <button disabled={false} className={`button ${false ? "button-disabled" : "button-enabled"}`}
                            onClick={() => {
                                console.log("Will Download Music XML")
                                if (xmlDownloadLinkRef.current && musicXmlUrl) {
                                    xmlDownloadLinkRef.current.click()
                                    return
                                }
                                if (musicXmlUrl) {
                                    downloadFromUrl(musicXmlUrl, 'tune.musicxml')
                                }

                            }}>{"Music File  "}
                        <FontAwesomeIcon icon={faDownload}
                                         style={{marginRight: '0.5rem'}}/>
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
