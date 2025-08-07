import React, { useEffect, useRef, useState } from 'react';
import AgoraRTC, {
  type IAgoraRTCClient,
  type ICameraVideoTrack,
  type IMicrophoneAudioTrack,
  type IAgoraRTCRemoteUser,
} from 'agora-rtc-sdk-ng';

// FIX 1: Define a clear type for the component's props
interface AgoraVideoPlayerProps {
  appId: string;
  channelName: string;
  token: string;
  userId: string;
  isVoiceCall: boolean;
}

// A simple type for the local tracks
type LocalTracks = [IMicrophoneAudioTrack, ICameraVideoTrack];

const AgoraVideoPlayer: React.FC<AgoraVideoPlayerProps> = ({
  appId,
  channelName,
  token,
  userId,
  isVoiceCall,
}) => {
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localTracksRef = useRef<LocalTracks | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const localPlayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize the client once
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    clientRef.current = client;

    const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      await client.subscribe(user, mediaType);
      if (mediaType === 'video') {
        const playerContainer = document.getElementById(`user-container-${user.uid}`);
        if (playerContainer) {
          user.videoTrack?.play(playerContainer);
        }
      }
      if (mediaType === 'audio') {
        user.audioTrack?.play();
      }
      setRemoteUsers(Array.from(client.remoteUsers));
    };

    const handleUserUnpublished = (_user: IAgoraRTCRemoteUser) => {
      setRemoteUsers(Array.from(client.remoteUsers));
    };

    const joinChannel = async () => {
      try {
        client.on('user-published', handleUserPublished);
        client.on('user-unpublished', handleUserUnpublished);

        // Agora's UID must be a number.
        const numericUserId = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1000000;

        await client.join(appId, channelName, token, numericUserId);

        const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
        localTracksRef.current = tracks;

        if (localPlayerRef.current) {
          tracks[1].play(localPlayerRef.current); // Play video track
        }
        
        // Audio is enabled by default, no need to call play on it.

        if (isVoiceCall) {
          await tracks[1].setEnabled(false); // Disable video for voice calls
        }

        await client.publish(tracks);
      } catch (error) {
        console.error("Agora Error: Failed to join channel", error);
      }
    };

    joinChannel();

    // Cleanup function to leave the channel when the component unmounts
    return () => {
      if (localTracksRef.current) {
        localTracksRef.current[0].close();
        localTracksRef.current[1].close();
      }
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
      client.leave();
    };
  }, [channelName, token, appId, userId, isVoiceCall]); // Dependencies for the effect

  return (
    <div className="w-full h-full relative grid grid-cols-1 grid-rows-1">
      {/* Container for the main (first remote) user's video */}
      {remoteUsers.length > 0 && (
        <div 
          key={remoteUsers[0].uid} 
          id={`user-container-${remoteUsers[0].uid}`} 
          className="w-full h-full bg-black rounded-lg overflow-hidden"
        ></div>
      )}
      
      {/* Container for the local user's video preview */}
      <div 
        ref={localPlayerRef} 
        className="w-48 h-auto absolute bottom-4 right-4 z-10 border-2 border-white rounded-md overflow-hidden bg-black"
      ></div>
    </div>
  );
};

export default AgoraVideoPlayer;