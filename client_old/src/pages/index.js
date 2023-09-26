import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import io from 'socket.io-client'
import Peer from 'simple-peer'

const inter = Inter({ subsets: ['latin'] })
const socket = io.connect('http://localhost:5000')

export default function Home() {
  const [me, setMe] = useState('');
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState('');
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();  

  const connectionRef = useRef();

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', (data) => {
      socket.emit('callUser', {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: caller });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(callerSignal);

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };

  const handleCopyClick = () => {
    copy(idToCall);
    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  };

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        if (myVideo.current)
          myVideo.current.srcObject = currentStream;
      });

    socket.on('me', (id) => setMe(id));

    socket.on('callUser', (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, [myVideo.current]);

  return (
    <>
      <Head>
        <title>Connect Me</title>
        <meta name="description" content="Connect-me, your video chat" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <p>
            Connect Me
          </p>
        </div>

        <div className={styles.center}>
          <div className={styles.videoContainer}>
            <div className={styles.video}>
              {stream && <video playsInline muted ref={myVideo} autoPlay />}
            </div>

            <div className={styles.video}>
              {callAccepted && !callEnded ?
                <video playsInline ref={userVideo} autoPlay /> :
                null
              }
            </div>
          </div>

          {/* <div className={styles.options}>
            <div className={styles.id}>
              <label htmlFor="idToCall">ID to call</label>
              <input
                type="text"
                name="idToCall"
                id="idToCall"
                value={idToCall}
                onChange={(e) => setIdToCall(e.target.value)}
              />
              <button onClick={handleCopyClick}>
                {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>

            <div className={styles.buttons}>
              {callAccepted && !callEnded ? (
                <button type="button" onClick={leaveCall}>
                  End Call
                </button>
              ) : (
                <button type="button" onClick={() => callUser(idToCall)}>
                  Call
                </button>
              )}
              {idToCall}
            </div>
          </div> */}

          {/* <div className={styles.caller}>
            {receivingCall && !callAccepted ? (
              <div className={styles.callerContainer}>
                <h1>{name} is calling...</h1>
                <button type="button" onClick={answerCall}>
                  Answer
                </button>
              </div>
            ) : null}
          </div> */}
        </div>

        <div className={styles.grid}>
          <h2 className={inter.className}>
            GitHub <span>-&gt;</span>
          </h2>

          <h2 className={inter.className}>
            Demo <span>-&gt;</span>
          </h2>
        </div>
      </main>
    </>
  )
}
