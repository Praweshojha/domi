import { onRequestPost } from './functions/api/contact.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle Contact API Form POST
    if (url.pathname === '/api/contact' && request.method === 'POST') {
      try {
        return await onRequestPost({ request, env, ctx });
      } catch (err) {
        return new Response(
          JSON.stringify({ success: false, message: 'Internal server error processing contact message.' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Serve static assets from frontend/public
    return env.ASSETS.fetch(request);
  },
};
