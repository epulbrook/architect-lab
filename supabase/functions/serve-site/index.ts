// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Hello from Functions!")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get the path from the URL
    const url = new URL(req.url)
    let path = url.pathname

    // Default to index.html for root path
    if (path === '/') {
      path = '/index.html'
    }

    // Remove leading slash
    path = path.replace(/^\//, '')

    // Get the file from storage
    const { data, error } = await supabaseClient
      .storage
      .from('site')
      .download(path)

    if (error) {
      // If file not found, try index.html
      if (error.statusCode === 404 && path !== 'index.html') {
        const { data: indexData, error: indexError } = await supabaseClient
          .storage
          .from('site')
          .download('index.html')

        if (indexError) {
          throw indexError
        }

        return new Response(indexData, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/html',
            'Cache-Control': 'public, max-age=3600',
          },
        })
      }
      throw error
    }

    // Determine content type
    const contentType = getContentType(path)

    // Return the file
    return new Response(data, {
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })
  }
})

function getContentType(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase()
  const contentTypes: Record<string, string> = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'ttf': 'font/ttf',
    'eot': 'application/vnd.ms-fontobject',
    'otf': 'font/otf',
  }
  return contentTypes[ext ?? ''] || 'application/octet-stream'
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/serve-site' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
