import { serve } from "std/http/server.ts";
import { RtcTokenBuilder, RtcRole } from "agora-access-token";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { channelName, userId } = await req.json();

    if (!channelName || !userId) {
      throw new Error('channelName and userId are required');
    }
    
    const numericUserId = Number(userId);
    if (isNaN(numericUserId)) {
        throw new Error('userId must be a valid number');
    }

    const APP_ID = Deno.env.get('AGORA_APP_ID');
    const APP_CERTIFICATE = Deno.env.get('AGORA_APP_CERTIFICATE');

    if (!APP_ID || !APP_CERTIFICATE) {
      throw new Error('Agora credentials are not set in environment variables.');
    }

    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600; // 1 hour
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      numericUserId,
      role,
      privilegeExpiredTs
    );

    return new Response(JSON.stringify({ token }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});