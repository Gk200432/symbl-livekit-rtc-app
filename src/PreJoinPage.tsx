import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { createLocalVideoTrack, LocalVideoTrack } from 'livekit-client';
import { AudioSelectButton, ControlButton, VideoRenderer, VideoSelectButton } from 'livekit-react';
import { AspectRatio } from 'react-aspect-ratio';

export const PreJoinPage = () => {
  const [teamName, setTeamName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [simulcast, setSimulcast] = useState(true);
  const [dynacast, setDynacast] = useState(true);
  const [adaptiveStream, setAdaptiveStream] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [connectDisabled, setConnectDisabled] = useState(true);
  const [videoTrack, setVideoTrack] = useState<LocalVideoTrack>();
  const [audioDevice, setAudioDevice] = useState<MediaDeviceInfo>();
  const [videoDevice, setVideoDevice] = useState<MediaDeviceInfo>();
  const navigate = useNavigate();

  useEffect(() => {
    if (username && teamName && token && url) {
      setConnectDisabled(false);
    } else {
      setConnectDisabled(true);
    }
  }, [username, teamName, token, url]);

  const toggleVideo = async () => {
    if (videoTrack) {
      videoTrack.stop();
      setVideoEnabled(false);
      setVideoTrack(undefined);
    } else {
      const track = await createLocalVideoTrack({
        deviceId: videoDevice?.deviceId,
      });
      setVideoEnabled(true);
      setVideoTrack(track);
    }
  };

  useEffect(() => {
    createLocalVideoTrack({
      deviceId: videoDevice?.deviceId,
    }).then((track) => {
      setVideoEnabled(true);
      setVideoTrack(track);
    });
  }, [videoDevice]);

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  const selectVideoDevice = (device: MediaDeviceInfo) => {
    setVideoDevice(device);
    if (videoTrack) {
      if (videoTrack.mediaStreamTrack.getSettings().deviceId === device.deviceId) {
        return;
      }
      videoTrack.stop();
    }
  };

  const fetchToken = async () => {
    if (!username || !teamName) {
      alert('Please enter both username and team name.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identity: username,
          roomName: teamName,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch token');
      }
  
      const data = await response.json();
      console.log('Fetched data:', data); // Debugging statement
      setUrl(data.url); // Get WebSocket URL from response
      setToken(data.token); // Get token from response
    } catch (error) {
      console.error('Error fetching token:', error);
    }
  };
  

  useEffect(() => {
    fetchToken();
  }, [username, teamName]);

  const connectToRoom = async () => {
    console.log('Connecting to room with params:', {
      url,
      token,
      videoEnabled,
      audioEnabled,
      simulcast,
      dynacast,
      adaptiveStream,
      audioDevice,
      videoDevice,
    });

    if (videoTrack) {
      videoTrack.stop();
    }

    const params: { [key: string]: string } = {
      url,
      token,
      videoEnabled: videoEnabled ? '1' : '0',
      audioEnabled: audioEnabled ? '1' : '0',
      simulcast: simulcast ? '1' : '0',
      dynacast: dynacast ? '1' : '0',
      adaptiveStream: adaptiveStream ? '1' : '0',
    };

    if (audioDevice) {
      params.audioDeviceId = audioDevice.deviceId;
    }
    if (videoDevice) {
      params.videoDeviceId = videoDevice.deviceId;
    } else if (videoTrack) {
      const deviceId = await videoTrack.getDeviceId();
      if (deviceId) {
        params.videoDeviceId = deviceId;
      }
    }

    navigate({
      pathname: '/room',
      search: "?" + new URLSearchParams(params).toString(),
    });
  };

  let videoElement;
  if (videoTrack) {
    videoElement = <VideoRenderer track={videoTrack} isLocal={true} />;
  } else {
    videoElement = <div className="placeholder" />;
  }

  return (
    <div className="prejoin">
      <main>
        <h2>LiveKit Video</h2>
        <hr />
        <div className="entrySection">
          <div>
            <div className="label">Username</div>
            <div>
              <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
          </div>
          <div>
            <div className="label">Team Name</div>
            <div>
              <input type="text" name="teamName" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
            </div>
          </div>
          <div className="options">
            <div>
              <input
                id="simulcast-option"
                type="checkbox"
                name="simulcast"
                checked={simulcast}
                onChange={(e) => setSimulcast(e.target.checked)}
              />
              <label htmlFor="simulcast-option">Simulcast</label>
            </div>
            <div>
              <input
                id="dynacast-option"
                type="checkbox"
                name="dynacast"
                checked={dynacast}
                onChange={(e) => setDynacast(e.target.checked)}
              />
              <label htmlFor="dynacast-option">Dynacast</label>
            </div>
            <div>
              <input
                id="adaptivestream-option"
                type="checkbox"
                name="adaptiveStream"
                checked={adaptiveStream}
                onChange={(e) => setAdaptiveStream(e.target.checked)}
              />
              <label htmlFor="adaptivestream-option">Adaptive Stream</label>
            </div>
          </div>
        </div>

        <div className="videoSection">
          <AspectRatio ratio={16 / 9}>{videoElement}</AspectRatio>
        </div>

        <div className="controlSection">
          <div>
            <AudioSelectButton
              isMuted={!audioEnabled}
              onClick={toggleAudio}
              onSourceSelected={setAudioDevice}
            />
            <VideoSelectButton
              isEnabled={videoTrack !== undefined}
              onClick={toggleVideo}
              onSourceSelected={selectVideoDevice}
            />
          </div>
          <div className="right">
            <ControlButton label="Connect" disabled={connectDisabled} icon={faBolt} onClick={connectToRoom} />
          </div>
        </div>
      </main>
      <footer>
        This page is built with <a href="https://github.com/livekit/livekit-react">LiveKit React</a>&nbsp;
        (<a href="https://github.com/livekit/livekit-react/blob/master/example/src/PreJoinPage.tsx">Source</a>)
      </footer>
    </div>
  );
};
